import React from 'react';
import { Compass, ShieldCheck, Users, Sparkles, HeartHandshake, Database, Code2 } from 'lucide-react';
import Badge from '../components/common/Badge.jsx';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="primary" size="md">
          About Campus Club Explorer
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Transforming the Collegiate Experience
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Our mission is to ensure no student feels disconnected from university life. We provide every student with an open window into campus activities, club initiatives, and leadership opportunities.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Inclusive Community
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Centralizing discovery so whether you are a freshman finding your rhythm or a senior driving innovation, you can connect instantly.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Secure Governance
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Backed by PostgreSQL Row Level Security (RLS) ensuring student confidentiality and rigorous club coordinator verification.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Real-Time Engagement
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Instant event notifications, announcements, member rosters, and seamless registration pipelines built for modern campus speeds.
          </p>
        </div>
      </div>

      {/* Technology Stack Spotlight */}
      <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Architectural Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <Code2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">React + Vite + Tailwind CSS</span>
              High performance, accessible design system inspired by Linear and Stripe with dark/light theme support.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">Supabase PostgreSQL + RLS</span>
              Production-grade relational schema with triggers, views, foreign keys, and ironclad Row Level Security.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
