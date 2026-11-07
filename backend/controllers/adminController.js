import { SupabaseService } from '../services/supabaseService.js';

export const AdminController = {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await SupabaseService.getAdminStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  async getAllStudents(req, res, next) {
    try {
      const students = await SupabaseService.getAllProfiles();
      res.json({ success: true, data: students });
    } catch (error) {
      next(error);
    }
  },

  async getClubLeads(req, res, next) {
    try {
      const assignments = await SupabaseService.getClubLeadAssignments();
      res.json({ success: true, data: assignments });
    } catch (error) {
      next(error);
    }
  },

  async assignClubLead(req, res, next) {
    try {
      const { user_id, club_id } = req.body;
      if (!user_id || !club_id) {
        return res.status(400).json({
          success: false,
          message: 'Both user_id and club_id are required to assign a Club Lead.',
        });
      }

      const assignment = await SupabaseService.assignClubLead({
        userId: user_id,
        clubId: club_id,
        assignedBy: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: 'Club Lead successfully assigned!',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  },

  async reassignClubLead(req, res, next) {
    try {
      const { id } = req.params;
      const { new_club_id, new_user_id } = req.body;

      const updated = await SupabaseService.reassignClubLead({
        assignmentId: id,
        newClubId: new_club_id,
        newUserId: new_user_id,
        assignedBy: req.user.id,
      });

      res.json({
        success: true,
        message: 'Club Lead assignment successfully updated.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeClubLead(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SupabaseService.removeClubLeadAssignment(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getEligibleUsers(req, res, next) {
    try {
      const search = req.query.search || '';
      const users = await SupabaseService.getEligibleUsersForClubLead(search);
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
};
