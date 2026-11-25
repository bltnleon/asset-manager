import { useOutletContext } from "react-router-dom";

function groupBy(assets, field) {
  const groups = {};

  assets.forEach((asset) => {
    const key = (asset[field] || "").trim() || "Unspecified";
    if (!groups[key]) {
      groups[key] = { count: 0, value: 0 };
    }
    groups[key].count += 1;
    groups[key].value += Number(asset.cost);
  });

  return Object.entries(groups)
    .map(([label, data]) => ({ label, ...data }))
    .sort((a, b) => b.count - a.count);
}

function SummaryTable({ title, heading, rows }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm break-inside-avoid">
      <h2 className="text-lg font-semibold text-gray-900 p-5 border-b border-gray-200">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">{heading}</th>
              <th className="px-5 py-3 font-medium">Assets</th>
              <th className="px-5 py-3 font-medium">Total value</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="3" className="px-5 py-6 text-center text-gray-500">
                  No data yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="px-5 py-3 font-medium text-gray-900">
                  {row.label}
                </td>
                <td className="px-5 py-3 text-gray-600">{row.count}</td>
                <td className="px-5 py-3 text-gray-600">
                  {row.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reports() {
  const { assets } = useOutletContext();

  const totalValue = assets.reduce((sum, asset) => sum + Number(asset.cost), 0);

  function handleDownload() {
    const headers = [
      "Name",
      "Serial / Reg. no.",
      "Category",
      "Location",
      "Department",
      "Assigned to",
      "Cost",
      "Date of purchase",
      "Condition",
      "Status",
    ];

    const rows = assets.map((asset) => [
      asset.name,
      asset.serialNumber,
      asset.category,
      asset.location,
      asset.department,
      asset.assignedTo,
      asset.cost,
      asset.purchaseDate,
      asset.condition,
      asset.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            Asset summary as of {new Date().toLocaleDateString()}.
          </p>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={assets.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-2">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total assets</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {assets.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total value</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SummaryTable
          title="By status"
          heading="Status"
          rows={groupBy(assets, "status")}
        />
        <SummaryTable
          title="By category"
          heading="Category"
          rows={groupBy(assets, "category")}
        />
        <SummaryTable
          title="By department"
          heading="Department"
          rows={groupBy(assets, "department")}
        />
        <SummaryTable
          title="By condition"
          heading="Condition"
          rows={groupBy(assets, "condition")}
        />
      </div>
    </div>
  );
}

export default Reports;
