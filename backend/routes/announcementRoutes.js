import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcementController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', AnnouncementController.getAnnouncements);
router.post('/', authenticate, requireAdmin, AnnouncementController.createAnnouncement);
router.delete('/:id', authenticate, requireAdmin, AnnouncementController.deleteAnnouncement);

export default router;
