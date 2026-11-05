import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Compass, Shield, User, Sparkles } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Login = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        success(`Welcome back, ${res.profile?.full_name || 'Student'}!`);
        if (res.profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/login' ? '/dashboard' : from);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick fill helper
  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Sign In to Campus Club Explorer
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter your college credentials to access your club memberships
          </p>
        </div>

        {/* Demo Fast-Login Pill Tray for Easy Evaluation */}
        <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5" /> Demo Login Quick-Fill (One-Click)
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoFill('student@campus.edu', 'password123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-dark-card border border-brand-200 dark:border-brand-800 hover:border-brand-500 text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-brand-600" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@campus.edu', 'admin123')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-dark-card border border-brand-200 dark:border-brand-800 hover:border-brand-500 text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-violet-600" />
              Demo Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-medium text-rose-700 dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            <Input
              label="College Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@campus.edu"
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
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember session</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
            Don't have a student account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
