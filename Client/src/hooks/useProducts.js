import { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';

/**
 * Hook para manejar la lógica de filtrado, búsqueda en tiempo real,
 * ordenamiento y operaciones directas sobre el catálogo de productos.
 */
export const useProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, registerMovement } = useInventory();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'currentStock' | 'sellingPrice' | 'purchasePrice' | 'sku'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filtro por búsqueda textual (nombre o SKU)
        const matchSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por categoría
        const matchCategory =
          selectedCategory === 'ALL' || product.category === selectedCategory;

        // Filtro por estado de stock
        let matchStockStatus = true;
        const currentStock = Number(product.currentStock) || 0;
        const minStock = Number(product.minStock) || 0;

        if (stockStatusFilter === 'OUT_OF_STOCK') {
          matchStockStatus = currentStock <= 0;
        } else if (stockStatusFilter === 'LOW_STOCK') {
          matchStockStatus = currentStock > 0 && currentStock <= minStock;
        } else if (stockStatusFilter === 'IN_STOCK') {
          matchStockStatus = currentStock > minStock;
        }

        return matchSearch && matchCategory && matchStockStatus;
      })
      .sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        // Comparación numérica vs textual
        if (typeof valueA === 'number' || typeof valueB === 'number') {
          valueA = Number(valueA) || 0;
          valueB = Number(valueB) || 0;
          return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
        }

        valueA = (valueA || '').toString().toLowerCase();
        valueB = (valueB || '').toString().toLowerCase();

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, stockStatusFilter, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setStockStatusFilter('ALL');
    setSortBy('name');
    setSortOrder('asc');
  };

  return {
    products: filteredAndSortedProducts,
    rawProductsCount: products.length,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    stockStatusFilter,
    setStockStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
    resetFilters,
    addProduct,
    updateProduct,
    deleteProduct,
    registerMovement,
  };
};

export default useProducts;
