import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', CategoryController.getCategories);
router.post('/', authenticate, requireAdmin, CategoryController.createCategory);
router.put('/:id', authenticate, requireAdmin, CategoryController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, CategoryController.deleteCategory);

export default router;
