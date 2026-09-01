import React from 'react';
import { useInventory } from '../context/InventoryContext';
import MovementHistory from '../components/inventory/MovementHistory';
import StockMovementModal from '../components/inventory/StockMovementModal';
import Button from '../components/common/Button';
import useModal from '../hooks/useModal';
import { ArrowLeftRight, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const StockMovementsPage = () => {
  const { movements } = useInventory();
  const movementModal = useModal();

  const totalEntries = movements.filter((m) => m.type === 'ENTRADA').reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
  const totalExits = movements.filter((m) => m.type === 'SALIDA').reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Control de Entradas y Salidas
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {movements.length} movimientos
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Historial de auditoría, reabastecimiento de mercancía y ajustes de stock.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => movementModal.openModal()}
        >
          Registrar Movimiento
        </Button>
      </div>

      {/* Mini Resumen de Entradas vs Salidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Total Entradas
              </span>
              <p className="text-xl font-black text-emerald-900">+{totalEntries} unidades</p>
            </div>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/80 px-2.5 py-1 rounded-lg">
            Reabastecimiento
          </span>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Total Salidas
              </span>
              <p className="text-xl font-black text-rose-900">-{totalExits} unidades</p>
            </div>
          </div>
          <span className="text-xs text-rose-700 font-semibold bg-rose-100/80 px-2.5 py-1 rounded-lg">
            Ventas y Mermas
          </span>
        </div>
      </div>

      {/* Tabla e Historial */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <MovementHistory movements={movements} />
      </div>

      {/* Modal para Registrar Movimiento */}
      <StockMovementModal
        isOpen={movementModal.isOpen}
        onClose={movementModal.closeModal}
      />
    </div>
  );
};

export default StockMovementsPage;
