import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowUpRight, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import Badge from './Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { apiService } from '../../services/api.js';

export const ClubCard = ({
  club,
  isFavorite: initialFavorite = false,
  onFavoriteChange,
  viewMode = 'grid',
}) => {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      info('Please sign in to save clubs to your favorites!');
      return;
    }

    if (favLoading) return;
    setFavLoading(true);

    try {
      if (favorite) {
        await apiService.favorites.remove(club.id);
        setFavorite(false);
        success(`Removed ${club.name} from favorites.`);
        onFavoriteChange?.(club.id, false);
      } else {
        await apiService.favorites.add(club.id);
        setFavorite(true);
        success(`Saved ${club.name} to favorites!`);
        onFavoriteChange?.(club.id, true);
      }
    } catch (err) {
      error(err.message || 'Failed to update favorite status');
    } finally {
      setFavLoading(false);
    }
  };

  const categoryName = club.categories?.name || 'Student Club';

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl shadow-xs hover:shadow-lg hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden hover:-translate-y-0.5">
        {/* Left Thumbnail */}
        <div className="relative sm:w-64 h-48 sm:h-auto overflow-hidden bg-[#F3F1F3] dark:bg-[#222222] shrink-0">
          <img
            src={club.cover_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 to-transparent" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge variant="burgundy" size="sm" className="font-semibold shadow-xs">
              {categoryName}
            </Badge>
            {club.is_featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#151515]/90 text-[#C5A46D] border border-[#C5A46D]/40 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-[#C5A46D]" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Center Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs bg-white dark:bg-[#222222] p-0.5">
                  <img
                    src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                    alt={`${club.name} logo`}
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div>
                  <Link to={`/clubs/${club.slug || club.id}`}>
                    <h3 className="font-serif font-bold text-lg text-[#151515] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                      {club.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#800020]" />
                      {club.member_count || 0} members
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" />
                      {club.establishment_date ? `Est. ${new Date(club.establishment_date).getFullYear()}` : 'Campus Club'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Heart Button */}
              <button
                onClick={handleFavoriteClick}
                disabled={favLoading}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  favorite
                    ? 'bg-[#800020] text-white border-[#800020]'
                    : 'bg-white dark:bg-[#222222] text-[#737373] border-[#E8E3E5] dark:border-[#2E2E2E] hover:text-[#800020]'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] line-clamp-2 mt-3 leading-relaxed">
              {club.short_description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E3E5] dark:border-[#2E2E2E] flex items-center justify-between">
            <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Led by <span className="font-medium text-[#151515] dark:text-neutral-200">{club.lead_coordinator_name || 'Designated Lead'}</span>
            </span>
            <Link
              to={`/clubs/${club.slug || club.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#5C001A] text-white transition-all shadow-xs group/btn"
            >
              <span>Explore Club</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div className="group relative bg-white dark:bg-[#181818] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl shadow-xs hover:shadow-[0_16px_36px_rgba(21,21,21,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Cover Image & Favorite Badge */}
      <div className="relative h-44 w-full overflow-hidden bg-[#F3F1F3] dark:bg-[#222222]">
        <img
          src={club.cover_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Featured Badge */}
        {club.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#151515]/90 text-[#C5A46D] border border-[#C5A46D]/40 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Featured
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer
            ${
              favorite
                ? 'bg-[#800020] text-white hover:bg-[#5C001A] scale-105'
                : 'bg-white/90 dark:bg-[#151515]/90 text-[#151515] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:bg-white dark:hover:bg-[#151515]'
            }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${favorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Category Pill Over Cover with Burgundy accent */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="burgundy" size="sm" className="font-semibold shadow-xs">
            {categoryName}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Logo & Club Name */}
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8E3E5] dark:border-[#2E2E2E] shadow-xs bg-white dark:bg-[#222222] p-0.5">
              <img
                src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                alt={`${club.name} logo`}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div>
              <Link to={`/clubs/${club.slug || club.id}`}>
                <h3 className="font-serif font-bold text-base text-[#151515] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors line-clamp-1">
                  {club.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#800020]" />
                <span>{club.member_count || 0} active members</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] line-clamp-2 leading-relaxed">
            {club.short_description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-[#E8E3E5] dark:border-[#2E2E2E] flex items-center justify-between">
          <span className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3]">
            {club.establishment_date ? `Est. ${new Date(club.establishment_date).getFullYear()}` : 'Campus Society'}
          </span>
          <Link
            to={`/clubs/${club.slug || club.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4E7EC] dark:bg-[#800020]/25 text-[#800020] dark:text-[#D9A0AE] hover:bg-[#800020] hover:text-white dark:hover:bg-[#800020] dark:hover:text-white text-xs font-bold transition-all group/link"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
