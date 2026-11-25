import { Link, useOutletContext } from "react-router-dom";
import { STATUSES } from "../../constants";

function Overview() {
  const { assets, user } = useOutletContext();

  const totalValue = assets.reduce((sum, asset) => sum + Number(asset.cost), 0);

  const summary = [
    { label: "Total assets", value: assets.length },
    ...STATUSES.map((status) => ({
      label: status,
      value: assets.filter((asset) => asset.status === status).length,
    })),
    { label: "Total value", value: totalValue.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
      <p className="text-gray-600">Here's an overview of your assets.</p>

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

      {assets.length === 0 && (
        <p className="mt-8 text-gray-600">
          You haven't registered any assets yet.{" "}
          <Link
            to="/dashboard/inventory"
            className="text-blue-600 hover:underline"
          >
            Go to Inventory
          </Link>{" "}
          to add your first one.
        </p>
      )}
    </div>
  );
}

export default Overview;
