import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Filter,
  X,
  Compass,
} from 'lucide-react';
import ClubCard from '../components/common/ClubCard.jsx';
import { ClubCardSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Button from '../components/common/Button.jsx';
import { apiService } from '../services/api.js';

export const ExploreClubs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL or defaults
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'popular';
  const featured = searchParams.get('featured') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await apiService.categories.getAll();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Debounced search sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateFilter('search', searchInput || null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (value === null || value === '' || value === 'all' || value === false) {
        updated.delete(key);
      } else {
        updated.set(key, value.toString());
      }
      // Reset to page 1 whenever filters change
      if (key !== 'page') {
        updated.delete('page');
      }
      return updated;
    });
  }, [setSearchParams]);

  // Fetch clubs when URL search parameters change
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await apiService.clubs.getAll({
          search,
          category,
          sort,
          featured,
          page,
          limit: 12,
        });

        if (res.success) {
          setClubs(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [search, category, sort, featured, page]);

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(search || (category && category !== 'all') || featured || sort !== 'popular');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
          <Compass className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" /> Discovery Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
          Explore College Clubs
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#A3A3A3] max-w-2xl font-sans">
          Browse through all active student organizations, search by interests, filter by categories, and discover your next community.
        </p>
      </div>

      {/* SEARCH & CONTROLS BAR */}
      <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search clubs by name, mission, keywords, or topics..."
              className="w-full pl-10 pr-10 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-sm text-[#111111] dark:text-[#FAF9F7] placeholder-[#737373]/70 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-[#800020]"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  updateFilter('search', null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#800020] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 rounded-[10px] bg-[#FFFFFF] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] text-sm font-medium text-[#111111] dark:text-[#FAF9F7] focus:outline-none focus:ring-2 focus:ring-[#800020] cursor-pointer"
              >
                <option value="popular">Most Popular (Members)</option>
                <option value="alphabetical">Alphabetical (A - Z)</option>
                <option value="recent">Recently Established</option>
              </select>
              <ArrowUpDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none" />
            </div>

            {/* Featured Only Pill */}
            <button
              onClick={() => updateFilter('featured', !featured)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-sm font-semibold border transition-all duration-150 shrink-0 ${
                featured
                  ? 'bg-[#111111] text-[#C5A46D] border-[#C5A46D]/60 shadow-xs'
                  : 'bg-[#FFFFFF] dark:bg-[#292929] border-[#E5E5E5] dark:border-[#383838] text-[#111111] dark:text-[#FAF9F7] hover:border-[#800020]/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A46D]" />
              <span>Featured Only</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => updateFilter('category', 'all')}
            className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all border ${
              category === 'all'
                ? 'bg-[#800020] text-white border-[#5C001A] shadow-xs'
                : 'bg-white dark:bg-[#1C1C1C] border-[#E5E5E5] dark:border-[#383838] text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF] dark:hover:bg-[#800020]/25'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`px-3.5 py-1.5 rounded-[10px] text-xs font-semibold whitespace-nowrap transition-all border ${
                category === cat.slug || category === cat.id
                  ? 'bg-[#800020] text-white border-[#5C001A] shadow-xs'
                  : 'bg-white dark:bg-[#1C1C1C] border-[#E5E5E5] dark:border-[#383838] text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF] dark:hover:bg-[#800020]/25'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE FILTERS SUMMARY & COUNT */}
      <div className="flex items-center justify-between text-xs text-[#737373] dark:text-[#A3A3A3]">
        <div>
          Showing <span className="font-bold text-[#111111] dark:text-[#FAF9F7]">{clubs.length}</span> of{' '}
          <span className="font-bold text-[#111111] dark:text-[#FAF9F7]">{pagination.total}</span> college clubs
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[#800020] dark:text-[#D9A0AE] hover:underline font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear active filters
          </button>
        )}
      </div>

      {/* CLUBS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      ) : clubs.length === 0 ? (
        <EmptyState
          title="No clubs match your filters"
          description="We couldn't find any student organizations matching your search terms or selected category."
          actionLabel="Clear All Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => updateFilter('page', newPage)}
        />
      )}
    </div>
  );
};
export default ExploreClubs;

