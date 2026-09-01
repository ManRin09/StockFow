import dotenv from 'dotenv';
import app from './src/app.js';
import { testConnection } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('='.repeat(55));
  console.log('🚀 Iniciando Gestor de Inventario API (Express + PostgreSQL)');
  console.log('='.repeat(55));

  // Verificar conexión a la base de datos PostgreSQL
  await testConnection();

  app.listen(PORT, () => {
    console.log(`📡 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`🔗 Endpoint Base de la API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Productos: http://localhost:${PORT}/api/products`);
    console.log(`🔄 Movimientos: http://localhost:${PORT}/api/movements`);
    console.log(`📊 Dashboard Stats: http://localhost:${PORT}/api/dashboard/stats`);
    console.log('='.repeat(55));
  });
};

startServer();
