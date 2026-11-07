import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2, ShieldAlert, ArrowLeft, LogIn, Compass } from 'lucide-react';
import Button from './common/Button.jsx';

export const ProtectedRoute = ({ children, requireAdmin = false, requireClubLead = false }) => {
  const { isAuthenticated, isAdmin, isClubLead, loading, profile, user, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#800020] mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading authentication session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but not an admin, display clear unauthorized screen
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              Administrator Access Required
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              The <strong>Admin Console & Management Module</strong> is restricted to campus administrators. You are currently logged in as a <strong>student</strong> (<span className="text-[#800020] dark:text-[#D9A0AE] font-semibold">{user?.email || profile?.email}</span>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCE7EF]/50 dark:bg-[#800020]/20 border border-[#D9A0AE]/50 dark:border-[#800020]/50 text-left text-xs space-y-1">
            <div className="font-bold text-[#800020] dark:text-[#D9A0AE]">
              Administrator Credentials:
            </div>
            <div className="text-[#111111] dark:text-[#FAF9F7]">
              Email: <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#111111] font-mono font-semibold">admin@campus.edu</code>
            </div>
            <div className="text-[#111111] dark:text-[#FAF9F7]">
              Password: <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#111111] font-mono font-semibold">admin123</code>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<LogIn className="w-4 h-4 text-white" />}
              onClick={async () => {
                await logout();
                window.location.href = '/login';
              }}
            >
              Sign In as Administrator
            </Button>

            <Link to="/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<ArrowLeft className="w-4 h-4 text-[#800020]" />}
              >
                Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated but not a club lead or admin, display unauthorized screen
  if (requireClubLead && !isClubLead && !isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center mx-auto text-[#800020] dark:text-[#D9A0AE]">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              Club Lead Access Required
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              The <strong>Club Lead Management Dashboard</strong> is restricted to assigned Club Leaders. You are currently logged in as a <strong>student</strong> (<span className="text-[#800020] dark:text-[#D9A0AE] font-semibold">{user?.email || profile?.email}</span>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCE7EF]/50 dark:bg-[#800020]/20 border border-[#D9A0AE]/50 dark:border-[#800020]/50 text-left text-xs space-y-1">
            <div className="font-bold text-[#800020] dark:text-[#D9A0AE]">
              Need Club Lead Privileges?
            </div>
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3] leading-relaxed">
              To manage a club, request an administrator to assign your student account as the Club Lead for your organization in the <strong>Admin Console</strong>.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<LogIn className="w-4 h-4 text-white" />}
              onClick={async () => {
                await logout();
                window.location.href = '/login';
              }}
            >
              Sign In with Another Account
            </Button>

            <Link to="/dashboard" className="block">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<ArrowLeft className="w-4 h-4 text-[#800020]" />}
              >
                Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
export default ProtectedRoute;
