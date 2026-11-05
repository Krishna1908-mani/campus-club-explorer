import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Compass,
  Users,
  Calendar,
  Layers,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Sparkles,
  Upload,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiService } from '../services/api.js';

export const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalStudents: 0,
    totalMemberships: 0,
    pendingRequests: 0,
    totalEvents: 0,
  });

  // Entities State
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);

  // Club Form Modal
  const [clubModalOpen, setClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [clubForm, setClubForm] = useState({
    name: '',
    category_id: '',
    short_description: '',
    full_description: '',
    mission: '',
    activities_and_achievements: '',
    faculty_coordinator: '',
    student_coordinator: '',
    contact_email: '',
    logo_url: '',
    cover_image_url: '',
    is_featured: false,
    is_active: true,
  });

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: 'Grid' });

  // Event Modal
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    club_id: '',
    title: '',
    description: '',
    event_date: '',
    start_time: '10:00',
    end_time: '12:00',
    venue: '',
    banner_url: '',
    registration_url: '',
  });

  // Announcement Modal
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    club_id: '',
    title: '',
    content: '',
  });

  // Deletion Confirmation Dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null,
    id: null,
    name: '',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        clubsRes,
        catsRes,
        memRes,
        eventsRes,
        annRes,
        studentsRes,
      ] = await Promise.all([
        apiService.admin.getStats(),
        apiService.clubs.getAll({ limit: 100 }),
        apiService.categories.getAll(),
        apiService.memberships.getAll({}),
        apiService.events.getAll({}),
        apiService.announcements.getAll({ limit: 50 }),
        apiService.admin.getStudents(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (clubsRes.success) setClubs(clubsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (memRes.success) setMemberships(memRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (annRes.success) setAnnouncements(annRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ------------------------------------------------------------------
  // CLUB CRUD ACTIONS
  // ------------------------------------------------------------------
  const handleOpenClubModal = (club = null) => {
    if (club) {
      setEditingClub(club);
      setClubForm({
        name: club.name || '',
        category_id: club.category_id || '',
        short_description: club.short_description || '',
        full_description: club.full_description || '',
        mission: club.mission || '',
        activities_and_achievements: club.activities_and_achievements || '',
        faculty_coordinator: club.faculty_coordinator || '',
        student_coordinator: club.student_coordinator || '',
        contact_email: club.contact_email || '',
        logo_url: club.logo_url || '',
        cover_image_url: club.cover_image_url || '',
        is_featured: club.is_featured ?? false,
        is_active: club.is_active ?? true,
      });
    } else {
      setEditingClub(null);
      setClubForm({
        name: '',
        category_id: categories[0]?.id || '',
        short_description: '',
        full_description: '',
        mission: '',
        activities_and_achievements: '',
        faculty_coordinator: '',
        student_coordinator: '',
        contact_email: '',
        logo_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
        cover_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
        is_featured: false,
        is_active: true,
      });
    }
    setClubModalOpen(true);
  };

  const handleSaveClub = async (e) => {
    e.preventDefault();
    try {
      if (editingClub) {
        await apiService.clubs.update(editingClub.id, clubForm);
        success('Club updated successfully!');
      } else {
        await apiService.clubs.create(clubForm);
        success('Club created successfully!');
      }
      setClubModalOpen(false);
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to save club');
    }
  };

  // ------------------------------------------------------------------
  // CATEGORY CRUD ACTIONS
  // ------------------------------------------------------------------
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ name: cat.name, description: cat.description || '', icon: cat.icon || 'Grid' });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', icon: 'Grid' });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await apiService.categories.update(editingCategory.id, categoryForm);
        success('Category updated successfully!');
      } else {
        await apiService.categories.create(categoryForm);
        success('Category created successfully!');
      }
      setCategoryModalOpen(false);
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to save category');
    }
  };

  // ------------------------------------------------------------------
  // MEMBERSHIP APPROVAL ACTIONS
  // ------------------------------------------------------------------
  const handleMembershipStatus = async (id, status) => {
    try {
      await apiService.memberships.updateStatus(id, status);
      success(`Membership ${status === 'approved' ? 'approved' : 'rejected'}!`);
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to update membership');
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await apiService.memberships.remove(id);
      success('Member removed.');
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to remove member');
    }
  };

  // ------------------------------------------------------------------
  // EVENT CRUD ACTIONS
  // ------------------------------------------------------------------
  const handleOpenEventModal = (evt = null) => {
    if (evt) {
      setEditingEvent(evt);
      setEventForm({
        club_id: evt.club_id,
        title: evt.title,
        description: evt.description,
        event_date: evt.event_date,
        start_time: evt.start_time || '10:00',
        end_time: evt.end_time || '12:00',
        venue: evt.venue,
        banner_url: evt.banner_url || '',
        registration_url: evt.registration_url || '',
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        club_id: clubs[0]?.id || '',
        title: '',
        description: '',
        event_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '12:00',
        venue: 'Campus Main Auditorium',
        banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        registration_url: '',
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await apiService.events.update(editingEvent.id, eventForm);
        success('Event updated successfully!');
      } else {
        await apiService.events.create(eventForm);
        success('Event created successfully!');
      }
      setEventModalOpen(false);
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to save event');
    }
  };

  // ------------------------------------------------------------------
  // ANNOUNCEMENT CRUD ACTIONS
  // ------------------------------------------------------------------
  const handleSaveAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await apiService.announcements.create(announcementForm);
      success('Announcement published successfully!');
      setAnnouncementModalOpen(false);
      setAnnouncementForm({ club_id: clubs[0]?.id || '', title: '', content: '' });
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to publish announcement');
    }
  };

  // ------------------------------------------------------------------
  // DELETE HANDLER
  // ------------------------------------------------------------------
  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog;
    try {
      if (type === 'club') await apiService.clubs.delete(id);
      if (type === 'category') await apiService.categories.delete(id);
      if (type === 'event') await apiService.events.delete(id);
      if (type === 'announcement') await apiService.announcements.delete(id);

      success(`${type} deleted successfully.`);
      setDeleteDialog({ isOpen: false, type: null, id: null, name: '' });
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
              Administrative Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Campus Club Administration
            </h1>
            <p className="text-xs text-gray-400">
              Logged in as {profile?.full_name} ({profile?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenClubModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Club
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-1">
        {[
          { id: 'stats', label: 'Overview' },
          { id: 'clubs', label: `Clubs (${clubs.length})` },
          { id: 'memberships', label: `Membership Approvals (${memberships.filter(m => m.status === 'pending').length} Pending)` },
          { id: 'events', label: `Events (${events.length})` },
          { id: 'categories', label: `Categories (${categories.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'students', label: `Students Directory (${students.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalClubs}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Total Clubs</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
              <div className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalStudents}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Registered Students</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
              <div className="text-3xl font-black text-emerald-600">{stats.totalMemberships}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Active Memberships</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center">
              <div className="text-3xl font-black text-amber-500">{stats.pendingRequests}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Pending Approvals</div>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 shadow-sm text-center col-span-2 lg:col-span-1">
              <div className="text-3xl font-black text-brand-600">{stats.totalEvents}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase mt-1">Total Events</div>
            </div>
          </div>

          {/* Pending Memberships Quick Action Card */}
          {memberships.filter((m) => m.status === 'pending').length > 0 && (
            <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Action Required: {memberships.filter((m) => m.status === 'pending').length} Student Membership Requests Pending
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Review and approve student applicants to grant them full access.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab('memberships')}
              >
                Review Requests
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE CLUBS */}
      {activeTab === 'clubs' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              All College Clubs ({clubs.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenClubModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Club
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-dark-surface text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Members</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {clubs.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={c.logo_url}
                        alt={c.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {c.name}
                        </span>
                        <span className="text-xs text-gray-400">{c.contact_email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                      {c.categories?.name || 'General'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      {c.member_count}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.is_featured && <Badge variant="featured" size="sm" className="mr-1">Featured</Badge>}
                      {c.is_active ? <Badge variant="success" size="sm">Active</Badge> : <Badge variant="danger" size="sm">Inactive</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenClubModal(c)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit Club"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            type: 'club',
                            id: c.id,
                            name: c.name,
                          })
                        }
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Club"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEMBERSHIPS MANAGEMENT */}
      {activeTab === 'memberships' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Membership Requests & Approvals
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-dark-surface text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">Applicant Student</th>
                  <th className="py-3 px-4">Club Applied To</th>
                  <th className="py-3 px-4">Requested On</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {memberships.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white block">
                        {m.profiles?.full_name || 'Student'}
                      </span>
                      <span className="text-xs text-gray-400">{m.profiles?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800 dark:text-gray-200">
                      {m.clubs?.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {new Date(m.joined_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {m.status === 'approved' && <Badge variant="success" size="sm">Approved</Badge>}
                      {m.status === 'pending' && <Badge variant="warning" size="sm">Pending</Badge>}
                      {m.status === 'rejected' && <Badge variant="danger" size="sm">Rejected</Badge>}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {m.status !== 'approved' && (
                        <button
                          onClick={() => handleMembershipStatus(m.id, 'approved')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        >
                          Approve
                        </button>
                      )}
                      {m.status !== 'rejected' && (
                        <button
                          onClick={() => handleMembershipStatus(m.id, 'rejected')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-rose-600"
                        title="Remove Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MANAGE EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Campus Events & Workshops ({events.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenEventModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create New Event
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-dark-surface text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Organized By</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                      {evt.title}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                      {evt.clubs?.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {evt.event_date} ({evt.start_time} - {evt.end_time})
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">{evt.venue}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEventModal(evt)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            type: 'event',
                            id: evt.id,
                            name: evt.title,
                          })
                        }
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Categories ({categories.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCategoryModal()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    {cat.club_count || 0} clubs
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="p-1 text-gray-500 hover:text-brand-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: 'category',
                          id: cat.id,
                          name: cat.name,
                        })
                      }
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Announcements ({announcements.length})
            </h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAnnouncementForm({ club_id: clubs[0]?.id || '', title: '', content: '' });
                setAnnouncementModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Post Announcement
            </Button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {announcements.map((a) => (
              <div key={a.id} className="py-4 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-brand-600">
                    {a.clubs?.name}
                  </span>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">
                    {a.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {a.content}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      type: 'announcement',
                      id: a.id,
                      name: a.title,
                    })
                  }
                  className="p-2 text-rose-500 hover:text-rose-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Registered Student Directory ({students.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-dark-surface text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">ID Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <img
                        src={s.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.full_name)}`}
                        alt={s.full_name}
                        className="w-9 h-9 rounded-xl object-cover bg-brand-100"
                      />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">
                          {s.full_name}
                        </span>
                        <span className="text-xs text-gray-400">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                      {s.student_id || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">
                      {s.department || 'General'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">
                      {s.year_of_study || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.role === 'admin' ? (
                        <Badge variant="primary" size="sm">Admin</Badge>
                      ) : (
                        <Badge variant="default" size="sm">Student</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLUB MODAL (CREATE / EDIT) */}
      <Modal
        isOpen={clubModalOpen}
        onClose={() => setClubModalOpen(false)}
        title={editingClub ? `Edit ${editingClub.name}` : 'Create New Club'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveClub} className="space-y-4">
          <Input
            label="Club Name"
            value={clubForm.name}
            onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
            placeholder="e.g. Artificial Intelligence Club"
            required
          />

          <Select
            label="Category"
            value={clubForm.category_id}
            onChange={(e) => setClubForm({ ...clubForm, category_id: e.target.value })}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <Input
            label="Short Description"
            value={clubForm.short_description}
            onChange={(e) => setClubForm({ ...clubForm, short_description: e.target.value })}
            placeholder="A single punchy summary line"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Full Description *
            </label>
            <textarea
              value={clubForm.full_description}
              onChange={(e) => setClubForm({ ...clubForm, full_description: e.target.value })}
              rows={4}
              required
              className="w-full rounded-xl text-sm p-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Detailed profile, meetings, objectives..."
            />
          </div>

          <Input
            label="Mission & Objectives"
            value={clubForm.mission}
            onChange={(e) => setClubForm({ ...clubForm, mission: e.target.value })}
            placeholder="Our mission is to..."
          />

          <Input
            label="Key Achievements & Activities"
            value={clubForm.activities_and_achievements}
            onChange={(e) => setClubForm({ ...clubForm, activities_and_achievements: e.target.value })}
            placeholder="Awards, competitions, hackathons..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Faculty Coordinator"
              value={clubForm.faculty_coordinator}
              onChange={(e) => setClubForm({ ...clubForm, faculty_coordinator: e.target.value })}
              placeholder="Prof. Name (Department)"
            />
            <Input
              label="Student Lead Coordinator"
              value={clubForm.student_coordinator}
              onChange={(e) => setClubForm({ ...clubForm, student_coordinator: e.target.value })}
              placeholder="Student Name (Year/Branch)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={clubForm.contact_email}
              onChange={(e) => setClubForm({ ...clubForm, contact_email: e.target.value })}
              placeholder="club@campus.edu"
            />
            <Input
              label="Logo URL"
              value={clubForm.logo_url}
              onChange={(e) => setClubForm({ ...clubForm, logo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <Input
            label="Cover Image URL"
            value={clubForm.cover_image_url}
            onChange={(e) => setClubForm({ ...clubForm, cover_image_url: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
              <input
                type="checkbox"
                checked={clubForm.is_featured}
                onChange={(e) => setClubForm({ ...clubForm, is_featured: e.target.checked })}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Mark as Featured Club</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
              <input
                type="checkbox"
                checked={clubForm.is_active}
                onChange={(e) => setClubForm({ ...clubForm, is_active: e.target.checked })}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Active Status</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setClubModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingClub ? 'Update Club' : 'Create Club'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            placeholder="e.g. Astronomy & Space"
            required
          />
          <Input
            label="Description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            placeholder="Summary of this interest group..."
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* EVENT MODAL */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Create Campus Event'}
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <Select
            label="Host Club"
            value={eventForm.club_id}
            onChange={(e) => setEventForm({ ...eventForm, club_id: e.target.value })}
            options={clubs.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Event Title"
            value={eventForm.title}
            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
            placeholder="e.g. Annual Autonomous Drone Derby"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase">Description *</label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              rows={3}
              required
              className="w-full rounded-xl text-sm p-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={eventForm.event_date}
              onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
              required
            />
            <Input
              label="Venue"
              value={eventForm.venue}
              onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
              placeholder="Hall / Lab / Field"
              required
            />
          </div>
          <Input
            label="Banner Image URL"
            value={eventForm.banner_url}
            onChange={(e) => setEventForm({ ...eventForm, banner_url: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setEventModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* ANNOUNCEMENT MODAL */}
      <Modal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title="Post Club Announcement"
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-4">
          <Select
            label="Associated Club"
            value={announcementForm.club_id}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, club_id: e.target.value })}
            options={clubs.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <Input
            label="Announcement Title"
            value={announcementForm.title}
            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
            placeholder="e.g. Audition Dates Rescheduled"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase">Notice Content *</label>
            <textarea
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              rows={4}
              required
              className="w-full rounded-xl text-sm p-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={() => setAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialog.type}?`}
        message={`Are you sure you want to permanently delete "${deleteDialog.name}"? This action removes associated records.`}
        confirmText="Permanently Delete"
        isDestructive={true}
      />
    </div>
  );
};
export default AdminDashboard;
