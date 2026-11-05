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
};
