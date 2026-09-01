import { query } from '../config/db.js';
import { mapRowToMovement } from './movement.repository.js';
import { mapRowToProduct } from './product.repository.js';

export const dashboardRepository = {
  /**
   * Obtiene las métricas cuantitativas y económicas globales del inventario
   */
  async getStats() {
    const statsSql = `
      SELECT
        COUNT(*)::INTEGER AS total_products,
        COALESCE(SUM(current_stock), 0)::INTEGER AS total_stock_units,
        COALESCE(SUM(current_stock * purchase_price), 0)::NUMERIC AS total_inventory_value,
        COALESCE(SUM(current_stock * COALESCE(sale_price, 0)), 0)::NUMERIC AS total_potential_revenue,
        COUNT(CASE WHEN current_stock <= min_stock AND current_stock > 0 THEN 1 END)::INTEGER AS low_stock_count,
        COUNT(CASE WHEN current_stock <= 0 THEN 1 END)::INTEGER AS out_of_stock_count
      FROM (
        SELECT id, current_stock, min_stock, purchase_price,
               COALESCE(
                 CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sale_price') THEN sale_price ELSE NULL END,
                 CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='selling_price') THEN selling_price ELSE NULL END,
                 0
               ) AS sale_price
        FROM products
      ) p;
    `;

    const recentMovementsSql = `
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
      ORDER BY m.created_at DESC
      LIMIT 5;
    `;

    const criticalProductsSql = `
      SELECT *
      FROM products
      WHERE current_stock <= min_stock
      ORDER BY current_stock ASC
      LIMIT 10;
    `;

    let statsRes, movementsRes, criticalRes;

    try {
      [statsRes, movementsRes, criticalRes] = await Promise.all([
        query(statsSql),
        query(recentMovementsSql),
        query(criticalProductsSql),
      ]);
    } catch {
      // Fallback simplificado
      const simpleStats = await query(`
        SELECT COUNT(*)::INTEGER AS total_products, COALESCE(SUM(current_stock), 0)::INTEGER AS total_stock_units,
               COALESCE(SUM(current_stock * purchase_price), 0)::NUMERIC AS total_inventory_value,
               COUNT(CASE WHEN current_stock <= min_stock AND current_stock > 0 THEN 1 END)::INTEGER AS low_stock_count,
               COUNT(CASE WHEN current_stock <= 0 THEN 1 END)::INTEGER AS out_of_stock_count
        FROM products
      `);
      const simpleCritical = await query(`SELECT * FROM products WHERE current_stock <= min_stock LIMIT 5`);
      statsRes = simpleStats;
      movementsRes = { rows: [] };
      criticalRes = simpleCritical;
    }

    const stats = (statsRes && statsRes.rows[0]) || {};

    return {
      totalProducts: stats.total_products || 0,
      totalStockUnits: stats.total_stock_units || 0,
      totalInventoryValue: parseFloat(stats.total_inventory_value || 0),
      totalPotentialRevenue: parseFloat(stats.total_potential_revenue || 0),
      lowStockCount: stats.low_stock_count || 0,
      outOfStockCount: stats.out_of_stock_count || 0,
      recentMovements: (movementsRes.rows || []).map(mapRowToMovement),
      criticalProducts: (criticalRes.rows || []).map(mapRowToProduct),
    };
  },
};

export default dashboardRepository;
