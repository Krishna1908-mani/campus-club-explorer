import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  Compass,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Button from './Button.jsx';

export const Navbar = () => {
  const { user, profile, isAuthenticated, isAdmin, isClubLead, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { success } = useToast();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [signInDropdownOpen, setSignInDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    success('You have been signed out.');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Clubs', path: '/clubs' },
    { name: 'Categories', path: '/categories' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    ...(isAdmin ? [{ name: 'Admin Console', path: '/admin', isAdmin: true }] : []),
    ...(isClubLead ? [{ name: 'Club Lead Portal', path: '/club-lead/dashboard', isClubLead: true }] : []),
    ...(isAuthenticated && !isAdmin && !isClubLead ? [{ name: 'My Dashboard', path: '/dashboard', isStudent: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl border-b border-[#E8E3E5] dark:border-[#2E2E2E] transition-colors shadow-[0_2px_12px_rgba(21,21,21,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Burgundy Luxury Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-sm shadow-[#800020]/30 group-hover:bg-[#5C001A] transition-all duration-300 group-hover:scale-105">
            <GraduationCap className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#151515] dark:text-[#FAF9F7] flex items-center gap-1 font-serif">
              Campus<span className="text-[#800020] dark:text-[#D9A0AE]">Club</span>
            </span>
            <span className="block text-[9px] uppercase font-bold tracking-[0.2em] text-[#737373] dark:text-[#A3A3A3] -mt-1 font-sans">
              Explorer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                link.isAdmin || link.isClubLead
                  ? `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 border ${
                      isActive
                        ? 'text-[#800020] dark:text-[#F4E7EC] bg-[#F4E7EC] dark:bg-[#800020]/40 border-[#800020]/40 shadow-xs'
                        : 'text-[#800020] dark:text-[#D9A0AE] bg-[#F4E7EC]/60 dark:bg-[#800020]/20 border-[#800020]/30 hover:bg-[#F4E7EC] dark:hover:bg-[#800020]/40'
                    }`
                  : `px-3.5 py-2 rounded-xl text-sm font-medium tracking-tight transition-all duration-200 ${
                      isActive
                        ? 'text-[#800020] dark:text-[#F4E7EC] bg-[#F4E7EC]/70 dark:bg-[#800020]/30 font-semibold'
                        : 'text-[#151515] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:bg-[#F8F7F8] dark:hover:bg-[#222222]'
                    }`
              }
            >
              {link.isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />}
              {link.isClubLead && <Compass className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Theme Toggle & User Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] text-[#777777] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:border-[#800020]/40 transition-all shadow-xs"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#C5A46D] transition-transform duration-300 hover:rotate-45" /> : <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />}
          </button>

          {/* User Profile / Auth Actions */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1E1E1E] hover:border-[#800020]/40 transition-all shadow-xs focus:outline-none cursor-pointer"
              >
                <img
                  src={
                    profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      profile?.full_name || 'Student'
                    )}`
                  }
                  alt={profile?.full_name}
                  className="w-8 h-8 rounded-lg object-cover bg-[#F4E7EC] dark:bg-[#800020]/30 border border-[#800020]/20"
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] max-w-[110px] truncate leading-tight">
                    {profile?.full_name || 'Student'}
                  </span>
                  <span className="block text-[10px] font-medium text-[#800020] dark:text-[#D9A0AE] capitalize">
                    {profile?.role === 'admin' ? 'Administrator' : profile?.role === 'club_lead' ? 'Club Lead' : 'Student'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#737373] ml-1" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#181818] border border-[#E8E5E5] dark:border-[#2E2E2E] rounded-2xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-[#E8E3E5] dark:border-[#2E2E2E] bg-[#F8F7F8] dark:bg-[#1E1E1E]">
                      <p className="text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] truncate">
                        {profile?.full_name}
                      </p>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] truncate">
                        {profile?.email}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/70 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#F4E7EC] rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Admin Console
                        </Link>
                      ) : isClubLead ? (
                        <Link
                          to="/club-lead/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/70 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#F4E7EC] rounded-xl transition-colors"
                        >
                          <Compass className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Club Lead Portal
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/70 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#F4E7EC] rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Student Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#B91C1C] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setSignInDropdownOpen(!signInDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#151515] dark:text-[#FAF9F7] bg-white dark:bg-[#1E1E1E] border border-[#E8E3E5] dark:border-[#2E2E2E] hover:border-[#800020]/40 hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-all shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                  <span>Sign In</span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </button>

                {signInDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSignInDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl shadow-xl z-20 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        to="/login"
                        onClick={() => setSignInDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:bg-[#F4E7EC]/60 dark:hover:bg-[#800020]/20 rounded-xl mx-1 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>All Portals (/login)</span>
                      </Link>
                      <div className="my-1 border-t border-[#E8E3E5] dark:border-[#2E2E2E]" />
                      <Link
                        to="/student/login"
                        onClick={() => setSignInDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/60 dark:hover:bg-[#800020]/20 rounded-xl mx-1 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Student Sign In</span>
                      </Link>
                      <Link
                        to="/club-lead/login"
                        onClick={() => setSignInDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/60 dark:hover:bg-[#800020]/20 rounded-xl mx-1 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Club Lead Sign In</span>
                      </Link>
                      <Link
                        to="/admin/login"
                        onClick={() => setSignInDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F4E7EC]/60 dark:hover:bg-[#800020]/20 rounded-xl mx-1 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Sign In</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Link to="/register">
                <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-3.5 h-3.5 text-white" />}>
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#737373] dark:text-[#FAF9F7]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-[#C5A46D]" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#151515] dark:text-[#FAF9F7] focus:outline-none"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#151515] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'text-[#800020] dark:text-[#F4E7EC] bg-[#F4E7EC]/80 dark:bg-[#800020]/30 font-semibold'
                    : 'text-[#151515] dark:text-[#FAF9F7] hover:bg-[#F8F7F8] dark:hover:bg-[#222222]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-[#E8E3E5] dark:border-[#2E2E2E] space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : isClubLead ? '/club-lead/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#F4E7EC]/70 dark:bg-[#800020]/30 text-[#800020] dark:text-[#F4E7EC]"
                >
                  {isAdmin ? 'Admin Console' : isClubLead ? 'Club Lead Portal' : 'My Dashboard'} ({profile?.full_name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#B91C1C] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
