import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, ArrowRight } from 'lucide-react';
import Badge from './Badge.jsx';
import Button from './Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { apiService } from '../../services/api.js';

export const EventCard = ({ event, onRegistrationChange }) => {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const [isRegistered, setIsRegistered] = useState(event.isRegistered || false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      info('Please log in to register for events.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistered) {
        await apiService.events.unregister(event.id);
        setIsRegistered(false);
        success(`Cancelled registration for "${event.title}".`);
        onRegistrationChange?.(event.id, false);
      } else {
        await apiService.events.register(event.id);
        setIsRegistered(true);
        success(`Successfully registered for "${event.title}"!`);
        onRegistrationChange?.(event.id, true);
      }
    } catch (err) {
      error(err.message || 'Failed to update event registration.');
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-glow-indigo/15 hover:border-brand-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Banner */}
        <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={event.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Date Tag */}
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md text-center">
            <span className="block text-[10px] font-bold tracking-wider uppercase text-brand-600 dark:text-brand-400">
              {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="block text-base font-extrabold text-gray-900 dark:text-white leading-none">
              {new Date(event.event_date).getDate()}
            </span>
          </div>

          {/* Club Pill */}
          {event.clubs && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                {event.clubs.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Details */}
          <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{event.start_time ? `${event.start_time} - ${event.end_time || 'Late'}` : 'Time announced soon'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 pt-0">
        <Button
          variant={isRegistered ? 'outline' : 'primary'}
          size="sm"
          className="w-full"
          onClick={handleRegister}
          isLoading={loading}
          leftIcon={isRegistered ? <Check className="w-4 h-4 text-emerald-500" /> : undefined}
        >
          {isRegistered ? 'Registered (Click to Cancel)' : 'Register for Event'}
        </Button>
      </div>
    </div>
  );
};
export default EventCard;
