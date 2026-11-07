import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const DEFAULT_DEV_JWT_SECRET = 'campus-club-explorer-jwt-secret-key-2026';
let JWT_SECRET = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production') {
  if (!JWT_SECRET || JWT_SECRET === DEFAULT_DEV_JWT_SECRET) {
    throw new Error(
      '[FATAL SECURITY ERROR] A strong, cryptographically secure JWT_SECRET must be set in production. Generate one using: openssl rand -hex 32'
    );
  }
} else if (!JWT_SECRET) {
  JWT_SECRET = DEFAULT_DEV_JWT_SECRET;
}

/**
 * Helper to fetch assigned club for a club_lead user
 */
const fetchAssignedClub = async (userId) => {
  if (isSupabaseConfigured && supabase) {
    const client = supabaseAdmin || supabase;
    try {
      const { data: assignment, error } = await client
        .from('club_lead_assignments')
        .select('club_id, clubs(*)')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && assignment) {
        return {
          assignedClubId: assignment.club_id,
          assignedClub: assignment.clubs,
        };
      }
    } catch {
      // In case table does not exist yet
    }
  }
  return { assignedClubId: null, assignedClub: null };
};

/**
 * Authenticate incoming request using either Supabase verified bearer token
 * or local JWT token.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // If live Supabase is configured, verify token with Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired authentication session.',
          error: error?.message,
        });
      }

      // Fetch user profile from public.profiles using admin client to ensure we get role
      const client = supabaseAdmin || supabase;
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const effectiveRole =
        profile?.role === 'admin' || user.user_metadata?.role === 'admin'
          ? 'admin'
          : profile?.role === 'club_lead' || user.user_metadata?.role === 'club_lead'
          ? 'club_lead'
          : profile?.role || 'student';

      req.user = user;
      req.profile = profile
        ? { ...profile, role: effectiveRole }
        : {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: effectiveRole,
          };

      // If user is a club lead, load their assigned club
      if (req.profile.role === 'club_lead') {
        const { assignedClubId, assignedClub } = await fetchAssignedClub(user.id);
        req.assignedClubId = assignedClubId || user.user_metadata?.assigned_club_id || null;
        req.assignedClub = assignedClub;
      }

      return next();
    }

    // Fallback: Verify internal JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
      req.profile = decoded;

      if (req.profile.role === 'club_lead') {
        req.assignedClubId = req.profile.assignedClubId || null;
      }
      return next();
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token.',
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server authentication error.',
    });
  }
};

/**
 * Optional authentication: Extracts user and profile if token exists,
 * but does not halt request if unauthenticated.
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    req.profile = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const client = supabaseAdmin || supabase;
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        req.user = user;
        req.profile = profile || {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: user.user_metadata?.role || 'student',
        };

        if (req.profile.role === 'club_lead') {
          const { assignedClubId, assignedClub } = await fetchAssignedClub(user.id);
          req.assignedClubId = assignedClubId;
          req.assignedClub = assignedClub;
        }
      }
    } else {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
      req.profile = decoded;
    }
  } catch {
    req.user = null;
    req.profile = null;
  }
  next();
};

/**
 * Restrict endpoint to admin users only.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.profile || req.profile.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Administrator privileges required.',
    });
  }
  next();
};

/**
 * Restrict endpoint to Club Lead or Admin users.
 */
export const requireClubLead = (req, res, next) => {
  if (!req.profile || (req.profile.role !== 'club_lead' && req.profile.role !== 'admin')) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Club Lead or Administrator privileges required.',
    });
  }
  next();
};

/**
 * Ensure that a Club Lead has an active assigned club.
 * Admins bypass this check since they have platform-wide access.
 */
export const requireAssignedClub = (req, res, next) => {
  if (req.profile?.role === 'admin') {
    return next();
  }

  if (!req.assignedClubId) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: No active club assigned to your Club Lead account. Please contact an administrator.',
    });
  }

  next();
};

/**
 * Strictly enforce that a Club Lead cannot access or modify another club's data.
 * Verifies that the requested clubId matches req.assignedClubId.
 */
export const enforceClubIsolation = (req, res, next) => {
  if (req.profile?.role === 'admin') {
    return next();
  }

  const targetClubId = req.params.clubId || req.body.club_id || req.query.club_id;
  if (targetClubId && targetClubId !== req.assignedClubId) {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: You cannot access or modify data belonging to another club.',
    });
  }

  next();
};

export { JWT_SECRET };
