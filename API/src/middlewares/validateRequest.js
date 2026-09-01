/**
 * Middleware para validar datos de creación de producto
 */
export const validateProductInput = (req, res, next) => {
  const { sku, name, purchasePrice, sellingPrice, currentStock, minStock } = req.body;
  const errors = [];

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    errors.push('El campo "sku" es obligatorio.');
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('El campo "name" es obligatorio.');
  }

  if (purchasePrice === undefined || isNaN(purchasePrice) || Number(purchasePrice) < 0) {
    errors.push('El campo "purchasePrice" debe ser un número mayor o igual a 0.');
  }

  if (sellingPrice === undefined || isNaN(sellingPrice) || Number(sellingPrice) < 0) {
    errors.push('El campo "sellingPrice" debe ser un número mayor o igual a 0.');
  }

  if (currentStock !== undefined && (isNaN(currentStock) || parseInt(currentStock, 10) < 0)) {
    errors.push('El campo "currentStock" debe ser un número entero mayor o igual a 0.');
  }

  if (minStock !== undefined && (isNaN(minStock) || parseInt(minStock, 10) < 0)) {
    errors.push('El campo "minStock" debe ser un número entero mayor o igual a 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en la solicitud.',
      errors,
    });
  }

  next();
};

/**
 * Middleware para validar datos de registro de movimiento
 */
export const validateMovementInput = (req, res, next) => {
  const { productId, type, quantity, reason, paymentMethod } = req.body;
  const errors = [];

  if (!productId) {
    errors.push('El campo "productId" es obligatorio.');
  }

  const validTypes = ['ENTRADA', 'SALIDA'];
  const upperType = (type || '').toUpperCase();
  if (!type || !validTypes.includes(upperType)) {
    errors.push('El campo "type" debe ser "ENTRADA" o "SALIDA".');
  }

  if (quantity === undefined || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
    errors.push('El campo "quantity" debe ser un número entero mayor a 0.');
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    errors.push('El campo "reason" es obligatorio.');
  }

  if (upperType === 'SALIDA' && paymentMethod) {
    const validPayments = ['Efectivo', 'Transferencia', 'EFECTIVO', 'TRANSFERENCIA'];
    if (!validPayments.includes(paymentMethod)) {
      errors.push('El método de pago debe ser "Efectivo" o "Transferencia".');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en la solicitud.',
      errors,
    });
  }

  next();
};
