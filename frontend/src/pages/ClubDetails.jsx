import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Mail,
  Heart,
  ExternalLink,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Building,
  UserCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import EventCard from '../components/common/EventCard.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiService } from '../services/api.js';

export const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const res = await apiService.clubs.getByIdOrSlug(id);
      if (res.success) {
        setClub(res.data);
        setFavorite(res.data.isFavorite || false);
      }
    } catch (err) {
      error(err.message || 'Club not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubDetails();
  }, [id, isAuthenticated]);

  const handleJoinClub = async () => {
    if (!isAuthenticated) {
      info('Please sign in or create a student account to join clubs.');
      navigate('/login', { state: { from: `/clubs/${id}` } });
      return;
    }

    setJoinLoading(true);
    try {
      const res = await apiService.memberships.join(club.id);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
        success('Membership request submitted! Status is pending coordinator approval.');
        fetchClubDetails();
      }
    } catch (err) {
      error(err.message || 'Failed to submit membership request.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    try {
      await apiService.memberships.leave(club.id);
      success(`You have left ${club.name}.`);
      setLeaveModalOpen(false);
      fetchClubDetails();
    } catch (err) {
      error(err.message || 'Failed to cancel membership.');
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      info('Sign in to bookmark this club in your favorites.');
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (favorite) {
        await apiService.favorites.remove(club.id);
        setFavorite(false);
        success('Removed from favorites.');
      } else {
        await apiService.favorites.add(club.id);
        setFavorite(true);
        success('Saved to your favorite clubs!');
      }
    } catch (err) {
      error(err.message || 'Failed to update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-64 sm:h-80 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 w-1/3 rounded-xl" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 w-2/3 rounded-xl" />
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Club Not Found</h2>
        <p className="text-sm text-gray-500">The requested club profile does not exist or has been archived.</p>
        <Link to="/clubs">
          <Button variant="primary">Back to Clubs Directory</Button>
        </Link>
      </div>
    );
  }

  const membershipStatus = club.membership?.status; // 'pending' | 'approved' | 'rejected' | null
  const socialLinks = club.social_links || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/clubs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to clubs directory
      </Link>

      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-dark-card shadow-lg">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={club.cover_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80'}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Top Actions: Favorite & Share */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              disabled={favLoading}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-md ${
                favorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Content Bar */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 relative z-10">
            {/* Logo + Titles */}
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-dark-card shadow-xl bg-white dark:bg-dark-surface shrink-0">
                <img
                  src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80'}
                  alt={`${club.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {club.categories?.name || 'Student Club'}
                  </Badge>
                  {club.is_featured && (
                    <Badge variant="featured" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" /> Featured Society
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {club.name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5" /> {club.member_count} Members
                  </span>
                  {club.establishment_date && (
                    <span>• Founded {new Date(club.establishment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Membership Action Button */}
            <div className="shrink-0 flex items-center gap-3">
              {membershipStatus === 'approved' ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Active Member
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLeaveModalOpen(true)}
                  >
                    Leave Club
                  </Button>
                </div>
              ) : membershipStatus === 'pending' ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    <Clock className="w-4 h-4 text-amber-600" /> Membership Pending Approval
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLeaveModalOpen(true)}
                  >
                    Cancel Request
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleJoinClub}
                  isLoading={joinLoading}
                  leftIcon={<Users className="w-5 h-5" />}
                >
                  Join This Club
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 sm:px-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'about', label: 'Overview & Mission' },
            { id: 'events', label: `Events (${club.events?.length || 0})` },
            { id: 'announcements', label: `Announcements (${club.announcements?.length || 0})` },
            { id: 'leadership', label: 'Faculty & Coordinators' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Full Description */}
              <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  About {club.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {club.full_description}
                </p>
              </div>

              {/* Mission & Objectives */}
              {club.mission && (
                <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Mission & Core Objectives
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {club.mission}
                  </p>
                </div>
              )}

              {/* Activities & Achievements */}
              {club.activities_and_achievements && (
                <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Award className="w-5 h-5" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Key Activities & Achievements
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {club.activities_and_achievements}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Club Events & Meetups
              </h3>
              {club.events?.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl text-sm text-gray-500">
                  No events scheduled at the moment. Check back soon!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {club.events.map((evt) => (
                    <EventCard key={evt.id} event={evt} onRegistrationChange={fetchClubDetails} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Announcements
              </h3>
              {club.announcements?.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl text-sm text-gray-500">
                  No announcements published yet.
                </div>
              ) : (
                club.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="font-semibold text-brand-600 dark:text-brand-400">Official Notice</span>
                      <span>{new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">
                      {ann.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'leadership' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Club Leadership & Coordination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Faculty Advisor
                    </span>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mt-0.5">
                      {club.faculty_coordinator || 'Faculty Coordinator Not Specified'}
                    </h4>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950 flex items-center justify-center text-violet-600">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Student Lead Coordinator
                    </span>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mt-0.5">
                      {club.student_coordinator || 'Student Coordinator Not Specified'}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contact & Social Card */}
          <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Connect & Reach Out
            </h4>

            {club.contact_email && (
              <a
                href={`mailto:${club.contact_email}`}
                className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 flex items-center justify-center text-brand-600">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">{club.contact_email}</span>
              </a>
            )}

            {/* Social Media Links */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <span className="text-xs font-semibold text-gray-500">Official Channels</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-brand-600 transition-colors"
                    title="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-brand-600 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-pink-600 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:text-blue-600 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Leaving Club */}
      <ConfirmationDialog
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveClub}
        title={membershipStatus === 'pending' ? 'Cancel Membership Request?' : 'Leave Club?'}
        message={
          membershipStatus === 'pending'
            ? `Are you sure you want to withdraw your pending membership request for ${club.name}?`
            : `Are you sure you want to leave ${club.name}? You will lose access to internal announcements and club voting rights.`
        }
        confirmText={membershipStatus === 'pending' ? 'Withdraw Request' : 'Leave Club'}
        isDestructive={true}
      />
    </div>
  );
};
export default ClubDetails;
