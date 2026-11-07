import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Grid,
  Info,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  Compass,
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
    ...(isAuthenticated && !isAdmin && !isClubLead ? [{ name: 'Student Dashboard', path: '/dashboard', isStudent: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 dark:bg-[#1C1C1C]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#383838] transition-colors shadow-[0_2px_12px_rgba(17,17,17,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Burgundy Luxury styling */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-sm shadow-[#800020]/25 group-hover:bg-[#5C001A] transition-all duration-300">
            <GraduationCap className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#111111] dark:text-[#FAF9F7] flex items-center gap-1 font-serif">
              Campus<span className="text-[#800020] dark:text-[#D9A0AE]">Club</span>
            </span>
            <span className="block text-[9px] uppercase font-bold tracking-[0.2em] text-[#737373] dark:text-[#A3A3A3] -mt-1 font-sans">
              Explorer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                link.isAdmin || link.isClubLead
                  ? `flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold tracking-tight transition-all duration-150 border ${
                      isActive
                        ? 'text-[#800020] dark:text-[#FCE7EF] bg-[#FCE7EF] dark:bg-[#800020]/40 border-[#800020]/40 shadow-xs'
                        : 'text-[#800020] dark:text-[#D9A0AE] bg-[#FCE7EF]/60 dark:bg-[#800020]/20 border-[#800020]/30 hover:bg-[#FCE7EF] dark:hover:bg-[#800020]/40'
                    }`
                  : `px-3.5 py-2 rounded-[10px] text-sm font-medium tracking-tight transition-all duration-150 ${
                      isActive
                        ? 'text-[#800020] dark:text-[#FCE7EF] bg-[#FCE7EF]/70 dark:bg-[#800020]/30 font-semibold'
                        : 'text-[#111111] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:bg-[#FAF9F7] dark:hover:bg-[#292929]'
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
            className="p-2.5 rounded-[10px] border border-[#E5E5E5] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#292929] text-[#737373] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:border-[#800020]/40 transition-colors shadow-xs"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-[#C5A46D]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth Actions */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-[10px] border border-[#E5E5E5] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#292929] hover:border-[#800020]/40 transition-all shadow-xs focus:outline-none"
              >
                <img
                  src={
                    profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      profile?.full_name || 'Student'
                    )}`
                  }
                  alt={profile?.full_name}
                  className="w-8 h-8 rounded-lg object-cover bg-[#FCE7EF] dark:bg-[#800020]/30"
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] max-w-[110px] truncate leading-tight">
                    {profile?.full_name || 'Student'}
                  </span>
                  <span className="block text-[10px] font-medium text-[#800020] dark:text-[#D9A0AE] capitalize">
                    {profile?.role || 'student'}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-[#E5E5E5] dark:border-[#383838]">
                      <p className="text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] truncate">
                        {profile?.full_name}
                      </p>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] truncate">
                        {profile?.email}
                      </p>
                    </div>

                    <div className="p-1">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF]/60 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#FCE7EF] rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Admin Console
                        </Link>
                      ) : isClubLead ? (
                        <Link
                          to="/club-lead/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF]/60 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#FCE7EF] rounded-xl transition-colors"
                        >
                          <Compass className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Club Lead Portal
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF]/60 dark:hover:bg-[#800020]/30 hover:text-[#800020] dark:hover:text-[#FCE7EF] rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
                          Student Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#B91C1C] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
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
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] bg-[#FCE7EF]/60 dark:bg-[#800020]/20 hover:bg-[#FCE7EF] border border-[#800020]/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                <span>Demo Logins</span>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" leftIcon={<LogIn className="w-4 h-4 text-[#800020]" />}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4 text-white" />}>
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
            className="p-2 rounded-[10px] text-[#737373] dark:text-[#FAF9F7]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-[#C5A46D]" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-[10px] text-[#111111] dark:text-[#FAF9F7] focus:outline-none"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E5] dark:border-[#383838] bg-[#FFFFFF] dark:bg-[#111111] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'text-[#800020] dark:text-[#FCE7EF] bg-[#FCE7EF]/70 dark:bg-[#800020]/30 font-semibold'
                    : 'text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FAF9F7] dark:hover:bg-[#292929]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#383838] space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : isClubLead ? '/club-lead/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#FCE7EF]/60 dark:bg-[#800020]/30 text-[#800020] dark:text-[#FCE7EF]"
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

