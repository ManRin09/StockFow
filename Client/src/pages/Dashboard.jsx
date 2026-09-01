import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { MetricCard } from '../components/common/Card';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StockAlertBadge from '../components/inventory/StockAlertBadge';
import MovementHistory from '../components/inventory/MovementHistory';
import ProductForm from '../components/inventory/ProductForm';
import StockMovementModal from '../components/inventory/StockMovementModal';
import useModal from '../hooks/useModal';
import {
  Package,
  DollarSign,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowRight,
  Boxes,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { products, movements, metrics, addProduct } = useInventory();

  // Modales
  const createProductModal = useModal();
  const movementModal = useModal();

  const handleOpenMovement = (type = 'ENTRADA') => {
    movementModal.openModal({ type });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel de Control
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Resumen global y métricas clave del estado de tu inventario en tiempo real.
          </p>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowDownLeft className="w-4 h-4 text-emerald-600" />}
            onClick={() => handleOpenMovement('ENTRADA')}
          >
            Registrar Entrada
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowUpRight className="w-4 h-4 text-rose-600" />}
            onClick={() => handleOpenMovement('SALIDA')}
          >
            Registrar Salida
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => createProductModal.openModal()}
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Artículos"
          value={metrics.totalProducts}
          subtitle={`${metrics.totalStockUnits} unidades físicas`}
          icon={<Package className="w-6 h-6" />}
          colorScheme="indigo"
        />

        <MetricCard
          title="Valor del Inventario"
          value={`$${metrics.totalInventoryValue.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Cálculo a costo de compra"
          icon={<DollarSign className="w-6 h-6" />}
          colorScheme="emerald"
        />

        <MetricCard
          title="Alertas Stock Bajo"
          value={metrics.lowStockCount}
          subtitle={
            metrics.lowStockCount > 0
              ? 'Requiere reabastecimiento'
              : 'Nivel de stock óptimo'
          }
          icon={<AlertTriangle className="w-6 h-6" />}
          colorScheme="amber"
        />

        <MetricCard
          title="Potencial en Ventas"
          value={`$${metrics.totalPotentialRevenue.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Valor estimado al vender stock"
          icon={<TrendingUp className="w-6 h-6" />}
          colorScheme="blue"
        />
      </div>

      {/* Alertas de Stock Bajo y Últimos Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Productos con Stock Bajo / Crítico */}
        <Card
          className="lg:col-span-1 flex flex-col justify-between"
          title="Alertas de Stock"
          subtitle="Artículos por debajo del umbral mínimo"
          action={
            <Link
              to="/products"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {metrics.lowStockProducts.length === 0 && metrics.outOfStockProducts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Boxes className="w-10 h-10 mx-auto text-emerald-400 mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-600">¡Inventario en buen estado!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                No hay productos en nivel crítico ni agotados.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {[...metrics.outOfStockProducts, ...metrics.lowStockProducts].map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StockAlertBadge
                      currentStock={item.currentStock}
                      minStock={item.minStock}
                    />
                    <button
                      onClick={() => movementModal.openModal(item)}
                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Reabastecer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Últimos Movimientos de Inventario */}
        <Card
          className="lg:col-span-2"
          title="Últimos Movimientos"
          subtitle="Registro de las transacciones y ajustes más recientes"
          action={
            <Link
              to="/movements"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Historial completo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <MovementHistory movements={movements} limit={5} />
        </Card>
      </div>

      {/* Modal para Crear Producto */}
      <ProductForm
        isOpen={createProductModal.isOpen}
        onClose={createProductModal.closeModal}
        onSubmit={addProduct}
      />

      {/* Modal para Movimientos */}
      <StockMovementModal
        isOpen={movementModal.isOpen}
        onClose={movementModal.closeModal}
        initialProduct={
          movementModal.data && movementModal.data.id ? movementModal.data : null
        }
      />
    </div>
  );
};

export default Dashboard;
