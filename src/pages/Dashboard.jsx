import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AssetForm from "../components/AssetForm";

const defaultAssets = [
  {
    id: 1,
    name: "Dell Latitude Laptop",
    category: "Electronics",
    location: "Head Office",
    status: "In Use",
  },
  {
    id: 2,
    name: "HP LaserJet Printer",
    category: "Electronics",
    location: "Reception",
    status: "In Use",
  },
  {
    id: 3,
    name: "Office Desk (Oak)",
    category: "Furniture",
    location: "Storage Room",
    status: "Available",
  },
  {
    id: 4,
    name: "Toyota Hilux",
    category: "Vehicle",
    location: "Parking Lot",
    status: "Under Repair",
  },
  {
    id: 5,
    name: "Projector",
    category: "Electronics",
    location: "Meeting Room",
    status: "Available",
  },
  {
    id: 6,
    name: "Power Generator",
    category: "Machinery",
    location: "Warehouse",
    status: "In Use",
  },
];

const statusStyles = {
  "In Use": "bg-green-100 text-green-700",
  Available: "bg-blue-100 text-blue-700",
  "Under Repair": "bg-red-100 text-red-700",
};

function Dashboard() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem("assets");
    return saved ? JSON.parse(saved) : defaultAssets;
  });

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  }

  function handleAddAsset(newAsset) {
    setAssets([{ id: Date.now(), ...newAsset }, ...assets]);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this asset?")) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
  }

  const summary = [
    { label: "Total assets", value: assets.length },
    {
      label: "In use",
      value: assets.filter((a) => a.status === "In Use").length,
    },
    {
      label: "Available",
      value: assets.filter((a) => a.status === "Available").length,
    },
    {
      label: "Under repair",
      value: assets.filter((a) => a.status === "Under Repair").length,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between bg-white border-r border-gray-200 p-6">
        <div>
          <h2 className="text-xl font-bold text-blue-600">AssetTrack</h2>
          <nav className="mt-8">
            <span className="block bg-blue-50 text-blue-700 font-medium px-4 py-2 rounded-lg">
              Dashboard
            </span>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-left text-gray-600 hover:text-red-600 px-4 py-2"
        >
          Log out
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600">Here's an overview of your assets.</p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden border border-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            Log out
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Add asset form */}
        <div className="mt-8">
          <AssetForm onAdd={handleAddAsset} />
        </div>

        {/* Assets table */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-200">
            Assets
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-6 text-center text-gray-500"
                    >
                      No assets yet. Add your first one above.
                    </td>
                  </tr>
                )}
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {asset.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {asset.category}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {asset.location}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[asset.status]}`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
