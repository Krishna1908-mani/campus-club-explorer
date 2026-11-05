import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import Badge from './Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { apiService } from '../../services/api.js';

export const ClubCard = ({
  club,
  isFavorite: initialFavorite = false,
  onFavoriteChange,
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

  const categoryName = club.categories?.name || 'General Club';

  return (
    <div className="group relative bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl shadow-sm hover:shadow-[0_16px_36px_rgba(17,17,17,0.08)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Cover Image & Favorite Badge */}
      <div className="relative h-44 w-full overflow-hidden bg-[#F5F3F2] dark:bg-[#292929]">
        <img
          src={club.cover_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Featured Badge with Luxury Gold styling */}
        {club.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#111111]/90 text-[#C5A46D] border border-[#C5A46D]/40 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" /> Featured
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm
            ${
              favorite
                ? 'bg-[#800020] text-white hover:bg-[#5C001A] scale-105'
                : 'bg-white/85 dark:bg-[#111111]/85 text-[#111111] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] hover:bg-white dark:hover:bg-[#111111]'
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
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E5E5E5] dark:border-[#383838] shadow-xs bg-white dark:bg-[#292929] p-0.5">
              <img
                src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                alt={`${club.name} logo`}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div>
              <Link to={`/clubs/${club.slug || club.id}`}>
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors line-clamp-1">
                  {club.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#737373]" />
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
        <div className="mt-5 pt-4 border-t border-[#E5E5E5] dark:border-[#383838] flex items-center justify-between">
          <span className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3]">
            {club.establishment_date ? `Est. ${new Date(club.establishment_date).getFullYear()}` : 'Campus Club'}
          </span>
          <Link
            to={`/clubs/${club.slug || club.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:text-[#5C001A] dark:hover:text-white group/link transition-colors"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ClubCard;

