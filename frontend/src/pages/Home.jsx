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
  CheckCircle,
  TrendingUp,
  Code2,
  Rocket,
  Palette,
  Music,
  Camera,
  HeartHandshake,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ClubCard from '../components/common/ClubCard.jsx';
import EventCard from '../components/common/EventCard.jsx';
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
          apiService.clubs.getFeatured(4),
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

  // Category Icon Resolver with Burgundy Luxury Palette
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'coding-technology':
        return <Code2 className="w-6 h-6 text-[#800020] dark:text-[#D9A0AE]" />;
      case 'entrepreneurship':
        return <Rocket className="w-6 h-6 text-[#C5A46D]" />;
      case 'sports-fitness':
        return <Trophy className="w-6 h-6 text-[#800020] dark:text-[#FCE7EF]" />;
      case 'arts-creativity':
        return <Palette className="w-6 h-6 text-[#C2185B]" />;
      case 'music-dance':
        return <Music className="w-6 h-6 text-[#990033]" />;
      case 'photography-media':
        return <Camera className="w-6 h-6 text-[#C5A46D]" />;
      case 'social-service':
        return <HeartHandshake className="w-6 h-6 text-[#15803D]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#800020]" />;
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20">
        {/* Subtle decorative burgundy element */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#800020]/10 via-[#FCE7EF]/30 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D9A0AE]/40 dark:border-[#800020]/60 bg-[#FFFFFF]/90 dark:bg-[#1C1C1C]/90 backdrop-blur-md shadow-xs">
            <Sparkles className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#800020] dark:text-[#D9A0AE]">
              Collegiate Club Platform 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight text-[#111111] dark:text-[#FAF9F7] max-w-4xl mx-auto leading-[1.12]">
            Find Your <span className="text-[#800020] dark:text-[#D9A0AE]">People</span>. <br className="hidden sm:inline" />
            Discover Your <span className="text-[#800020] dark:text-[#D9A0AE]">Passion</span>.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[#737373] dark:text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed font-sans">
            Unite with student-led organizations, build cutting-edge projects, compete in university tournaments, and elevate your collegiate journey in one centralized platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/clubs">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Explore All Clubs
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Join a Club Today
              </Button>
            </Link>
          </div>

          {/* Visual Showcase Banner */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-[#383838] shadow-2xl bg-white dark:bg-[#1C1C1C] p-2 sm:p-3">
              <div className="relative rounded-2xl overflow-hidden h-[260px] sm:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"
                  alt="College students collaborating in a club workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/25 to-transparent flex items-end p-6 sm:p-10">
                  <div className="text-left max-w-xl text-white">
                    <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A46D]">
                      Vibrant Campus Life
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-extrabold mt-1 text-white">
                      Over 80+ student societies actively recruiting members
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION (Powered by real Supabase counts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              {stats.totalClubs}
            </div>
            <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Active Clubs
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Registered Students
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              {stats.upcomingEvents}
            </div>
            <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Upcoming Events
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center mx-auto mb-4">
              <Grid className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              {stats.interestCategories}
            </div>
            <div className="text-xs sm:text-sm font-medium uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-1">
              Interest Categories
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D9A0AE] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Handpicked Highlights
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              Featured Campus Clubs
            </h2>
          </div>
          <Link
            to="/clubs?featured=true"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800020] dark:text-[#D9A0AE] hover:text-[#5C001A] transition-colors"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ClubCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
            Find What Inspires You
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
            Explore Clubs by Interest Category
          </h2>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
            Whether your calling is software engineering, stage performance, varsity football, or philanthropic activism, there is a place for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/clubs?category=${cat.slug}`}
              className="group p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 hover:shadow-[0_16px_36px_rgba(17,17,17,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF9F7] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E5E5E5] dark:border-[#383838] flex items-center justify-between text-xs font-semibold text-[#737373] dark:text-[#A3A3A3]">
                <span>{cat.club_count || 0} clubs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-[#800020] dark:text-[#D9A0AE] transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D9A0AE] mb-2">
              <Calendar className="w-3.5 h-3.5" /> What's Happening Next
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800020] dark:text-[#D9A0AE] hover:text-[#5C001A] transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#800020] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle gold / deep wine decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5C001A] rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/15 text-[#E6D3B1] backdrop-blur-md border border-white/10">
              Start Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight text-white">
              Ready to find your campus crew and lead great initiatives?
            </h2>
            <p className="text-base text-rose-100/90 leading-relaxed font-sans">
              Create a free student profile with your college email and submit membership requests with one click.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" className="bg-white text-[#800020] hover:bg-[#FAF9F7] shadow-md font-semibold">
                  Create Student Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;

