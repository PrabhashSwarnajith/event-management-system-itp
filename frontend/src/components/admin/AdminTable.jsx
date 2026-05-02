const AdminTable = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          {headers.map((header) => (
            <th
              key={header}
              className="whitespace-nowrap px-3 py-3 text-left text-xs font-black uppercase tracking-wide text-slate-500"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">{children}</tbody>
    </table>
  </div>
);

export const AdminTd = ({ children, strong }) => (
  <td className={`whitespace-nowrap px-3 py-3 align-middle text-slate-600 ${strong ? "font-bold text-slate-900" : ""}`}>
    {children}
  </td>
);

export const AdminBadge = ({ children, tone = "slate" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700"
  };

  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
};

export default AdminTable;
