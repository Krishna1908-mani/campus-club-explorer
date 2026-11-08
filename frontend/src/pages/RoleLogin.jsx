import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Users,
  User,
  LogIn,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ROLE_CONFIGS = {
  admin: {
    role: 'admin',
    title: 'Admin Login',
    subtitle: 'Sign in to access complete platform administration and club oversight.',
    icon: Shield,
    iconBg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    badgeText: 'Platform Administration',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    buttonText: 'Admin Sign In',
    targetRoute: '/admin',
    emailPlaceholder: 'admin@campus.edu',
    showRegister: false,
  },
  club_lead: {
    role: 'club_lead',
    title: 'Club Lead Login',
    subtitle: 'Sign in to manage your assigned college club, members, and events.',
    icon: Users,
    iconBg: 'bg-rose-100 dark:bg-[#800020]/30 text-[#800020] dark:text-rose-200 border-rose-300 dark:border-[#800020]/60',
    badgeText: 'Club Management',
    badgeClass: 'bg-rose-100 text-[#800020] border-rose-300 dark:bg-[#800020]/30 dark:text-rose-200 dark:border-[#800020]/60',
    buttonText: 'Club Lead Sign In',
    targetRoute: '/club-lead/dashboard',
    emailPlaceholder: 'club.lead@campus.edu',
    showRegister: false,
  },
  student: {
    role: 'student',
    title: 'Student Login',
    subtitle: 'Sign in to explore clubs, join activities, and register for campus events.',
    icon: User,
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    badgeText: 'Student Portal',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    buttonText: 'Student Sign In',
    targetRoute: '/dashboard',
    emailPlaceholder: 'student@campus.edu',
    showRegister: true,
  },
};

export const RoleLogin = ({ role = 'student' }) => {
  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.student;
  const RoleIcon = config.icon;

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || config.targetRoute;

  const handleLoginSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await login({
        email: email.trim(),
        password,
        expectedRole: config.role,
      });

      if (res.success) {
        success(`Welcome back, ${res.profile?.full_name || 'User'}!`);
        navigate(from === '/login' || from.includes('/login') ? config.targetRoute : from);
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setErrorMessage(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link to Login Selection */}
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#800020] dark:text-[#A3A3A3] dark:hover:text-[#D9A0AE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login Selection</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center mb-1">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-md ${config.iconBg}`}>
              <RoleIcon className="w-7 h-7" />
            </div>
          </div>
          <div className="inline-block">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeClass}`}>
              {config.badgeText}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] max-w-sm mx-auto leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-[10px] bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-medium text-[#B91C1C] dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="College Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`e.g. ${config.emailPlaceholder}`}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#737373] dark:text-[#A3A3A3]">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded border-[#E5E5E5] text-[#800020] focus:ring-[#800020]"
                />
                <span>Remember session</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[#800020] dark:text-[#D9A0AE] hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              {config.buttonText}
            </Button>
          </form>

          {/* Registration link ONLY shown for students */}
          {config.showRegister ? (
            <div className="mt-6 pt-5 border-t border-[#E5E5E5] dark:border-[#383838] text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
              Don't have a student account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline"
              >
                Register here
              </Link>
            </div>
          ) : (
            <div className="mt-6 pt-5 border-t border-[#E5E5E5] dark:border-[#383838] text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
              <span className="text-gray-400">Need credentials? </span>
              <span className="font-medium">
                {role === 'admin'
                  ? 'Contact campus IT administration'
                  : 'Contact your faculty club administrator'}
              </span>
            </div>
          )}
        </div>

        {/* Switch Login Option Links */}
        <div className="text-center text-xs text-[#737373] dark:text-[#A3A3A3] space-x-3">
          <span>Looking for another portal?</span>
          {role !== 'student' && (
            <Link to="/student/login" className="text-[#800020] dark:text-[#D9A0AE] font-semibold hover:underline">
              Student Login
            </Link>
          )}
          {role !== 'club_lead' && (
            <Link to="/club-lead/login" className="text-[#800020] dark:text-[#D9A0AE] font-semibold hover:underline">
              Club Lead Login
            </Link>
          )}
          {role !== 'admin' && (
            <Link to="/admin/login" className="text-[#800020] dark:text-[#D9A0AE] font-semibold hover:underline">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
