import { SupabaseService } from '../services/supabaseService.js';

export const MembershipController = {
  async joinClub(req, res, next) {
    try {
      const { club_id } = req.body;
      if (!club_id) {
        return res.status(400).json({ success: false, message: 'Club ID is required' });
      }

      const membership = await SupabaseService.requestMembership(req.user.id, club_id);
      res.status(201).json({
        success: true,
        message: 'Membership request submitted successfully! Status is pending approval.',
        data: membership,
      });
    } catch (error) {
      if (error.message && error.message.includes('already have')) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next(error);
    }
  },

  async getMyMemberships(req, res, next) {
    try {
      const memberships = await SupabaseService.getUserMemberships(req.user.id);
      res.json({ success: true, data: memberships });
    } catch (error) {
      next(error);
    }
  },

  async leaveClub(req, res, next) {
    try {
      const { clubId } = req.params;
      await SupabaseService.cancelMembership(req.user.id, clubId);
      res.json({
        success: true,
        message: 'Successfully left the club.',
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllMemberships(req, res, next) {
    try {
      const { status, clubId } = req.query;
      const memberships = await SupabaseService.getAllMemberships({ status, clubId });
      res.json({ success: true, data: memberships });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required (pending, approved, rejected)' });
      }

      const updated = await SupabaseService.updateMembershipStatus(id, status);
      res.json({
        success: true,
        message: `Membership status updated to ${status}.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeMemberAdmin(req, res, next) {
    try {
      const { id } = req.params;
      await SupabaseService.removeMembershipAdmin(id);
      res.json({ success: true, message: 'Member removed successfully.' });
    } catch (error) {
      next(error);
    }
  },
};

