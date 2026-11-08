import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const AuthLayout = ({
  children,
  badgeText = 'Student Portal',
  badgeIcon = null,
  badgeVariant = 'emerald',
  title = 'Student Sign In',
  subtitle = 'Enter your university credentials to access your account',
  backTo = '/login',
  backLabel = 'All sign in options',
  role = 'student',
}) => {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] w-full flex flex-col lg:flex-row bg-[#F8F7F8] dark:bg-[#111111] transition-colors">
      {/* LEFT SECTION (Approximately 45% width on desktop) */}
      <div className="lg:w-[45%] xl:w-[42%] bg-gradient-to-br from-[#800020] via-[#5C001A] to-[#3B0010] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0 shadow-lg">
        {/* Subtle decorative ambient circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/25 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        {/* Brand Header */}
        <div className="relative z-10 space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#800020] shadow-md group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white font-serif flex items-center gap-1">
                Campus<span className="text-[#F4E7EC]">Club</span>
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-[0.25em] text-[#F4E7EC]/70 font-sans -mt-1">
                Explorer
              </span>
            </div>
          </Link>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[#F4E7EC] backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Collegiate Leadership & Community</span>
            </span>
          </div>
        </div>

        {/* Center Editorial Billboard */}
        <div className="relative z-10 my-8 sm:my-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-serif font-black tracking-tight text-white leading-[1.12]">
              Your Campus. <br />
              <span className="text-[#F4E7EC]">Your Community.</span>
            </h2>
            <p className="text-sm sm:text-base text-rose-100/85 leading-relaxed max-w-md font-sans">
              Discover verified student societies, attend flagship university workshops, collaborate with passionate peers, and cultivate lifelong leadership.
            </p>
          </div>

          {/* Tasteful Showcase Visual Artwork Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-white/10 backdrop-blur-md">
            <div className="h-44 sm:h-52 w-full overflow-hidden relative">
              <img
                src={
                  role === 'admin'
                    ? 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80'
                    : role === 'club_lead'
                    ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&auto=format&fit=crop&q=80'
                }
                alt="University campus and community members"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                  <span>Official University Verified Platform</span>
                </div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                  35+ Clubs Active
                </span>
              </div>
            </div>
          </div>

          {/* Small community statistics pills */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-xl font-bold font-serif text-white">35+</div>
              <div className="text-[10px] uppercase font-bold text-rose-200/80 tracking-wider">Active Clubs</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-xl font-bold font-serif text-white">1,200+</div>
              <div className="text-[10px] uppercase font-bold text-rose-200/80 tracking-wider">Students</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-xl font-bold font-serif text-white">100%</div>
              <div className="text-[10px] uppercase font-bold text-rose-200/80 tracking-wider">Verified</div>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-rose-200/75 flex items-center justify-between">
          <span>Campus Club Explorer © {new Date().getFullYear()}</span>
          <span className="text-[11px]">Strict Access Governance</span>
        </div>
      </div>

      {/* RIGHT AUTHENTICATION PANEL (Approximately 55% width on desktop) */}
      <div className="lg:w-[55%] xl:w-[58%] flex items-center justify-center p-6 sm:p-10 lg:p-14 xl:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Back link */}
          <div className="flex items-center justify-between">
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#800020] dark:text-[#A3A3A3] dark:hover:text-[#D9A0AE] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </Link>

            <Link
              to="/"
              className="text-xs text-[#777777] hover:text-[#800020] dark:text-[#A3A3A3] dark:hover:text-[#D9A0AE] font-medium"
            >
              Back to Home
            </Link>
          </div>

          {/* Centered Authentication Card */}
          <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl p-7 sm:p-9 shadow-sm hover:shadow-md transition-shadow space-y-6">
            {/* Card Header */}
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#777777] dark:text-[#A3A3A3]">
                  Welcome Back
                </span>
                <span className="text-[#E8E3E5] dark:text-[#2E2E2E]">•</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : role === 'club_lead'
                      ? 'bg-[#F4E7EC] text-[#800020] border-[#E8E3E5] dark:bg-[#800020]/30 dark:text-rose-200 dark:border-[#800020]/60'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  {badgeIcon && <span className="w-3 h-3 shrink-0">{badgeIcon}</span>}
                  <span>{badgeText}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7] tracking-tight">
                {title}
              </h1>

              <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form Content */}
            {children}
          </div>

          {/* Role Switching Links */}
          <div className="pt-2 text-center text-xs text-[#777777] dark:text-[#A3A3A3] space-y-2">
            <span className="block font-medium">Looking for a different access portal?</span>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {role !== 'student' && (
                <Link
                  to="/student/login"
                  className="font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
                >
                  Student Login
                </Link>
              )}
              {role !== 'club_lead' && (
                <Link
                  to="/club-lead/login"
                  className="font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
                >
                  Club Lead Login
                </Link>
              )}
              {role !== 'admin' && (
                <Link
                  to="/admin/login"
                  className="font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-[#800020] rounded"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
