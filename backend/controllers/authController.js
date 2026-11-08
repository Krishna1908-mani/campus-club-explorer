import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { SupabaseService, memoryStore } from '../services/supabaseService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../middleware/auth.js';

export const AuthController = {
  async register(req, res, next) {
    try {
      const { email, password, confirmPassword, full_name, student_id, department, year_of_study } = req.body;

      // Validation
      if (!email || !password || !full_name) {
        return res.status(400).json({
          success: false,
          message: 'Full name, email, and password are required.',
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
        });
      }

      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match.',
        });
      }

      // If Supabase Auth is configured:
      if (isSupabaseConfigured && supabase) {
        const frontendBaseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173')
          .split(',')[0]
          .trim()
          .replace(/\/+$/, '');

        let { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${frontendBaseUrl}/login`,
            data: {
              full_name,
              student_id: student_id || null,
              department: department || null,
              year_of_study: year_of_study || null,
              role: 'student', // enforced by DB trigger as well
            },
          },
        });

        let user = data?.user;
        let session = data?.session;

        // If Supabase free tier email rate limit is exceeded, automatically provision via admin client
        if (error) {
          if (error.message.toLowerCase().includes('rate limit') && supabaseAdmin) {
            const adminResult = await supabaseAdmin.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
              user_metadata: {
                full_name,
                student_id: student_id || null,
                department: department || null,
                year_of_study: year_of_study || null,
                role: 'student',
              },
            });

            if (adminResult.error) {
              return res.status(400).json({
                success: false,
                message: adminResult.error.message,
              });
            }

            user = adminResult.data.user;
          } else {
            return res.status(400).json({
              success: false,
              message: error.message,
            });
          }
        }

        return res.status(201).json({
          success: true,
          message: session ? 'Registration successful!' : 'Registration successful! Please check your email to verify your account.',
          token: session?.access_token || null,
          user: {
            id: user?.id,
            email: user?.email,
          },
          profile: {
            id: user?.id,
            email: user?.email,
            full_name,
            student_id,
            department,
            year_of_study,
            role: 'student',
          },
        });
      }

      // Fallback in-memory authentication
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const userId = 'u-' + Math.random().toString(36).substring(2, 11);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: userId,
        email,
        full_name,
        student_id: student_id || '',
        department: department || '',
        year_of_study: year_of_study || '',
        role: 'student',
        password_hash: hashedPassword,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
        created_at: new Date().toISOString(),
      };

      memoryStore.users.push(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, full_name: newUser.full_name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash, ...safeProfile } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to Campus Club Explorer.',
        token,
        user: { id: newUser.id, email: newUser.email },
        profile: safeProfile,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password, expectedRole } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password.',
        });
      }

      // If Supabase Auth is configured:
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return res.status(401).json({
            success: false,
            message: error.message,
          });
        }

        const user = data.user;
        const session = data.session;

        // Fetch profile
        const { data: profile } = await supabase
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

        // Strict Role Verification if login requested via a dedicated role portal
        if (expectedRole) {
          if (expectedRole === 'admin' && effectiveRole !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'This account does not have Admin access.',
            });
          }
          if (expectedRole === 'club_lead') {
            if (effectiveRole !== 'club_lead') {
              return res.status(403).json({
                success: false,
                message: 'This account does not have Club Lead access.',
              });
            }

            if (user.user_metadata?.account_status === 'deactivated') {
              return res.status(403).json({
                success: false,
                message: 'This Club Lead account has been deactivated by the administrator.',
              });
            }

            // Verify active club assignment for Club Lead
            let assignedClubId = user.user_metadata?.assigned_club_id;
            const client = supabaseAdmin || supabase;
            if (client) {
              try {
                const { data: assignment } = await client
                  .from('club_lead_assignments')
                  .select('club_id')
                  .eq('user_id', user.id)
                  .eq('is_active', true)
                  .maybeSingle();
                if (assignment?.club_id) {
                  assignedClubId = assignment.club_id;
                }
              } catch {
                // Ignore table query errors if running with memory fallback
              }
            }

            if (!assignedClubId) {
              return res.status(403).json({
                success: false,
                message: 'Your Club Lead account does not have an active club assignment. Please contact an administrator.',
              });
            }
          }
          if (expectedRole === 'student' && effectiveRole !== 'student') {
            return res.status(403).json({
              success: false,
              message: 'This login portal is reserved for students. Please use the Admin or Club Lead portal.',
            });
          }
        }

        const safeProfile = profile
          ? { ...profile, role: effectiveRole }
          : {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || email.split('@')[0],
              role: effectiveRole,
            };

        return res.json({
          success: true,
          message: 'Login successful!',
          token: session.access_token,
          user: {
            id: user.id,
            email: user.email,
          },
          profile: safeProfile,
        });
      }

      // Fallback in-memory authentication
      const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // Verify credentials
      let passwordValid = false;
      if (user) {
        if (user.password_hash) {
          passwordValid = await bcrypt.compare(password, user.password_hash);
        } else {
          // Legacy fallback for seed users without hashes
          passwordValid = (user.role === 'admin' && password === 'admin123') ||
                          (user.role === 'club_lead' && password === 'lead123') ||
                          (user.role === 'student' && password === 'password123');
        }
      }

      if (user && passwordValid) {
        // Strict Role Verification in memory fallback
        if (expectedRole) {
          if (expectedRole === 'admin' && user.role !== 'admin') {
            return res.status(403).json({
              success: false,
              message: 'This account does not have Admin access.',
            });
          }
          if (expectedRole === 'club_lead') {
            if (user.role !== 'club_lead') {
              return res.status(403).json({
                success: false,
                message: 'This account does not have Club Lead access.',
              });
            }
            if (!user.assigned_club_id) {
              return res.status(403).json({
                success: false,
                message: 'Your Club Lead account does not have an active club assignment. Please contact an administrator.',
              });
            }
          }
          if (expectedRole === 'student' && user.role !== 'student') {
            return res.status(403).json({
              success: false,
              message: 'This login portal is reserved for students. Please use the Admin or Club Lead portal.',
            });
          }
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        const { password_hash, ...safeProfile } = user;
        return res.json({
          success: true,
          message: 'Login successful!',
          token,
          user: { id: user.id, email: user.email },
          profile: safeProfile,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      res.json({
        success: true,
        user: req.user,
        profile: req.profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await SupabaseService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully!',
        profile: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
        });
        if (error) {
          return res.status(400).json({ success: false, message: error.message });
        }
      }

      res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      res.json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
      next(error);
    }
  },
};

