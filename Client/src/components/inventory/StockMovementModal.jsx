import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { ArrowDownLeft, ArrowUpRight, Hash, Banknote, CreditCard, DollarSign } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const REASON_OPTIONS = {
  ENTRADA: [
    'Reabastecimiento de Proveedor',
    'Devolución de Cliente',
    'Ajuste por Conteo Físico (+)',
    'Transferencia Interna',
    'Otro Ingreso',
  ],
  SALIDA: [
    'Venta a Cliente',
    'Merma / Producto Dañado',
    'Ajuste por Conteo Físico (-)',
    'Devolución a Proveedor',
    'Uso Interno',
    'Otro Egreso',
  ],
};

export const StockMovementModal = ({
  isOpen,
  onClose,
  initialProduct = null,
  isLoading = false,
}) => {
  const { products, registerMovement } = useInventory();

  const [movementType, setMovementType] = useState('ENTRADA');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo'); // 'Efectivo' | 'Transferencia'
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [initialProduct, products, isOpen]);

  useEffect(() => {
    // Resetear razón por defecto según el tipo
    setReason(REASON_OPTIONS[movementType][0]);
    setError('');
  }, [movementType]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    if (!selectedProduct) {
      setError('Por favor selecciona un producto válido.');
      return;
    }

    if (movementType === 'SALIDA' && selectedProduct.currentStock < qty) {
      setError(
        `Stock insuficiente para esta salida. Stock actual disponible: ${selectedProduct.currentStock}`
      );
      return;
    }

    try {
      await registerMovement({
        productId: selectedProduct.id,
        type: movementType,
        quantity: qty,
        reason,
        paymentMethod: movementType === 'SALIDA' ? paymentMethod : null,
        notes,
      });
      setQuantity('');
      setNotes('');
      onClose();
    } catch (err) {
      setError(err.message || 'Error al procesar el movimiento');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Movimiento de Inventario"
      subtitle="Aumenta o reduce el stock actual con registro de auditoría."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Tipo (Entrada vs Salida) */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMovementType('ENTRADA')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              movementType === 'ENTRADA'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Entrada (Ingreso)
          </button>
          <button
            type="button"
            onClick={() => setMovementType('SALIDA')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              movementType === 'SALIDA'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Salida (Egreso)
          </button>
        </div>

        {/* Selección de Producto */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Producto Seleccionado
          </label>
          {products.length === 0 ? (
            <p className="text-xs text-rose-500 py-2">
              No hay productos registrados en el inventario. Crea un producto primero.
            </p>
          ) : (
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={Boolean(initialProduct)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.sku}) - Stock: {prod.currentStock}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Resumen del producto seleccionado */}
        {selectedProduct && (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Stock Disponible</span>
              <span className="font-bold text-slate-800 text-sm">
                {selectedProduct.currentStock} unidades
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block font-medium">P. Venta Ref.</span>
              <span className="font-semibold text-emerald-700 text-sm">
                ${Number(selectedProduct.sellingPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Cantidad */}
        <Input
          label="Cantidad a Mover"
          type="number"
          min="1"
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          leftIcon={<Hash className="w-4 h-4" />}
          required
        />

        {/* Método de Pago (Exclusivo para Salidas) */}
        {movementType === 'SALIDA' && (
          <div className="flex flex-col gap-1.5 text-left p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-fade-in">
            <label className="text-xs font-bold text-indigo-900 tracking-wide flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Método de Pago (Salida)
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('Efectivo')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'Efectivo'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Efectivo
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Transferencia')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'Transferencia'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Transferencia
              </button>
            </div>
          </div>
        )}

        {/* Motivo o Razón */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Motivo de la Operación
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {REASON_OPTIONS[movementType].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Notas u Observaciones */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Notas / Referencia (Opcional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Factura #9812, Comprobante de transferencia, etc."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={movementType === 'ENTRADA' ? 'success' : 'danger'}
            isLoading={isLoading}
            disabled={products.length === 0}
          >
            Confirmar {movementType === 'ENTRADA' ? 'Entrada' : 'Salida'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockMovementModal;
