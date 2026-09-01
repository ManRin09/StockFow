import React, { useState } from 'react';
import Table from '../common/Table';
import { ArrowDownLeft, ArrowUpRight, Calendar, Search, Banknote, CreditCard } from 'lucide-react';

export const MovementHistory = ({ movements = [], limit = null }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const displayMovements = movements
    .filter((m) => {
      const matchType = filterType === 'ALL' || m.type === filterType;
      const matchText =
        (m.productName || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.sku || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.reason || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.paymentMethod || '').toLowerCase().includes(search.toLowerCase());
      return matchType && matchText;
    })
    .slice(0, limit || movements.length);

  const headers = [
    { label: 'Tipo' },
    { label: 'Producto / SKU' },
    { label: 'Cantidad' },
    { label: 'Método de Pago' },
    { label: 'Motivo' },
    { label: 'Fecha' },
    { label: 'Notas / Ref' },
  ];

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Búsqueda */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por producto, SKU o motivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtro Tipo */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'ALL'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('ENTRADA')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'ENTRADA'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilterType('SALIDA')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterType === 'SALIDA'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Salidas
            </button>
          </div>
        </div>
      )}

      <Table
        headers={headers}
        isEmpty={displayMovements.length === 0}
        emptyMessage="No se han registrado movimientos de inventario."
      >
        {displayMovements.map((mov) => {
          const isEntry = mov.type === 'ENTRADA';
          return (
            <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isEntry
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isEntry ? (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  {isEntry ? 'Entrada' : 'Salida'}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <div className="font-semibold text-slate-800">{mov.productName}</div>
                <div className="text-xs text-slate-400 font-mono">{mov.sku}</div>
              </td>
              <td className="px-5 py-3.5 font-bold">
                <span className={isEntry ? 'text-emerald-600' : 'text-rose-600'}>
                  {isEntry ? '+' : '-'}
                  {mov.quantity} uds
                </span>
              </td>
              <td className="px-5 py-3.5">
                {mov.paymentMethod ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {mov.paymentMethod === 'Efectivo' ? (
                      <Banknote className="w-3.5 h-3.5" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    {mov.paymentMethod}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>
              <td className="px-5 py-3.5 text-slate-600 text-xs">{mov.reason}</td>
              <td className="px-5 py-3.5 text-slate-400 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(mov.date)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-slate-500 text-xs italic">
                {mov.notes || '—'}
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
};

export default MovementHistory;
