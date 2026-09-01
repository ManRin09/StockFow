import productRepository from '../repositories/product.repository.js';

export const productService = {
  /**
   * Obtiene la lista de productos con filtros
   */
  async getAllProducts(filters) {
    return await productRepository.findAll(filters);
  },

  /**
   * Obtiene un producto por su ID
   */
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error(`No se encontró el producto con el ID ${id}`);
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  /**
   * Crea un nuevo producto validando la no duplicidad del SKU
   */
  async createProduct(data) {
    const { sku, name, category, purchasePrice, sellingPrice, currentStock, minStock } = data;

    // Validación de unicidad de SKU
    const existingProduct = await productRepository.findBySku(sku);
    if (existingProduct) {
      const error = new Error(`Ya existe un producto registrado con el SKU '${sku}'`);
      error.statusCode = 409;
      throw error;
    }

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      category: (category || 'General').trim(),
      purchasePrice: Number(purchasePrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      currentStock: parseInt(currentStock, 10) || 0,
      minStock: parseInt(minStock, 10) || 0,
    };

    return await productRepository.create(payload);
  },

  /**
   * Actualiza los datos de un producto existente
   */
  async updateProduct(id, data) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const error = new Error(`No se encontró el producto con ID ${id}`);
      error.statusCode = 404;
      throw error;
    }

    // Si cambió el SKU, verificar que no colisione con otro producto
    if (data.sku && data.sku.toUpperCase() !== existing.sku.toUpperCase()) {
      const duplicateSku = await productRepository.findBySku(data.sku);
      if (duplicateSku && duplicateSku.id !== id.toString()) {
        const error = new Error(`El código SKU '${data.sku}' ya está asignado a otro producto`);
        error.statusCode = 409;
        throw error;
      }
    }

    const payload = {
      sku: (data.sku || existing.sku).trim(),
      name: (data.name || existing.name).trim(),
      category: (data.category || existing.category).trim(),
      purchasePrice: data.purchasePrice !== undefined ? Number(data.purchasePrice) : existing.purchasePrice,
      sellingPrice: data.sellingPrice !== undefined ? Number(data.sellingPrice) : existing.sellingPrice,
      currentStock: data.currentStock !== undefined ? parseInt(data.currentStock, 10) : existing.currentStock,
      minStock: data.minStock !== undefined ? parseInt(data.minStock, 10) : existing.minStock,
    };

    return await productRepository.update(id, payload);
  },

  /**
   * Elimina un producto por ID
   */
  async deleteProduct(id) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      const error = new Error(`No se encontró el producto con ID ${id}`);
      error.statusCode = 404;
      throw error;
    }

    const deleted = await productRepository.delete(id);
    if (!deleted) {
      const error = new Error('No se pudo eliminar el producto.');
      error.statusCode = 500;
      throw error;
    }

    return { message: 'Producto eliminado correctamente', id };
  },

  /**
   * Obtiene productos con stock bajo
   */
  async getLowStockProducts() {
    return await productRepository.findLowStock();
  },
};

export default productService;
