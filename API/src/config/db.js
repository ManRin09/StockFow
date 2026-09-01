import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración del Pool de conexiones de PostgreSQL
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'inventory_db',
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[PostgreSQL] Error inesperado en el cliente inactivo del pool:', err.message);
});

/**
 * Ejecuta una consulta SQL simple parametrizada
 * @param {string} text - Consulta SQL
 * @param {Array} params - Parámetros de la consulta
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Obtiene un cliente dedicado del pool para transacciones (BEGIN, COMMIT, ROLLBACK)
 */
export const getClient = () => pool.connect();

/**
 * Verifica la conectividad con la base de datos al arrancar el servidor
 */
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() as current_time');
    console.log(`[PostgreSQL] Conexión establecida exitosamente a las ${res.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error('[PostgreSQL] Error al conectar con la base de datos:', error.message);
    console.warn('[PostgreSQL] Verifica que el servicio PostgreSQL esté activo y las credenciales en .env sean correctas.');
    return false;
  }
};

export default {
  query,
  getClient,
  testConnection,
  pool,
};
