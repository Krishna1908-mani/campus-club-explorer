import { SupabaseService } from '../services/supabaseService.js';

export const AnnouncementController = {
  async getAnnouncements(req, res, next) {
    try {
      const { clubId, limit } = req.query;
      const announcements = await SupabaseService.getAnnouncements({
        clubId,
        limit: limit ? parseInt(limit, 10) : 20,
      });
      res.json({ success: true, data: announcements });
    } catch (error) {
      next(error);
    }
  },

  async createAnnouncement(req, res, next) {
    try {
      const { club_id, title, content } = req.body;
      if (!club_id || !title || !content) {
        return res.status(400).json({
          success: false,
          message: 'Club ID, title, and content are required.',
        });
      }
      const announcement = await SupabaseService.createAnnouncement({
        ...req.body,
        created_by: req.user?.id || null,
      });
      res.status(201).json({
        success: true,
        message: 'Announcement posted successfully!',
        data: announcement,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAnnouncement(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.deleteAnnouncement(id);
      res.json({ success: true, message: 'Announcement deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
};

