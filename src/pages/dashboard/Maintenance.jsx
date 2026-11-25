import { useOutletContext } from "react-router-dom";
import AssetTable from "../../components/AssetTable";

const columns = [
  { key: "name", header: "Name" },
  { key: "serialNumber", header: "Serial / Reg. no." },
  { key: "category", header: "Category" },
  { key: "location", header: "Location" },
  { key: "department", header: "Department" },
];

function Maintenance() {
  const { assets, updateAsset } = useOutletContext();

  const underMaintenance = assets.filter(
    (asset) => asset.status === "Under Maintenance",
  );

  function handleRepaired(asset) {
    if (window.confirm(`Mark "${asset.name}" as repaired and available?`)) {
      updateAsset(asset.id, { status: "Available", assignedTo: "" });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
      <p className="text-gray-600">
        Assets under repair or servicing ({underMaintenance.length}).
      </p>

      <div className="mt-6">
        <AssetTable
          assets={underMaintenance}
          columns={columns}
          emptyMessage="No assets are under maintenance."
          renderActions={(asset) => (
            <button
              onClick={() => handleRepaired(asset)}
              className="text-green-600 hover:underline"
            >
              Mark as repaired
            </button>
          )}
        />
      </div>
    </div>
  );
}

export default Maintenance;
