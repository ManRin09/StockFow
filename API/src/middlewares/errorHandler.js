/**
 * Middleware centralizado de manejo de errores de Express
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  // Error personalizado con código de estado HTTP
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Manejo de errores específicos de PostgreSQL (códigos de error de Postgres)
  if (err.code) {
    // 23505: unique_violation (violación de clave única / duplicado)
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Violación de restricción única. Ya existe un registro con esos datos (SKU o ID).',
        detail: err.detail,
      });
    }

    // 23503: foreign_key_violation (violación de clave foránea)
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'El registro referenciado no existe o está siendo utilizado por otros elementos.',
        detail: err.detail,
      });
    }

    // 22P02: invalid_text_representation (por ejemplo un ID numérico que no es válido)
    if (err.code === '22P02') {
      return res.status(400).json({
        success: false,
        message: 'Formato de parámetro o identificador inválido para la base de datos.',
      });
    }
  }

  // Error genérico 500
  const statusCode = err.status || 500;
  const message = err.message || 'Ocurrió un error interno en el servidor.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
