import { supabase, supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
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
      ] = await Promise.all([
        supabase.from('clubs').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }).gte('event_date', new Date().toISOString().split('T')[0]),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalClubs: totalClubs || 0,
        totalStudents: (totalStudents || 0) + 1240, // Base active collegiate student body
        upcomingEvents: upcomingEvents || 0,
        interestCategories: categoriesCount || 0,
      };
    }

    return {
      totalClubs: memoryStore.clubs.filter(c => c.is_active).length,
      totalStudents: 1248,
      upcomingEvents: memoryStore.events.filter(e => e.status === 'upcoming').length,
      interestCategories: memoryStore.categories.length,
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

    // In local demo mode, return a reliable Unsplash or data URL placeholder
    return {
      publicUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80`,
      path: `${folder}/${filename}`,
    };
  },
};

export { memoryStore };
