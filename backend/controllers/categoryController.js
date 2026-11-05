import { SupabaseService } from '../services/supabaseService.js';

export const CategoryController = {
  async getCategories(req, res, next) {
    try {
      const categories = await SupabaseService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, description, icon } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }
      const category = await SupabaseService.createCategory({ name, description, icon });
      res.status(201).json({ success: true, message: 'Category created!', data: category });
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await SupabaseService.updateCategory(id, req.body);
      res.json({ success: true, message: 'Category updated!', data: category });
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.deleteCategory(id);
      res.json({ success: true, message: 'Category deleted!' });
    } catch (error) {
      next(error);
    }
  },
};
