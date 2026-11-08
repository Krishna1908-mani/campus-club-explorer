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
  UserX,
  Key,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Unlock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import AnimatedCounter from '../components/common/AnimatedCounter.jsx';
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
  const [clubLeads, setClubLeads] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [clubLeadSearch, setClubLeadSearch] = useState('');

  // Comprehensive Club Lead Directory & Management State
  const [clubLeadDirectory, setClubLeadDirectory] = useState([]);
  const [unassignedLeadsList, setUnassignedLeadsList] = useState([]);
  const [directoryStats, setDirectoryStats] = useState({
    totalClubs: 0,
    assignedClubs: 0,
    unassignedClubs: 0,
    totalActiveLeads: 0,
  });
  const [leadAssignmentFilter, setLeadAssignmentFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [directoryPage, setDirectoryPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  // Dedicated Create Club Lead Account Modal State
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [createLeadForm, setCreateLeadForm] = useState({
    full_name: '',
    email: '',
    password: 'lead123',
    club_id: '',
    department: '',
    student_id: '',
    account_status: 'active',
  });
  const [creatingLeadAccount, setCreatingLeadAccount] = useState(false);

  // Edit Club Lead Profile Modal State
  const [editLeadModalOpen, setEditLeadModalOpen] = useState(false);
  const [editingLeadTarget, setEditingLeadTarget] = useState(null);
  const [editLeadForm, setEditLeadForm] = useState({
    full_name: '',
    department: '',
    student_id: '',
  });

  // Reset Password Modal State
  const [resetPassModalOpen, setResetPassModalOpen] = useState(false);
  const [resetLeadTarget, setResetLeadTarget] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('lead123');

  // Club Lead Assignment Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ club_id: '', user_id: '' });
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [reassignForm, setReassignForm] = useState({ new_club_id: '', new_user_id: '' });

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
        clubLeadsRes,
        eligibleRes,
        directoryRes,
      ] = await Promise.all([
        apiService.admin.getStats(),
        apiService.clubs.getAll({ limit: 100 }),
        apiService.categories.getAll(),
        apiService.memberships.getAll({}),
        apiService.events.getAll({}),
        apiService.announcements.getAll({ limit: 50 }),
        apiService.admin.getStudents(),
        apiService.admin.getClubLeads(),
        apiService.admin.getEligibleUsers(),
        apiService.admin.getClubLeadDirectory(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (clubsRes.success) setClubs(clubsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (memRes.success) setMemberships(memRes.data);
      if (eventsRes.success) setEvents(eventsRes.data);
      if (annRes.success) setAnnouncements(annRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
      if (clubLeadsRes.success) setClubLeads(clubLeadsRes.data);
      if (eligibleRes.success) setEligibleStudents(eligibleRes.data);
      if (directoryRes?.success && directoryRes.data) {
        setClubLeadDirectory(directoryRes.data.directory || []);
        setUnassignedLeadsList(directoryRes.data.unassignedLeads || []);
        if (directoryRes.data.stats) setDirectoryStats(directoryRes.data.stats);
      }
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
  // CLUB LEAD DIRECTORY & ACCOUNT ACTIONS
  // ------------------------------------------------------------------
  const handleOpenCreateLeadModal = (preselectedClubId = '') => {
    setCreateLeadForm({
      full_name: '',
      email: '',
      password: 'lead123',
      club_id: preselectedClubId || (clubs[0]?.id || ''),
      department: '',
      student_id: '',
      account_status: 'active',
    });
    setCreateLeadModalOpen(true);
  };

  const handleCreateLeadSubmit = async (e) => {
    e.preventDefault();
    if (!createLeadForm.full_name || !createLeadForm.email) {
      error('Full Name and Email Address are required.');
      return;
    }
    setCreatingLeadAccount(true);
    try {
      const res = await apiService.admin.createClubLeadAccount(createLeadForm);
      if (res.success) {
        success(`Club Lead account created! Initial Password: ${res.data?.initialPassword || 'lead123'}`);
        setCreateLeadModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to create Club Lead account.');
    } finally {
      setCreatingLeadAccount(false);
    }
  };

  const handleOpenEditLeadModal = (leadItem) => {
    setEditingLeadTarget(leadItem);
    setEditLeadForm({
      full_name: leadItem.lead?.full_name || '',
      department: leadItem.lead?.department || '',
      student_id: leadItem.lead?.student_id || '',
    });
    setEditLeadModalOpen(true);
  };

  const handleSaveLeadProfile = async (e) => {
    e.preventDefault();
    if (!editingLeadTarget?.lead) return;
    try {
      const res = await apiService.admin.updateClubLeadProfile(editingLeadTarget.lead.id, editLeadForm);
      if (res.success) {
        success('Club Lead profile updated successfully!');
        setEditLeadModalOpen(false);
        setEditingLeadTarget(null);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to update Club Lead profile.');
    }
  };

  const handleOpenResetPasswordModal = (leadItem) => {
    setResetLeadTarget(leadItem);
    setNewPasswordVal('lead' + Math.floor(1000 + Math.random() * 9000));
    setResetPassModalOpen(true);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!resetLeadTarget?.lead) return;
    try {
      const res = await apiService.admin.resetClubLeadPassword(resetLeadTarget.lead.id, newPasswordVal);
      if (res.success) {
        success(`Password reset! New credentials: ${newPasswordVal}`);
        setResetPassModalOpen(false);
        setResetLeadTarget(null);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to reset password.');
    }
  };

  const handleToggleLeadStatus = async (leadItem) => {
    if (!leadItem?.lead) return;
    const currentStatus = leadItem.accountStatus || 'active';
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    try {
      const res = await apiService.admin.updateClubLeadStatus(leadItem.lead.id, newStatus);
      if (res.success) {
        success(res.message || `Account ${newStatus}.`);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to update account status.');
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
  // CLUB LEAD ASSIGNMENT ACTIONS
  // ------------------------------------------------------------------
  const handleAssignLead = async (e) => {
    e.preventDefault();
    if (!assignForm.club_id || !assignForm.user_id) {
      error('Please select both a club and an eligible student.');
      return;
    }
    try {
      const res = await apiService.admin.assignClubLead(assignForm);
      if (res.success) {
        success('Club Lead assigned successfully!');
        setAssignModalOpen(false);
        setAssignForm({ club_id: '', user_id: '' });
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to assign Club Lead.');
    }
  };

  const handleOpenReassignModal = (assignment) => {
    setEditingAssignment(assignment);
    setReassignForm({
      new_club_id: assignment.club_id,
      new_user_id: assignment.user_id,
    });
    setReassignModalOpen(true);
  };

  const handleReassignLead = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;
    try {
      const res = await apiService.admin.reassignClubLead(editingAssignment.id, reassignForm);
      if (res.success) {
        success('Club Lead reassigned successfully!');
        setReassignModalOpen(false);
        setEditingAssignment(null);
        fetchAdminData();
      }
    } catch (err) {
      error(err.message || 'Failed to reassign Club Lead.');
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
      if (type === 'club_lead') await apiService.admin.removeClubLead(id);
      if (type === 'club_lead_account') await apiService.admin.deleteClubLeadAccount(id);

      success(`${type} deleted successfully.`);
      setDeleteDialog({ isOpen: false, type: null, id: null, name: '' });
      fetchAdminData();
    } catch (err) {
      error(err.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF9F7] dark:bg-[#111111] transition-colors">
      {/* Header Banner with Luxury Charcoal + Burgundy Accent */}
      <div className="rounded-2xl bg-[#111111] p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#292929]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#800020] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C5A46D]">
              Administrative Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Campus Club Administration
            </h1>
            <p className="text-xs text-[#737373]">
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
      <div className="flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#383838] overflow-x-auto pb-1">
        {[
          { id: 'stats', label: 'Overview' },
          { id: 'clubs', label: `Clubs (${clubs.length})` },
          { id: 'club_leads', label: `Club Leads Directory (${directoryStats.assignedClubs}/${directoryStats.totalClubs || clubs.length})` },
          { id: 'memberships', label: `Membership Approvals (${memberships.filter(m => m.status === 'pending').length} Pending)` },
          { id: 'events', label: `Events (${events.length})` },
          { id: 'categories', label: `Categories (${categories.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'students', label: `Students Directory (${students.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2.5 px-4 text-xs font-semibold rounded-[10px] whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#800020] text-white shadow-xs'
                : 'text-[#111111] dark:text-[#FAF9F7] hover:bg-[#FCE7EF]/60 dark:hover:bg-[#800020]/20'
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
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.totalClubs} />
              </div>
              <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase mt-1">Total Clubs</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="text-3xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                <AnimatedCounter value={stats.totalStudents} />
              </div>
              <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase mt-1">Registered Students</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="text-3xl font-serif font-bold text-[#15803D] dark:text-emerald-400">
                <AnimatedCounter value={stats.totalMemberships} />
              </div>
              <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase mt-1">Active Memberships</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center hover:border-[#800020]/30 transition-all">
              <div className="text-3xl font-serif font-bold text-[#D97706] dark:text-amber-400">
                <AnimatedCounter value={stats.pendingRequests} />
              </div>
              <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase mt-1">Pending Approvals</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] shadow-xs text-center col-span-2 lg:col-span-1 hover:border-[#800020]/30 transition-all">
              <div className="text-3xl font-serif font-bold text-[#800020] dark:text-[#D9A0AE]">
                <AnimatedCounter value={stats.totalEvents} />
              </div>
              <div className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium uppercase mt-1">Total Events</div>
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

          {/* INTERACTIVE SVG ANALYTICS CHARTS (Section 9) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Distribution Chart */}
            <div className="lg:col-span-7 bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#383838] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7]">
                    Club Distribution by Category
                  </h3>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                    Live tally of approved societies across university disciplines
                  </p>
                </div>
                <Badge variant="burgundy" size="sm">
                  {categories.length} Categories
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {categories.map((cat) => {
                  const clubCount = clubs.filter(
                    (c) => c.category_id === cat.id || c.categories?.slug === cat.slug
                  ).length;
                  const percent = clubs.length ? Math.round((clubCount / clubs.length) * 100) : 0;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#111111] dark:text-[#FAF9F7]">{cat.name}</span>
                        <span className="text-[#737373] dark:text-[#A3A3A3]">
                          {clubCount} clubs ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF9F7] dark:bg-[#292929] overflow-hidden border border-[#E5E5E5]/60 dark:border-[#383838]">
                        <div
                          className="h-full bg-gradient-to-r from-[#800020] via-[#C2185B] to-[#C5A46D] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${Math.max(percent, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Membership Approval Breakdown Donut Chart */}
            <div className="lg:col-span-5 bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="border-b border-[#E5E5E5] dark:border-[#383838] pb-3">
                <h3 className="font-serif font-bold text-base text-[#111111] dark:text-[#FAF9F7]">
                  Membership Governance
                </h3>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                  Student applications approval ratio
                </p>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {/* SVG Donut */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <path
                      className="text-gray-100 dark:text-neutral-800"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Approved slice (Burgundy) */}
                    <path
                      className="text-[#800020]"
                      strokeDasharray={`${
                        memberships.length
                          ? (memberships.filter((m) => m.status === 'approved').length / memberships.length) * 100
                          : 70
                      }, 100`}
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-serif font-bold text-[#111111] dark:text-[#FAF9F7]">
                      {memberships.length
                        ? Math.round(
                            (memberships.filter((m) => m.status === 'approved').length / memberships.length) * 100
                          )
                        : 0}
                      %
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#737373] dark:text-[#A3A3A3] tracking-widest">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E5E5] dark:border-[#383838] text-center">
                <div className="p-2 rounded-xl bg-[#FAF9F7] dark:bg-[#292929]">
                  <div className="text-xs font-bold text-[#15803D]">
                    {memberships.filter((m) => m.status === 'approved').length}
                  </div>
                  <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Approved</div>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF9F7] dark:bg-[#292929]">
                  <div className="text-xs font-bold text-[#D97706]">
                    {memberships.filter((m) => m.status === 'pending').length}
                  </div>
                  <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Pending</div>
                </div>
                <div className="p-2 rounded-xl bg-[#FAF9F7] dark:bg-[#292929]">
                  <div className="text-xs font-bold text-[#B91C1C]">
                    {memberships.filter((m) => m.status === 'rejected').length}
                  </div>
                  <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Rejected</div>
                </div>
              </div>
            </div>
          </div>
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
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#800020] hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {/* TAB 2.5: ALL CLUB LEAD ACCOUNTS & DIRECTORY */}
      {activeTab === 'club_leads' && (
        <div className="bg-white dark:bg-dark-card border border-gray-200/90 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header & Primary Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#800020] dark:text-[#D9A0AE]" />
                <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                  All Club Lead Accounts & Directory
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
                Centralized registry of every collegiate organization and its designated Club Lead login credentials. Newly created clubs dynamically populate here with instant account provisioning and strict isolation.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenCreateLeadModal()}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Create Club Lead Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAssignForm({ club_id: clubs[0]?.id || '', user_id: eligibleStudents[0]?.id || '' });
                  setAssignModalOpen(true);
                }}
                leftIcon={<UserCheck className="w-4 h-4 text-[#800020]" />}
              >
                Assign Existing Student
              </Button>
            </div>
          </div>

          {/* Quick Real-Time Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1C] border border-gray-200 dark:border-gray-800 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Campus Clubs
              </span>
              <span className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1 block">
                {directoryStats.totalClubs || clubs.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCE7EF]/60 dark:bg-[#800020]/20 border border-[#D9A0AE]/50 dark:border-[#800020]/50 shadow-xs">
              <span className="text-[11px] font-semibold text-[#800020] dark:text-[#D9A0AE] uppercase tracking-wider block">
                Clubs With Assigned Leads
              </span>
              <span className="text-2xl font-serif font-bold text-[#800020] dark:text-[#D9A0AE] mt-1 block">
                {directoryStats.assignedClubs}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-xs">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                Unassigned Clubs (Needs Lead)
              </span>
              <span className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 mt-1 block">
                {directoryStats.unassignedClubs}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                Active Club Lead Accounts
              </span>
              <span className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                {directoryStats.totalActiveLeads}
              </span>
            </div>
          </div>

          {/* Search & Multi-Filters Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Search by club name, lead name, email, or user ID..."
                value={clubLeadSearch}
                onChange={(e) => {
                  setClubLeadSearch(e.target.value);
                  setDirectoryPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={leadAssignmentFilter}
                onChange={(e) => {
                  setLeadAssignmentFilter(e.target.value);
                  setDirectoryPage(1);
                }}
                className="text-xs font-medium py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800020]"
              >
                <option value="all">All Assignments ({clubLeadDirectory.length})</option>
                <option value="assigned">Assigned Only ({directoryStats.assignedClubs})</option>
                <option value="unassigned">Unassigned (Not Assigned) ({directoryStats.unassignedClubs})</option>
              </select>

              <select
                value={leadStatusFilter}
                onChange={(e) => {
                  setLeadStatusFilter(e.target.value);
                  setDirectoryPage(1);
                }}
                className="text-xs font-medium py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1C] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800020]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Accounts</option>
                <option value="deactivated">Deactivated Accounts</option>
              </select>
            </div>
          </div>

          {/* Directory Master Table */}
          {(() => {
            const filteredDirectory = clubLeadDirectory.filter((item) => {
              // Search filter
              if (clubLeadSearch) {
                const q = clubLeadSearch.toLowerCase().trim();
                const matchClub = item.club.name.toLowerCase().includes(q) || item.club.slug?.toLowerCase().includes(q);
                const matchLead = item.lead?.full_name?.toLowerCase().includes(q);
                const matchEmail = item.lead?.email?.toLowerCase().includes(q);
                const matchId = item.lead?.id?.toLowerCase().includes(q);
                if (!matchClub && !matchLead && !matchEmail && !matchId) return false;
              }

              // Assignment filter
              if (leadAssignmentFilter === 'assigned' && item.assignmentStatus !== 'assigned') return false;
              if (leadAssignmentFilter === 'unassigned' && item.assignmentStatus !== 'unassigned') return false;

              // Account Status filter
              if (leadStatusFilter === 'active' && item.accountStatus !== 'active') return false;
              if (leadStatusFilter === 'deactivated' && item.accountStatus !== 'deactivated') return false;

              return true;
            });

            const pageSize = 10;
            const totalPages = Math.ceil(filteredDirectory.length / pageSize) || 1;
            const paginatedItems = filteredDirectory.slice((directoryPage - 1) * pageSize, directoryPage * pageSize);

            if (filteredDirectory.length === 0) {
              return (
                <div className="text-center py-14 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
                  <Compass className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    No matching clubs or Club Lead accounts found
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Try adjusting your search query or filters, or provision a new Club Lead account for any club.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenCreateLeadModal()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Create Club Lead Account
                  </Button>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAF9F7] dark:bg-[#1E1E1E] text-[11px] uppercase font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Club Organization</th>
                        <th className="py-3.5 px-4">Designated Club Lead</th>
                        <th className="py-3.5 px-4">Login Email & User ID</th>
                        <th className="py-3.5 px-4 text-center">Account Status</th>
                        <th className="py-3.5 px-4 text-center">Assignment</th>
                        <th className="py-3.5 px-4">Last Login</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                      {paginatedItems.map((item) => {
                        const { club, lead, assignmentStatus, accountStatus } = item;
                        const isAssigned = assignmentStatus === 'assigned';

                        return (
                          <tr
                            key={club.id}
                            className={`hover:bg-gray-50/70 dark:hover:bg-[#222222]/60 transition-colors ${
                              !isAssigned ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                            }`}
                          >
                            {/* Club Column */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={club.logo_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100'}
                                  alt={club.name}
                                  className="w-10 h-10 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700 shadow-xs"
                                />
                                <div>
                                  <span className="font-bold text-gray-900 dark:text-white block text-sm leading-tight">
                                    {club.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-mono text-[#800020] dark:text-[#D9A0AE]">
                                      /{club.slug}
                                    </span>
                                    {club.categories?.name && (
                                      <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-1.5 py-0.2 rounded">
                                        {club.categories.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Lead Column */}
                            <td className="py-3.5 px-4">
                              {isAssigned && lead ? (
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={lead.avatar_url}
                                    alt={lead.full_name}
                                    className="w-8 h-8 rounded-lg object-cover bg-[#FCE7EF] dark:bg-[#800020]/30 shrink-0"
                                  />
                                  <div>
                                    <span className="font-semibold text-gray-900 dark:text-white block text-xs">
                                      {lead.full_name}
                                    </span>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                      {lead.department || 'Student Lead'}
                                      {lead.student_id ? ` • ID: ${lead.student_id}` : ''}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-amber-700 dark:text-amber-400 italic font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>No Lead Assigned</span>
                                </span>
                              )}
                            </td>

                            {/* Login Email & User ID Column */}
                            <td className="py-3.5 px-4 font-mono text-xs">
                              {isAssigned && lead ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100 font-semibold">
                                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0 font-sans" />
                                    <span>{lead.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(`email-${lead.id}`, lead.email)}
                                      className="p-0.5 text-gray-400 hover:text-[#800020] ml-1"
                                      title="Copy Login Email"
                                    >
                                      {copiedId === `email-${lead.id}` ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <span>UID: {lead.id.substring(0, 13)}...</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyText(`uid-${lead.id}`, lead.id)}
                                      className="p-0.5 hover:text-[#800020]"
                                      title="Copy Supabase User ID"
                                    >
                                      {copiedId === `uid-${lead.id}` ? (
                                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-2.5 h-2.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs font-sans">-</span>
                              )}
                            </td>

                            {/* Account Status Column */}
                            <td className="py-3.5 px-4 text-center">
                              {isAssigned ? (
                                accountStatus === 'deactivated' ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-[#B91C1C] border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300">
                                    <Lock className="w-2.5 h-2.5" />
                                    <span>Deactivated</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>Active</span>
                                  </span>
                                )
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>

                            {/* Assignment Status Column */}
                            <td className="py-3.5 px-4 text-center">
                              {isAssigned ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300">
                                  <span>Assigned</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 animate-pulse">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  <span>Not Assigned</span>
                                </span>
                              )}
                            </td>

                            {/* Last Login Column */}
                            <td className="py-3.5 px-4 text-xs text-gray-500">
                              {isAssigned && lead?.last_sign_in_at
                                ? new Date(lead.last_sign_in_at).toLocaleDateString()
                                : isAssigned
                                ? 'Never'
                                : '-'}
                            </td>

                            {/* Actions Column */}
                            <td className="py-3.5 px-4 text-right">
                              {isAssigned && lead ? (
                                <div className="flex items-center justify-end gap-1">
                                  {/* Edit Profile */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditLeadModal(item)}
                                    className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    title="Edit Lead Profile Details"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Reassign Club */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenReassignModal({
                                        id: item.assignment?.id || `cla-${club.id}-${lead.id}`,
                                        club_id: club.id,
                                        user_id: lead.id,
                                        clubs: club,
                                        profile: lead,
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    title="Reassign to Another Club"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Reset Password */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenResetPasswordModal(item)}
                                    className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                                    title="Reset Password Credentials"
                                  >
                                    <Key className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Deactivate / Reactivate Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLeadStatus(item)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      accountStatus === 'deactivated'
                                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                        : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                    }`}
                                    title={accountStatus === 'deactivated' ? 'Reactivate Account' : 'Deactivate Account'}
                                  >
                                    {accountStatus === 'deactivated' ? (
                                      <Unlock className="w-3.5 h-3.5" />
                                    ) : (
                                      <Lock className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Remove Assignment */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        type: 'club_lead',
                                        id: item.assignment?.id || lead.id,
                                        name: `${lead.full_name} from ${club.name}`,
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                    title="Remove Club Lead Assignment"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Account */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        type: 'club_lead_account',
                                        id: lead.id,
                                        name: `Account for ${lead.full_name} (${lead.email})`,
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                    title="Delete Lead Account Permanently"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOpenCreateLeadModal(club.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] hover:bg-[#5C001A] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>Create or Assign Lead</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <span>
                      Showing {(directoryPage - 1) * pageSize + 1} to{' '}
                      {Math.min(directoryPage * pageSize, filteredDirectory.length)} of {filteredDirectory.length} clubs
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={directoryPage === 1}
                        onClick={() => setDirectoryPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span className="px-3 font-semibold text-gray-900 dark:text-white">
                        Page {directoryPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={directoryPage === totalPages}
                        onClick={() => setDirectoryPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Unassigned Leads Standby Tray (if any) */}
          {unassignedLeadsList.length > 0 && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Unassigned Club Lead Accounts on Standby ({unassignedLeadsList.length})
                </h4>
                <span className="text-[11px] text-gray-400">
                  These accounts have Club Lead privileges but are awaiting club designation
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unassignedLeadsList.map((ul) => (
                  <div
                    key={ul.id}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-xs text-gray-900 dark:text-white block">
                        {ul.full_name}
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono block">{ul.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAssignForm({ club_id: clubs[0]?.id || '', user_id: ul.id });
                        setAssignModalOpen(true);
                      }}
                    >
                      Assign Club
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#800020]"
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
                      className="p-1 text-gray-500 hover:text-[#800020]"
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
                  <span className="text-xs font-bold text-[#800020] dark:text-[#D9A0AE]">
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
                        className="w-9 h-9 rounded-xl object-cover bg-[#FCE7EF]"
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
              className="w-full rounded-[10px] text-sm p-3 bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#111111] dark:text-[#FAF9F7]"
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
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
              <input
                type="checkbox"
                checked={clubForm.is_featured}
                onChange={(e) => setClubForm({ ...clubForm, is_featured: e.target.checked })}
                className="rounded border-[#E5E5E5] text-[#800020] focus:ring-[#800020]"
              />
              <span>Mark as Featured Club</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#111111] dark:text-[#FAF9F7]">
              <input
                type="checkbox"
                checked={clubForm.is_active}
                onChange={(e) => setClubForm({ ...clubForm, is_active: e.target.checked })}
                className="rounded border-[#E5E5E5] text-[#800020] focus:ring-[#800020]"
              />
              <span>Active Status</span>
            </label>
          </div>

          {/* OPTIONAL INTEGRATED LEAD CREATION (PHASE 2) */}
          {!editingClub && (
            <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#383838] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-[#FAF9F7] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#800020] dark:text-[#D9A0AE]" />
                    <span>Create Club Lead Account (Optional)</span>
                  </h4>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Optionally provision a dedicated login account for this club's leader now, or assign later.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(clubForm.provision_lead)}
                    onChange={(e) => setClubForm({ ...clubForm, provision_lead: e.target.checked })}
                    className="rounded border-[#E5E5E5] text-[#800020] focus:ring-[#800020] w-4 h-4"
                  />
                  <span className="ml-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Add Lead Now
                  </span>
                </label>
              </div>

              {clubForm.provision_lead && (
                <div className="p-3.5 rounded-xl bg-[#FAF9F7] dark:bg-[#242424] border border-[#E5E5E5] dark:border-[#383838] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Club Lead Full Name *"
                      value={clubForm.lead_full_name || ''}
                      onChange={(e) => setClubForm({ ...clubForm, lead_full_name: e.target.value })}
                      placeholder="e.g. Maya Lin"
                      required={clubForm.provision_lead}
                    />
                    <Input
                      label="Club Lead Login Email *"
                      type="email"
                      value={clubForm.lead_email || ''}
                      onChange={(e) => setClubForm({ ...clubForm, lead_email: e.target.value })}
                      placeholder="e.g. maya.lead@campus.edu"
                      required={clubForm.provision_lead}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Initial Password"
                      type="password"
                      value={clubForm.lead_password || 'lead123'}
                      onChange={(e) => setClubForm({ ...clubForm, lead_password: e.target.value })}
                      placeholder="Default: lead123"
                    />
                    <Input
                      label="Department / Major"
                      value={clubForm.lead_department || ''}
                      onChange={(e) => setClubForm({ ...clubForm, lead_department: e.target.value })}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* ASSIGN CLUB LEAD MODAL */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Student as Club Lead"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignLead} className="space-y-4">
          <Select
            label="Select Collegiate Organization *"
            value={assignForm.club_id}
            onChange={(e) => setAssignForm({ ...assignForm, club_id: e.target.value })}
            options={clubs.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.categories?.name || 'General'})`,
            }))}
            required
          />

          <Select
            label="Select Eligible Student *"
            value={assignForm.user_id}
            onChange={(e) => setAssignForm({ ...assignForm, user_id: e.target.value })}
            options={eligibleStudents.map((s) => ({
              value: s.id,
              label: `${s.full_name} (${s.email}${s.student_id ? ' - ID: ' + s.student_id : ''})`,
            }))}
            required
          />

          <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
            Assigning this student will elevate their role to <strong>Club Lead</strong> with permissions strictly scoped to manage this organization, its membership applications, events, and announcements.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* REASSIGN CLUB LEAD MODAL */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title={`Reassign: ${editingAssignment?.clubs?.name || 'Club'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReassignLead} className="space-y-4">
          <Select
            label="Organization"
            value={reassignForm.new_club_id}
            onChange={(e) => setReassignForm({ ...reassignForm, new_club_id: e.target.value })}
            options={clubs.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            required
          />

          <Select
            label="Assigned Student Leader"
            value={reassignForm.new_user_id}
            onChange={(e) => setReassignForm({ ...reassignForm, new_user_id: e.target.value })}
            options={eligibleStudents.map((s) => ({
              value: s.id,
              label: `${s.full_name} (${s.email})`,
            }))}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setReassignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Reassignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE DEDICATED CLUB LEAD ACCOUNT MODAL */}
      <Modal
        isOpen={createLeadModalOpen}
        onClose={() => setCreateLeadModalOpen(false)}
        title="Create Dedicated Club Lead Account"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateLeadSubmit} className="space-y-4">
          <Input
            label="Club Lead Full Name *"
            value={createLeadForm.full_name}
            onChange={(e) => setCreateLeadForm({ ...createLeadForm, full_name: e.target.value })}
            placeholder="e.g. Jordan Hayes"
            required
          />

          <Input
            label="Login Email Address *"
            type="email"
            value={createLeadForm.email}
            onChange={(e) => setCreateLeadForm({ ...createLeadForm, email: e.target.value })}
            placeholder="e.g. jordan.lead@campus.edu"
            required
          />

          <Select
            label="Assigned Collegiate Organization *"
            value={createLeadForm.club_id}
            onChange={(e) => setCreateLeadForm({ ...createLeadForm, club_id: e.target.value })}
            options={clubs.map((c) => {
              const assignedLead = clubLeadDirectory.find((d) => d.club?.id === c.id && d.assignmentStatus === 'assigned');
              const statusTag = assignedLead ? `(Current Lead: ${assignedLead.lead?.full_name})` : '(Not Assigned)';
              return {
                value: c.id,
                label: `${c.name} ${statusTag}`,
              };
            })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Department / Faculty"
              value={createLeadForm.department}
              onChange={(e) => setCreateLeadForm({ ...createLeadForm, department: e.target.value })}
              placeholder="e.g. Computer Science"
            />
            <Input
              label="Student / Lead ID"
              value={createLeadForm.student_id}
              onChange={(e) => setCreateLeadForm({ ...createLeadForm, student_id: e.target.value })}
              placeholder="e.g. LEAD-2026-04"
            />
          </div>

          <Input
            label="Initial Account Password"
            type="password"
            value={createLeadForm.password}
            onChange={(e) => setCreateLeadForm({ ...createLeadForm, password: e.target.value })}
            placeholder="Default: lead123"
            required
          />

          <p className="text-[11px] text-gray-500 leading-relaxed bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
            This account will be provisioned with <strong>Club Lead</strong> privileges strictly isolated to the selected organization. The lead can log in using their email and initial password at <code>/club-lead/login</code>.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setCreateLeadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={creatingLeadAccount}
            >
              Create Lead Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT CLUB LEAD PROFILE MODAL */}
      <Modal
        isOpen={editLeadModalOpen}
        onClose={() => setEditLeadModalOpen(false)}
        title={`Edit Club Lead: ${editingLeadTarget?.lead?.full_name || 'Leader'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveLeadProfile} className="space-y-4">
          <Input
            label="Full Name *"
            value={editLeadForm.full_name}
            onChange={(e) => setEditLeadForm({ ...editLeadForm, full_name: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
              Login Email (Verified Auth)
            </label>
            <input
              type="text"
              disabled
              value={editingLeadTarget?.lead?.email || ''}
              className="w-full text-xs font-mono p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700"
            />
          </div>

          <Input
            label="Department / Faculty"
            value={editLeadForm.department}
            onChange={(e) => setEditLeadForm({ ...editLeadForm, department: e.target.value })}
          />

          <Input
            label="Student / Lead ID"
            value={editLeadForm.student_id}
            onChange={(e) => setEditLeadForm({ ...editLeadForm, student_id: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditLeadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal
        isOpen={resetPassModalOpen}
        onClose={() => setResetPassModalOpen(false)}
        title={`Reset Password: ${resetLeadTarget?.lead?.full_name || 'Leader'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Set a new password for <strong>{resetLeadTarget?.lead?.email}</strong>. The Club Lead can immediately use this new password to sign in.
          </p>

          <Input
            label="New Temporary Password *"
            type="text"
            value={newPasswordVal}
            onChange={(e) => setNewPasswordVal(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setResetPassModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm Password Reset
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

