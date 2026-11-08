import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Platform & student management
router.get('/stats', authenticate, requireAdmin, AdminController.getDashboardStats);
router.get('/students', authenticate, requireAdmin, AdminController.getAllStudents);

// Club Lead assignments management
router.get('/club-leads', authenticate, requireAdmin, AdminController.getClubLeads);
router.get('/club-leads/directory', authenticate, requireAdmin, AdminController.getClubLeadDirectory);
router.get('/club-leads/eligible-users', authenticate, requireAdmin, AdminController.getEligibleUsers);
router.post('/club-leads/create-account', authenticate, requireAdmin, AdminController.createClubLeadAccount);
router.post('/club-leads/assign', authenticate, requireAdmin, AdminController.assignClubLead);
router.put('/club-leads/:id/reassign', authenticate, requireAdmin, AdminController.reassignClubLead);
router.put('/club-leads/:id/status', authenticate, requireAdmin, AdminController.updateClubLeadStatus);
router.post('/club-leads/:id/reset-password', authenticate, requireAdmin, AdminController.resetClubLeadPassword);
router.put('/club-leads/:id/profile', authenticate, requireAdmin, AdminController.updateClubLeadProfile);
router.delete('/club-leads/:id/remove', authenticate, requireAdmin, AdminController.removeClubLead);
router.delete('/club-leads/:id/account', authenticate, requireAdmin, AdminController.deleteClubLeadAccount);

export default router;
