import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', message = 'Cargando datos...', className = '' }) => {
  const sizeStyles = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <Loader2 className={`${sizeStyles[size] || sizeStyles.md} text-indigo-600 animate-spin`} />
      {message && <p className="mt-3 text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-3">
      <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-lg w-full flex gap-4 px-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-200 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
