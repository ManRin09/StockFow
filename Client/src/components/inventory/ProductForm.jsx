import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Tag, Barcode, DollarSign, Layers, AlertCircle } from 'lucide-react';

export const ProductForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    currentStock: '',
    minStock: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        name: initialData.name || '',
        category: initialData.category || '',
        purchasePrice: initialData.purchasePrice !== undefined ? initialData.purchasePrice : '',
        sellingPrice: initialData.sellingPrice !== undefined ? initialData.sellingPrice : '',
        currentStock: initialData.currentStock !== undefined ? initialData.currentStock : '',
        minStock: initialData.minStock !== undefined ? initialData.minStock : '',
      });
    } else {
      setFormData({
        sku: '',
        name: '',
        category: '',
        purchasePrice: '',
        sellingPrice: '',
        currentStock: '',
        minStock: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.sku.trim()) newErrors.sku = 'El SKU es obligatorio.';
    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio.';
    if (!formData.category.trim()) newErrors.category = 'La categoría es obligatoria.';

    if (formData.purchasePrice === '' || isNaN(formData.purchasePrice) || Number(formData.purchasePrice) < 0) {
      newErrors.purchasePrice = 'El precio de compra debe ser un número mayor o igual a 0.';
    }

    if (formData.sellingPrice === '' || isNaN(formData.sellingPrice) || Number(formData.sellingPrice) < 0) {
      newErrors.sellingPrice = 'El precio de venta debe ser un número mayor o igual a 0.';
    }

    if (formData.currentStock === '' || isNaN(formData.currentStock) || Number(formData.currentStock) < 0) {
      newErrors.currentStock = 'El stock actual debe ser un número entero mayor o igual a 0.';
    }

    if (formData.minStock === '' || isNaN(formData.minStock) || Number(formData.minStock) < 0) {
      newErrors.minStock = 'El stock mínimo debe ser un número entero mayor o igual a 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      currentStock: parseInt(formData.currentStock, 10),
      minStock: parseInt(formData.minStock, 10),
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      // Error capturado en el contexto
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
      subtitle={
        isEditing
          ? 'Actualiza las propiedades, precios y umbrales de stock del producto.'
          : 'Completa los campos para registrar un nuevo artículo en el inventario.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Código SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Ej: PROD-001"
            leftIcon={<Barcode className="w-4 h-4" />}
            error={errors.sku}
            required
          />

          <Input
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Ej: Electrónica, Alimentos, Repuestos..."
            leftIcon={<Tag className="w-4 h-4" />}
            error={errors.category}
            required
          />
        </div>

        <Input
          label="Nombre del Producto"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Teclado Mecánico RGB"
          leftIcon={<Tag className="w-4 h-4" />}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio de Compra ($)"
            name="purchasePrice"
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="0.00"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.purchasePrice}
            required
          />

          <Input
            label="Precio de Venta ($)"
            name="sellingPrice"
            type="number"
            step="0.01"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="0.00"
            leftIcon={<DollarSign className="w-4 h-4" />}
            error={errors.sellingPrice}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Stock Actual"
            name="currentStock"
            type="number"
            value={formData.currentStock}
            onChange={handleChange}
            placeholder="0"
            leftIcon={<Layers className="w-4 h-4" />}
            error={errors.currentStock}
            required
          />

          <Input
            label="Stock Mínimo (Alerta)"
            name="minStock"
            type="number"
            value={formData.minStock}
            onChange={handleChange}
            placeholder="0"
            leftIcon={<AlertCircle className="w-4 h-4" />}
            error={errors.minStock}
            helperText="Notifica cuando el stock cae por debajo de este valor."
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
