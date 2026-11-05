import { Router } from 'express';
import { ClubController } from '../controllers/clubController.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, ClubController.getClubs);
router.get('/featured', ClubController.getFeatured);
router.get('/stats', ClubController.getStats);
router.get('/:id', optionalAuth, ClubController.getClubByIdOrSlug);

// Admin-only endpoints
router.post('/', authenticate, requireAdmin, ClubController.createClub);
router.put('/:id', authenticate, requireAdmin, ClubController.updateClub);
router.delete('/:id', authenticate, requireAdmin, ClubController.deleteClub);

export default router;

