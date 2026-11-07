import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin, Mail, Heart, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] dark:bg-[#111111] border-t border-[#E5E5E5] dark:border-[#383838] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-xs group-hover:bg-[#5C001A] transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-[#111111] dark:text-[#FAF9F7] font-serif">
                Campus<span className="text-[#800020] dark:text-[#D9A0AE]">Club</span> Explorer
              </span>
            </Link>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed max-w-sm">
              The premier collegiate hub for discovering student organizations, attending vibrant events, collaborating on visionary projects, and cultivating lifelong leadership.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center text-[#737373] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:border-[#800020]/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center text-[#737373] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:border-[#800020]/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center text-[#737373] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:border-[#800020]/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FAF9F7] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/clubs" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  All Clubs
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Interest Categories
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link to="/student/login" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/club-lead/login" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Club Lead Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                  <span>Admin Sign In</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#800020] dark:text-[#D9A0AE] font-semibold hover:underline">
                  All Login Options
                </Link>
              </li>
            </ul>
          </div>

          {/* Interest Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FAF9F7] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/clubs?category=coding-technology" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Coding & Tech
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=entrepreneurship" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Entrepreneurship
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=sports-fitness" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link to="/clubs?category=arts-creativity" className="text-[#737373] dark:text-[#A3A3A3] hover:text-[#800020] dark:hover:text-[#D9A0AE] transition-colors">
                  Arts & Music
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FAF9F7] mb-4">
              Student Affairs
            </h4>
            <ul className="space-y-3 text-sm text-[#737373] dark:text-[#A3A3A3]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE] shrink-0 mt-0.5" />
                <span>Student Activity Center, West Wing, Room 302</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE] shrink-0" />
                <a href="mailto:clubs@campus.edu" className="hover:text-[#800020] dark:hover:text-[#D9A0AE]">
                  clubs@campus.edu
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE] shrink-0" />
                <span>+1 (555) 489-CLUB</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E5] dark:border-[#383838] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373] dark:text-[#A3A3A3]">
          <p>© {new Date().getFullYear()} Campus Club Explorer. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-[#800020] fill-current" /> for university student communities
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

