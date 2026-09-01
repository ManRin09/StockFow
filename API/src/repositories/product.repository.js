import { query } from '../config/db.js';

/**
 * Mapea una fila de PostgreSQL (snake_case) al formato camelCase utilizado en la aplicación
 */
export const mapRowToProduct = (row) => {
  if (!row) return null;
  return {
    id: row.id.toString(),
    sku: row.sku,
    name: row.name,
    category: row.category,
    purchasePrice: parseFloat(row.purchase_price !== undefined ? row.purchase_price : 0),
    sellingPrice: parseFloat(
      row.sale_price !== undefined
        ? row.sale_price
        : row.selling_price !== undefined
        ? row.selling_price
        : 0
    ),
    currentStock: parseInt(row.current_stock, 10),
    minStock: parseInt(row.min_stock, 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const productRepository = {
  /**
   * Obtiene todos los productos con filtros dinámicos y ordenamiento
   */
  async findAll({ search, category, stockStatus, sortBy = 'name', sortOrder = 'ASC' } = {}) {
    let sql = `
      SELECT id, sku, name, category, purchase_price, 
             COALESCE(NULLIF(sale_price::text, ''), selling_price::text, '0')::NUMERIC AS sale_price,
             current_stock, min_stock, created_at, updated_at
      FROM (
        SELECT id, sku, name, category, purchase_price, 
               CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sale_price') 
                    THEN sale_price ELSE NULL END AS sale_price,
               CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='selling_price') 
                    THEN selling_price ELSE NULL END AS selling_price,
               current_stock, min_stock, created_at, updated_at
        FROM products
      ) p
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filtro por búsqueda textual (Nombre o SKU)
    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR sku ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filtro por categoría
    if (category && category !== 'ALL') {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtro por estado de stock
    if (stockStatus === 'OUT_OF_STOCK' || stockStatus === 'OUT') {
      sql += ` AND current_stock <= 0`;
    } else if (stockStatus === 'LOW_STOCK' || stockStatus === 'LOW') {
      sql += ` AND current_stock > 0 AND current_stock <= min_stock`;
    } else if (stockStatus === 'IN_STOCK' || stockStatus === 'OK') {
      sql += ` AND current_stock > min_stock`;
    }

    // Ordenamiento seguro
    const allowedSortFields = {
      name: 'name',
      sku: 'sku',
      category: 'category',
      purchasePrice: 'purchase_price',
      sellingPrice: 'sale_price',
      currentStock: 'current_stock',
      minStock: 'min_stock',
      createdAt: 'created_at',
    };

    const sortColumn = allowedSortFields[sortBy] || 'name';
    const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY ${sortColumn} ${direction}`;

    try {
      const { rows } = await query(sql, params);
      return rows.map(mapRowToProduct);
    } catch {
      // Consulta directa simplificada como fallback
      const directSql = `SELECT * FROM products ORDER BY name ASC`;
      const { rows } = await query(directSql);
      return rows.map(mapRowToProduct);
    }
  },

  /**
   * Busca un producto por su ID
   */
  async findById(id) {
    const sql = `SELECT * FROM products WHERE id = $1`;
    const { rows } = await query(sql, [id]);
    return mapRowToProduct(rows[0]);
  },

  /**
   * Busca un producto por su código SKU
   */
  async findBySku(sku) {
    const sql = `SELECT * FROM products WHERE UPPER(sku) = UPPER($1)`;
    const { rows } = await query(sql, [sku]);
    return mapRowToProduct(rows[0]);
  },

  /**
   * Crea un nuevo producto con compatibilidad para sale_price o selling_price
   */
  async create({ sku, name, category, purchasePrice, sellingPrice, currentStock = 0, minStock = 5 }) {
    try {
      const sql = `
        INSERT INTO products (sku, name, category, purchase_price, sale_price, current_stock, min_stock, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;
      const params = [sku, name, category, purchasePrice, sellingPrice, currentStock, minStock];
      const { rows } = await query(sql, params);
      return mapRowToProduct(rows[0]);
    } catch (err) {
      if (err.message && err.message.includes('sale_price')) {
        const fallbackSql = `
          INSERT INTO products (sku, name, category, purchase_price, selling_price, current_stock, min_stock, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING *
        `;
        const { rows } = await query(fallbackSql, [sku, name, category, purchasePrice, sellingPrice, currentStock, minStock]);
        return mapRowToProduct(rows[0]);
      }
      throw err;
    }
  },

  /**
   * Actualiza los datos de un producto
   */
  async update(id, { sku, name, category, purchasePrice, sellingPrice, currentStock, minStock }) {
    try {
      const sql = `
        UPDATE products
        SET sku = $1,
            name = $2,
            category = $3,
            purchase_price = $4,
            sale_price = $5,
            current_stock = $6,
            min_stock = $7,
            updated_at = NOW()
        WHERE id = $8
        RETURNING *
      `;
      const params = [sku, name, category, purchasePrice, sellingPrice, currentStock, minStock, id];
      const { rows } = await query(sql, params);
      return mapRowToProduct(rows[0]);
    } catch (err) {
      if (err.message && err.message.includes('sale_price')) {
        const fallbackSql = `
          UPDATE products
          SET sku = $1,
              name = $2,
              category = $3,
              purchase_price = $4,
              selling_price = $5,
              current_stock = $6,
              min_stock = $7,
              updated_at = NOW()
          WHERE id = $8
          RETURNING *
        `;
        const { rows } = await query(fallbackSql, [sku, name, category, purchasePrice, sellingPrice, currentStock, minStock, id]);
        return mapRowToProduct(rows[0]);
      }
      throw err;
    }
  },

  /**
   * Elimina un producto por su ID
   */
  async delete(id) {
    const sql = `DELETE FROM products WHERE id = $1 RETURNING id`;
    const { rows } = await query(sql, [id]);
    return rows.length > 0;
  },

  /**
   * Obtiene los productos con stock bajo o agotados
   */
  async findLowStock() {
    const sql = `
      SELECT * FROM products
      WHERE current_stock <= min_stock
      ORDER BY current_stock ASC
    `;
    const { rows } = await query(sql);
    return rows.map(mapRowToProduct);
  },
};

export default productRepository;
