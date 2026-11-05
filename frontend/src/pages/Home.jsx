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
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ClubCard from '../components/common/ClubCard.jsx';
import EventCard from '../components/common/EventCard.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
import CountdownTimer from '../components/common/CountdownTimer.jsx';
import { ClubCardSkeleton } from '../components/common/Skeleton.jsx';
import { apiService } from '../services/api.js';

export const Home = () => {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalStudents: 0,
    upcomingEvents: 0,
    interestCategories: 0,
  });
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, featuredRes, eventsRes, categoriesRes] = await Promise.all([
          apiService.clubs.getStats(),
          apiService.clubs.getFeatured(6),
          apiService.events.getAll({ status: 'upcoming' }),
          apiService.categories.getAll(),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (featuredRes.success) setFeaturedClubs(featuredRes.data);
        if (eventsRes.success) setUpcomingEvents(eventsRes.data.slice(0, 3));
        if (categoriesRes.success) setCategories(categoriesRes.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'coding-technology':
        return <Code2 className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE]" />;
      case 'entrepreneurship':
        return <Rocket className="w-5 h-5 text-[#C5A46D]" />;
      case 'sports-fitness':
        return <Trophy className="w-5 h-5 text-[#800020] dark:text-[#FCE7EF]" />;
      case 'arts-creativity':
        return <Palette className="w-5 h-5 text-[#C2185B]" />;
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
    <div className="space-y-20 pb-20 overflow-hidden bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-10 lg:pt-12">
        {/* Ambient Burgundy Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#800020]/15 via-[#FCE7EF]/25 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-[#C5A46D]/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/* Editorial Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D9A0AE]/50 dark:border-[#800020]/60 bg-white/90 dark:bg-[#1C1C1C]/90 backdrop-blur-md shadow-xs animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#800020] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#800020] dark:text-[#D9A0AE]">
                The Premier Collegiate Hub
              </span>
            </div>

            {/* Requested Master Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#111111] dark:text-[#FAF9F7] leading-[1.1]">
              Your Campus. <br className="hidden sm:inline" />
              <span className="text-[#800020] dark:text-[#D9A0AE]">Your Community.</span> <br className="hidden sm:inline" />
              Your Journey.
            </h1>

            {/* Requested Supporting Text */}
            <p className="text-base sm:text-lg text-[#737373] dark:text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed font-sans">
              Discover extraordinary communities, connect with passionate people, and make your college experience unforgettable.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
              <Link to="/clubs">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Explore Clubs
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="secondary" rightIcon={<Calendar className="w-5 h-5" />}>
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Multi-Image Editorial Collage */}
          <div className="pt-8 sm:pt-10 max-w-6xl mx-auto relative">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
              {/* Left Column (Coding / Tech) */}
              <div className="col-span-12 sm:col-span-3 space-y-3 sm:space-y-4">
                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] h-44 sm:h-52 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] h-40 sm:h-44 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
                    alt="Sports and athletics teams"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">Athletics</span>
                      <p className="text-white text-xs font-serif font-bold">Sports & Fitness</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Main Stage (Campus Showcase Banner) */}
              <div className="col-span-12 sm:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#800020]/20 dark:border-[#800020]/40 shadow-2xl bg-white dark:bg-[#1C1C1C] p-2 sm:p-2.5">
                  <div className="relative rounded-2xl overflow-hidden h-[300px] sm:h-[420px]">
                    <img
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"
                      alt="College students in student lounge collaborating"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/90 text-white text-xs font-semibold w-fit mb-2 backdrop-blur-sm border border-rose-300/30">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Active Recruitment 2026
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-white leading-tight">
                        Over 80+ student organizations waiting for you to lead.
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Badges */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-6 p-3 rounded-2xl bg-white/95 dark:bg-[#1C1C1C]/95 border border-[#E5E5E5] dark:border-[#383838] shadow-xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/40 flex items-center justify-center text-[#800020] dark:text-[#D9A0AE]">
                    <Award className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111111] dark:text-[#FAF9F7]">100% Student-Led</div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Autonomous Governance</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-6 p-3 rounded-2xl bg-white/95 dark:bg-[#1C1C1C]/95 border border-[#E5E5E5] dark:border-[#383838] shadow-xl backdrop-blur-md flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 flex items-center justify-center text-[#8F6B2A] dark:text-[#E6D3B1]">
                    <CheckCircle2 className="w-5 h-5 text-[#C5A46D]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111111] dark:text-[#FAF9F7]">University Verified</div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Dean of Students Office</div>
                  </div>
                </div>
              </div>

              {/* Right Column (Arts & Stage / Entrepreneurship) */}
              <div className="col-span-12 sm:col-span-3 space-y-3 sm:space-y-4">
                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] h-40 sm:h-44 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

                <div className="group relative rounded-2xl overflow-hidden shadow-md border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] h-44 sm:h-52 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

            {/* Scroll Indicator */}
            <div className="pt-10 flex flex-col items-center justify-center text-[#737373] dark:text-[#A3A3A3]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE] mb-1">
                Scroll to Explore
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce text-[#800020] dark:text-[#D9A0AE]" />
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC STATISTICS (Section 5: Animated count-up with real DB values) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.totalClubs} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Active Clubs
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.totalStudents} suffix="+" />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Registered Students
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.upcomingEvents} />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Upcoming Events
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/40 transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={stats.interestCategories} />
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Interest Sectors
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#383838] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#800020] dark:text-[#D9A0AE] mb-1">
              <Sparkles className="w-4 h-4 text-[#C5A46D]" /> Curated Spotlight
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>

      {/* INTERACTIVE CATEGORY EXPLORER (Section 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
            Explore By Domain
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
            Find Your Passion Domain
          </h2>
          <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3]">
            Select an interest category to directly view all certified clubs and upcoming workshops in that realm.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/clubs?category=${encodeURIComponent(cat.slug)}`}
              className="group p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs hover:shadow-lg hover:border-[#800020]/50 dark:hover:border-[#C2185B]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FAF9F7] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.slug)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 line-clamp-1">
                  {cat.description || 'Explore registered societies'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5E5E5]/60 dark:border-[#383838] flex items-center justify-between text-xs font-semibold text-[#800020] dark:text-[#D9A0AE]">
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING CAMPUS EVENTS WITH COUNTDOWN (Section 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#241318] to-[#111111] text-white border border-[#383838] shadow-2xl relative overflow-hidden">
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

          {/* Event Cards Strip */}
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

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {new Date(event.event_date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#D9A0AE] hover:text-white transition-colors"
                  >
                    <span>Details & RSVP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/events">
              <Button size="md" variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Campus Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#800020] text-white flex items-center justify-center mx-auto shadow-md">
            <Compass className="w-7 h-7" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              Ready to Join Your College Community?
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              Create an account using your college email address, request membership in any club, and track your active participation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" variant="primary">
                Register as Student
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">
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
