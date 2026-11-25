import { useOutletContext } from "react-router-dom";
import AssetTable from "../../components/AssetTable";

const columns = [
  { key: "name", header: "Name" },
  { key: "serialNumber", header: "Serial / Reg. no." },
  { key: "category", header: "Category" },
  { key: "assignedTo", header: "Assigned to" },
  { key: "department", header: "Department" },
  { key: "location", header: "Location" },
];

function Assignment() {
  const { assets, updateAsset } = useOutletContext();

  const assignedAssets = assets.filter((asset) => asset.status === "Assigned");

  function handleReassign(asset) {
    const name = window.prompt("Reassign to:", asset.assignedTo);
    if (name && name.trim()) {
      updateAsset(asset.id, { assignedTo: name.trim() });
    }
  }

  function handleUnassign(asset) {
    if (window.confirm(`Unassign "${asset.name}" from ${asset.assignedTo}?`)) {
      updateAsset(asset.id, { status: "Available", assignedTo: "" });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Assignment</h1>
      <p className="text-gray-600">
        Assets currently assigned to people ({assignedAssets.length}).
      </p>

      <div className="mt-6">
        <AssetTable
          assets={assignedAssets}
          columns={columns}
          emptyMessage="No assets are assigned right now."
          renderActions={(asset) => (
            <>
              <button
                onClick={() => handleReassign(asset)}
                className="text-blue-600 hover:underline"
              >
                Reassign
              </button>
              <button
                onClick={() => handleUnassign(asset)}
                className="text-red-600 hover:underline"
              >
                Unassign
              </button>
            </>
          )}
        />
      </div>
    </div>
  );
}

export default Assignment;
