import { Router } from 'express';
import productRoutes from './product.routes.js';
import movementRoutes from './movement.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Montaje de rutas modulares
router.use('/products', productRoutes);
router.use('/movements', movementRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
