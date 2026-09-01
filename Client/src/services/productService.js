import api from './api';

export const productService = {
  /**
   * Obtiene la lista completa de productos o con filtros opcionales
   */
  async getAll(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Obtiene un producto por su ID o SKU
   */
  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Crea un nuevo producto
   */
  async create(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  /**
   * Actualiza los datos de un producto existente
   */
  async update(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Elimina un producto por ID
   */
  async delete(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Obtiene productos con stock bajo o agotados
   */
  async getLowStock() {
    const response = await api.get('/products/low-stock');
    return response.data;
  },
};

export default productService;
