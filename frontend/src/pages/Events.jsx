import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, X, MapPin } from 'lucide-react';
import EventCard from '../components/common/EventCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <Calendar className="w-4 h-4" /> Campus Calendar
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Events & Workshops
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Discover hackathons, acoustic jam nights, venture pitch sessions, sports tournaments, and humanitarian drives hosted by college societies.
        </p>
      </div>

      {/* Filter & Controls */}
      <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search event title, venue..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Status (Upcoming / Past) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="completed">Past Events</option>
            <option value="all">All Events</option>
          </select>

          {/* Filter by Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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
            className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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
