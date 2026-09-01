import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Bell, Boxes, Wifi, WifiOff } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { apiConnected, metrics } = useInventory();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight">StockFlow</h1>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              Sistema de Inventario
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Indicador de conexión con el backend */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            apiConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={
            apiConnected
              ? 'Conectado a http://localhost:5000/api'
              : 'Modo Offline/Local (Backend desconectado)'
          }
        >
          {apiConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Backend Activo</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Modo Local</span>
            </>
          )}
        </div>

        {/* Alerta de Stock Bajo */}
        {metrics.lowStockCount > 0 && (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
            title={`${metrics.lowStockCount} productos con stock crítico o bajo`}
          >
            <Bell className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
            <span>{metrics.lowStockCount} alertas</span>
          </div>
        )}

        {/* Perfil Usuario */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">Admin General</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
