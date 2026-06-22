export default function StatsTable({ title, headers, rows }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-dark-700">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dark-900 border-b border-dark-700">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-secondary font-semibold text-xs uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-secondary">
                  Sin datos
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-dark-700 transition">
                  {Object.values(row).map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-6 py-3 text-primary">
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
