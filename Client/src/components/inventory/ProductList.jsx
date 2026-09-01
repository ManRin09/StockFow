import React, { useState } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import StockAlertBadge from './StockAlertBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ArrowLeftRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const ProductList = ({
  products = [],
  onEditProduct,
  onDeleteProduct,
  onAdjustStock,
  onCreateProduct,
}) => {
  const { categories, fetchProducts, loading } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Filtrado y ordenamiento en cliente
  const filteredProducts = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;

      let matchStock = true;
      const stock = Number(p.currentStock) || 0;
      const min = Number(p.minStock) || 0;

      if (stockStatus === 'OUT') matchStock = stock <= 0;
      else if (stockStatus === 'LOW') matchStock = stock > 0 && stock <= min;
      else if (stockStatus === 'OK') matchStock = stock > min;

      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'number' || typeof valB === 'number') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return sortAsc ? valA - valB : valB - valA;
      }
      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const headers = [
    {
      label: (
        <button
          onClick={() => handleSort('sku')}
          className="flex items-center gap-1 hover:text-slate-800 focus:outline-none"
        >
          SKU <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      label: (
        <button
          onClick={() => handleSort('name')}
          className="flex items-center gap-1 hover:text-slate-800 focus:outline-none"
        >
          Producto <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    { label: 'Categoría' },
    {
      label: (
        <button
          onClick={() => handleSort('purchasePrice')}
          className="flex items-center gap-1 hover:text-slate-800 focus:outline-none"
        >
          P. Compra <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      label: (
        <button
          onClick={() => handleSort('sellingPrice')}
          className="flex items-center gap-1 hover:text-slate-800 focus:outline-none"
        >
          P. Venta <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    {
      label: (
        <button
          onClick={() => handleSort('currentStock')}
          className="flex items-center gap-1 hover:text-slate-800 focus:outline-none"
        >
          Stock <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
    },
    { label: 'Estado' },
    { label: 'Acciones', className: 'text-right' },
  ];

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Acciones */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filtros Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Categoría */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 pl-3 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Estado de Stock */}
          <div className="relative">
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="py-2 pl-3 pr-8 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Todo el Stock</option>
              <option value="OK">En Stock</option>
              <option value="LOW">Stock Bajo</option>
              <option value="OUT">Agotados</option>
            </select>
          </div>

          {/* Recargar */}
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchProducts}
            isLoading={loading}
            title="Recargar productos"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          {/* Botón Crear */}
          {onCreateProduct && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onCreateProduct}
            >
              Nuevo Producto
            </Button>
          )}
        </div>
      </div>

      {/* Tabla de Productos */}
      <Table
        headers={headers}
        isEmpty={filteredProducts.length === 0}
        emptyMessage="No se encontraron productos que coincidan con la búsqueda."
      >
        {filteredProducts.map((product) => (
          <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
            <td className="px-5 py-4 font-mono text-xs font-bold text-slate-500">
              {product.sku}
            </td>
            <td className="px-5 py-4">
              <div className="font-bold text-slate-800">{product.name}</div>
              <div className="text-[11px] text-slate-400">Min. req: {product.minStock} uds</div>
            </td>
            <td className="px-5 py-4">
              <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                {product.category || 'General'}
              </span>
            </td>
            <td className="px-5 py-4 font-medium text-slate-600">
              ${Number(product.purchasePrice || 0).toFixed(2)}
            </td>
            <td className="px-5 py-4 font-bold text-slate-900">
              ${Number(product.sellingPrice || 0).toFixed(2)}
            </td>
            <td className="px-5 py-4 font-bold text-slate-800">
              {product.currentStock} uds
            </td>
            <td className="px-5 py-4">
              <StockAlertBadge
                currentStock={product.currentStock}
                minStock={product.minStock}
              />
            </td>
            <td className="px-5 py-4 text-right">
              <div className="flex items-center justify-end gap-1.5">
                {/* Botón Ajustar Stock Rápido */}
                <button
                  onClick={() => onAdjustStock && onAdjustStock(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Registrar Entrada/Salida"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                {/* Botón Editar */}
                <button
                  onClick={() => onEditProduct && onEditProduct(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  title="Editar Producto"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Botón Eliminar */}
                <button
                  onClick={() => onDeleteProduct && onDeleteProduct(product)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Eliminar Producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      {/* Resumen de conteo */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <span>
          Mostrando <strong className="text-slate-600">{filteredProducts.length}</strong> de{' '}
          <strong className="text-slate-600">{products.length}</strong> productos
        </span>
      </div>
    </div>
  );
};

export default ProductList;
