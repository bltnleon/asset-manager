import { useState, useEffect } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const navItems = [
  { to: "/dashboard", label: "Overview", end: true, adminOnly: true },
  { to: "/dashboard/inventory", label: "Inventory" },
  { to: "/dashboard/assignment", label: "Assignment", adminOnly: true },
  { to: "/dashboard/maintenance", label: "Maintenance", adminOnly: true },
  { to: "/dashboard/available", label: "Available", adminOnly: true },
  { to: "/dashboard/reports", label: "Reports" },
  { to: "/dashboard/users", label: "Users", adminOnly: true },
  { to: "/dashboard/profile", label: "Profile", adminOnly: true },
  { to: "/dashboard/settings", label: "Settings", adminOnly: true },
];

function DashboardLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState("");

  const userId = user ? user.id : null;

  // Who is logged in?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await getDoc(doc(db, "users", firebaseUser.uid));

        if (profile.exists()) {
          setUser({ id: firebaseUser.uid, ...profile.data() });
        } else {
          await signOut(auth);
          setUser(null);
        }
      } catch (err) {
        console.error("Could not load profile:", err);
        setUser(null);
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Keep the asset list up to date once someone is logged in
  useEffect(() => {
    if (!userId) return;

    const assetsQuery = query(
      collection(db, "assets"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      assetsQuery,
      (snapshot) => {
        setAssets(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setAssetsError("");
        setAssetsLoading(false);
      },
      (err) => {
        console.error("Could not load assets:", err);
        setAssetsError("Could not load assets. Please try again later.");
        setAssetsLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === "admin";
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  async function addAsset(data) {
    if (!isAdmin) return;
    await addDoc(collection(db, "assets"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  async function updateAsset(id, data) {
    if (!isAdmin) return;
    await updateDoc(doc(db, "assets", id), data);
  }

  async function deleteAsset(id) {
    if (!isAdmin) return;
    await deleteDoc(doc(db, "assets", id));
  }

  async function clearAssets() {
    if (!isAdmin) return;

    const snapshot = await getDocs(collection(db, "assets"));
    const docs = snapshot.docs;

    // A batch can hold up to 500 changes, so we delete in groups of 400
    for (let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(db);
      docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  async function updateProfile(data) {
    const changes = {
      name: data.name,
      phone: data.phone,
      jobTitle: data.jobTitle,
    };

    await updateDoc(doc(db, "users", user.id), changes);
    setUser({ ...user, ...changes });
  }

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  function linkClass({ isActive }) {
    return `block whitespace-nowrap px-4 py-2 rounded-lg font-medium ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`;
  }

  return (
    <div className="min-h-screen md:flex bg-gray-50">
      {/* Top bar for small screens */}
      <header className="md:hidden print:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600">AssetTrack</h2>
          <button onClick={handleLogout} className="text-gray-600">
            Log out
          </button>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex print:hidden w-64 flex-col justify-between bg-white border-r border-gray-200 p-6">
        <div>
          <h2 className="text-xl font-bold text-blue-600">AssetTrack</h2>
          <nav className="mt-8 space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-xs font-medium text-blue-600">
                {isAdmin ? "Admin" : "View only"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-600 hover:text-red-600 px-4 py-2"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Section content appears here */}
      <main className="flex-1 min-w-0 p-6 md:p-10">
        {assetsError && (
          <p className="mb-4 text-red-600 text-sm">{assetsError}</p>
        )}

        {assetsLoading ? (
          <p className="text-gray-500">Loading assets...</p>
        ) : (
          <Outlet
            context={{
              assets,
              addAsset,
              updateAsset,
              deleteAsset,
              clearAssets,
              user,
              updateProfile,
            }}
          />
        )}
      </main>
    </div>
  );
}

export default DashboardLayout;
