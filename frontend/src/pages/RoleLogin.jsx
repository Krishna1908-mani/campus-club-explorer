import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Users,
  User,
  LogIn,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '../components/common/AuthLayout.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ROLE_CONFIGS = {
  admin: {
    role: 'admin',
    title: 'Administrator Sign In',
    subtitle: 'Sign in to access platform governance, club lead assignments, and audit controls.',
    icon: Shield,
    badgeText: 'Platform Administration',
    badgeVariant: 'amber',
    buttonText: 'Admin Sign In',
    targetRoute: '/admin',
    emailPlaceholder: 'admin@campus.edu',
    showRegister: false,
  },
  club_lead: {
    role: 'club_lead',
    title: 'Club Lead Sign In',
    subtitle: 'Sign in to manage your designated student club, member approvals, and events.',
    icon: Users,
    badgeText: 'Club Lead Portal',
    badgeVariant: 'rose',
    buttonText: 'Club Lead Sign In',
    targetRoute: '/club-lead/dashboard',
    emailPlaceholder: 'club.lead@campus.edu',
    showRegister: false,
  },
  student: {
    role: 'student',
    title: 'Student Sign In',
    subtitle: 'Enter your university credentials to explore clubs, join activities, and RSVP to events.',
    icon: User,
    badgeText: 'Student Portal',
    badgeVariant: 'emerald',
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
      setErrorMessage('Please enter both your college email and password.');
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
    <AuthLayout
      role={config.role}
      badgeText={config.badgeText}
      badgeIcon={<RoleIcon className="w-3.5 h-3.5" />}
      badgeVariant={config.badgeVariant}
      title={config.title}
      subtitle={config.subtitle}
      backTo="/login"
      backLabel="All sign in options"
    >
      <form onSubmit={handleLoginSubmit} className="space-y-4.5">
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-medium text-[#B91C1C] dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B91C1C]" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <Input
          label="College Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={config.emailPlaceholder}
          leftIcon={<Mail className="w-4 h-4" />}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between text-xs pt-0.5">
          <Checkbox
            label="Remember session"
            checked={rememberSession}
            onChange={(e) => setRememberSession(e.target.checked)}
          />

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full h-11 text-sm font-semibold rounded-xl shadow-xs hover:shadow-md mt-2"
          isLoading={loading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          {config.buttonText}
        </Button>
      </form>

      {/* Footer link for Student Registration */}
      {config.showRegister ? (
        <div className="pt-4 border-t border-[#E8E3E5] dark:border-[#2E2E2E] text-center text-xs text-[#777777] dark:text-[#A3A3A3]">
          Don't have a student account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
          >
            Register here
          </Link>
        </div>
      ) : (
        <div className="pt-4 border-t border-[#E8E3E5] dark:border-[#2E2E2E] text-center text-xs text-[#777777] dark:text-[#A3A3A3]">
          <span>Need credentials? </span>
          <span className="font-semibold text-[#151515] dark:text-[#FAF9F7]">
            {role === 'admin'
              ? 'Contact university IT system administration'
              : 'Contact university student activities board'}
          </span>
        </div>
      )}
    </AuthLayout>
  );
};

export default RoleLogin;
