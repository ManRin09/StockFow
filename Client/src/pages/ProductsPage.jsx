import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import ProductList from '../components/inventory/ProductList';
import ProductForm from '../components/inventory/ProductForm';
import StockMovementModal from '../components/inventory/StockMovementModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import useModal from '../hooks/useModal';
import { Package, Plus } from 'lucide-react';

export const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useInventory();

  // Modales
  const formModal = useModal();
  const deleteModal = useModal();
  const movementModal = useModal();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = () => {
    formModal.openModal(null); // null = Modo Creación
  };

  const handleEdit = (product) => {
    formModal.openModal(product); // payload con producto = Modo Edición
  };

  const handleDelete = (product) => {
    deleteModal.openModal(product);
  };

  const handleAdjustStock = (product) => {
    movementModal.openModal(product);
  };

  const handleFormSubmit = async (formData) => {
    if (formModal.data && formModal.data.id) {
      await updateProduct(formModal.data.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.data) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteModal.data.id);
      deleteModal.closeModal();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Catálogo de Productos
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {products.length} artículos
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Administra tus productos, precios de compra/venta y niveles de inventario.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Lista / Tabla de Productos */}
      <ProductList
        products={products}
        onEditProduct={handleEdit}
        onDeleteProduct={handleDelete}
        onAdjustStock={handleAdjustStock}
        onCreateProduct={handleCreate}
      />

      {/* Modal de Creación / Edición */}
      <ProductForm
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        onSubmit={handleFormSubmit}
        initialData={formModal.data}
      />

      {/* Modal de Ajuste de Stock */}
      <StockMovementModal
        isOpen={movementModal.isOpen}
        onClose={movementModal.closeModal}
        initialProduct={movementModal.data}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar producto del inventario?"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.data?.name}" (${deleteModal.data?.sku})? Esta acción eliminará permanentemente el registro.`}
        confirmText="Eliminar Producto"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductsPage;
