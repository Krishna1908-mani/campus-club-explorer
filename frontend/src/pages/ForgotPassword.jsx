import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/common/AuthLayout.jsx';
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
    <AuthLayout
      badgeText="Security Recovery"
      badgeIcon={<KeyRound className="w-3.5 h-3.5" />}
      badgeVariant="amber"
      title="Reset Account Password"
      subtitle="Enter your collegiate email address to receive secure password recovery instructions."
      backTo="/login"
      backLabel="Back to all login options"
    >
      {submitted ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#15803D] flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
            Check Your Email
          </h3>
          <p className="text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
            If an account matches <span className="font-semibold text-[#151515] dark:text-[#FAF9F7]">{email}</span>, password reset instructions have been dispatched.
          </p>
          <div className="pt-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="College Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. student@campus.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full h-11 text-sm font-semibold rounded-xl mt-2 shadow-xs hover:shadow-md"
            isLoading={loading}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
