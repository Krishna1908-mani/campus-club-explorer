import { SupabaseService } from '../services/supabaseService.js';

export const ClubController = {
  async getClubs(req, res, next) {
    try {
      const { search, category, sort, featured, page = 1, limit = 12 } = req.query;
      const result = await SupabaseService.getClubs({
        search,
        category,
        sort,
        featured,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });

      res.json({
        success: true,
        data: result.clubs,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getFeatured(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
      const featured = await SupabaseService.getFeaturedClubs(limit);
      res.json({ success: true, data: featured });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await SupabaseService.getPublicStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  async getClubByIdOrSlug(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;
      const club = await SupabaseService.getClubByIdOrSlug(id, userId);

      if (!club) {
        return res.status(404).json({
          success: false,
          message: 'Club not found.',
        });
      }

      res.json({ success: true, data: club });
    } catch (error) {
      next(error);
    }
  },

  async createClub(req, res, next) {
    try {
      const { name, short_description, full_description, category_id } = req.body;
      if (!name || !short_description || !full_description) {
        return res.status(400).json({
          success: false,
          message: 'Club name, short description, and full description are required.',
        });
      }

      const club = await SupabaseService.createClub(req.body);
      res.status(201).json({
        success: true,
        message: 'Club created successfully!',
        data: club,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateClub(req, res, next) {
    try {
      const { id } = req.params;
      const club = await SupabaseService.updateClub(id, req.body);
      res.json({
        success: true,
        message: 'Club updated successfully!',
        data: club,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteClub(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.deleteClub(id);
      res.json({
        success: true,
        message: 'Club deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};

