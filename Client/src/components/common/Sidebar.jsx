import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { metrics } = useInventory();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: '/products',
      label: 'Catálogo de Productos',
      icon: <Package className="w-5 h-5" />,
      badge: metrics.totalProducts,
    },
    {
      to: '/movements',
      label: 'Entradas y Salidas',
      icon: <ArrowLeftRight className="w-5 h-5" />,
      badge: metrics.recentMovements.length,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-100 p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 lg:hidden">
            <span className="font-bold text-slate-800 text-sm">Menú Principal</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navegación
            </span>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.badge > 0
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        {/* Resumen inferior */}
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Stock Crítico</span>
            <span className="text-xs font-bold text-rose-600">{metrics.lowStockCount} items</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  metrics.totalProducts > 0
                    ? Math.min(100, (metrics.lowStockCount / metrics.totalProducts) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
