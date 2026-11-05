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
    <div className="group relative bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-glow-indigo/15 hover:border-brand-500/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Cover Image & Favorite Badge */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={club.cover_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Featured Badge */}
        {club.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Featured
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
                ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-gray-900'
            }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${favorite ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Category Pill Over Cover */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="primary" size="sm" className="bg-white/90 dark:bg-gray-950/90 text-brand-700 dark:text-brand-300 font-semibold backdrop-blur-sm border-0">
            {categoryName}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Logo & Club Name */}
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-dark-surface p-0.5">
              <img
                src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                alt={`${club.name} logo`}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <div>
              <Link to={`/clubs/${club.slug || club.id}`}>
                <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                  {club.name}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>{club.member_count || 0} active members</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {club.short_description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {club.establishment_date ? `Est. ${new Date(club.establishment_date).getFullYear()}` : 'Campus Club'}
          </span>
          <Link
            to={`/clubs/${club.slug || club.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 group/link"
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
