import api from './api';

export const movementService = {
  /**
   * Obtiene el historial de movimientos de inventario
   */
  async getAll(params = {}) {
    const response = await api.get('/movements', { params });
    return response.data;
  },

  /**
   * Registra un nuevo movimiento de stock (ENTRADA o SALIDA)
   * @param {Object} movementData - { productId, type: 'ENTRADA' | 'SALIDA', quantity, reason, notes }
   */
  async create(movementData) {
    const response = await api.post('/movements', movementData);
    return response.data;
  },

  /**
   * Obtiene resumen o métricas generales de movimientos
   */
  async getSummary() {
    const response = await api.get('/movements/summary');
    return response.data;
  },
};

export default movementService;
