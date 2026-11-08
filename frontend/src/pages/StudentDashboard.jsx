import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Compass,
  Heart,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
  ArrowRight,
  Trash2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiService } from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Badge from '../components/common/Badge.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';

export const StudentDashboard = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [memberships, setMemberships] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    student_id: profile?.student_id || '',
    department: profile?.department || '',
    year_of_study: profile?.year_of_study || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Leave Club Modal
  const [leaveClubId, setLeaveClubId] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [memRes, favRes, evtRes, annRes] = await Promise.all([
        apiService.memberships.getMy(),
        apiService.favorites.getMy(),
        apiService.events.getAll({ userId: user?.id }),
        apiService.announcements.getAll({ limit: 5 }),
      ]);

      if (memRes.success) setMemberships(memRes.data);
      if (favRes.success) setFavorites(favRes.data);
      if (evtRes.success) setEvents(evtRes.data.filter((e) => e.isRegistered));
      if (annRes.success) setAnnouncements(annRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleLeaveConfirm = async () => {
    if (!leaveClubId) return;
    try {
      await apiService.memberships.leave(leaveClubId);
      success('Club membership cancelled.');
      setLeaveModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      error(err.message || 'Failed to leave club.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      success('Profile details updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const approvedMemberships = memberships.filter((m) => m.status === 'approved');
  const pendingMemberships = memberships.filter((m) => m.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner with Burgundy Luxury Styling */}
      <div className="relative rounded-3xl bg-[#800020] p-8 sm:p-10 text-white shadow-xl overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5C001A] rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none" />
        <div className="flex items-center gap-5 relative z-10">
          <img
            src={
              profile?.avatar_url ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                profile?.full_name || 'Student'
              )}`
            }
            alt={profile?.full_name}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#E6D3B1]/60 bg-white/20 object-cover shadow-lg"
          />
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#E6D3B1]">
              Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              Welcome back, {profile?.full_name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-rose-100/90 font-sans">
              {profile?.department || 'Department Not Set'} • {profile?.year_of_study || 'Year Not Set'}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2 relative z-10 flex-wrap">
          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-amber-950 hover:bg-amber-300 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-900" />
              <span>Admin Console</span>
            </Link>
          )}
          {profile?.role === 'club_lead' && (
            <Link
              to="/club-lead/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Club Lead Portal</span>
            </Link>
          )}
          <Link
            to="/clubs"
            style={{ color: '#800020', backgroundColor: '#FFFFFF' }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-95 group hover:bg-[#FAF9F7]"
          >
            <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" style={{ color: '#800020' }} />
            <span style={{ color: '#800020' }}>Explore Clubs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: '#800020' }} />
          </Link>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs flex items-center gap-4 hover:border-[#800020]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={approvedMemberships.length} />
            </div>
            <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase tracking-wider">
              Joined Clubs
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs flex items-center gap-4 hover:border-[#800020]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={pendingMemberships.length} />
            </div>
            <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase tracking-wider">
              Pending Requests
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs flex items-center gap-4 hover:border-[#800020]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={favorites.length} />
            </div>
            <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase tracking-wider">
              Saved Favorites
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs flex items-center gap-4 hover:border-[#800020]/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#FAF5EC] dark:bg-[#C5A46D]/20 text-[#8F6B2A] dark:text-[#E6D3B1] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
              <AnimatedCounter value={events.length} />
            </div>
            <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase tracking-wider">
              Registered Events
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5E5E5] dark:border-[#383838] overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'clubs', label: `My Clubs (${memberships.length})` },
            { id: 'favorites', label: `Favorites (${favorites.length})` },
            { id: 'events', label: `My Events (${events.length})` },
            { id: 'settings', label: 'Edit Profile Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#800020] text-[#800020] dark:border-[#C2185B] dark:text-[#FAF9F7]'
                  : 'border-transparent text-[#737373] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:text-[#FAF9F7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Joined Clubs Quick Preview */}
              <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    My Active Memberships
                  </h3>
                  <button
                    onClick={() => setActiveTab('clubs')}
                    className="text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {approvedMemberships.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">
                    You haven't been approved in any clubs yet.{' '}
                    <Link to="/clubs" className="text-[#800020] dark:text-[#D9A0AE] hover:underline font-semibold">
                      Explore and apply to clubs!
                    </Link>
                  </p>
                ) : (
                  <div className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
                    {approvedMemberships.slice(0, 3).map((m) => (
                      <div key={m.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.clubs?.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                            alt={m.clubs?.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E5E5E5] dark:border-[#383838]"
                          />
                          <div>
                            <Link
                              to={`/clubs/${m.clubs?.slug || m.clubs?.id}`}
                              className="font-serif font-bold text-sm text-[#111111] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE]"
                            >
                              {m.clubs?.name}
                            </Link>
                            <span className="block text-xs text-[#737373]">
                              Joined {new Date(m.joined_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">
                          Approved Member
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registered Events */}
              <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    My Registered Events
                  </h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {events.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">
                    No event registrations found.{' '}
                    <Link to="/events" className="text-[#800020] dark:text-[#D9A0AE] hover:underline font-semibold">
                      Check upcoming campus events!
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-3">
                    {events.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                            {evt.title}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {evt.event_date} • {evt.venue}
                          </span>
                        </div>
                        <Badge variant="primary" size="sm">
                          Confirmed
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Announcements Feed */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Campus Club Notices
                </h3>
                {announcements.length === 0 ? (
                  <p className="text-xs text-gray-400">No recent notices.</p>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((a) => (
                      <div
                        key={a.id}
                        className="p-3.5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-100 dark:border-gray-700/60 space-y-1"
                      >
                        <span className="text-[10px] font-bold text-[#800020] dark:text-[#D9A0AE]">
                          {a.clubs?.name || 'Club Announcement'}
                        </span>
                        <h4 className="font-semibold text-xs text-gray-900 dark:text-white">
                          {a.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {a.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY CLUBS */}
        {activeTab === 'clubs' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                All Club Memberships & Requests
              </h3>

              {memberships.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-gray-500">
                    You have not submitted membership requests for any club yet.
                  </p>
                  <Link to="/clubs">
                    <Button variant="primary" size="sm">
                      Browse Clubs
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {memberships.map((m) => (
                    <div
                      key={m.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={m.clubs?.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80'}
                          alt={m.clubs?.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <Link
                            to={`/clubs/${m.clubs?.slug || m.clubs?.id}`}
                            className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE]"
                          >
                            {m.clubs?.name}
                          </Link>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {m.clubs?.short_description}
                          </p>
                          <span className="text-[11px] text-gray-400">
                            Requested {new Date(m.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {m.status === 'approved' && (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approved
                          </Badge>
                        )}
                        {m.status === 'pending' && (
                          <Badge variant="warning" size="sm">
                            <Clock className="w-3.5 h-3.5 mr-1" /> Pending Approval
                          </Badge>
                        )}
                        {m.status === 'rejected' && (
                          <Badge variant="danger" size="sm">
                            <AlertCircle className="w-3.5 h-3.5 mr-1" /> Request Declined
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => {
                            setLeaveClubId(m.club_id);
                            setLeaveModalOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Leave
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Saved Favorite Clubs
              </h3>

              {favorites.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  You haven't bookmarked any favorite clubs yet. Click the heart icon on any club card!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((club) => (
                    <div
                      key={club.id}
                      className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={club.logo_url}
                          alt={club.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <Link
                            to={`/clubs/${club.slug || club.id}`}
                            className="font-serif font-bold text-sm text-[#111111] dark:text-[#FAF9F7] hover:text-[#800020] dark:hover:text-[#D9A0AE] line-clamp-1"
                          >
                            {club.name}
                          </Link>
                          <span className="text-xs text-[#737373]">
                            {club.member_count} members
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] dark:border-[#383838]">
                        <Link
                          to={`/clubs/${club.slug || club.id}`}
                          className="text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={async () => {
                            await apiService.favorites.remove(club.id);
                            success('Removed from favorites.');
                            fetchDashboardData();
                          }}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MY EVENTS */}
        {activeTab === 'events' && (
          <div className="bg-white dark:bg-dark-card border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#111111] dark:text-[#FAF9F7]">
              My Registered Events
            </h3>
            {events.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                You are not registered for any upcoming events.
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-[#E5E5E5] dark:border-[#383838] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7]">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#737373] mt-0.5">
                        {evt.event_date} • {evt.start_time} - {evt.end_time || 'Late'} • {evt.venue}
                      </p>
                      <span className="text-xs text-[#800020] dark:text-[#D9A0AE] font-semibold mt-1 inline-block">
                        Hosted by {evt.clubs?.name}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await apiService.events.unregister(evt.id);
                        success('Registration cancelled.');
                        fetchDashboardData();
                      }}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EDIT PROFILE */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Student Profile
              </h3>
              <p className="text-xs text-gray-500">
                Update your contact information, student ID, and campus department.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Student ID"
                  value={profileForm.student_id}
                  onChange={(e) => setProfileForm({ ...profileForm, student_id: e.target.value })}
                  placeholder="e.g. STU-2026-092"
                />
                <Input
                  label="Phone Number"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Department"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
                <Input
                  label="Year of Study"
                  value={profileForm.year_of_study}
                  onChange={(e) => setProfileForm({ ...profileForm, year_of_study: e.target.value })}
                  placeholder="e.g. 3rd Year"
                />
              </div>

              <Input
                label="Avatar URL (Image link)"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                placeholder="https://..."
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Student Bio / Interests
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-[10px] text-sm p-3 bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#111111] dark:text-[#FAF9F7]"
                  placeholder="Share a short bio or interests..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={savingProfile}
              >
                Save Profile Changes
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Leaving Club */}
      <ConfirmationDialog
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
        title="Leave Club Confirmation"
        message="Are you sure you want to withdraw or leave this club?"
        confirmText="Confirm"
        isDestructive={true}
      />
    </div>
  );
};
export default StudentDashboard;

