import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, GraduationCap } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const Register = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    student_id: '',
    department: 'Computer Science & Engineering',
    year_of_study: '1st Year',
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const departments = [
    { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
    { value: 'Information Technology', label: 'Information Technology' },
    { value: 'Electronics & Communication', label: 'Electronics & Communication' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'School of Business & Management', label: 'School of Business & Management' },
    { value: 'Liberal Arts & Humanities', label: 'Liberal Arts & Humanities' },
    { value: 'Architecture & Design', label: 'Architecture & Design' },
  ];

  const yearsOfStudy = [
    { value: '1st Year', label: '1st Year (Freshman)' },
    { value: '2nd Year', label: '2nd Year (Sophomore)' },
    { value: '3rd Year', label: '3rd Year (Junior)' },
    { value: '4th Year', label: '4th Year (Senior)' },
    { value: 'Postgraduate / Master', label: 'Postgraduate / Master' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'College email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please provide a valid email format';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        success('Account created successfully! Welcome to Campus Club Explorer.');
        navigate('/dashboard');
      }
    } catch (err) {
      error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-white shadow-xs hover:bg-[#5C001A] transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] tracking-tight">
            Create Your Student Account
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
            Join collegiate societies, sign up for events, and build your campus network
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Jordan Lee"
              error={formErrors.full_name}
              required
            />

            <Input
              label="College Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. jordan.lee@campus.edu"
              error={formErrors.email}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                error={formErrors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={formErrors.confirmPassword}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student ID (Optional)"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                placeholder="e.g. STU-2026-104"
              />

              <Select
                label="Year of Study"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
                options={yearsOfStudy}
                placeholder=""
              />
            </div>

            <Select
              label="Department / Faculty"
              name="department"
              value={formData.department}
              onChange={handleChange}
              options={departments}
              placeholder=""
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3"
              isLoading={loading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] dark:border-[#383838] text-center text-xs text-[#737373] dark:text-[#A3A3A3]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;

