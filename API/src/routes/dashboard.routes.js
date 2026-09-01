import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

// Rutas de Estadísticas del Dashboard
router.get('/stats', dashboardController.getStats);

export default router;
