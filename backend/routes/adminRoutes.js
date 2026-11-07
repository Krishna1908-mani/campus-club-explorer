import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Platform & student management
router.get('/stats', authenticate, requireAdmin, AdminController.getDashboardStats);
router.get('/students', authenticate, requireAdmin, AdminController.getAllStudents);

// Club Lead assignments management
router.get('/club-leads', authenticate, requireAdmin, AdminController.getClubLeads);
router.get('/club-leads/eligible-users', authenticate, requireAdmin, AdminController.getEligibleUsers);
router.post('/club-leads/assign', authenticate, requireAdmin, AdminController.assignClubLead);
router.put('/club-leads/:id/reassign', authenticate, requireAdmin, AdminController.reassignClubLead);
router.delete('/club-leads/:id/remove', authenticate, requireAdmin, AdminController.removeClubLead);

export default router;
