import { Router } from 'express';
import { ClubLeadController } from '../controllers/clubLeadController.js';
import { authenticate, requireClubLead, requireAssignedClub } from '../middleware/auth.js';

const router = Router();

// Enforce authentication, Club Lead role, and active club assignment on ALL /api/club-lead routes
router.use(authenticate, requireClubLead, requireAssignedClub);

// Dashboard overview
router.get('/dashboard', ClubLeadController.getDashboard);
router.get('/activity', ClubLeadController.getActivity);

// Club details (view & edit permitted fields)
router.get('/club', ClubLeadController.getClubDetails);
router.put('/club', ClubLeadController.updateClubDetails);

// Members & Membership requests
router.get('/members', ClubLeadController.getMembers);
router.put('/memberships/:id/status', ClubLeadController.updateMembershipStatus);
router.delete('/members/:id', ClubLeadController.removeMember);

// Events management
router.get('/events', ClubLeadController.getEvents);
router.post('/events', ClubLeadController.createEvent);
router.put('/events/:id', ClubLeadController.updateEvent);
router.delete('/events/:id', ClubLeadController.deleteEvent);
router.get('/events/:id/registrations', ClubLeadController.getEventRegistrations);

// Announcements management
router.get('/announcements', ClubLeadController.getAnnouncements);
router.post('/announcements', ClubLeadController.createAnnouncement);
router.put('/announcements/:id', ClubLeadController.updateAnnouncement);
router.delete('/announcements/:id', ClubLeadController.deleteAnnouncement);

export default router;
