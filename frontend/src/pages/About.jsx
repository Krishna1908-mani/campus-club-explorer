import React from 'react';
import { GraduationCap, ShieldCheck, Users, Sparkles, HeartHandshake, Database, Code2 } from 'lucide-react';
import Badge from '../components/common/Badge.jsx';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="burgundy" size="md">
          About Campus Club Explorer
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
          Transforming the Collegiate Experience
        </h1>
        <p className="text-base text-[#737373] dark:text-[#A3A3A3] leading-relaxed font-sans">
          Our mission is to ensure no student feels disconnected from university life. We provide every student with an open window into campus activities, club initiatives, and leadership opportunities.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 flex items-center justify-center text-[#800020] dark:text-[#D9A0AE]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-[#FAF9F7]">
            Inclusive Community
          </h3>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            Centralizing discovery so whether you are a freshman finding your rhythm or a senior driving innovation, you can connect instantly.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 flex items-center justify-center text-[#8F6B2A] dark:text-[#E6D3B1]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-[#FAF9F7]">
            Secure Governance
          </h3>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            Backed by PostgreSQL Row Level Security (RLS) ensuring student confidentiality and rigorous club coordinator verification.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 flex items-center justify-center text-[#800020] dark:text-[#D9A0AE]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-[#FAF9F7]">
            Real-Time Engagement
          </h3>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            Instant event notifications, announcements, member rosters, and seamless registration pipelines built for modern campus speeds.
          </p>
        </div>
      </div>

      {/* Technology Stack Spotlight */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-8 sm:p-10 space-y-6 shadow-xs">
        <h2 className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
          Architectural Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#737373] dark:text-[#A3A3A3]">
          <div className="flex items-start gap-3">
            <Code2 className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#111111] dark:text-[#FAF9F7] block">React + Vite + Tailwind CSS</span>
              High performance, editorial luxury design system in Burgundy, Black & White with dark/light theme support.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#111111] dark:text-[#FAF9F7] block">Supabase PostgreSQL + RLS</span>
              Production-grade relational schema with triggers, views, foreign keys, and ironclad Row Level Security.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;

