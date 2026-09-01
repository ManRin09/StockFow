import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const StockAlertBadge = ({ currentStock, minStock, className = '' }) => {
  const stock = Number(currentStock) || 0;
  const min = Number(minStock) || 0;

  if (stock <= 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}
      >
        <XCircle className="w-3.5 h-3.5 text-rose-500" />
        Agotado
      </span>
    );
  }

  if (stock <= min) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        Stock Bajo ({stock}/{min})
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      En Stock ({stock})
    </span>
  );
};

export default StockAlertBadge;
