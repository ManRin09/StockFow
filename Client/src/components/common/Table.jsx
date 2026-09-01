import React from 'react';

export const Table = ({
  headers = [],
  children,
  emptyMessage = 'No se encontraron registros.',
  isEmpty = false,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
            {headers.map((header, index) => (
              <th key={index} className={`px-5 py-4 ${header.className || ''}`}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length || 1} className="py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
