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

  // Category Icon Resolver
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'coding-technology':
        return <Code2 className="w-6 h-6 text-indigo-500" />;
      case 'entrepreneurship':
        return <Rocket className="w-6 h-6 text-violet-500" />;
      case 'sports-fitness':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 'arts-creativity':
        return <Palette className="w-6 h-6 text-pink-500" />;
      case 'music-dance':
        return <Music className="w-6 h-6 text-rose-500" />;
      case 'photography-media':
        return <Camera className="w-6 h-6 text-cyan-500" />;
      case 'social-service':
        return <HeartHandshake className="w-6 h-6 text-emerald-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-violet-500/20 to-pink-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800/80 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              Campus Club Explorer 2026
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Discover Your Community. <br className="hidden sm:inline" />
            <span className="gradient-text">Explore Your Passion.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
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
              <Button size="lg" variant="outline">
                Join a Club Today
              </Button>
            </Link>
          </div>

          {/* Visual Showcase Banner */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-dark-card p-2 sm:p-3">
              <div className="relative rounded-2xl overflow-hidden h-[260px] sm:h-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"
                  alt="College students collaborating in a club workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
                  <div className="text-left max-w-xl text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
                      Vibrant Campus Life
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {stats.totalClubs}
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
              Active Clubs
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {stats.totalStudents.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
              Registered Students
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {stats.upcomingEvents}
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
              Upcoming Events
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Grid className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              {stats.interestCategories}
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
              Interest Categories
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CLUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Highlights
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Featured Campus Clubs
            </h2>
          </div>
          <Link
            to="/clubs?featured=true"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
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
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Find What Inspires You
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Explore Clubs by Interest Category
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Whether your calling is software engineering, stage performance, varsity football, or philanthropic activism, there is a place for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/clubs?category=${cat.slug}`}
              className="group p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 hover:border-brand-500/50 hover:shadow-xl dark:hover:shadow-glow-indigo/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-gray-700/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
                <span>{cat.club_count || 0} clubs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-brand-600 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
              <Calendar className="w-3.5 h-3.5" /> What's Happening Next
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700"
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
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-violet-700 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
              Start Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready to find your campus crew and lead great initiatives?
            </h2>
            <p className="text-base text-brand-100 leading-relaxed">
              Create a free student profile with your college email and submit membership requests with one click.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100 shadow-md">
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
