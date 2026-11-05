import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <span className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        404 — Page Not Found
      </span>
      <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mt-2 mb-4 tracking-tight">
        You seem to have strayed off campus
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-8">
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
