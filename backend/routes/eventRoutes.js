import { Router } from 'express';
import { EventController } from '../controllers/eventController.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, EventController.getEvents);
router.get('/:id', optionalAuth, EventController.getEventById);

// Student registration
router.post('/:id/register', authenticate, EventController.registerEvent);
router.delete('/:id/register', authenticate, EventController.unregisterEvent);

// Admin routes
router.post('/', authenticate, requireAdmin, EventController.createEvent);
router.put('/:id', authenticate, requireAdmin, EventController.updateEvent);
router.delete('/:id', authenticate, requireAdmin, EventController.deleteEvent);

export default router;
