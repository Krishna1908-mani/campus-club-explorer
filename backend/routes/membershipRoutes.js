import { Router } from 'express';
import { MembershipController } from '../controllers/membershipController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Student routes
router.post('/', authenticate, MembershipController.joinClub);
router.get('/my', authenticate, MembershipController.getMyMemberships);
router.delete('/:clubId/leave', authenticate, MembershipController.leaveClub);

// Admin routes
router.get('/', authenticate, requireAdmin, MembershipController.getAllMemberships);
router.put('/:id/status', authenticate, requireAdmin, MembershipController.updateStatus);
router.delete('/:id', authenticate, requireAdmin, MembershipController.removeMemberAdmin);

export default router;
