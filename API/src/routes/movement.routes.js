import { Router } from 'express';
import movementController from '../controllers/movement.controller.js';
import { validateMovementInput } from '../middlewares/validateRequest.js';

const router = Router();

// Rutas de Movimientos de Inventario
router.get('/', movementController.getAll);
router.get('/summary', movementController.getSummary);
router.post('/', validateMovementInput, movementController.create);

export default router;
