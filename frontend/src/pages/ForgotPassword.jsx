import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, CheckCircle2 } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { apiService } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.auth.forgotPassword({ email });
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      error(err.message || 'Failed to send password recovery instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-xs hover:bg-[#5C001A] transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] tracking-tight">
            Reset Account Password
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
            Enter your college email address to receive password reset instructions
          </p>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#15803D] flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                Check Your Email
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                If an account matches <span className="font-semibold text-[#111111] dark:text-[#FAF9F7]">{email}</span>, password reset instructions have been dispatched.
              </p>
              <Link to="/login" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="College Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@campus.edu"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] dark:border-[#383838] text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#800020] dark:text-[#A3A3A3] dark:hover:text-[#D9A0AE]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;

