import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-2">Página no encontrada</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">
        La ruta a la que intentas acceder no existe o ha sido movida dentro del sistema de inventario.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          Volver al Panel Principal
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
