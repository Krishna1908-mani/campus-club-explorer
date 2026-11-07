import { SupabaseService } from '../services/supabaseService.js';

export const ClubLeadController = {
  /**
   * Get complete real-time dashboard data for the authenticated Club Lead's assigned club
   */
  async getDashboard(req, res, next) {
    try {
      const data = await SupabaseService.getClubLeadDashboardData(req.user.id);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get assigned club details
   */
  async getClubDetails(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const club = await SupabaseService.getClubByIdOrSlug(clubId);
      res.json({ success: true, data: club });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update permitted details of assigned club
   */
  async updateClubDetails(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const updated = await SupabaseService.updateClubForLead(clubId, req.body);
      res.json({
        success: true,
        message: 'Club details successfully updated!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get membership requests and member list for assigned club
   */
  async getMembers(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { status, search } = req.query;
      const members = await SupabaseService.getClubMembersForLead(clubId, { status, search });
      res.json({ success: true, data: members });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Approve or reject a membership request for assigned club
   */
  async updateMembershipStatus(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Valid status ('approved', 'rejected', 'pending') is required.",
        });
      }

      const updated = await SupabaseService.updateMembershipStatusForLead(clubId, id, status);
      res.json({
        success: true,
        message: `Membership request ${status} successfully!`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove a member from assigned club
   */
  async removeMember(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const result = await SupabaseService.removeMemberForLead(clubId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all events belonging to assigned club
   */
  async getEvents(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const events = await SupabaseService.getClubEventsForLead(clubId);
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new event for assigned club
   */
  async createEvent(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const event = await SupabaseService.createClubEventForLead(clubId, req.body);
      res.status(201).json({
        success: true,
        message: 'Club event created successfully!',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an existing event belonging to assigned club
   */
  async updateEvent(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const updated = await SupabaseService.updateClubEventForLead(clubId, id, req.body);
      res.json({
        success: true,
        message: 'Event updated successfully!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete or cancel an event belonging to assigned club
   */
  async deleteEvent(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const result = await SupabaseService.deleteClubEventForLead(clubId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * View student registrations for an event belonging to assigned club
   */
  async getEventRegistrations(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const result = await SupabaseService.getClubEventRegistrationsForLead(clubId, id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all announcements belonging to assigned club
   */
  async getAnnouncements(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const announcements = await SupabaseService.getClubAnnouncementsForLead(clubId);
      res.json({ success: true, data: announcements });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create an announcement for assigned club
   */
  async createAnnouncement(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const created = await SupabaseService.createClubAnnouncementForLead(clubId, req.body, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Announcement published successfully!',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an announcement belonging to assigned club
   */
  async updateAnnouncement(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const updated = await SupabaseService.updateClubAnnouncementForLead(clubId, id, req.body);
      res.json({
        success: true,
        message: 'Announcement updated successfully!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an announcement belonging to assigned club
   */
  async deleteAnnouncement(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const { id } = req.params;
      const result = await SupabaseService.deleteClubAnnouncementForLead(clubId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get recent activity timeline for assigned club
   */
  async getActivity(req, res, next) {
    try {
      const clubId = req.assignedClubId;
      const activity = await SupabaseService.getClubActivityForLead(clubId);
      res.json({ success: true, data: activity });
    } catch (error) {
      next(error);
    }
  },
};
