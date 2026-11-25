import { useOutletContext } from "react-router-dom";
import AssetTable from "../../components/AssetTable";

const columns = [
  { key: "name", header: "Name" },
  { key: "serialNumber", header: "Serial / Reg. no." },
  { key: "category", header: "Category" },
  { key: "location", header: "Location" },
  { key: "department", header: "Department" },
  { key: "condition", header: "Condition" },
];

function Available() {
  const { assets, updateAsset } = useOutletContext();

  const availableAssets = assets.filter(
    (asset) => asset.status === "Available",
  );

  function handleAssign(asset) {
    const name = window.prompt(`Assign "${asset.name}" to:`);
    if (name && name.trim()) {
      updateAsset(asset.id, { status: "Assigned", assignedTo: name.trim() });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Available</h1>
      <p className="text-gray-600">
        Assets not assigned to anyone ({availableAssets.length}).
      </p>

      <div className="mt-6">
        <AssetTable
          assets={availableAssets}
          columns={columns}
          emptyMessage="No assets are available right now."
          renderActions={(asset) => (
            <button
              onClick={() => handleAssign(asset)}
              className="text-blue-600 hover:underline"
            >
              Assign
            </button>
          )}
        />
      </div>
    </div>
  );
}

export default Available;
