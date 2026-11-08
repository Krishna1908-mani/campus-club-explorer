import crypto from 'crypto';
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
      const {
        lead_full_name,
        lead_email,
        lead_password,
        lead_department,
        provision_lead,
        ...clubData
      } = req.body;

      if (!clubData.name || !clubData.short_description || !clubData.full_description) {
        return res.status(400).json({
          success: false,
          message: 'Club name, short description, and full description are required.',
        });
      }

      // 1. Create the club with pure club fields
      const club = await SupabaseService.createClub(clubData);

      // 2. If Admin provided optional Club Lead account details, provision it immediately
      let createdLead = null;
      if (lead_full_name && lead_email) {
        try {
          createdLead = await SupabaseService.createClubLeadAccount({
            fullName: lead_full_name,
            email: lead_email,
            password: lead_password || ('Ld!' + crypto.randomBytes(6).toString('base64url')),
            clubId: club.id,
            department: lead_department || null,
            assignedBy: req.user?.id || null,
          });
        } catch (leadErr) {
          console.warn('Optional integrated lead creation notice:', leadErr.message);
        }
      }

      res.status(201).json({
        success: true,
        message: createdLead
          ? 'Club and Club Lead account created successfully!'
          : 'Club created successfully!',
        data: club,
        lead: createdLead,
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

