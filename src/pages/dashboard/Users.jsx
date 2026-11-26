import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { deleteUserProfile } from "../../users";
import { MAX_ADMINS, MAX_VIEWERS } from "../../auth";

const roleStyles = {
  admin: "bg-purple-100 text-purple-700",
  viewer: "bg-blue-100 text-blue-700",
};

const roleLabels = {
  admin: "Admin",
  viewer: "View only",
};

function Users() {
  const { user } = useOutletContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setUsers(list);
      } catch (err) {
        console.error(err);
        setError("Could not load users. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;

  async function handleDelete(target) {
    if (target.id === user.id) return;

    if (
      !window.confirm(
        `Delete ${target.name} (${target.email})? They will no longer be able to access the system.`,
      )
    ) {
      return;
    }

    try {
      await deleteUserProfile(target);
      setUsers(users.filter((u) => u.id !== target.id));
    } catch (err) {
      console.error(err);
      setError("Could not delete this user. Please try again.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <p className="text-gray-600">Manage who can access the system.</p>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      <div className="mt-6 grid gap-4 grid-cols-2 max-w-xl">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {adminCount}{" "}
            <span className="text-base font-normal text-gray-500">
              of {MAX_ADMINS}
            </span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">View-only users</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {viewerCount}{" "}
            <span className="text-base font-normal text-gray-500">
              of {MAX_VIEWERS}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((target) => (
                <tr
                  key={target.id}
                  className="border-t border-gray-100 whitespace-nowrap"
                >
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {target.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{target.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[target.role]}`}
                    >
                      {roleLabels[target.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {target.id === user.id ? (
                      <span className="text-gray-400">You</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(target)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;
