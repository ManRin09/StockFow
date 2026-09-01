import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { validateProductInput } from '../middlewares/validateRequest.js';

const router = Router();

// Rutas de Productos
router.get('/', productController.getAll);
router.get('/low-stock', productController.getLowStock);
router.get('/:id', productController.getById);
router.post('/', validateProductInput, productController.create);
router.put('/:id', validateProductInput, productController.update);
router.delete('/:id', productController.delete);

export default router;
