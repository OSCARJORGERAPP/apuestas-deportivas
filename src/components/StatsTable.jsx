export default function StatsTable({ title, headers, rows }) {
  return (
    <div className="bg-gray-700 rounded-2xl overflow-hidden shadow-lg border border-gray-600">
      <div className="px-8 py-6 border-b border-gray-600 bg-gray-800">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 border-b border-gray-600">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-8 py-4 text-left text-gray-400 font-bold text-xs uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-8 py-4 text-center text-gray-400">
                  Sin datos
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-600 transition">
                  {Object.values(row).map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-8 py-4 text-white">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
