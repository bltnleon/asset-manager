import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AssetForm from "../../components/AssetForm";
import { statusStyles, STATUSES, CATEGORIES } from "../../constants";

const filterStyle =
  "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

function Inventory() {
  const { assets, addAsset, updateAsset, deleteAsset, user } =
    useOutletContext();
  const isAdmin = user.role === "admin";

  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  function openAddForm() {
    setEditingAsset(null);
    setShowForm(true);
  }

  function openEditForm(asset) {
    setEditingAsset(asset);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingAsset(null);
  }

  async function handleSave(data) {
    const serial = data.serialNumber.trim().toLowerCase();
    const duplicate = assets.some(
      (asset) =>
        asset.serialNumber.toLowerCase() === serial &&
        asset.id !== editingAsset?.id,
    );

    if (duplicate) {
      return "An asset with this serial / registration number already exists.";
    }

    const cleaned = {
      name: data.name.trim(),
      serialNumber: data.serialNumber.trim(),
      category: data.category,
      location: data.location.trim(),
      cost: Number(data.cost),
      purchaseDate: data.purchaseDate,
      condition: data.condition,
      department: data.department.trim(),
      status: data.status,
      assignedTo: data.assignedTo.trim(),
    };

    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, cleaned);
      } else {
        await addAsset(cleaned);
      }
      closeForm();
    } catch (err) {
      console.error(err);
      return "Could not save the asset. Please try again.";
    }
  }

  async function handleDelete(asset) {
    if (!window.confirm(`Delete "${asset.name}"?`)) return;

    try {
      await deleteAsset(asset.id);
    } catch (err) {
      console.error(err);
      window.alert("Could not delete the asset. Please try again.");
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
  }

  const query = search.trim().toLowerCase();

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      query === "" ||
      [
        asset.name,
        asset.serialNumber,
        asset.location,
        asset.department,
        asset.assignedTo,
      ].some((value) => (value || "").toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || asset.status === statusFilter;
    const matchesCategory =
      categoryFilter === "All" || asset.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const hasFilters =
    query !== "" || statusFilter !== "All" || categoryFilter !== "All";

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">
            {isAdmin
              ? "All registered assets."
              : "All registered assets (view only)."}
          </p>
        </div>
        {isAdmin && !showForm && (
          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Register asset
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="mt-6">
          <AssetForm
            key={editingAsset ? editingAsset.id : "new"}
            initialData={editingAsset}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </div>
      )}

      {/* Search and filters */}
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, serial no., location, department, assigned to..."
          className={`${filterStyle} md:col-span-2`}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={filterStyle}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={filterStyle}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
        <span>
          Showing {filteredAssets.length} of {assets.length} assets
        </span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Serial / Reg. no.</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Assigned to</th>
                <th className="px-5 py-3 font-medium">Cost</th>
                <th className="px-5 py-3 font-medium">Purchased</th>
                <th className="px-5 py-3 font-medium">Condition</th>
                <th className="px-5 py-3 font-medium">Status</th>
                {isAdmin && <th className="px-5 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 11 : 10}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    {assets.length > 0
                      ? "No assets match your search or filters."
                      : isAdmin
                        ? 'No assets registered yet. Click "Register asset" to add your first one.'
                        : "No assets registered yet."}
                  </td>
                </tr>
              )}
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-t border-gray-100 whitespace-nowrap"
                >
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {asset.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {asset.serialNumber}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{asset.category}</td>
                  <td className="px-5 py-3 text-gray-600">{asset.location}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {asset.department}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {asset.assignedTo || "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {Number(asset.cost).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {asset.purchaseDate}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{asset.condition}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[asset.status]}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3 space-x-4">
                      <button
                        onClick={() => openEditForm(asset)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(asset)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
