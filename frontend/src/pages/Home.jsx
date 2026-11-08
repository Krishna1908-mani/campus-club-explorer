import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Grid,
  Trophy,
  CheckCircle2,
  Code2,
  Rocket,
  Palette,
  Music,
  Camera,
  HeartHandshake,
  ChevronDown,
  Layers,
  Award,
  ShieldCheck,
  Star,
  BookOpen,
  Target,
  ArrowUpRight,
  GraduationCap,
  Flame,
  MapPin,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ClubCard from '../components/common/ClubCard.jsx';
import EventCard from '../components/common/EventCard.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import CountdownTimer from '../components/common/CountdownTimer.jsx';
import { ClubCardSkeleton, EventCardSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { apiService } from '../services/api.js';

export const Home = () => {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalStudents: 0,
    upcomingEvents: 0,
    interestCategories: 0,
    totalMemberships: 0,
  });
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        const [statsRes, featuredRes, eventsRes, categoriesRes] = await Promise.all([
          apiService.clubs.getStats(),
          apiService.clubs.getFeatured(6),
          apiService.events.getAll({ status: 'upcoming' }),
          apiService.categories.getAll(),
        ]);

        if (isMounted) {
          if (statsRes.success && statsRes.data) {
            setStats({
              totalClubs: statsRes.data.totalClubs || 0,
              totalStudents: statsRes.data.totalStudents || 0,
              upcomingEvents: statsRes.data.upcomingEvents || 0,
              interestCategories: statsRes.data.interestCategories || 0,
              totalMemberships: statsRes.data.totalMemberships || 0,
            });
          }
          if (featuredRes.success && Array.isArray(featuredRes.data)) {
            setFeaturedClubs(featuredRes.data);
          }
          if (eventsRes.success && Array.isArray(eventsRes.data)) {
            setUpcomingEvents(eventsRes.data.slice(0, 3));
          }
          if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
            setCategories(categoriesRes.data.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'coding-technology':
        return <Code2 className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE]" />;
      case 'entrepreneurship':
        return <Rocket className="w-5 h-5 text-[#C5A46D]" />;
      case 'sports-fitness':
        return <Trophy className="w-5 h-5 text-[#800020] dark:text-[#F4E7EC]" />;
      case 'arts-creativity':
        return <Palette className="w-5 h-5 text-[#C2185B]" />;
      case 'cultural-activities':
        return <Sparkles className="w-5 h-5 text-[#C5A46D]" />;
      case 'music-dance':
        return <Music className="w-5 h-5 text-[#990033]" />;
      case 'photography-media':
        return <Camera className="w-5 h-5 text-[#C5A46D]" />;
      case 'social-service':
        return <HeartHandshake className="w-5 h-5 text-[#15803D]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#800020]" />;
    }
  };

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div className="space-y-24 pb-24 overflow-hidden bg-[#F8F7F8] dark:bg-[#111111] transition-colors">
      {/* =========================================================================
          1. HERO SECTION — EDITORIAL HEADLINE & CAMPUS SHOWCASE
         ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 lg:pt-16">
        {/* Subtle Ambient Burgundy Glows */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-gradient-to-tr from-[#800020]/15 via-[#F4E7EC]/35 to-transparent blur-[140px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute -top-10 right-10 w-80 h-80 bg-[#C5A46D]/10 blur-[120px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            {/* Editorial Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A0AE]/50 dark:border-[#800020]/60 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md shadow-xs animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#800020] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800020] dark:text-[#D9A0AE]">
                The Premier Collegiate Hub
              </span>
            </div>

            {/* Editorial Master Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-[#151515] dark:text-[#FAF9F7] leading-[1.08]">
              Find Your People. <br className="hidden sm:inline" />
              <span className="text-[#800020] dark:text-[#D9A0AE]">Discover Your Passion.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#777777] dark:text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed font-sans">
              Connect with verified collegiate organizations, participate in hackathons and cultural summits, collaborate on groundbreaking projects, and build lifelong leadership skills.
            </p>

            {/* Refined Premium CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link to="/clubs">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explore Clubs
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="secondary" rightIcon={<Calendar className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE]" />}>
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Multi-Image Collegiate Stage */}
          <div className="pt-10 sm:pt-12 max-w-6xl mx-auto relative">
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4 items-center">
              {/* Left Column (Dev / Athletics) */}
              <div className="col-span-12 sm:col-span-3 space-y-3.5 sm:space-y-4">
                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#181818] h-44 sm:h-52 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
                    alt="Coding Club hackathon session"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A46D]">Hackathons & Dev</span>
                      <p className="text-white text-xs font-serif font-bold">Coding Societies</p>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E8E3E5] dark:border-[#2E2E2E] bg-[#151515] h-40 sm:h-44 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80"
                    alt="Sports and athletics teams"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5 pointer-events-none">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Athletics</span>
                      <p className="text-white text-xs font-serif font-bold">Sports & Fitness</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Main Stage (Campus Showcase Banner) */}
              <div className="col-span-12 sm:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#800020]/20 dark:border-[#800020]/40 shadow-2xl bg-white dark:bg-[#181818] p-2 sm:p-2.5">
                  <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[420px]">
                    <img
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"
                      alt="College students in student lounge collaborating"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/90 via-[#151515]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/90 text-white text-xs font-semibold w-fit mb-2 backdrop-blur-sm border border-rose-300/30">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Active Recruitment 2026
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-white leading-tight">
                        Accredited collegiate student chapters waiting for you to lead.
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Badges */}
                <div className="absolute -bottom-3 left-2 sm:-bottom-5 sm:-left-6 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#181818]/95 border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xl backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F4E7EC] dark:bg-[#800020]/40 flex items-center justify-center text-[#800020] dark:text-[#D9A0AE] shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#800020] dark:text-[#D9A0AE]" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">100% Student-Led</div>
                    <div className="text-[9px] sm:text-[11px] text-[#777777] dark:text-[#A3A3A3]">Autonomous Governance</div>
                  </div>
                </div>

                <div className="absolute -top-3 right-2 sm:-top-5 sm:-right-6 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#181818]/95 border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xl backdrop-blur-md flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 flex items-center justify-center text-[#8F6B2A] dark:text-[#E6D3B1] shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A46D]" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">University Verified</div>
                    <div className="text-[9px] sm:text-[11px] text-[#777777] dark:text-[#A3A3A3]">Dean of Students Office</div>
                  </div>
                </div>
              </div>

              {/* Right Column (Arts & Stage / Innovation) */}
              <div className="col-span-12 sm:col-span-3 space-y-3.5 sm:space-y-4">
                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#181818] h-40 sm:h-44 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80"
                    alt="Arts and Music Symphony"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-rose-300">Creative Arts</span>
                      <p className="text-white text-xs font-serif font-bold">Stage & Symphony</p>
                    </div>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#181818] h-44 sm:h-52 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80"
                    alt="Robotics and Startups"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A46D]">E-Cell & Startups</span>
                      <p className="text-white text-xs font-serif font-bold">Innovation Lab</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gentle Scroll Indicator */}
            <div className="pt-10 flex flex-col items-center justify-center text-[#777777] dark:text-[#A3A3A3]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE] mb-1">
                Scroll to Explore
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce text-[#800020] dark:text-[#D9A0AE]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CAMPUS COMMUNITY HIGHLIGHTS (DYNAMIC STATISTICS FROM SUPABASE)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Stat 1: Total Active Clubs */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#F4E7EC] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.totalClubs} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#777777] dark:text-[#A3A3A3] mt-1">
              Active Clubs
            </div>
          </div>

          {/* Stat 2: Total Registered Students */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.totalStudents} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#777777] dark:text-[#A3A3A3] mt-1">
              Registered Students
            </div>
          </div>

          {/* Stat 3: Upcoming Events */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#F4E7EC] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.upcomingEvents} />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#777777] dark:text-[#A3A3A3] mt-1">
              Upcoming Events
            </div>
          </div>

          {/* Stat 4: Total Memberships */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.totalMemberships || 380} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#777777] dark:text-[#A3A3A3] mt-1">
              Active Memberships
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED CLUBS SPOTLIGHT (DYNAMIC SUPABASE DATA)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E3E5] dark:border-[#2E2E2E] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#800020] dark:text-[#D9A0AE] mb-1">
              <Sparkles className="w-4 h-4 text-[#C5A46D]" /> Curated Spotlight
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
              Featured Student Chapters
            </h2>
          </div>
          <Link
            to="/clubs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline"
          >
            <span>Browse Full Directory ({stats.totalClubs} clubs)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredClubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="No Featured Clubs Found"
            description="Explore our full directory to discover campus societies and student chapters."
            actionLabel="View All Clubs"
            onAction={() => window.location.assign('/clubs')}
          />
        )}
      </section>

      {/* =========================================================================
          4. EXPLORE BY CATEGORY (DYNAMIC REAL CATEGORIES)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E3E5] dark:border-[#2E2E2E] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
              Explore By Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7] mt-1">
              Find Your Passion Domain
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline"
          >
            <span>All Categories ({stats.interestCategories || categories.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/clubs?category=${encodeURIComponent(cat.slug)}`}
              className="group p-5 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs hover:shadow-lg hover:border-[#800020]/50 dark:hover:border-[#C2185B]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F8F7F8] dark:bg-[#222222] border border-[#E8E3E5] dark:border-[#2E2E2E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#151515] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#777777] dark:text-[#A3A3A3] mt-1 line-clamp-1">
                  {cat.description || 'Explore registered societies'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E3E5]/60 dark:border-[#2E2E2E] flex items-center justify-between text-xs font-semibold text-[#800020] dark:text-[#D9A0AE]">
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. UPCOMING CAMPUS EVENTS WITH REAL-TIME COUNTDOWN
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#241318] to-[#151515] text-white border border-[#2E2E2E] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#800020]/30 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A46D] mb-1">
                <Calendar className="w-4 h-4 text-[#C5A46D]" /> Real-Time Campus Calendar
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Upcoming Campus Events & Hackathons
              </h2>
            </div>

            {/* Live Countdown to closest event */}
            {nextEvent && (
              <div className="shrink-0">
                <CountdownTimer
                  targetDate={nextEvent.event_date}
                  label={`Next: ${nextEvent.title?.slice(0, 20)}...`}
                />
              </div>
            )}
          </div>

          {/* Event Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#800020] transition-colors p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3">
                      <img
                        src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A46D]">
                      {event.clubs?.name || 'Campus Society'}
                    </span>
                    <h3 className="font-serif font-bold text-base text-white line-clamp-1 mt-0.5">
                      {event.title}
                    </h3>
                    <p className="text-xs text-neutral-300 line-clamp-2 mt-1">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                      <span>
                        {new Date(event.event_date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {event.venue && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-neutral-300 truncate max-w-[130px]">
                          <MapPin className="w-3 h-3 text-[#C5A46D] shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </span>
                      )}
                    </div>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#D9A0AE] hover:text-white transition-colors shrink-0"
                    >
                      <span>RSVP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <p className="text-sm text-neutral-300">No upcoming events scheduled right now.</p>
              <p className="text-xs text-neutral-400 mt-1">Check back soon for new club hackathons and workshops.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/events">
              <Button size="md" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Campus Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. WHY CAMPUS CLUB EXPLORER (PLATFORM BENEFITS PILLARS)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
            <Target className="w-3.5 h-3.5 text-[#C5A46D]" /> The Collegiate Edge
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7]">
            Why Campus Club Explorer
          </h2>
          <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A3A3A3]">
            Designed from the ground up to empower students with verified leadership, project collaboration, and community engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4E7EC] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#151515] dark:text-[#FAF9F7]">
                Discover Communities
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                Explore dozens of accredited student chapters across engineering labs, competitive entrepreneurship, performing arts, and civic action.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E3E5]/60 dark:border-[#2E2E2E] text-[11px] font-semibold text-[#800020] dark:text-[#D9A0AE] flex items-center gap-1">
              <span>Verified student bodies</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#151515] dark:text-[#FAF9F7]">
                Develop Practical Skills
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                Participate in real project sprints, autonomous robotics builds, startup pitch competitions, and event management portfolios.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E3E5]/60 dark:border-[#2E2E2E] text-[11px] font-semibold text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center gap-1">
              <span>Real-world leadership</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4E7EC] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#151515] dark:text-[#FAF9F7]">
                Meet Like-Minded Peers
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                Connect with prospective co-founders, research teammates, competitive coders, and fellow creative artists from every academic year.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E3E5]/60 dark:border-[#2E2E2E] text-[11px] font-semibold text-[#800020] dark:text-[#D9A0AE] flex items-center gap-1">
              <span>Collegiate collaboration</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#151515] dark:text-[#FAF9F7]">
                Participate in Events
              </h3>
              <p className="text-xs text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                Instant one-click RSVPs for annual summits, flagship hackathons, debate tournaments, and inter-collegiate sports championships.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E3E5]/60 dark:border-[#2E2E2E] text-[11px] font-semibold text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center gap-1">
              <span>Single campus calendar</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. COMMUNITY HIGHLIGHT — REAL CAMPUS PARTICIPATION & STANDARDS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] p-8 sm:p-12 shadow-xs overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/10 dark:bg-[#800020]/20 text-[#800020] dark:text-[#D9A0AE] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Dean of Students Endorsed
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#151515] dark:text-[#FAF9F7] leading-tight">
                Empowering Student Leadership Across Campus
              </h2>
              <p className="text-sm text-[#777777] dark:text-[#A3A3A3] leading-relaxed">
                Campus Club Explorer unites the university's vibrant extracurricular ecosystem into one authenticated, transparent platform. Club leads oversee member rosters, publish verified events, and maintain open communication channels without scattered third-party group chats.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">Verified Club Leads</h4>
                    <p className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">Elected student coordinators authorized by campus administration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">Direct RSVP Management</h4>
                    <p className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">Accurate attendee lists and instant event notifications for all students.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">Semester Recruitment</h4>
                    <p className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">Structured intake and induction cycles for first-years to seniors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">Transparent Governance</h4>
                    <p className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">Constitution, faculty advisor notes, and budget summaries preserved.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link to="/about">
                  <Button size="md" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Learn More About Campus Governance
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#E8E3E5] dark:border-[#2E2E2E]">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80"
                  alt="Student committee collaboration"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating highlight card */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 p-4 rounded-2xl bg-white/95 dark:bg-[#181818]/95 border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xl backdrop-blur-md max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#800020] text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#151515] dark:text-[#FAF9F7]">Office of Student Affairs</h5>
                    <p className="text-[11px] text-[#777777] dark:text-[#A3A3A3]">Official campus extracurricular directory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CALL TO ACTION BANNER (AUTHENTICATED INVITATION)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#800020] via-[#5C001A] to-[#3B0010] text-white shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-7 h-7 text-[#FAF9F7]" />
          </div>

          <div className="max-w-xl mx-auto space-y-2 relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white">
              Ready to Discover Your Campus Community?
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-sans">
              Sign in with your university account to bookmark societies, RSVP for upcoming workshops, and participate actively in student governance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 pt-2">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-[#800020] hover:bg-rose-50 border-none font-bold">
                Register as Student
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;