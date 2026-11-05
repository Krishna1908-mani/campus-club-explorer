import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Trophy,
  Palette,
  Rocket,
  Sparkles,
  Music,
  Camera,
  HeartHandshake,
  ArrowRight,
  Grid,
} from 'lucide-react';
import { apiService } from '../services/api.js';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.categories.getAll();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getIcon = (slug) => {
    switch (slug) {
      case 'coding-technology':
        return <Code2 className="w-8 h-8 text-indigo-500" />;
      case 'entrepreneurship':
        return <Rocket className="w-8 h-8 text-violet-500" />;
      case 'sports-fitness':
        return <Trophy className="w-8 h-8 text-amber-500" />;
      case 'arts-creativity':
        return <Palette className="w-8 h-8 text-pink-500" />;
      case 'music-dance':
        return <Music className="w-8 h-8 text-rose-500" />;
      case 'photography-media':
        return <Camera className="w-8 h-8 text-cyan-500" />;
      case 'social-service':
        return <HeartHandshake className="w-8 h-8 text-emerald-500" />;
      default:
        return <Sparkles className="w-8 h-8 text-brand-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          <Grid className="w-4 h-4" /> Categorized Taxonomy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Explore Interest Categories
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Choose a discipline to discover student chapters, labs, varsity clubs, and artistic groups dedicated to that domain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/clubs?category=${cat.slug}`}
            className="group p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 hover:border-brand-500/50 hover:shadow-xl dark:hover:shadow-glow-indigo/15 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(cat.slug)}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
              <span>{cat.club_count || 0} Registered Clubs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Categories;
