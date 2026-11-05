import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cce_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors & handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // If 401 unauthorized on protected endpoint, clear stale token
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('cce_auth_token');
      localStorage.removeItem('cce_user');
      localStorage.removeItem('cce_profile');
    }

    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  // Auth API
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    logout: () => api.post('/auth/logout'),
  },

  // Clubs API
  clubs: {
    getAll: (params) => api.get('/clubs', { params }),
    getFeatured: (limit = 6) => api.get('/clubs/featured', { params: { limit } }),
    getStats: () => api.get('/clubs/stats'),
    getByIdOrSlug: (idOrSlug) => api.get(`/clubs/${idOrSlug}`),
    create: (clubData) => api.post('/clubs', clubData),
    update: (id, updates) => api.put(`/clubs/${id}`, updates),
    delete: (id) => api.delete(`/clubs/${id}`),
  },

  // Categories API
  categories: {
    getAll: () => api.get('/categories'),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
  },

  // Memberships API
  memberships: {
    join: (clubId) => api.post('/memberships', { club_id: clubId }),
    getMy: () => api.get('/memberships/my'),
    leave: (clubId) => api.delete(`/memberships/${clubId}/leave`),
    getAll: (params) => api.get('/memberships', { params }),
    updateStatus: (id, status) => api.put(`/memberships/${id}/status`, { status }),
    remove: (id) => api.delete(`/memberships/${id}`),
  },

  // Favorites API
  favorites: {
    getMy: () => api.get('/favorites'),
    add: (clubId) => api.post(`/favorites/${clubId}`),
    remove: (clubId) => api.delete(`/favorites/${clubId}`),
  },

  // Events API
  events: {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => api.get(`/events/${id}`),
    register: (id) => api.post(`/events/${id}/register`),
    unregister: (id) => api.delete(`/events/${id}/register`),
    create: (data) => api.post('/events', data),
    update: (id, data) => api.put(`/events/${id}`, data),
    delete: (id) => api.delete(`/events/${id}`),
  },

  // Announcements API
  announcements: {
    getAll: (params) => api.get('/announcements', { params }),
    create: (data) => api.post('/announcements', data),
    delete: (id) => api.delete(`/announcements/${id}`),
  },

  // Admin API
  admin: {
    getStats: () => api.get('/admin/stats'),
    getStudents: () => api.get('/admin/students'),
  },

  // Image Upload
  upload: {
    image: (file, folder = 'clubs/logos') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },
};

export default api;

