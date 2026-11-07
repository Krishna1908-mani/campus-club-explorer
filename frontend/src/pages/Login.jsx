import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  User,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Lock,
  Compass,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Login = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [quickLoadingRole, setQuickLoadingRole] = useState(null);

  const loginCards = [
    {
      role: 'admin',
      title: 'Admin Login',
      description: 'Access the complete platform administration.',
      icon: Shield,
      iconColor: 'text-amber-800 dark:text-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800',
      badge: 'Platform Administration',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
      buttonText: 'Admin Sign In',
      route: '/admin/login',
      targetDashboard: '/admin',
      demoEmail: 'admin@campus.edu',
      demoPassword: 'admin123',
      features: [
        'Platform metrics & audit logs',
        '35 verified clubs oversight',
        'Assign & remove Club Leads',
        'Campus-wide announcements',
      ],
    },
    {
      role: 'club_lead',
      title: 'Club Lead Login',
      description: 'Manage your assigned college club.',
      icon: Users,
      iconColor: 'text-[#800020] dark:text-rose-200',
      iconBg: 'bg-rose-100 dark:bg-[#800020]/30 border-rose-300 dark:border-[#800020]/60',
      badge: 'Club Management',
      badgeClass: 'bg-rose-100 text-[#800020] border-rose-300 dark:bg-[#800020]/30 dark:text-rose-200 dark:border-[#800020]/60',
      buttonText: 'Club Lead Sign In',
      route: '/club-lead/login',
      targetDashboard: '/club-lead/dashboard',
      demoEmail: 'lead@campus.edu',
      demoPassword: 'lead123',
      features: [
        'AI & ML Club scoped portal',
        'Approve or reject memberships',
        'Create & schedule club events',
        'Post club-specific notices',
      ],
    },
    {
      role: 'student',
      title: 'Student Login',
      description: 'Explore clubs, join activities and register for events.',
      icon: User,
      iconColor: 'text-emerald-800 dark:text-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800',
      badge: 'Student Portal',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      buttonText: 'Student Sign In',
      route: '/student/login',
      targetDashboard: '/dashboard',
      demoEmail: 'student@campus.edu',
      demoPassword: 'password123',
      features: [
        'Discover 35 campus clubs',
        'Apply for club memberships',
        'RSVP to workshops & fests',
        'Manage profile & bookmarks',
      ],
    },
  ];

  const handle1ClickLogin = async (e, card) => {
    e.stopPropagation();
    setQuickLoadingRole(card.role);
    try {
      const res = await login({
        email: card.demoEmail,
        password: card.demoPassword,
        expectedRole: card.role,
      });
      if (res.success) {
        success(`Welcome back, ${res.profile?.full_name || 'User'}!`);
        navigate(card.targetDashboard);
      }
    } catch (err) {
      error(err.message || 'Login failed.');
    } finally {
      setQuickLoadingRole(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-full max-w-6xl space-y-12">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] tracking-tight">
            Sign In to Campus Club Explorer
          </h1>
          <p className="text-sm sm:text-base text-[#737373] dark:text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Select your university role below to access your dedicated management portal or student account.
          </p>
        </div>

        {/* 3 Visually Distinct Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {loginCards.map((card) => {
            const Icon = card.icon;
            const isLoggingIn = quickLoadingRole === card.role;

            return (
              <div
                key={card.role}
                onClick={() => navigate(card.route)}
                className="group relative rounded-3xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] p-7 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#800020]/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Top Section */}
                <div className="space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${card.iconBg}`}>
                      <Icon className={`w-7 h-7 ${card.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.badgeClass}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="pt-2 border-t border-[#E5E5E5]/70 dark:border-[#383838]/70 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                      Module Capabilities:
                    </span>
                    <ul className="space-y-1.5">
                      {card.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 space-y-3 mt-4">
                  {/* Primary Button */}
                  <Link
                    to={card.route}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#800020] hover:bg-[#5C001A] text-white font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95 group/btn"
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  {/* Quick 1-Click Demo Shortcut */}
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={(e) => handle1ClickLogin(e, card)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E5E5E5] dark:border-[#383838] bg-[#FAF9F7] dark:bg-[#242424] hover:border-[#800020]/40 text-[11px] font-semibold text-[#800020] dark:text-[#D9A0AE] transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                    <span>{isLoggingIn ? 'Signing in...' : `1-Click Demo (${card.demoEmail.split('@')[0]})`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info: Registration for students & assistance */}
        <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#383838] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373] dark:text-[#A3A3A3]">
          <div>
            <span>Are you a new student without an account? </span>
            <Link
              to="/register"
              className="font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline"
            >
              Register your student profile here →
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
              Platform Info
            </Link>
            <span>•</span>
            <Link to="/clubs" className="hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
              Explore 35 Clubs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
