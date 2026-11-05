import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      <div className="w-20 h-20 rounded-2xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mb-6 shadow-xs">
        <GraduationCap className="w-10 h-10" />
      </div>
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#800020] dark:text-[#D9A0AE]">
        404 — Page Not Found
      </span>
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7] mt-2 mb-4 tracking-tight">
        You seem to have strayed off campus
      </h1>
      <p className="text-sm text-[#737373] dark:text-[#A3A3A3] max-w-md leading-relaxed mb-8 font-sans">
        The club page, event link, or administrative URL you are looking for does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="w-5 h-5" />}>
          Return to Home Page
        </Button>
      </Link>
    </div>
  );
};
export default NotFound;

