import movementRepository from '../repositories/movement.repository.js';
import productRepository from '../repositories/product.repository.js';

export const movementService = {
  /**
   * Obtiene el listado de movimientos
   */
  async getAllMovements(filters) {
    return await movementRepository.findAll(filters);
  },

  /**
   * Registra un movimiento de entrada o salida de inventario con método de pago
   */
  async recordMovement(data) {
    const { productId, type, quantity, reason, paymentMethod, notes } = data;

    if (!productId) {
      const error = new Error('El ID del producto es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    const upperType = (type || '').toUpperCase();
    if (upperType !== 'ENTRADA' && upperType !== 'SALIDA') {
      const error = new Error("El tipo de movimiento debe ser 'ENTRADA' o 'SALIDA'.");
      error.statusCode = 400;
      throw error;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      const error = new Error('La cantidad debe ser un número entero mayor a 0.');
      error.statusCode = 400;
      throw error;
    }

    if (!reason || !reason.trim()) {
      const error = new Error('El motivo del movimiento es obligatorio.');
      error.statusCode = 400;
      throw error;
    }

    // Verificar existencia previa del producto
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error(`El producto con ID ${productId} no existe.`);
      error.statusCode = 404;
      throw error;
    }

    // Ejecutar transacción atómica en repositorio
    return await movementRepository.createWithTransaction({
      productId,
      type: upperType,
      quantity: qty,
      reason: reason.trim(),
      paymentMethod: upperType === 'SALIDA' ? (paymentMethod || 'Efectivo') : null,
      notes: (notes || '').trim(),
    });
  },

  /**
   * Resumen general de movimientos
   */
  async getMovementsSummary() {
    return await movementRepository.getSummary();
  },
};

export default movementService;
