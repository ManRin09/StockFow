import { query, getClient } from '../config/db.js';

export const mapRowToMovement = (row) => {
  if (!row) return null;
  return {
    id: row.id.toString(),
    productId: row.product_id ? row.product_id.toString() : null,
    productName: row.product_name || row.name || null,
    sku: row.sku || null,
    type: row.type === 'IN' ? 'ENTRADA' : row.type === 'OUT' ? 'SALIDA' : row.type, // Normalización 'ENTRADA' | 'SALIDA'
    quantity: parseInt(row.quantity, 10),
    reason: row.reason,
    paymentMethod:
      row.payment_method ||
      (row.notes && row.notes.includes('[Pago:')
        ? row.notes.match(/\[Pago:\s*([^\]]+)\]/)?.[1]
        : null),
    notes: row.notes,
    date: row.created_at || row.date,
  };
};

export const movementRepository = {
  /**
   * Obtiene la lista de movimientos con detalles del producto asociado
   */
  async findAll({ productId, type, search, limit = 50, offset = 0 } = {}) {
    // Busca en stock_movements o en la vista movements
    let sql = `
      SELECT 
        m.id,
        m.product_id,
        p.name AS product_name,
        p.sku,
        m.type,
        m.quantity,
        m.reason,
        m.notes,
        m.payment_method,
        m.created_at
      FROM (
        SELECT id, product_id, type, quantity, reason, notes, payment_method, created_at FROM stock_movements
      ) m
      LEFT JOIN products p ON m.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (productId) {
      sql += ` AND m.product_id = $${paramIndex}`;
      params.push(productId);
      paramIndex++;
    }

    if (type && type !== 'ALL') {
      const normalizedType = type.toUpperCase();
      sql += ` AND (m.type = $${paramIndex} OR (m.type = 'IN' AND $${paramIndex} = 'ENTRADA') OR (m.type = 'OUT' AND $${paramIndex} = 'SALIDA'))`;
      params.push(normalizedType);
      paramIndex++;
    }

    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex} OR m.reason ILIKE $${paramIndex} OR m.payment_method ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY m.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    try {
      const { rows } = await query(sql, params);
      return rows.map(mapRowToMovement);
    } catch (err) {
      // Fallback a tabla movements si stock_movements no estuviera
      const fallbackSql = sql.replace('FROM stock_movements', 'FROM movements');
      const { rows } = await query(fallbackSql, params);
      return rows.map(mapRowToMovement);
    }
  },

  /**
   * Registra un movimiento y actualiza el stock del producto de forma ATÓMICA mediante transacción SQL
   */
  async createWithTransaction({ productId, type, quantity, reason, paymentMethod = null, notes = '' }) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // 1. Bloquear y consultar el producto para evitar condiciones de carrera (Race Condition)
      const selectProductSql = `
        SELECT id, name, sku, current_stock, min_stock
        FROM products
        WHERE id = $1
        FOR UPDATE
      `;
      const productRes = await client.query(selectProductSql, [productId]);
      if (productRes.rows.length === 0) {
        throw new Error('El producto especificado no existe.');
      }

      const product = productRes.rows[0];
      const currentStock = parseInt(product.current_stock, 10);
      let newStock = currentStock;

      const upperType = type.toUpperCase();
      const isEntry = upperType === 'ENTRADA' || upperType === 'IN';
      const isExit = upperType === 'SALIDA' || upperType === 'OUT';

      if (isEntry) {
        newStock += quantity;
      } else if (isExit) {
        if (currentStock < quantity) {
          throw new Error(
            `Stock insuficiente. El stock actual es ${currentStock}, no es posible retirar ${quantity} unidades.`
          );
        }
        newStock -= quantity;
      } else {
        throw new Error('Tipo de movimiento inválido. Debe ser ENTRADA o SALIDA.');
      }

      // 2. Actualizar el stock del producto
      const updateStockSql = `
        UPDATE products
        SET current_stock = $1, updated_at = NOW()
        WHERE id = $2
      `;
      await client.query(updateStockSql, [newStock, productId]);

      // 3. Insertar el registro en stock_movements (o movements)
      let finalNotes = notes;
      if (isExit && paymentMethod && !finalNotes.includes('[Pago:')) {
        finalNotes = finalNotes ? `${finalNotes} [Pago: ${paymentMethod}]` : `[Pago: ${paymentMethod}]`;
      }

      let movementRes;
      try {
        const insertMovementSql = `
          INSERT INTO stock_movements (product_id, type, quantity, reason, payment_method, notes, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          RETURNING id, product_id, type, quantity, reason, payment_method, notes, created_at
        `;
        movementRes = await client.query(insertMovementSql, [
          productId,
          upperType,
          quantity,
          reason,
          paymentMethod,
          finalNotes,
        ]);
      } catch (insertErr) {
        const insertFallbackSql = `
          INSERT INTO movements (product_id, type, quantity, reason, payment_method, notes, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          RETURNING id, product_id, type, quantity, reason, payment_method, notes, created_at
        `;
        movementRes = await client.query(insertFallbackSql, [
          productId,
          upperType,
          quantity,
          reason,
          paymentMethod,
          finalNotes,
        ]);
      }

      await client.query('COMMIT');

      const createdMovement = movementRes.rows[0];
      return {
        ...mapRowToMovement(createdMovement),
        paymentMethod: paymentMethod || mapRowToMovement(createdMovement).paymentMethod,
        productName: product.name,
        sku: product.sku,
        updatedStock: newStock,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Resumen numérico de movimientos agrupados por tipo
   */
  async getSummary() {
    const sql = `
      SELECT 
        type,
        COUNT(*) AS total_count,
        COALESCE(SUM(quantity), 0) AS total_units
      FROM (
        SELECT type, quantity FROM stock_movements
        UNION ALL
        SELECT type, quantity FROM movements WHERE NOT EXISTS (SELECT 1 FROM stock_movements)
      ) m
      GROUP BY type
    `;
    try {
      const { rows } = await query(sql);
      return rows;
    } catch {
      return [];
    }
  },
};

export default movementRepository;
