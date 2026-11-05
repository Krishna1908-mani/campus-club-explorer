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
  BookOpen,
  Globe,
  Gamepad2,
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
      case 'coding-tech':
      case 'coding-technology':
        return <Code2 className="w-8 h-8 text-[#800020] dark:text-[#D9A0AE]" />;
      case 'entrepreneurship':
        return <Rocket className="w-8 h-8 text-[#C5A46D]" />;
      case 'sports-fitness':
        return <Trophy className="w-8 h-8 text-[#800020] dark:text-[#FCE7EF]" />;
      case 'arts-creativity':
        return <Palette className="w-8 h-8 text-[#C2185B]" />;
      case 'music-dance':
        return <Music className="w-8 h-8 text-[#990033]" />;
      case 'literature-media':
        return <BookOpen className="w-8 h-8 text-[#800020] dark:text-[#D9A0AE]" />;
      case 'social-impact':
      case 'social-service':
        return <Globe className="w-8 h-8 text-[#15803D]" />;
      case 'gaming-strategy':
        return <Gamepad2 className="w-8 h-8 text-[#C5A46D]" />;
      case 'photography-media':
        return <Camera className="w-8 h-8 text-[#C5A46D]" />;
      default:
        return <Sparkles className="w-8 h-8 text-[#800020]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#800020] dark:text-[#D9A0AE]">
          <Grid className="w-4 h-4 text-[#800020] dark:text-[#D9A0AE]" /> Categorized Taxonomy
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
          Explore Interest Categories
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#A3A3A3] max-w-2xl font-sans">
          Choose a discipline to discover student chapters, labs, varsity clubs, and artistic groups dedicated to that domain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/clubs?category=${cat.slug}`}
            className="group p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] hover:border-[#800020]/40 dark:hover:border-[#C2185B]/40 hover:shadow-[0_16px_36px_rgba(17,17,17,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-xl bg-[#FAF9F7] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {getIcon(cat.slug)}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111111] dark:text-[#FAF9F7] group-hover:text-[#800020] dark:group-hover:text-[#D9A0AE] transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-2 line-clamp-3 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E5E5E5] dark:border-[#383838] flex items-center justify-between text-xs font-bold text-[#800020] dark:text-[#D9A0AE]">
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

