import { SupabaseService } from '../services/supabaseService.js';

export const EventController = {
  async getEvents(req, res, next) {
    try {
      const { clubId, categoryId, status, search } = req.query;
      const userId = req.user?.id || null;
      const events = await SupabaseService.getEvents({
        clubId,
        categoryId,
        status,
        search,
        userId,
      });
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  },

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;
      const event = await SupabaseService.getEventById(id, userId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  },

  async createEvent(req, res, next) {
    try {
      const { club_id, title, description, event_date, venue } = req.body;
      if (!club_id || !title || !description || !event_date || !venue) {
        return res.status(400).json({
          success: false,
          message: 'Club ID, title, description, event date, and venue are required.',
        });
      }
      const event = await SupabaseService.createEvent(req.body);
      res.status(201).json({ success: true, message: 'Event created successfully!', data: event });
    } catch (error) {
      next(error);
    }
  },

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const event = await SupabaseService.updateEvent(id, req.body);
      res.json({ success: true, message: 'Event updated successfully!', data: event });
    } catch (error) {
      next(error);
    }
  },

  async deleteEvent(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.deleteEvent(id);
      res.json({ success: true, message: 'Event deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async registerEvent(req, res, next) {
    try {
      const { id } = req.params;
      const reg = await SupabaseService.registerForEvent(req.user.id, id);
      res.status(201).json({
        success: true,
        message: 'Successfully registered for this event!',
        data: reg,
      });
    } catch (error) {
      next(error);
    }
  },

  async unregisterEvent(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.cancelEventRegistration(req.user.id, id);
      res.json({
        success: true,
        message: 'Event registration cancelled.',
      });
    } catch (error) {
      next(error);
    }
  },
};
