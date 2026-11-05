import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, GraduationCap } from 'lucide-react';
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-xs hover:bg-[#5C001A] transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] tracking-tight">
            Sign In to Campus Club Explorer
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
            Enter your college credentials to access your club memberships
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-[10px] bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-medium text-[#B91C1C] dark:text-rose-300">
                {errorMessage}
              </div>
            )}

            <Input
              label="College Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@campus.edu"
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
                  defaultChecked
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] dark:border-[#383838] text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
            Don't have a student account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline"
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

