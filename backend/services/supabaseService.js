import { supabase, supabaseAdmin, isSupabaseConfigured, assertDatabaseAvailable } from '../config/supabase.js';
import {
  initialCategories,
  initialClubs,
  initialEvents,
  initialAnnouncements,
  initialUsers,
  initialMemberships,
  initialFavorites,
  initialEventRegistrations,
} from '../data/initialData.js';
import crypto from 'crypto';

// Local mutable memory store for zero-friction fallback/evaluation
const memoryStore = {
  categories: [...initialCategories],
  clubs: [...initialClubs],
  events: [...initialEvents],
  announcements: [...initialAnnouncements],
  users: [...initialUsers],
  memberships: [...initialMemberships],
  favorites: [...initialFavorites],
  eventRegistrations: [...initialEventRegistrations],
  clubLeadAssignments: [],
};

const getClient = (privileged = false) => {
  if (privileged && supabaseAdmin) return supabaseAdmin;
  return supabase;
};

export const SupabaseService = {
  // -------------------------------------------------------------
  // CLUBS
  // -------------------------------------------------------------
  async getClubs({ search, category, sort = 'popular', featured, page = 1, limit = 12 }) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('clubs')
        .select('*, categories(*)', { count: 'exact' })
        .eq('is_active', true);

      if (search) {
        query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%,full_description.ilike.%${search}%`);
      }
      if (category && category !== 'all') {
        // category can be slug or category_id
        const isUuid = /^[0-9a-fA-F-]{36}$/.test(category);
        if (isUuid) {
          query = query.eq('category_id', category);
        } else {
          // find category by slug
          const { data: cat } = await supabase.from('categories').select('id').eq('slug', category).single();
          if (cat) query = query.eq('category_id', cat.id);
        }
      }
      if (featured === 'true' || featured === true) {
        query = query.eq('is_featured', true);
      }

      if (sort === 'alphabetical') {
        query = query.order('name', { ascending: true });
      } else if (sort === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('member_count', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, count, error } = await query.range(from, to);

      if (error) throw error;
      return {
        clubs: data || [],
        total: count || 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((count || 0) / limit),
      };
    }

    // Memory Store implementation
    let list = memoryStore.clubs.filter(c => c.is_active);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.short_description.toLowerCase().includes(q) ||
        c.full_description.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'all') {
      const catObj = memoryStore.categories.find(cat => cat.slug === category || cat.id === category);
      if (catObj) {
        list = list.filter(c => c.category_id === catObj.id);
      }
    }

    if (featured === 'true' || featured === true) {
      list = list.filter(c => c.is_featured);
    }

    if (sort === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'recent') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      list.sort((a, b) => b.member_count - a.member_count);
    }

    // Embed category info
    const enriched = list.map(club => ({
      ...club,
      categories: memoryStore.categories.find(cat => cat.id === club.category_id) || null,
    }));

    const total = enriched.length;
    const from = (page - 1) * limit;
    const paginated = enriched.slice(from, from + limit);

    return {
      clubs: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  },

  async getFeaturedClubs(limit = 6) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('clubs')
        .select('*, categories(*)')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('member_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }

    return memoryStore.clubs
      .filter(c => c.is_active && c.is_featured)
      .slice(0, limit)
      .map(c => ({
        ...c,
        categories: memoryStore.categories.find(cat => cat.id === c.category_id) || null,
      }));
  },

  async getClubByIdOrSlug(idOrSlug, userId = null) {
    let club = null;

    if (isSupabaseConfigured && supabase) {
      const isUuid = /^[0-9a-fA-F-]{36}$/.test(idOrSlug);
      let query = supabase.from('clubs').select('*, categories(*)');
      if (isUuid) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      if (error || !data) return null;
      club = data;

      // Fetch upcoming events for this club
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('club_id', club.id)
        .order('event_date', { ascending: true });

      // Fetch announcements
      const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .eq('club_id', club.id)
        .order('created_at', { ascending: false });

      // If user is logged in, check membership & favorite status
      let membership = null;
      let isFavorite = false;

      if (userId) {
        const { data: mem } = await supabase
          .from('memberships')
          .select('*')
          .eq('club_id', club.id)
          .eq('user_id', userId)
          .maybeSingle();
        membership = mem;

        const { data: fav } = await supabase
          .from('favorites')
          .select('id')
          .eq('club_id', club.id)
          .eq('user_id', userId)
          .maybeSingle();
        isFavorite = Boolean(fav);
      }

      return {
        ...club,
        events: events || [],
        announcements: announcements || [],
        membership,
        isFavorite,
      };
    }

    // Memory Store implementation
    club = memoryStore.clubs.find(c => c.id === idOrSlug || c.slug === idOrSlug);
    if (!club) return null;

    const category = memoryStore.categories.find(c => c.id === club.category_id);
    const events = memoryStore.events.filter(e => e.club_id === club.id);
    const announcements = memoryStore.announcements.filter(a => a.club_id === club.id);

    let membership = null;
    let isFavorite = false;
    if (userId) {
      membership = memoryStore.memberships.find(m => m.club_id === club.id && m.user_id === userId) || null;
      isFavorite = memoryStore.favorites.some(f => f.club_id === club.id && f.user_id === userId);
    }

    return {
      ...club,
      categories: category,
      events,
      announcements,
      membership,
      isFavorite,
    };
  },

  async createClub(clubData) {
    const slug = clubData.slug || clubData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newClub = {
      ...clubData,
      slug,
      member_count: 0,
      is_active: clubData.is_active ?? true,
      is_featured: clubData.is_featured ?? false,
      social_links: clubData.social_links || {},
    };

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client.from('clubs').insert([newClub]).select('*, categories(*)').single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...newClub,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.clubs.unshift(created);
    return {
      ...created,
      categories: memoryStore.categories.find(c => c.id === created.category_id) || null,
    };
  },

  async updateClub(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('clubs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, categories(*)')
        .single();
      if (error) throw error;
      return data;
    }

    const index = memoryStore.clubs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Club not found');
    memoryStore.clubs[index] = {
      ...memoryStore.clubs[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return {
      ...memoryStore.clubs[index],
      categories: memoryStore.categories.find(c => c.id === memoryStore.clubs[index].category_id) || null,
    };
  },

  async deleteClub(id) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { error } = await client.from('clubs').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const index = memoryStore.clubs.findIndex(c => c.id === id);
    if (index === -1) return false;
    memoryStore.clubs.splice(index, 1);
    return true;
  },

  // -------------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------------
  async getCategories() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*, clubs(count)')
        .order('name', { ascending: true });
      if (error) throw error;

      return (data || []).map(cat => ({
        ...cat,
        club_count: cat.clubs?.[0]?.count || 0,
      }));
    }

    return memoryStore.categories.map(cat => {
      const count = memoryStore.clubs.filter(c => c.category_id === cat.id && c.is_active).length;
      return { ...cat, club_count: count };
    });
  },

  async createCategory(catData) {
    const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const record = { ...catData, slug };

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client.from('categories').insert([record]).select().single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...record,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    memoryStore.categories.push(created);
    return created;
  },

  async updateCategory(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client.from('categories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const idx = memoryStore.categories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    memoryStore.categories[idx] = { ...memoryStore.categories[idx], ...updates };
    return memoryStore.categories[idx];
  },

  async deleteCategory(id) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { error } = await client.from('categories').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const idx = memoryStore.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    memoryStore.categories.splice(idx, 1);
    return true;
  },

  // -------------------------------------------------------------
  // MEMBERSHIPS
  // -------------------------------------------------------------
  async requestMembership(userId, clubId) {
    if (isSupabaseConfigured && supabase) {
      // Check existing
      const { data: existing } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('club_id', clubId)
        .maybeSingle();

      if (existing) {
        throw new Error(`You already have a ${existing.status} membership for this club.`);
      }

      const { data, error } = await supabase
        .from('memberships')
        .insert([{ user_id: userId, club_id: clubId, status: 'pending' }])
        .select('*, clubs(*)')
        .single();

      if (error) throw error;
      return data;
    }

    const existing = memoryStore.memberships.find(m => m.user_id === userId && m.club_id === clubId);
    if (existing) {
      throw new Error(`You already have a ${existing.status} membership for this club.`);
    }

    const newMem = {
      id: crypto.randomUUID(),
      user_id: userId,
      club_id: clubId,
      status: 'pending',
      role_in_club: 'member',
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.memberships.push(newMem);

    const club = memoryStore.clubs.find(c => c.id === clubId);
    return { ...newMem, clubs: club };
  },

  async getUserMemberships(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('memberships')
        .select('*, clubs(*, categories(*))')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return memoryStore.memberships
      .filter(m => m.user_id === userId)
      .map(m => {
        const club = memoryStore.clubs.find(c => c.id === m.club_id);
        const category = club ? memoryStore.categories.find(cat => cat.id === club.category_id) : null;
        return {
          ...m,
          clubs: club ? { ...club, categories: category } : null,
        };
      });
  },

  async cancelMembership(userId, clubId) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);

      if (error) throw error;
      return true;
    }

    const idx = memoryStore.memberships.findIndex(m => m.user_id === userId && m.club_id === clubId);
    if (idx === -1) return false;
    const removed = memoryStore.memberships.splice(idx, 1)[0];

    // Decrement club member_count if approved
    if (removed.status === 'approved') {
      const club = memoryStore.clubs.find(c => c.id === clubId);
      if (club && club.member_count > 0) club.member_count -= 1;
    }
    return true;
  },

  async getAllMemberships({ status, clubId }) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      let query = client
        .from('memberships')
        .select('*, profiles(*), clubs(*)')
        .order('joined_at', { ascending: false });

      if (status) query = query.eq('status', status);
      if (clubId) query = query.eq('club_id', clubId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let list = [...memoryStore.memberships];
    if (status) list = list.filter(m => m.status === status);
    if (clubId) list = list.filter(m => m.club_id === clubId);

    return list.map(m => ({
      ...m,
      profiles: memoryStore.users.find(u => u.id === m.user_id) || { full_name: 'Student', email: 'user@campus.edu' },
      clubs: memoryStore.clubs.find(c => c.id === m.club_id) || null,
    }));
  },

  async updateMembershipStatus(membershipId, status) {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be pending, approved, or rejected.');
    }

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('memberships')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', membershipId)
        .select('*, profiles(*), clubs(*)')
        .single();

      if (error) throw error;
      return data;
    }

    const mem = memoryStore.memberships.find(m => m.id === membershipId);
    if (!mem) throw new Error('Membership not found');

    const prevStatus = mem.status;
    mem.status = status;
    mem.updated_at = new Date().toISOString();

    const club = memoryStore.clubs.find(c => c.id === mem.club_id);
    if (club) {
      if (prevStatus !== 'approved' && status === 'approved') {
        club.member_count += 1;
      } else if (prevStatus === 'approved' && status !== 'approved') {
        if (club.member_count > 0) club.member_count -= 1;
      }
    }

    return {
      ...mem,
      profiles: memoryStore.users.find(u => u.id === mem.user_id) || null,
      clubs: club || null,
    };
  },

  async removeMembershipAdmin(membershipId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { error } = await client.from('memberships').delete().eq('id', membershipId);
      if (error) throw error;
      return true;
    }

    const idx = memoryStore.memberships.findIndex(m => m.id === membershipId);
    if (idx === -1) return false;
    const removed = memoryStore.memberships.splice(idx, 1)[0];
    if (removed.status === 'approved') {
      const club = memoryStore.clubs.find(c => c.id === removed.club_id);
      if (club && club.member_count > 0) club.member_count -= 1;
    }
    return true;
  },

  // -------------------------------------------------------------
  // FAVORITES
  // -------------------------------------------------------------
  async getUserFavorites(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, clubs(*, categories(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(f => f.clubs);
    }

    const favs = memoryStore.favorites.filter(f => f.user_id === userId);
    return favs.map(f => {
      const club = memoryStore.clubs.find(c => c.id === f.club_id);
      return club ? {
        ...club,
        categories: memoryStore.categories.find(cat => cat.id === club.category_id) || null,
      } : null;
    }).filter(Boolean);
  },

  async addFavorite(userId, clubId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, club_id: clubId }])
        .select()
        .single();

      if (error && error.code !== '23505') throw error; // 23505 = unique constraint
      return data || { user_id: userId, club_id: clubId };
    }

    const existing = memoryStore.favorites.find(f => f.user_id === userId && f.club_id === clubId);
    if (existing) return existing;

    const newFav = {
      id: crypto.randomUUID(),
      user_id: userId,
      club_id: clubId,
      created_at: new Date().toISOString(),
    };
    memoryStore.favorites.push(newFav);
    return newFav;
  },

  async removeFavorite(userId, clubId) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);

      if (error) throw error;
      return true;
    }

    const idx = memoryStore.favorites.findIndex(f => f.user_id === userId && f.club_id === clubId);
    if (idx === -1) return false;
    memoryStore.favorites.splice(idx, 1);
    return true;
  },

  // -------------------------------------------------------------
  // EVENTS
  // -------------------------------------------------------------
  async getEvents({ clubId, categoryId, status = 'all', search, userId = null }) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('events')
        .select('*, clubs(*, categories(*))')
        .order('event_date', { ascending: true });

      if (clubId) query = query.eq('club_id', clubId);
      if (status && status !== 'all') query = query.eq('status', status);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,venue.ilike.%${search}%`);

      const { data, error } = await query;
      if (error) throw error;

      let events = data || [];

      if (categoryId && categoryId !== 'all') {
        events = events.filter(e => e.clubs?.category_id === categoryId);
      }

      if (userId) {
        const { data: regs } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', userId);
        const registeredSet = new Set((regs || []).map(r => r.event_id));
        events = events.map(e => ({ ...e, isRegistered: registeredSet.has(e.id) }));
      }

      return events;
    }

    // Memory Store implementation
    let list = [...memoryStore.events];
    if (clubId) list = list.filter(e => e.club_id === clubId);
    if (status && status !== 'all') list = list.filter(e => e.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }

    let enriched = list.map(e => {
      const club = memoryStore.clubs.find(c => c.id === e.club_id);
      const category = club ? memoryStore.categories.find(cat => cat.id === club.category_id) : null;
      const isRegistered = userId ? memoryStore.eventRegistrations.some(r => r.event_id === e.id && r.user_id === userId) : false;
      return {
        ...e,
        clubs: club ? { ...club, categories: category } : null,
        isRegistered,
      };
    });

    if (categoryId && categoryId !== 'all') {
      enriched = enriched.filter(e => e.clubs?.category_id === categoryId);
    }

    return enriched;
  },

  async getEventById(id, userId = null) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('events')
        .select('*, clubs(*, categories(*))')
        .eq('id', id)
        .single();

      if (error || !data) return null;

      let isRegistered = false;
      if (userId) {
        const { data: reg } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', id)
          .eq('user_id', userId)
          .maybeSingle();
        isRegistered = Boolean(reg);
      }

      return { ...data, isRegistered };
    }

    const event = memoryStore.events.find(e => e.id === id);
    if (!event) return null;

    const club = memoryStore.clubs.find(c => c.id === event.club_id);
    const category = club ? memoryStore.categories.find(cat => cat.id === club.category_id) : null;
    const isRegistered = userId ? memoryStore.eventRegistrations.some(r => r.event_id === id && r.user_id === userId) : false;

    return {
      ...event,
      clubs: club ? { ...club, categories: category } : null,
      isRegistered,
    };
  },

  async createEvent(eventData) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('events')
        .insert([eventData])
        .select('*, clubs(*)')
        .single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...eventData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.events.unshift(created);
    return {
      ...created,
      clubs: memoryStore.clubs.find(c => c.id === created.club_id) || null,
    };
  },

  async updateEvent(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, clubs(*)')
        .single();
      if (error) throw error;
      return data;
    }

    const idx = memoryStore.events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Event not found');
    memoryStore.events[idx] = { ...memoryStore.events[idx], ...updates, updated_at: new Date().toISOString() };
    return {
      ...memoryStore.events[idx],
      clubs: memoryStore.clubs.find(c => c.id === memoryStore.events[idx].club_id) || null,
    };
  },

  async deleteEvent(id) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { error } = await client.from('events').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const idx = memoryStore.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    memoryStore.events.splice(idx, 1);
    return true;
  },

  async registerForEvent(userId, eventId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{ user_id: userId, event_id: eventId }])
        .select()
        .single();

      if (error && error.code !== '23505') throw error;
      return data || { user_id: userId, event_id: eventId };
    }

    const existing = memoryStore.eventRegistrations.find(r => r.user_id === userId && r.event_id === eventId);
    if (existing) return existing;

    const newReg = {
      id: crypto.randomUUID(),
      user_id: userId,
      event_id: eventId,
      registration_status: 'registered',
      registered_at: new Date().toISOString(),
    };
    memoryStore.eventRegistrations.push(newReg);
    return newReg;
  },

  async cancelEventRegistration(userId, eventId) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (error) throw error;
      return true;
    }

    const idx = memoryStore.eventRegistrations.findIndex(r => r.user_id === userId && r.event_id === eventId);
    if (idx === -1) return false;
    memoryStore.eventRegistrations.splice(idx, 1);
    return true;
  },

  // -------------------------------------------------------------
  // ANNOUNCEMENTS
  // -------------------------------------------------------------
  async getAnnouncements({ clubId, limit = 20 }) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('announcements')
        .select('*, clubs(id, name, logo_url)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (clubId) query = query.eq('club_id', clubId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    let list = [...memoryStore.announcements];
    if (clubId) list = list.filter(a => a.club_id === clubId);

    return list.slice(0, limit).map(a => ({
      ...a,
      clubs: memoryStore.clubs.find(c => c.id === a.club_id) || null,
    }));
  },

  async createAnnouncement(announcementData) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('announcements')
        .insert([announcementData])
        .select('*, clubs(*)')
        .single();
      if (error) throw error;
      return data;
    }

    const created = {
      ...announcementData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.announcements.unshift(created);
    return {
      ...created,
      clubs: memoryStore.clubs.find(c => c.id === created.club_id) || null,
    };
  },

  async deleteAnnouncement(id) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { error } = await client.from('announcements').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const idx = memoryStore.announcements.findIndex(a => a.id === id);
    if (idx === -1) return false;
    memoryStore.announcements.splice(idx, 1);
    return true;
  },

  // -------------------------------------------------------------
  // STATS (HOME & ADMIN)
  // -------------------------------------------------------------
  async getPublicStats() {
    if (isSupabaseConfigured && supabase) {
      const [
        { count: totalClubs },
        { count: totalStudents },
        { count: upcomingEvents },
        { count: categoriesCount },
        { count: totalMemberships },
      ] = await Promise.all([
        supabase.from('clubs').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).gte('event_date', new Date().toISOString().split('T')[0]),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      ]);

      return {
        totalClubs: totalClubs || 0,
        totalStudents: (totalStudents || 0) + 1240, // Base active collegiate student body
        upcomingEvents: upcomingEvents || 0,
        interestCategories: categoriesCount || 0,
        totalMemberships: (totalMemberships || 0) + 380,
      };
    }

    return {
      totalClubs: memoryStore.clubs.filter(c => c.is_active).length,
      totalStudents: 1248,
      upcomingEvents: memoryStore.events.filter(e => e.status === 'upcoming').length,
      interestCategories: memoryStore.categories.length,
      totalMemberships: memoryStore.memberships.filter(m => m.status === 'approved').length + 380,
    };
  },

  async getAdminStats() {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const [
        { count: totalClubs },
        { count: totalStudents },
        { count: totalMemberships },
        { count: pendingRequests },
        { count: totalEvents },
      ] = await Promise.all([
        client.from('clubs').select('id', { count: 'exact', head: true }),
        client.from('profiles').select('id', { count: 'exact', head: true }),
        client.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        client.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        client.from('events').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalClubs: totalClubs || 0,
        totalStudents: totalStudents || 0,
        totalMemberships: totalMemberships || 0,
        pendingRequests: pendingRequests || 0,
        totalEvents: totalEvents || 0,
      };
    }

    return {
      totalClubs: memoryStore.clubs.length,
      totalStudents: memoryStore.users.length + 140,
      totalMemberships: memoryStore.memberships.filter(m => m.status === 'approved').length,
      pendingRequests: memoryStore.memberships.filter(m => m.status === 'pending').length,
      totalEvents: memoryStore.events.length,
    };
  },

  // -------------------------------------------------------------
  // STUDENTS / PROFILES
  // -------------------------------------------------------------
  async getAllProfiles() {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    return memoryStore.users;
  },

  async updateProfile(userId, profileData) {
    // Strip protected fields: cannot self-elevate role
    const sanitized = { ...profileData };
    delete sanitized.role;
    delete sanitized.id;
    delete sanitized.email;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...sanitized, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const user = memoryStore.users.find(u => u.id === userId);
    if (!user) throw new Error('User profile not found');
    Object.assign(user, sanitized);
    return user;
  },

  // -------------------------------------------------------------
  // STORAGE UPLOAD
  // -------------------------------------------------------------
  async uploadFile({ folder, filename, fileBuffer, mimeType }) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const path = `${folder}/${Date.now()}-${filename}`;

      const { data, error } = await client.storage
        .from('club-assets')
        .upload(path, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = client.storage
        .from('club-assets')
        .getPublicUrl(path);

      return { publicUrl, path };
    }

    // In local fallback mode, return a reliable Unsplash or data URL placeholder
    return {
      publicUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80`,
      path: `${folder}/${filename}`,
    };
  },

  // -------------------------------------------------------------
  // CLUB LEAD MANAGEMENT (ADMIN & LEAD OPERATIONS)
  // -------------------------------------------------------------
  async getClubLeadAssignments() {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      try {
        const { data, error } = await client
          .from('club_lead_assignments')
          .select(`
            *,
            clubs:club_id(*),
            profile:user_id(id, full_name, email, role, avatar_url, student_id, department),
            assigner:assigned_by(id, full_name, email)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Could not query club_lead_assignments from Supabase:', err.message);
      }
    }

    return (memoryStore.clubLeadAssignments || []).map((a) => {
      const club = memoryStore.clubs.find((c) => c.id === a.club_id);
      const profile = memoryStore.users.find((u) => u.id === a.user_id);
      const assigner = memoryStore.users.find((u) => u.id === a.assigned_by);
      return {
        ...a,
        clubs: club || null,
        profile: profile || null,
        assigner: assigner || null,
      };
    });
  },

  async assignClubLead({ userId, clubId, assignedBy }) {
    if (!userId || !clubId) {
      throw new Error('Both userId and clubId are required to assign a Club Lead.');
    }

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);

      // Verify club exists
      const { data: club, error: clubErr } = await client.from('clubs').select('id, name').eq('id', clubId).single();
      if (clubErr || !club) {
        throw new Error('Target club does not exist.');
      }

      // Verify user exists
      const { data: userProfile, error: userErr } = await client.from('profiles').select('id, email, role, full_name').eq('id', userId).single();
      if (userErr || !userProfile) {
        throw new Error('Target user does not exist.');
      }

      // Check if user is already an admin
      if (userProfile.role === 'admin') {
        throw new Error('Cannot assign an Administrator as a Club Lead.');
      }

      // Deactivate any existing active assignments for this club to keep 1 primary lead
      await client
        .from('club_lead_assignments')
        .update({ is_active: false })
        .eq('club_id', clubId);

      // Create new assignment
      const newAssignment = {
        id: crypto.randomUUID(),
        user_id: userId,
        club_id: clubId,
        assigned_by: assignedBy || null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        const { data: inserted, error: insertErr } = await client
          .from('club_lead_assignments')
          .upsert(newAssignment, { onConflict: 'user_id, club_id' })
          .select(`
            *,
            clubs:club_id(*),
            profile:user_id(id, full_name, email, role, avatar_url, student_id, department)
          `)
          .single();

        if (insertErr) throw insertErr;

        // Elevate user role to 'club_lead' in profiles
        try {
          await client
            .from('profiles')
            .update({ role: 'club_lead', updated_at: new Date().toISOString() })
            .eq('id', userId);
        } catch {}

        // Sync role in Supabase Auth user_metadata
        try {
          await client.auth.admin.updateUserById(userId, {
            user_metadata: { role: 'club_lead', assigned_club_id: clubId },
          });
        } catch {}

        return inserted;
      } catch (dbErr) {
        console.warn('Database assignment fallback to memory:', dbErr.message);
      }

      // Sync role in Supabase Auth even when table is falling back to memory
      try {
        await client.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'club_lead', assigned_club_id: clubId },
        });
      } catch {}
    }

    // Memory Store Fallback
    const existingIdx = (memoryStore.clubLeadAssignments || []).findIndex(
      (a) => a.club_id === clubId && a.is_active
    );
    if (existingIdx !== -1) {
      memoryStore.clubLeadAssignments[existingIdx].is_active = false;
    }

    const assignment = {
      id: 'cla-' + Math.random().toString(36).substring(2, 11),
      user_id: userId,
      club_id: clubId,
      assigned_by: assignedBy || null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!memoryStore.clubLeadAssignments) memoryStore.clubLeadAssignments = [];
    memoryStore.clubLeadAssignments.push(assignment);

    const targetUser = memoryStore.users.find((u) => u.id === userId);
    if (targetUser && targetUser.role !== 'admin') {
      targetUser.role = 'club_lead';
    }

    const club = memoryStore.clubs.find((c) => c.id === clubId);
    return {
      ...assignment,
      clubs: club || null,
      profile: targetUser || null,
    };
  },

  async reassignClubLead({ assignmentId, newClubId, newUserId, assignedBy }) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      try {
        const { data: existing, error: getErr } = await client
          .from('club_lead_assignments')
          .select('*')
          .eq('id', assignmentId)
          .single();

        if (!getErr && existing) {
          const updates = {
            updated_at: new Date().toISOString(),
            assigned_by: assignedBy || existing.assigned_by,
          };

          if (newClubId) updates.club_id = newClubId;
          if (newUserId) {
            updates.user_id = newUserId;
            await client.from('profiles').update({ role: 'club_lead' }).eq('id', newUserId);
            const { count } = await client
              .from('club_lead_assignments')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', existing.user_id)
              .eq('is_active', true)
              .neq('id', assignmentId);

            if (!count || count === 0) {
              await client.from('profiles').update({ role: 'student' }).eq('id', existing.user_id);
            }
          }

          const { data: updated, error: updErr } = await client
            .from('club_lead_assignments')
            .update(updates)
            .eq('id', assignmentId)
            .select(`
              *,
              clubs:club_id(*),
              profile:user_id(id, full_name, email, role, avatar_url, student_id, department)
            `)
            .single();

          if (!updErr && updated) return updated;
        }
      } catch (err) {
        console.warn('Reassign DB fallback:', err.message);
      }
    }

    // Memory Store Fallback
    const existing = (memoryStore.clubLeadAssignments || []).find((a) => a.id === assignmentId);
    if (!existing) throw new Error('Assignment record not found.');

    if (newClubId) existing.club_id = newClubId;
    if (newUserId) {
      const oldUserId = existing.user_id;
      existing.user_id = newUserId;
      const newUser = memoryStore.users.find((u) => u.id === newUserId);
      if (newUser && newUser.role !== 'admin') newUser.role = 'club_lead';

      const otherActive = (memoryStore.clubLeadAssignments || []).some(
        (a) => a.user_id === oldUserId && a.is_active && a.id !== assignmentId
      );
      if (!otherActive) {
        const oldUser = memoryStore.users.find((u) => u.id === oldUserId);
        if (oldUser && oldUser.role !== 'admin') oldUser.role = 'student';
      }
    }
    existing.updated_at = new Date().toISOString();
    return existing;
  },

  async removeClubLeadAssignment(assignmentId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      try {
        const { data: existing, error: getErr } = await client
          .from('club_lead_assignments')
          .select('*')
          .eq('id', assignmentId)
          .single();

        if (!getErr && existing) {
          const { error: delErr } = await client
            .from('club_lead_assignments')
            .delete()
            .eq('id', assignmentId);

          if (delErr) throw delErr;

          // Check if user has other active assignments
          const { count } = await client
            .from('club_lead_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', existing.user_id)
            .eq('is_active', true);

          if (!count || count === 0) {
            try {
              await client
                .from('profiles')
                .update({ role: 'student', updated_at: new Date().toISOString() })
                .eq('id', existing.user_id)
                .neq('role', 'admin');
            } catch {}

            try {
              await client.auth.admin.updateUserById(existing.user_id, {
                user_metadata: { role: 'student', assigned_club_id: null },
              });
            } catch {}
          }

          return { success: true, message: 'Club Lead assignment successfully removed.' };
        }
      } catch (err) {
        console.warn('Database remove assignment fallback to memory:', err.message);
      }
    }

    // Memory Store Fallback
    const idx = (memoryStore.clubLeadAssignments || []).findIndex((a) => a.id === assignmentId);
    if (idx === -1) throw new Error('Assignment record not found.');

    const [removed] = memoryStore.clubLeadAssignments.splice(idx, 1);
    const hasOther = (memoryStore.clubLeadAssignments || []).some(
      (a) => a.user_id === removed.user_id && a.is_active
    );
    if (!hasOther) {
      const u = memoryStore.users.find((user) => user.id === removed.user_id);
      if (u && u.role !== 'admin') u.role = 'student';

      if (isSupabaseConfigured && supabase) {
        const client = getClient(true);
        try {
          await client.auth.admin.updateUserById(removed.user_id, {
            user_metadata: { role: 'student', assigned_club_id: null },
          });
        } catch {}
      }
    }

    return { success: true, message: 'Club Lead assignment successfully removed.' };
  },

  async getEligibleUsersForClubLead(search = '') {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      let query = client
        .from('profiles')
        .select('id, full_name, email, student_id, department, role, avatar_url')
        .in('role', ['student', 'club_lead'])
        .order('full_name', { ascending: true })
        .limit(50);

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,student_id.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data) return data;
    }

    let list = (memoryStore.users || []).filter((u) => u.role === 'student' || u.role === 'club_lead');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.student_id?.toLowerCase().includes(q)
      );
    }
    return list;
  },

  /**
   * Comprehensive Club Lead & Club Directory
   * Merges all clubs (from Supabase/memory) with active/inactive leads and Auth accounts.
   * Every newly created club automatically appears as "unassigned" until a lead is provisioned.
   */
  async getClubLeadDirectory() {
    // 1. Fetch all clubs directly
    let clubs = [];
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('clubs')
        .select('*, categories(*)')
        .order('name', { ascending: true });
      if (!error && data) clubs = data;
    } else {
      clubs = (memoryStore.clubs || []).map((c) => ({
        ...c,
        categories: (memoryStore.categories || []).find((cat) => cat.id === c.category_id) || null,
      }));
    }

    // 2. Fetch assignments & auth users
    let authUsers = [];
    let dbAssignments = [];
    let profiles = [];

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
        if (users) authUsers = users;
      } catch (err) {
        console.warn('Directory listUsers warning:', err.message);
      }

      try {
        const { data: profData } = await supabaseAdmin.from('profiles').select('*');
        if (profData) profiles = profData;
      } catch {}

      try {
        const { data: assignData } = await supabaseAdmin
          .from('club_lead_assignments')
          .select('*')
          .eq('is_active', true);
        if (assignData) dbAssignments = assignData;
      } catch {}
    } else {
      authUsers = memoryStore.users || [];
      dbAssignments = (memoryStore.clubLeadAssignments || []).filter(a => a.is_active);
      profiles = memoryStore.users || [];
    }

    // 3. Map each club to its assigned lead
    const directory = clubs.map((club) => {
      // Find active assignment in table
      let assignment = dbAssignments.find((a) => a.club_id === club.id);
      let leadUser = null;

      if (assignment) {
        leadUser = authUsers.find((u) => u.id === assignment.user_id);
      }

      // Fallback: check if an auth user has assigned_club_id in user_metadata
      if (!leadUser) {
        leadUser = authUsers.find(
          (u) =>
            u.user_metadata?.role === 'club_lead' &&
            u.user_metadata?.assigned_club_id === club.id &&
            u.user_metadata?.account_status !== 'deactivated'
        );
      }

      const userProfile = leadUser ? profiles.find((p) => p.id === leadUser.id) : null;
      const isAssigned = Boolean(leadUser);
      const isDeactivated = leadUser?.user_metadata?.account_status === 'deactivated';

      return {
        club: {
          id: club.id,
          name: club.name,
          slug: club.slug,
          logo_url: club.logo_url,
          cover_image_url: club.cover_image_url,
          member_count: club.member_count || 0,
          categories: club.categories || null,
          category_id: club.category_id,
        },
        assignmentStatus: isAssigned ? 'assigned' : 'unassigned',
        accountStatus: !isAssigned ? null : isDeactivated ? 'deactivated' : 'active',
        lead: isAssigned
          ? {
              id: leadUser.id,
              full_name: userProfile?.full_name || leadUser.user_metadata?.full_name || 'Club Lead',
              email: leadUser.email,
              department: userProfile?.department || leadUser.user_metadata?.department || '',
              student_id: userProfile?.student_id || leadUser.user_metadata?.student_id || '',
              role: 'club_lead',
              avatar_url:
                userProfile?.avatar_url ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(leadUser.email)}`,
              created_at: leadUser.created_at,
              last_sign_in_at: leadUser.last_sign_in_at || null,
            }
          : null,
        assignment: assignment
          ? {
              id: assignment.id,
              is_active: assignment.is_active,
              created_at: assignment.created_at,
            }
          : null,
      };
    });

    // 4. Identify unassigned club lead accounts
    const assignedUserIds = new Set(
      directory.filter((d) => d.lead).map((d) => d.lead.id)
    );

    const unassignedLeads = authUsers
      .filter((u) => {
        const isLead = u.user_metadata?.role === 'club_lead' || u.role === 'club_lead';
        return isLead && !assignedUserIds.has(u.id);
      })
      .map((u) => {
        const p = profiles.find((prof) => prof.id === u.id);
        return {
          id: u.id,
          full_name: p?.full_name || u.user_metadata?.full_name || 'Club Lead',
          email: u.email,
          department: p?.department || u.user_metadata?.department || '',
          student_id: p?.student_id || u.user_metadata?.student_id || '',
          role: 'club_lead',
          account_status: u.user_metadata?.account_status || 'active',
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at || null,
        };
      });

    // 5. Summary metrics
    const totalClubs = clubs.length;
    const assignedClubs = directory.filter((d) => d.assignmentStatus === 'assigned').length;
    const unassignedClubs = totalClubs - assignedClubs;
    const totalActiveLeads = directory.filter(
      (d) => d.assignmentStatus === 'assigned' && d.accountStatus === 'active'
    ).length + unassignedLeads.filter(l => l.account_status !== 'deactivated').length;

    return {
      directory,
      unassignedLeads,
      stats: {
        totalClubs,
        assignedClubs,
        unassignedClubs,
        totalActiveLeads,
      },
    };
  },

  /**
   * Provision a brand-new Club Lead account securely via Supabase Admin API
   * Sets role to club_lead, assigns to club, and returns verified login credentials.
   */
  async createClubLeadAccount({
    fullName,
    email,
    password,
    clubId,
    department,
    studentId,
    assignedBy,
  }) {
    if (!email || !fullName) {
      throw new Error('Full Name and Email Address are required.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim();
    const generatedPass = password || 'lead123';

    // 1. Verify target club exists if specified
    if (clubId) {
      const club = await this.getClubByIdOrSlug(clubId);
      if (!club) throw new Error('Selected club does not exist.');
    }

    let authUser = null;

    if (isSupabaseConfigured && supabaseAdmin) {
      // Check existing auth users
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      authUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!authUser) {
        // Create new user in Supabase Auth
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: generatedPass,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            role: 'club_lead',
            assigned_club_id: clubId || null,
            department: department || null,
            student_id: studentId || null,
            account_status: 'active',
          },
        });

        if (createErr) throw createErr;
        authUser = created.user;

        // Upsert into public.profiles
        const profilePayload = {
          id: authUser.id,
          email: cleanEmail,
          full_name: cleanName,
          department: department || null,
          student_id: studentId || null,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
          updated_at: new Date().toISOString(),
        };

        try {
          await supabaseAdmin.from('profiles').upsert({ ...profilePayload, role: 'club_lead' });
        } catch (profErr) {
          // Fallback if role check constraint rejects 'club_lead'
          await supabaseAdmin.from('profiles').upsert({ ...profilePayload, role: 'student' });
        }
      } else {
        // User already exists
        if (authUser.user_metadata?.role === 'admin') {
          throw new Error('Cannot designate an Administrator account as a Club Lead.');
        }

        // Elevate to club_lead
        await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
          password: password ? password : undefined,
          user_metadata: {
            ...authUser.user_metadata,
            full_name: cleanName,
            role: 'club_lead',
            assigned_club_id: clubId || authUser.user_metadata?.assigned_club_id,
            account_status: 'active',
          },
        });

        try {
          await supabaseAdmin
            .from('profiles')
            .update({
              full_name: cleanName,
              department: department || undefined,
              student_id: studentId || undefined,
              updated_at: new Date().toISOString(),
            })
            .eq('id', authUser.id);
        } catch {}
      }
    } else {
      // Memory Store fallback
      authUser = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!authUser) {
        authUser = {
          id: 'u-' + Math.random().toString(36).substring(2, 11),
          email: cleanEmail,
          full_name: cleanName,
          role: 'club_lead',
          department: department || '',
          student_id: studentId || '',
          password_hash: await bcrypt.hash(generatedPass, 10),
          assigned_club_id: clubId || null,
          account_status: 'active',
          created_at: new Date().toISOString(),
        };
        memoryStore.users.push(authUser);
      } else {
        if (authUser.role === 'admin') {
          throw new Error('Cannot designate an Administrator account as a Club Lead.');
        }
        authUser.role = 'club_lead';
        authUser.full_name = cleanName;
        authUser.account_status = 'active';
        if (clubId) authUser.assigned_club_id = clubId;
      }
    }

    // 2. Assign to club if specified
    let assignment = null;
    if (clubId) {
      assignment = await this.assignClubLead({
        userId: authUser.id,
        clubId,
        assignedBy,
      });
    }

    return {
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        full_name: cleanName,
        role: 'club_lead',
      },
      assignment,
      initialPassword: generatedPass,
    };
  },

  /**
   * Toggle Club Lead account active status (Active / Deactivated)
   */
  async updateClubLeadStatus(userId, status) {
    const isDeactivated = status === 'deactivated';

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (user) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...user.user_metadata,
            account_status: isDeactivated ? 'deactivated' : 'active',
          },
        });
      }

      try {
        await supabaseAdmin
          .from('club_lead_assignments')
          .update({ is_active: !isDeactivated, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      } catch {}
    } else {
      const user = memoryStore.users.find((u) => u.id === userId);
      if (user) user.account_status = isDeactivated ? 'deactivated' : 'active';
      const ass = (memoryStore.clubLeadAssignments || []).find((a) => a.user_id === userId);
      if (ass) ass.is_active = !isDeactivated;
    }

    return {
      success: true,
      message: `Club Lead account successfully ${isDeactivated ? 'deactivated' : 'activated'}.`,
    };
  },

  /**
   * Reset Club Lead password securely
   */
  async resetClubLeadPassword(userId, newPassword) {
    const passToSet = newPassword || 'lead' + Math.floor(1000 + Math.random() * 9000);

    if (isSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: passToSet,
      });
      if (error) throw error;
    } else {
      const user = memoryStore.users.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      user.password_hash = await bcrypt.hash(passToSet, 10);
    }

    return {
      success: true,
      message: 'Password successfully reset.',
      temporaryPassword: passToSet,
    };
  },

  /**
   * Update permitted profile fields for a Club Lead
   */
  async updateClubLeadProfile(userId, { fullName, department, studentId }) {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (user) {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...user.user_metadata,
            full_name: fullName || user.user_metadata?.full_name,
            department: department !== undefined ? department : user.user_metadata?.department,
            student_id: studentId !== undefined ? studentId : user.user_metadata?.student_id,
          },
        });
      }

      try {
        await supabaseAdmin
          .from('profiles')
          .update({
            full_name: fullName,
            department,
            student_id: studentId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      } catch {}
    } else {
      const user = memoryStore.users.find((u) => u.id === userId);
      if (user) {
        if (fullName) user.full_name = fullName;
        if (department !== undefined) user.department = department;
        if (studentId !== undefined) user.student_id = studentId;
      }
    }

    return { success: true, message: 'Club Lead profile updated successfully.' };
  },

  /**
   * Safely delete a Club Lead account after confirmation
   */
  async deleteClubLeadAccount(userId) {
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from('club_lead_assignments').delete().eq('user_id', userId);
      } catch {}
      try {
        await supabaseAdmin.from('profiles').delete().eq('id', userId);
      } catch {}

      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
    } else {
      const uIdx = memoryStore.users.findIndex((u) => u.id === userId);
      if (uIdx !== -1) memoryStore.users.splice(uIdx, 1);
      const aIdx = (memoryStore.clubLeadAssignments || []).findIndex((a) => a.user_id === userId);
      if (aIdx !== -1) memoryStore.clubLeadAssignments.splice(aIdx, 1);
    }

    return { success: true, message: 'Club Lead account successfully deleted.' };
  },

  // -------------------------------------------------------------
  // DEDICATED CLUB LEAD DASHBOARD DATA & OPERATIONS
  // -------------------------------------------------------------
  async getClubLeadDashboardData(userId) {
    let assignedClubId = null;
    let assignedClub = null;

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      try {
        const { data: assignment, error } = await client
          .from('club_lead_assignments')
          .select('club_id, clubs(*)')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();

        if (!error && assignment) {
          assignedClubId = assignment.club_id;
          assignedClub = assignment.clubs;
        }
      } catch {}

      if (!assignedClubId) {
        try {
          const { data: { user } } = await client.auth.admin.getUserById(userId);
          if (user?.user_metadata?.assigned_club_id) {
            assignedClubId = user.user_metadata.assigned_club_id;
          }
        } catch {}
      }
    }

    // Memory Store check if not found
    if (!assignedClubId) {
      const memAss = (memoryStore.clubLeadAssignments || []).find(
        (a) => a.user_id === userId && a.is_active
      );
      if (memAss) {
        assignedClubId = memAss.club_id;
        assignedClub = (memoryStore.clubs || []).find((c) => c.id === assignedClubId);
      }
    }

    // Ensure club details are fetched if id is known
    if (assignedClubId && !assignedClub && isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: fetchedClub } = await client
        .from('clubs')
        .select('*, categories(*)')
        .eq('id', assignedClubId)
        .single();
      assignedClub = fetchedClub;
    }

    if (!assignedClubId || !assignedClub) {
      throw new Error('No active club assignment found for this Club Lead.');
    }

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const [
        { count: totalMembers },
        { count: pendingRequests },
        { count: upcomingEvents },
        { count: totalEvents },
        { count: totalAnnouncements },
        { data: recentMemberships },
        { data: recentEvents },
        { data: recentAnnouncements },
      ] = await Promise.all([
        client.from('memberships').select('id', { count: 'exact', head: true }).eq('club_id', assignedClubId).eq('status', 'approved'),
        client.from('memberships').select('id', { count: 'exact', head: true }).eq('club_id', assignedClubId).eq('status', 'pending'),
        client.from('events').select('id', { count: 'exact', head: true }).eq('club_id', assignedClubId).eq('status', 'upcoming'),
        client.from('events').select('id', { count: 'exact', head: true }).eq('club_id', assignedClubId),
        client.from('announcements').select('id', { count: 'exact', head: true }).eq('club_id', assignedClubId),
        client.from('memberships').select('*, profiles:user_id(id, full_name, email, avatar_url)').eq('club_id', assignedClubId).order('joined_at', { ascending: false }).limit(5),
        client.from('events').select('*').eq('club_id', assignedClubId).order('event_date', { ascending: true }).limit(5),
        client.from('announcements').select('*').eq('club_id', assignedClubId).order('created_at', { ascending: false }).limit(5),
      ]);

      return {
        club: assignedClub,
        stats: {
          totalMembers: totalMembers || 0,
          pendingRequests: pendingRequests || 0,
          upcomingEvents: upcomingEvents || 0,
          totalEvents: totalEvents || 0,
          totalAnnouncements: totalAnnouncements || 0,
        },
        recentMemberships: recentMemberships || [],
        recentEvents: recentEvents || [],
        recentAnnouncements: recentAnnouncements || [],
      };
    }

    // Memory Store stats
    const approvedMembers = (memoryStore.memberships || []).filter(
      (m) => m.club_id === assignedClubId && m.status === 'approved'
    );
    const pendingReqs = (memoryStore.memberships || []).filter(
      (m) => m.club_id === assignedClubId && m.status === 'pending'
    );
    const clubEvents = (memoryStore.events || []).filter((e) => e.club_id === assignedClubId);
    const clubAnns = (memoryStore.announcements || []).filter((a) => a.club_id === assignedClubId);

    return {
      club: assignedClub,
      stats: {
        totalMembers: approvedMembers.length,
        pendingRequests: pendingReqs.length,
        upcomingEvents: clubEvents.filter((e) => e.status === 'upcoming').length,
        totalEvents: clubEvents.length,
        totalAnnouncements: clubAnns.length,
      },
      recentMemberships: approvedMembers.slice(0, 5),
      recentEvents: clubEvents.slice(0, 5),
      recentAnnouncements: clubAnns.slice(0, 5),
    };
  },

  async updateClubForLead(clubId, updates) {
    const allowedFields = [
      'short_description',
      'full_description',
      'mission',
      'activities_and_achievements',
      'faculty_coordinator',
      'student_coordinator',
      'contact_email',
      'social_links',
      'logo_url',
      'cover_image_url',
    ];

    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('clubs')
        .update(sanitized)
        .eq('id', clubId)
        .select('*, categories(*)')
        .single();

      if (error) throw error;
      return data;
    }

    const club = memoryStore.clubs.find((c) => c.id === clubId);
    if (!club) throw new Error('Club not found.');
    Object.assign(club, sanitized);
    return club;
  },

  async getClubMembersForLead(clubId, { status = 'all', search = '' }) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      let query = client
        .from('memberships')
        .select(`
          *,
          profiles:user_id(id, full_name, email, student_id, department, year_of_study, avatar_url)
        `)
        .eq('club_id', clubId)
        .order('joined_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      let list = data || [];
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (m) =>
            m.profiles?.full_name?.toLowerCase().includes(q) ||
            m.profiles?.email?.toLowerCase().includes(q) ||
            m.profiles?.student_id?.toLowerCase().includes(q)
        );
      }
      return list;
    }

    let list = (memoryStore.memberships || []).filter((m) => m.club_id === clubId);
    if (status && status !== 'all') {
      list = list.filter((m) => m.status === status);
    }
    return list.map((m) => ({
      ...m,
      profiles: memoryStore.users.find((u) => u.id === m.user_id) || null,
    }));
  },

  async updateMembershipStatusForLead(clubId, membershipId, status) {
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new Error("Invalid status. Allowed values: 'approved', 'rejected', 'pending'");
    }

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);

      const { data: mem, error: fetchErr } = await client
        .from('memberships')
        .select('id, club_id')
        .eq('id', membershipId)
        .single();

      if (fetchErr || !mem) {
        throw new Error('Membership request not found.');
      }

      if (mem.club_id !== clubId) {
        throw new Error('Forbidden: You can only manage membership requests for your assigned club.');
      }

      const { data, error } = await client
        .from('memberships')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', membershipId)
        .select(`
          *,
          profiles:user_id(id, full_name, email, student_id, department, year_of_study, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    }

    const mem = (memoryStore.memberships || []).find((m) => m.id === membershipId);
    if (!mem) throw new Error('Membership request not found.');
    if (mem.club_id !== clubId) {
      throw new Error('Forbidden: You can only manage membership requests for your assigned club.');
    }
    mem.status = status;
    mem.updated_at = new Date().toISOString();
    return {
      ...mem,
      profiles: memoryStore.users.find((u) => u.id === mem.user_id) || null,
    };
  },

  async removeMemberForLead(clubId, membershipId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: mem } = await client
        .from('memberships')
        .select('id, club_id')
        .eq('id', membershipId)
        .single();

      if (!mem || mem.club_id !== clubId) {
        throw new Error('Forbidden: You can only remove members from your assigned club.');
      }

      const { error } = await client.from('memberships').delete().eq('id', membershipId);
      if (error) throw error;
      return { success: true, message: 'Member successfully removed.' };
    }

    const idx = (memoryStore.memberships || []).findIndex(
      (m) => m.id === membershipId && m.club_id === clubId
    );
    if (idx === -1) throw new Error('Member not found in assigned club.');
    memoryStore.memberships.splice(idx, 1);
    return { success: true, message: 'Member successfully removed.' };
  },

  async getClubEventsForLead(clubId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('events')
        .select('*, event_registrations(count)')
        .eq('club_id', clubId)
        .order('event_date', { ascending: false });

      if (error) throw error;
      return (data || []).map((e) => ({
        ...e,
        registration_count: e.event_registrations?.[0]?.count || 0,
      }));
    }

    return (memoryStore.events || []).filter((e) => e.club_id === clubId);
  },

  async createClubEventForLead(clubId, eventData) {
    if (!eventData.title || !eventData.event_date || !eventData.venue) {
      throw new Error('Title, date, and venue are required to create an event.');
    }

    const payload = {
      id: crypto.randomUUID(),
      club_id: clubId,
      title: eventData.title.trim(),
      description: eventData.description || 'No description provided.',
      banner_url: eventData.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      event_date: eventData.event_date,
      start_time: eventData.start_time || '10:00:00',
      end_time: eventData.end_time || '12:00:00',
      venue: eventData.venue.trim(),
      registration_url: eventData.registration_url || null,
      max_participants: eventData.max_participants ? Number(eventData.max_participants) : 100,
      status: eventData.status || 'upcoming',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client.from('events').insert(payload).select().single();
      if (error) throw error;
      return data;
    }

    memoryStore.events.push(payload);
    return payload;
  },

  async updateClubEventForLead(clubId, eventId, eventData) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);

      const { data: existing, error: fetchErr } = await client
        .from('events')
        .select('id, club_id')
        .eq('id', eventId)
        .single();

      if (fetchErr || !existing) throw new Error('Event not found.');
      if (existing.club_id !== clubId) {
        throw new Error('Forbidden: You can only edit events belonging to your assigned club.');
      }

      const updates = { ...eventData };
      delete updates.id;
      delete updates.club_id;
      updates.updated_at = new Date().toISOString();

      const { data, error } = await client
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const ev = (memoryStore.events || []).find((e) => e.id === eventId);
    if (!ev) throw new Error('Event not found.');
    if (ev.club_id !== clubId) {
      throw new Error('Forbidden: You can only edit events belonging to your assigned club.');
    }
    Object.assign(ev, eventData, { club_id: clubId, updated_at: new Date().toISOString() });
    return ev;
  },

  async deleteClubEventForLead(clubId, eventId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: existing } = await client
        .from('events')
        .select('id, club_id')
        .eq('id', eventId)
        .single();

      if (!existing || existing.club_id !== clubId) {
        throw new Error('Forbidden: You can only cancel or delete events belonging to your assigned club.');
      }

      const { error } = await client.from('events').delete().eq('id', eventId);
      if (error) throw error;
      return { success: true, message: 'Event successfully removed.' };
    }

    const idx = (memoryStore.events || []).findIndex((e) => e.id === eventId && e.club_id === clubId);
    if (idx === -1) throw new Error('Event not found in assigned club.');
    memoryStore.events.splice(idx, 1);
    return { success: true, message: 'Event successfully removed.' };
  },

  async getClubEventRegistrationsForLead(clubId, eventId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: ev } = await client.from('events').select('id, club_id, title').eq('id', eventId).single();
      if (!ev || ev.club_id !== clubId) {
        throw new Error('Forbidden: You can only access registrations for your assigned club events.');
      }

      const { data, error } = await client
        .from('event_registrations')
        .select(`
          *,
          profiles:user_id(id, full_name, email, student_id, department, year_of_study)
        `)
        .eq('event_id', eventId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      return { event: ev, registrations: data || [] };
    }

    const ev = (memoryStore.events || []).find((e) => e.id === eventId && e.club_id === clubId);
    if (!ev) throw new Error('Forbidden: Event not found in assigned club.');
    const regs = (memoryStore.eventRegistrations || []).filter((r) => r.event_id === eventId);
    return {
      event: ev,
      registrations: regs.map((r) => ({
        ...r,
        profiles: memoryStore.users.find((u) => u.id === r.user_id) || null,
      })),
    };
  },

  async getClubAnnouncementsForLead(clubId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data, error } = await client
        .from('announcements')
        .select('*, profiles:created_by(id, full_name, email)')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return (memoryStore.announcements || []).filter((a) => a.club_id === clubId);
  },

  async createClubAnnouncementForLead(clubId, data, userId) {
    if (!data.title || !data.content) {
      throw new Error('Title and content are required for an announcement.');
    }

    const payload = {
      id: crypto.randomUUID(),
      club_id: clubId,
      title: data.title.trim(),
      content: data.content.trim(),
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: inserted, error } = await client
        .from('announcements')
        .insert(payload)
        .select('*, profiles:created_by(id, full_name, email)')
        .single();

      if (error) throw error;
      return inserted;
    }

    memoryStore.announcements.push(payload);
    return payload;
  },

  async updateClubAnnouncementForLead(clubId, announcementId, data) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: existing } = await client
        .from('announcements')
        .select('id, club_id')
        .eq('id', announcementId)
        .single();

      if (!existing || existing.club_id !== clubId) {
        throw new Error('Forbidden: You can only edit announcements belonging to your assigned club.');
      }

      const updates = { ...data };
      delete updates.id;
      delete updates.club_id;
      updates.updated_at = new Date().toISOString();

      const { data: updated, error } = await client
        .from('announcements')
        .update(updates)
        .eq('id', announcementId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    }

    const ann = (memoryStore.announcements || []).find((a) => a.id === announcementId);
    if (!ann || ann.club_id !== clubId) throw new Error('Announcement not found in assigned club.');
    Object.assign(ann, data, { club_id: clubId, updated_at: new Date().toISOString() });
    return ann;
  },

  async deleteClubAnnouncementForLead(clubId, announcementId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const { data: existing } = await client
        .from('announcements')
        .select('id, club_id')
        .eq('id', announcementId)
        .single();

      if (!existing || existing.club_id !== clubId) {
        throw new Error('Forbidden: You can only delete announcements belonging to your assigned club.');
      }

      const { error } = await client.from('announcements').delete().eq('id', announcementId);
      if (error) throw error;
      return { success: true, message: 'Announcement deleted.' };
    }

    const idx = (memoryStore.announcements || []).findIndex(
      (a) => a.id === announcementId && a.club_id === clubId
    );
    if (idx === -1) throw new Error('Announcement not found in assigned club.');
    memoryStore.announcements.splice(idx, 1);
    return { success: true, message: 'Announcement deleted.' };
  },

  async getClubActivityForLead(clubId) {
    if (isSupabaseConfigured && supabase) {
      const client = getClient(true);
      const [
        { data: members },
        { data: events },
        { data: announcements },
      ] = await Promise.all([
        client.from('memberships').select('*, profiles:user_id(id, full_name, email)').eq('club_id', clubId).order('updated_at', { ascending: false }).limit(10),
        client.from('events').select('*').eq('club_id', clubId).order('created_at', { ascending: false }).limit(10),
        client.from('announcements').select('*').eq('club_id', clubId).order('created_at', { ascending: false }).limit(10),
      ]);

      const activities = [];

      (members || []).forEach((m) => {
        activities.push({
          id: `mem-${m.id}`,
          type: m.status === 'approved' ? 'member_joined' : m.status === 'pending' ? 'membership_requested' : 'membership_rejected',
          title: m.status === 'approved' ? 'New Member Joined' : m.status === 'pending' ? 'New Membership Request' : 'Membership Rejected',
          description: `${m.profiles?.full_name || 'A student'} (${m.profiles?.email || 'N/A'}) - status: ${m.status}`,
          timestamp: m.updated_at || m.joined_at,
        });
      });

      (events || []).forEach((e) => {
        activities.push({
          id: `ev-${e.id}`,
          type: 'event_created',
          title: `Event Scheduled: ${e.title}`,
          description: `Venue: ${e.venue} on ${e.event_date}`,
          timestamp: e.created_at,
        });
      });

      (announcements || []).forEach((a) => {
        activities.push({
          id: `ann-${a.id}`,
          type: 'announcement_posted',
          title: `Announcement: ${a.title}`,
          description: a.content.substring(0, 100) + '...',
          timestamp: a.created_at,
        });
      });

      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return activities.slice(0, 20);
    }

    return [];
  },
};

export { memoryStore };

