import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, X, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import EventCard from '../components/common/EventCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import CountdownTimer from '../components/common/CountdownTimer.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import { apiService } from '../services/api.js';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [clubFilter, setClubFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiService.events.getAll({
        status: statusFilter,
        clubId: clubFilter === 'all' ? undefined : clubFilter,
        categoryId: categoryFilter === 'all' ? undefined : categoryFilter,
        search: search || undefined,
      });
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsRes, clubsRes] = await Promise.all([
          apiService.categories.getAll(),
          apiService.clubs.getAll({ limit: 50 }),
        ]);
        if (catsRes.success) setCategories(catsRes.data);
        if (clubsRes.success) setClubs(clubsRes.data);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, clubFilter, categoryFilter]);

  // Closest upcoming event
  const spotlightEvent = events.find((e) => new Date(e.event_date) > new Date()) || events[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
          <Calendar className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" /> Campus Calendar
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
          Events & Workshops
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#A3A3A3] max-w-2xl font-sans">
          Discover hackathons, acoustic jam nights, venture pitch sessions, sports tournaments, and humanitarian drives hosted by college societies.
        </p>
      </div>

      {/* FEATURED EVENT SPOTLIGHT WITH LIVE COUNTDOWN */}
      {!search && statusFilter === 'upcoming' && spotlightEvent && (
        <div className="rounded-3xl overflow-hidden border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Banner */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
              <img
                src={spotlightEvent.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
                alt={spotlightEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#800020] text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Featured Campus Event
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="burgundy" size="sm">
                    {spotlightEvent.clubs?.name || 'Campus Society'}
                  </Badge>
                  <CountdownTimer
                    targetDate={spotlightEvent.event_date}
                    label="Event Countdown"
                  />
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#111111] dark:text-[#FAF9F7] leading-tight">
                  {spotlightEvent.title}
                </h2>

                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] line-clamp-3 leading-relaxed">
                  {spotlightEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#737373] dark:text-[#A3A3A3] pt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-[#800020]" />
                    <span>
                      {new Date(spotlightEvent.event_date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#C5A46D]" />
                    <span>{spotlightEvent.venue || spotlightEvent.location || 'Campus Auditorium'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Controls */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event title, venue..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-xs font-medium text-[#111111] dark:text-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-[#800020]"
            />
          </div>

          {/* Status (Upcoming / Past) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="completed">Past Events</option>
            <option value="all">All Events</option>
          </select>

          {/* Filter by Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Filter by Club */}
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-xs font-semibold text-[#111111] dark:text-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
          >
            <option value="all">All Organizing Clubs</option>
            {clubs.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events match your criteria"
          description="Try broadening your category or date filter to see other upcoming campus events."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setStatusFilter('all');
            setClubFilter('all');
            setCategoryFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} onRegistrationChange={fetchEvents} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
