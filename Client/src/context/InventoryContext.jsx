import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import movementService from '../services/movementService';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Notificaciones Toast
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Carga inicial de datos desde Backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      if (Array.isArray(data)) {
        setProducts(data);
        setApiConnected(true);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
        setApiConnected(true);
      }
    } catch (err) {
      console.warn('[InventoryContext] No se pudo conectar con el backend API. Iniciando con estado vacío.');
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovements = useCallback(async () => {
    try {
      const data = await movementService.getAll();
      if (Array.isArray(data)) {
        setMovements(data);
      } else if (data && Array.isArray(data.movements)) {
        setMovements(data.movements);
      }
    } catch (err) {
      // Backend offline o sin datos
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchMovements();
  }, [fetchProducts, fetchMovements]);

  // Operaciones CRUD de Productos
  const addProduct = async (productData) => {
    try {
      if (apiConnected) {
        const created = await productService.create(productData);
        setProducts((prev) => [created, ...prev]);
      } else {
        // Modo local sin backend
        const newProduct = {
          ...productData,
          id: 'p-' + Date.now(),
          currentStock: Number(productData.currentStock) || 0,
          minStock: Number(productData.minStock) || 0,
          purchasePrice: Number(productData.purchasePrice) || 0,
          sellingPrice: Number(productData.sellingPrice) || 0,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [newProduct, ...prev]);
      }
      showNotification('Producto creado exitosamente.', 'success');
      return true;
    } catch (error) {
      showNotification(error.message || 'Error al crear el producto.', 'error');
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const formatted = {
        ...productData,
        currentStock: Number(productData.currentStock),
        minStock: Number(productData.minStock),
        purchasePrice: Number(productData.purchasePrice),
        sellingPrice: Number(productData.sellingPrice),
      };

      if (apiConnected) {
        const updated = await productService.update(id, formatted);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } else {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...formatted } : p)));
      }
      showNotification('Producto actualizado correctamente.', 'success');
      return true;
    } catch (error) {
      showNotification(error.message || 'Error al actualizar el producto.', 'error');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      if (apiConnected) {
        await productService.delete(id);
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showNotification('Producto eliminado del inventario.', 'success');
      return true;
    } catch (error) {
      showNotification(error.message || 'Error al eliminar el producto.', 'error');
      throw error;
    }
  };

  // Registro de Movimientos de Inventario (Entrada / Salida con Método de Pago)
  const registerMovement = async (movementData) => {
    try {
      const targetProduct = products.find((p) => p.id === movementData.productId);
      if (!targetProduct) {
        throw new Error('Producto no encontrado para el movimiento.');
      }

      const qty = Number(movementData.quantity);
      if (isNaN(qty) || qty <= 0) {
        throw new Error('La cantidad debe ser mayor a 0.');
      }

      let newStock = targetProduct.currentStock;
      if (movementData.type === 'ENTRADA') {
        newStock += qty;
      } else if (movementData.type === 'SALIDA') {
        if (targetProduct.currentStock < qty) {
          throw new Error(`Stock insuficiente. Stock actual: ${targetProduct.currentStock}`);
        }
        newStock -= qty;
      } else {
        throw new Error('Tipo de movimiento no válido.');
      }

      const newMovementRecord = {
        id: 'm-' + Date.now(),
        productId: targetProduct.id,
        productName: targetProduct.name,
        sku: targetProduct.sku,
        type: movementData.type,
        quantity: qty,
        reason: movementData.reason,
        paymentMethod: movementData.type === 'SALIDA' ? (movementData.paymentMethod || 'Efectivo') : null,
        notes: movementData.notes || '',
        date: new Date().toISOString(),
      };

      if (apiConnected) {
        const responseData = await movementService.create(movementData);
        if (responseData && responseData.updatedStock !== undefined) {
          newStock = responseData.updatedStock;
        }
      }

      // Actualizar estado local
      setProducts((prev) =>
        prev.map((p) => (p.id === targetProduct.id ? { ...p, currentStock: newStock } : p))
      );
      setMovements((prev) => [newMovementRecord, ...prev]);

      showNotification(
        `Movimiento de ${movementData.type.toLowerCase()} registrado correctamente.`,
        'success'
      );
      return true;
    } catch (error) {
      showNotification(error.message || 'Error al registrar el movimiento.', 'error');
      throw error;
    }
  };

  // Cálculo de Métricas y Estadísticas Globales
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (Number(p.currentStock) || 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (Number(p.currentStock) || 0) * (Number(p.purchasePrice) || 0),
    0
  );
  const totalPotentialRevenue = products.reduce(
    (acc, p) => acc + (Number(p.currentStock) || 0) * (Number(p.sellingPrice) || 0),
    0
  );
  const lowStockProducts = products.filter(
    (p) => Number(p.currentStock) > 0 && Number(p.currentStock) <= Number(p.minStock)
  );
  const outOfStockProducts = products.filter((p) => Number(p.currentStock) <= 0);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const value = {
    products,
    movements,
    loading,
    apiConnected,
    categories,
    notifications,
    showNotification,
    removeNotification,
    fetchProducts,
    fetchMovements,
    addProduct,
    updateProduct,
    deleteProduct,
    registerMovement,
    metrics: {
      totalProducts,
      totalStockUnits,
      totalInventoryValue,
      totalPotentialRevenue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      recentMovements: movements.slice(0, 5),
    },
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
      {/* Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((toast) => {
          const bgColors = {
            success: 'bg-emerald-600 text-white border-emerald-700',
            error: 'bg-rose-600 text-white border-rose-700',
            warning: 'bg-amber-500 text-white border-amber-600',
            info: 'bg-indigo-600 text-white border-indigo-700',
          };
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center justify-between transition-all duration-300 transform translate-y-0 ${
                bgColors[toast.type] || bgColors.info
              }`}
            >
              <span>{toast.message}</span>
              <button
                onClick={() => removeNotification(toast.id)}
                className="ml-3 text-white hover:opacity-75 focus:outline-none"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe ser utilizado dentro de un InventoryProvider');
  }
  return context;
};

export default InventoryContext;
