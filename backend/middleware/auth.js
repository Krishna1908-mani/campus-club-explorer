import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'campus-club-explorer-jwt-secret-key-2026';

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

      req.user = user;
      req.profile = profile || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        role: user.user_metadata?.role || 'student',
      };

      return next();
    }

    // Fallback: Verify internal JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
      req.profile = decoded;
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

export { JWT_SECRET };
