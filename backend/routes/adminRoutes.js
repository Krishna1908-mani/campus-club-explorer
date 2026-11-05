import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, requireAdmin, AdminController.getDashboardStats);
router.get('/students', authenticate, requireAdmin, AdminController.getAllStudents);

export default router;
