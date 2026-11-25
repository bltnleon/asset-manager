function AssetTable({ assets, columns, renderActions, emptyMessage }) {
  const columnCount = columns.length + (renderActions ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-3 font-medium">
                  {column.header}
                </th>
              ))}
              {renderActions && (
                <th className="px-5 py-3 font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 && (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="border-t border-gray-100 whitespace-nowrap"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-3 text-gray-600">
                    {asset[column.key] || "-"}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-5 py-3 space-x-4">
                    {renderActions(asset)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssetTable;
