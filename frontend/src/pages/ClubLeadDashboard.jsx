import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  Calendar,
  Bell,
  Activity,
  UserCheck,
  Settings,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  FileText,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiService } from '../services/api.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';

export const ClubLeadDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Club Data & Real Stats
  const [club, setClub] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    upcomingEvents: 0,
    totalEvents: 0,
    totalAnnouncements: 0,
  });

  // Entities
  const [members, setMembers] = useState([]);
  const [membershipFilter, setMembershipFilter] = useState('pending');
  const [memberSearch, setMemberSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);

  // Club Information Form State
  const [clubForm, setClubForm] = useState({
    short_description: '',
    full_description: '',
    mission: '',
    activities_and_achievements: '',
    contact_email: '',
    faculty_coordinator: '',
    student_coordinator: '',
    logo_url: '',
    cover_image_url: '',
  });
  const [updatingClub, setUpdatingClub] = useState(false);

  // Event Modal & Form State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '10:00:00',
    end_time: '12:00:00',
    venue: '',
    banner_url: '',
    registration_url: '',
    max_participants: 100,
    status: 'upcoming',
  });

  // Event Registrations Modal
  const [registrationsModalOpen, setRegistrationsModalOpen] = useState(false);
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Announcement Modal & Form State
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });

  // Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  // Fetch complete dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await apiService.clubLead.getDashboard();
      if (res.success && res.data) {
        setClub(res.data.club);
        setStats(res.data.stats);
        setClubForm({
          short_description: res.data.club?.short_description || '',
          full_description: res.data.club?.full_description || '',
          mission: res.data.club?.mission || '',
          activities_and_achievements: res.data.club?.activities_and_achievements || '',
          contact_email: res.data.club?.contact_email || '',
          faculty_coordinator: res.data.club?.faculty_coordinator || '',
          student_coordinator: res.data.club?.student_coordinator || '',
          logo_url: res.data.club?.logo_url || '',
          cover_image_url: res.data.club?.cover_image_url || '',
        });
      }

      // Concurrently load detailed lists
      const [membersRes, eventsRes, annRes, actRes] = await Promise.all([
        apiService.clubLead.getMembers(),
        apiService.clubLead.getEvents(),
        apiService.clubLead.getAnnouncements(),
        apiService.clubLead.getActivity(),
      ]);

      if (membersRes.success) setMembers(membersRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (annRes.success) setAnnouncements(annRes.data);
      if (actRes.success) setActivities(actRes.data);
    } catch (err) {
      console.error('Failed to load Club Lead dashboard:', err);
      error(err.message || 'Failed to load assigned club data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ------------------------------------------------------------------
  // CLUB INFORMATION HANDLERS
  // ------------------------------------------------------------------
  const handleSaveClubInfo = async (e) => {
    e.preventDefault();
    setUpdatingClub(true);
    try {
      const res = await apiService.clubLead.updateClub(clubForm);
      if (res.success) {
        success('Club information successfully updated!');
        setClub(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to update club information.');
    } finally {
      setUpdatingClub(false);
    }
  };

  // ------------------------------------------------------------------
  // MEMBERSHIP REQUESTS & MEMBERS HANDLERS
  // ------------------------------------------------------------------
  const handleUpdateMembershipStatus = async (membershipId, newStatus) => {
    try {
      const res = await apiService.clubLead.updateMembershipStatus(membershipId, newStatus);
      if (res.success) {
        success(`Membership request ${newStatus}!`);
        // Refresh members and dashboard stats
        const [updatedMembers, updatedDash] = await Promise.all([
          apiService.clubLead.getMembers(),
          apiService.clubLead.getDashboard(),
        ]);
        if (updatedMembers.success) setMembers(updatedMembers.data);
        if (updatedDash.success) setStats(updatedDash.data.stats);
      }
    } catch (err) {
      error(err.message || `Failed to update membership to ${newStatus}.`);
    }
  };

  const handleRemoveMember = (membership) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Member',
      message: `Are you sure you want to remove ${membership.profiles?.full_name || 'this student'} from ${club?.name}?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiService.clubLead.removeMember(membership.id);
          if (res.success) {
            success('Member successfully removed from club.');
            setMembers((prev) => prev.filter((m) => m.id !== membership.id));
            setStats((prev) => ({ ...prev, totalMembers: Math.max(0, prev.totalMembers - 1) }));
          }
        } catch (err) {
          error(err.message || 'Failed to remove member.');
        }
      },
    });
  };

  // ------------------------------------------------------------------
  // EVENTS MANAGEMENT HANDLERS
  // ------------------------------------------------------------------
  const handleOpenEventModal = (eventToEdit = null) => {
    if (eventToEdit) {
      setEditingEvent(eventToEdit);
      setEventForm({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        event_date: eventToEdit.event_date || '',
        start_time: eventToEdit.start_time || '10:00:00',
        end_time: eventToEdit.end_time || '12:00:00',
        venue: eventToEdit.venue || '',
        banner_url: eventToEdit.banner_url || '',
        registration_url: eventToEdit.registration_url || '',
        max_participants: eventToEdit.max_participants || 100,
        status: eventToEdit.status || 'upcoming',
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        start_time: '10:00:00',
        end_time: '12:00:00',
        venue: 'Campus Innovation Center',
        banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        registration_url: '',
        max_participants: 100,
        status: 'upcoming',
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await apiService.clubLead.updateEvent(editingEvent.id, eventForm);
        if (res.success) {
          success('Event updated successfully!');
          setEvents((prev) => prev.map((ev) => (ev.id === editingEvent.id ? res.data : ev)));
          setEventModalOpen(false);
        }
      } else {
        const res = await apiService.clubLead.createEvent(eventForm);
        if (res.success) {
          success('New club event created successfully!');
          setEvents((prev) => [res.data, ...prev]);
          setStats((prev) => ({
            ...prev,
            totalEvents: prev.totalEvents + 1,
            upcomingEvents: prev.upcomingEvents + 1,
          }));
          setEventModalOpen(false);
        }
      }
    } catch (err) {
      error(err.message || 'Failed to save event.');
    }
  };

  const handleDeleteEvent = (eventToDelete) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Event',
      message: `Are you sure you want to delete "${eventToDelete.title}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiService.clubLead.deleteEvent(eventToDelete.id);
          if (res.success) {
            success('Event deleted successfully.');
            setEvents((prev) => prev.filter((ev) => ev.id !== eventToDelete.id));
            setStats((prev) => ({
              ...prev,
              totalEvents: Math.max(0, prev.totalEvents - 1),
              upcomingEvents: eventToDelete.status === 'upcoming' ? Math.max(0, prev.upcomingEvents - 1) : prev.upcomingEvents,
            }));
          }
        } catch (err) {
          error(err.message || 'Failed to delete event.');
        }
      },
    });
  };

  const handleViewRegistrations = async (eventObj) => {
    setSelectedEventForRegistrations(eventObj);
    setRegistrationsModalOpen(true);
    setLoadingRegistrations(true);
    try {
      const res = await apiService.clubLead.getEventRegistrations(eventObj.id);
      if (res.success && res.data) {
        setEventRegistrations(res.data.registrations || []);
      }
    } catch (err) {
      error(err.message || 'Failed to load event registrations.');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // ------------------------------------------------------------------
  // ANNOUNCEMENTS HANDLERS
  // ------------------------------------------------------------------
  const handleOpenAnnouncementModal = (annToEdit = null) => {
    if (annToEdit) {
      setEditingAnnouncement(annToEdit);
      setAnnouncementForm({
        title: annToEdit.title || '',
        content: annToEdit.content || '',
      });
    } else {
      setEditingAnnouncement(null);
      setAnnouncementForm({
        title: '',
        content: '',
      });
    }
    setAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        const res = await apiService.clubLead.updateAnnouncement(editingAnnouncement.id, announcementForm);
        if (res.success) {
          success('Announcement updated!');
          setAnnouncements((prev) => prev.map((a) => (a.id === editingAnnouncement.id ? res.data : a)));
          setAnnouncementModalOpen(false);
        }
      } else {
        const res = await apiService.clubLead.createAnnouncement(announcementForm);
        if (res.success) {
          success('Announcement published successfully!');
          setAnnouncements((prev) => [res.data, ...prev]);
          setStats((prev) => ({ ...prev, totalAnnouncements: prev.totalAnnouncements + 1 }));
          setAnnouncementModalOpen(false);
        }
      }
    } catch (err) {
      error(err.message || 'Failed to save announcement.');
    }
  };

  const handleDeleteAnnouncement = (annToDelete) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Announcement',
      message: `Are you sure you want to delete "${annToDelete.title}"?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await apiService.clubLead.deleteAnnouncement(annToDelete.id);
          if (res.success) {
            success('Announcement removed.');
            setAnnouncements((prev) => prev.filter((a) => a.id !== annToDelete.id));
            setStats((prev) => ({ ...prev, totalAnnouncements: Math.max(0, prev.totalAnnouncements - 1) }));
          }
        } catch (err) {
          error(err.message || 'Failed to delete announcement.');
        }
      },
    });
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesFilter = membershipFilter === 'all' || m.status === membershipFilter;
    const matchesSearch =
      !memberSearch ||
      m.profiles?.full_name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.profiles?.email?.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.profiles?.student_id?.toLowerCase().includes(memberSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = members.filter((m) => m.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#800020]/10 border border-[#800020]/30 flex items-center justify-center animate-spin">
          <Compass className="w-6 h-6 text-[#800020]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
          Loading Assigned Club Management Console...
        </p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#111111] dark:text-[#FAF9F7]">
            No Club Assigned
          </h2>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            Your account is designated as a <strong>Club Lead</strong>, but no active collegiate organization has been assigned to you yet by the Campus Administrator.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-full mt-4">
              Return to Student Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HERO BANNER: ASSIGNED CLUB HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3B0010] via-[#5C001A] to-[#800020] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none">
          <img
            src={club.cover_image_url || club.logo_url}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={club.logo_url}
              alt={club.name}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/20 bg-white/10 object-cover shrink-0 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-[#FAF9F7] backdrop-blur-sm border border-white/20">
                  <Compass className="w-3 h-3 text-[#C5A46D]" /> Club Lead Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A46D]/20 text-[#E6D3B1] border border-[#C5A46D]/40">
                  {club.categories?.name || 'Student Society'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {club.name}
              </h1>
              <p className="text-xs text-rose-100/80 max-w-xl line-clamp-1">
                {club.short_description}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#E6D3B1] pt-1">
                <span>Lead: <strong>{profile?.full_name}</strong></span>
                <span>•</span>
                <span>Contact: {club.contact_email || profile?.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Link to={`/clubs/${club.slug}`} target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                View Public Page
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              className="bg-white !text-[#800020] hover:bg-white/90 font-bold"
              leftIcon={<Plus className="w-4 h-4 text-[#800020]" />}
              onClick={() => handleOpenEventModal()}
            >
              New Event
            </Button>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-[#E5E5E5] dark:border-[#383838] overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'info', label: 'Club Information', icon: Settings },
          { id: 'requests', label: `Membership Requests (${pendingCount})`, icon: UserCheck, alert: pendingCount > 0 },
          { id: 'members', label: `Members (${stats.totalMembers})`, icon: Users },
          { id: 'events', label: `Events (${stats.totalEvents})`, icon: Calendar },
          { id: 'announcements', label: `Announcements (${stats.totalAnnouncements})`, icon: Bell },
          { id: 'activity', label: 'Activity Log', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF]/60 dark:hover:bg-[#800020]/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & STATS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.totalMembers} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Active Members
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400">
                <AnimatedCounter value={stats.pendingRequests} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Pending Requests
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.upcomingEvents} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Upcoming Events
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.totalEvents} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Total Events
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.totalAnnouncements} />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                Announcements
              </div>
            </div>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D9A0AE]">
                  Membership Queue
                </span>
                <Badge variant={pendingCount > 0 ? 'warning' : 'default'} size="sm">
                  {pendingCount} Pending
                </Badge>
              </div>
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAF9F7]">
                Review Student Applications
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                Approve or reject prospective student members who requested to join {club.name}.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMembershipFilter('pending');
                  setActiveTab('requests');
                }}
              >
                Review Requests ({pendingCount})
              </Button>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D9A0AE]">
                  Events Coordinator
                </span>
                <Badge variant="primary" size="sm">
                  {stats.upcomingEvents} Upcoming
                </Badge>
              </div>
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAF9F7]">
                Host Campus Events
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                Schedule workshops, hackathons, meetings, or social tournaments for your members.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleOpenEventModal()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Create Event
              </Button>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#800020] dark:text-[#D9A0AE]">
                  Communications
                </span>
                <Badge variant="default" size="sm">
                  {stats.totalAnnouncements} Broadcasts
                </Badge>
              </div>
              <h3 className="text-base font-bold text-[#111111] dark:text-[#FAF9F7]">
                Post Club Announcements
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
                Notify members of recruitment drives, weekly agendas, venue updates, or deadlines.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleOpenAnnouncementModal()}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Post Announcement
              </Button>
            </div>
          </div>

          {/* Recent Club Activity Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111111] dark:text-[#FAF9F7]">
                  Recent Activity for {club.name}
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                  Real-time timeline of registrations, membership actions, and events.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-bold text-[#800020] dark:text-[#D9A0AE] hover:underline flex items-center gap-1"
              >
                View Complete Log <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#737373] dark:text-[#A3A3A3]">
                No recent activity logged for this club.
              </div>
            ) : (
              <div className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
                {activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#800020] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#111111] dark:text-[#FAF9F7]">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        {act.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#737373] whitespace-nowrap">
                      {new Date(act.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: CLUB INFORMATION & SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'info' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
              Manage {club.name} Information
            </h3>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Update your organization's mission statement, contact email, coordinators, and brand assets.
            </p>
          </div>

          <form onSubmit={handleSaveClubInfo} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] mb-1">
                  Club Name (Read-Only)
                </label>
                <input
                  type="text"
                  value={club.name}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#383838] bg-[#F5F5F5] dark:bg-[#262626] text-xs font-semibold text-[#737373] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] mb-1">
                  Category (Managed by Admin)
                </label>
                <input
                  type="text"
                  value={club.categories?.name || 'Standard Organization'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#383838] bg-[#F5F5F5] dark:bg-[#262626] text-xs font-semibold text-[#737373] cursor-not-allowed"
                />
              </div>
            </div>

            <Input
              label="Short Tagline Description"
              value={clubForm.short_description}
              onChange={(e) => setClubForm({ ...clubForm, short_description: e.target.value })}
              placeholder="A brief 1-sentence introduction to the club"
              required
            />

            <Textarea
              label="Full Club Description"
              value={clubForm.full_description}
              onChange={(e) => setClubForm({ ...clubForm, full_description: e.target.value })}
              rows={4}
              placeholder="Comprehensive description of the club, core pillars, and activities..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Mission Statement"
                value={clubForm.mission}
                onChange={(e) => setClubForm({ ...clubForm, mission: e.target.value })}
                rows={3}
                placeholder="The driving mission and collegiate purpose of the club..."
              />

              <Textarea
                label="Activities & Achievements"
                value={clubForm.activities_and_achievements}
                onChange={(e) => setClubForm({ ...clubForm, activities_and_achievements: e.target.value })}
                rows={3}
                placeholder="Key accomplishments, regular workshops, competitions, trophies..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Official Club Email"
                type="email"
                value={clubForm.contact_email}
                onChange={(e) => setClubForm({ ...clubForm, contact_email: e.target.value })}
                placeholder="club@campus.edu"
              />
              <Input
                label="Student Coordinator"
                value={clubForm.student_coordinator}
                onChange={(e) => setClubForm({ ...clubForm, student_coordinator: e.target.value })}
                placeholder="e.g. Alex Morgan"
              />
              <Input
                label="Faculty Coordinator"
                value={clubForm.faculty_coordinator}
                onChange={(e) => setClubForm({ ...clubForm, faculty_coordinator: e.target.value })}
                placeholder="e.g. Dr. Robert Chen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Logo Image URL"
                value={clubForm.logo_url}
                onChange={(e) => setClubForm({ ...clubForm, logo_url: e.target.value })}
                placeholder="https://... logo image link"
              />
              <Input
                label="Cover Image Banner URL"
                value={clubForm.cover_image_url}
                onChange={(e) => setClubForm({ ...clubForm, cover_image_url: e.target.value })}
                placeholder="https://... 16:9 banner link"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={updatingClub}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Save Club Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: MEMBERSHIP REQUESTS (APPROVE / REJECT) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
                Membership Requests ({members.filter((m) => m.status === 'pending').length} Pending)
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Review student applications specifically for {club.name}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl bg-[#FAF9F7] dark:bg-[#292929] border border-[#E5E5E5] dark:border-[#383838] p-1">
                {['pending', 'approved', 'rejected', 'all'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setMembershipFilter(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      membershipFilter === st
                        ? 'bg-[#800020] text-white'
                        : 'text-[#737373] hover:text-[#111111] dark:text-[#A3A3A3]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-md">
            <Input
              placeholder="Search applicants by name, email, or student ID..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
            />
          </div>

          {/* Requests Table */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#E5E5E5] dark:border-[#383838] rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-[#737373] mx-auto" />
              <p className="text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
                No membership records found
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                There are no {membershipFilter !== 'all' ? membershipFilter : ''} requests matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F7] dark:bg-[#262626] uppercase text-[#737373] dark:text-[#A3A3A3] font-bold border-b border-[#E5E5E5] dark:border-[#383838]">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Requested On</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FAF9F7] dark:hover:bg-[#262626]/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={
                            m.profiles?.avatar_url ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              m.profiles?.full_name || 'Student'
                            )}`
                          }
                          alt={m.profiles?.full_name}
                          className="w-8 h-8 rounded-lg object-cover bg-[#FCE7EF]"
                        />
                        <div>
                          <span className="font-bold text-[#111111] dark:text-[#FAF9F7] block">
                            {m.profiles?.full_name || 'Anonymous Student'}
                          </span>
                          <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                            {m.profiles?.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-[#737373] dark:text-[#A3A3A3]">
                        {m.profiles?.student_id || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-[#737373] dark:text-[#A3A3A3]">
                        {m.profiles?.department || 'General'} • {m.profiles?.year_of_study || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-[#737373] dark:text-[#A3A3A3]">
                        {new Date(m.joined_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            m.status === 'approved'
                              ? 'success'
                              : m.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {m.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {m.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateMembershipStatus(m.id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateMembershipStatus(m.id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : m.status === 'approved' ? (
                          <button
                            onClick={() => handleRemoveMember(m)}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateMembershipStatus(m.id, 'approved')}
                            className="text-xs text-[#800020] hover:underline"
                          >
                            Re-Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: CLUB MEMBERS DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'members' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
                Approved Club Members ({members.filter((m) => m.status === 'approved').length})
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Full roster of active collegiate members belonging to {club.name}.
              </p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
              />
            </div>
          </div>

          {members.filter((m) => m.status === 'approved').length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#E5E5E5] dark:border-[#383838] rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-[#737373] mx-auto" />
              <p className="text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
                No approved members yet
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Students who apply to join will appear in your Membership Requests queue.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F7] dark:bg-[#262626] uppercase text-[#737373] dark:text-[#A3A3A3] font-bold border-b border-[#E5E5E5] dark:border-[#383838]">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Department & Year</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
                  {members
                    .filter((m) => m.status === 'approved')
                    .filter(
                      (m) =>
                        !memberSearch ||
                        m.profiles?.full_name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        m.profiles?.email?.toLowerCase().includes(memberSearch.toLowerCase())
                    )
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-[#FAF9F7] dark:hover:bg-[#262626]/50">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={
                              m.profiles?.avatar_url ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                m.profiles?.full_name || 'Member'
                              )}`
                            }
                            alt={m.profiles?.full_name}
                            className="w-8 h-8 rounded-lg object-cover bg-[#FCE7EF]"
                          />
                          <div>
                            <span className="font-bold text-[#111111] dark:text-[#FAF9F7] block">
                              {m.profiles?.full_name}
                            </span>
                            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                              {m.profiles?.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-[#737373] dark:text-[#A3A3A3]">
                          {m.profiles?.student_id || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-[#737373] dark:text-[#A3A3A3]">
                          {m.profiles?.department || 'General'} • {m.profiles?.year_of_study || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-[#737373] dark:text-[#A3A3A3]">
                          {new Date(m.joined_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRemoveMember(m)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: EVENTS MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'events' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
                Club Events ({events.length})
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Manage public and member events hosted exclusively by {club.name}.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => handleOpenEventModal()}
            >
              Create New Event
            </Button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#E5E5E5] dark:border-[#383838] rounded-2xl space-y-2">
              <Calendar className="w-8 h-8 text-[#737373] mx-auto" />
              <p className="text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
                No events scheduled yet
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Create your first workshop, hackathon, or general body meeting.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEventModal()}
                className="mt-2"
              >
                Create Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-2xl border border-[#E5E5E5] dark:border-[#383838] overflow-hidden bg-white dark:bg-[#1C1C1C] shadow-xs flex flex-col hover:border-[#800020]/30 transition-all"
                >
                  <div className="h-36 relative overflow-hidden bg-[#FAF9F7] dark:bg-[#262626]">
                    <img
                      src={ev.banner_url || club.cover_image_url}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <Badge
                        variant={
                          ev.status === 'upcoming'
                            ? 'success'
                            : ev.status === 'completed'
                            ? 'default'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {ev.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-[#111111] dark:text-[#FAF9F7] line-clamp-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#737373] dark:text-[#A3A3A3] line-clamp-2">
                        {ev.description}
                      </p>
                      <div className="pt-2 space-y-1 text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                          <span>{ev.event_date} ({ev.start_time || '10:00'} - {ev.end_time || '12:00'})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                          <span>{ev.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-[#111111] dark:text-[#FAF9F7]">
                          <Users className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                          <span>
                            {ev.registration_count || 0} registered (Max: {ev.max_participants || 'Unlimited'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#383838] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleViewRegistrations(ev)}
                        className="text-xs font-semibold text-[#800020] dark:text-[#D9A0AE] hover:underline"
                      >
                        Attendees
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEventModal(ev)}
                          className="p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#383838] hover:border-[#800020] text-[#737373] hover:text-[#800020]"
                          title="Edit Event"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev)}
                          className="p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#383838] hover:border-rose-500 text-[#737373] hover:text-rose-600"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: ANNOUNCEMENTS MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
                Club Announcements ({announcements.length})
              </h3>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Post notices, general meeting agendas, and updates visible to your members.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => handleOpenAnnouncementModal()}
            >
              Post Announcement
            </Button>
          </div>

          {announcements.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#E5E5E5] dark:border-[#383838] rounded-2xl space-y-2">
              <Bell className="w-8 h-8 text-[#737373] mx-auto" />
              <p className="text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
                No announcements published
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Share news, weekly plans, or deadlines with your club community.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-5 rounded-2xl border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#111111] dark:text-[#FAF9F7]">
                        {ann.title}
                      </h4>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                        Posted by {ann.profiles?.full_name || 'Club Lead'} on{' '}
                        {new Date(ann.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenAnnouncementModal(ann)}
                        className="p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#383838] hover:border-[#800020] text-[#737373] hover:text-[#800020]"
                        title="Edit Announcement"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann)}
                        className="p-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#383838] hover:border-rose-500 text-[#737373] hover:text-rose-600"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#525252] dark:text-[#D4D4D4] whitespace-pre-line leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: COMPLETE ACTIVITY LOG */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'activity' && (
        <div className="bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-[#FAF9F7]">
              Complete Activity Audit Trail
            </h3>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Immutable chronological history of all memberships, events, and communications for {club.name}.
            </p>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#E5E5E5] dark:border-[#383838] rounded-2xl text-xs text-[#737373]">
              No activity logs recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
              {activities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#FCE7EF] dark:bg-[#800020]/30 text-[#800020] dark:text-[#D9A0AE] flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#111111] dark:text-[#FAF9F7]">
                      {act.title}
                    </p>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      {act.description}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#737373] shrink-0">
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EVENT MODAL (CREATE / EDIT) */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title={editingEvent ? `Edit Event: ${editingEvent.title}` : `Create Event for ${club.name}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <Input
            label="Event Title"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            placeholder="e.g. Annual Design Thinking Workshop"
            required
          />

          <Textarea
            label="Event Description"
            value={eventForm.description}
            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            rows={3}
            placeholder="Detailed schedule, speakers, takeaways, prerequisites..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Event Date"
              type="date"
              value={eventForm.event_date}
              onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
              required
            />
            <Input
              label="Start Time"
              type="time"
              value={eventForm.start_time}
              onChange={(e) => setEventForm({ ...eventForm, start_time: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={eventForm.end_time}
              onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Venue / Location"
              value={eventForm.venue}
              onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              placeholder="e.g. Auditorium Hall B"
              required
            />
            <Input
              label="Max Participant Capacity"
              type="number"
              value={eventForm.max_participants}
              onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })}
              placeholder="100"
            />
          </div>

          <Input
            label="Banner Poster Image URL"
            value={eventForm.banner_url}
            onChange={(e) => setEventForm({ ...eventForm, banner_url: e.target.value })}
            placeholder="https://... 16:9 poster URL"
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setEventModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingEvent ? 'Save Changes' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* EVENT ATTENDEES MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={registrationsModalOpen}
        onClose={() => setRegistrationsModalOpen(false)}
        title={`Registered Attendees: ${selectedEventForRegistrations?.title || ''}`}
        maxWidth="max-w-2xl"
      >
        {loadingRegistrations ? (
          <div className="py-8 text-center text-xs text-[#737373]">
            Loading attendee registrations...
          </div>
        ) : eventRegistrations.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#737373]">
            No student registrations recorded yet for this event.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Total Confirmed Attendees: <strong>{eventRegistrations.length}</strong>
            </div>
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#383838]">
              {eventRegistrations.map((reg) => (
                <div key={reg.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#111111] dark:text-[#FAF9F7] block">
                      {reg.profiles?.full_name || 'Anonymous Student'}
                    </span>
                    <span className="text-[11px] text-[#737373]">
                      {reg.profiles?.email} • {reg.profiles?.department || 'General'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#737373]">
                    {new Date(reg.registered_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* ANNOUNCEMENT MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title={editingAnnouncement ? 'Edit Announcement' : `Post Announcement for ${club.name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <Input
            label="Announcement Title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            placeholder="e.g. Meeting Rescheduled to Room 304"
            required
          />

          <Textarea
            label="Notice Content"
            value={announcementForm.content}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
            rows={4}
            placeholder="Write the full broadcast notice for your club members..."
            required
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingAnnouncement ? 'Update Announcement' : 'Post Broadcast'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* CONFIRMATION DIALOG */}
      {/* ------------------------------------------------------------- */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </div>
  );
};

export default ClubLeadDashboard;
