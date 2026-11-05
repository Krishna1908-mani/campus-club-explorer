import { SupabaseService } from '../services/supabaseService.js';

export const FavoriteController = {
  async getMyFavorites(req, res, next) {
    try {
      const favorites = await SupabaseService.getUserFavorites(req.user.id);
      res.json({ success: true, data: favorites });
    } catch (error) {
      next(error);
    }
  },

  async addFavorite(req, res, next) {
    try {
      const { clubId } = req.params;
      const fav = await SupabaseService.addFavorite(req.user.id, clubId);
      res.status(201).json({ success: true, message: 'Added to favorites!', data: fav });
    } catch (error) {
      next(error);
    }
  },

  async removeFavorite(req, res, next) {
    try {
      const { clubId } = req.params;
      await SupabaseService.removeFavorite(req.user.id, clubId);
      res.json({ success: true, message: 'Removed from favorites!' });
    } catch (error) {
      next(error);
    }
  },
};
