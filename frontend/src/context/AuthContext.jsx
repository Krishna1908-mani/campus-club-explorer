import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cce_auth_token'));
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token is stored
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cce_auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiService.auth.getMe();
        if (res.success) {
          setUser(res.user);
          setProfile(res.profile);
        }
      } catch (err) {
        console.warn('Session verification failed, resetting token:', err.message);
        localStorage.removeItem('cce_auth_token');
        setUser(null);
        setProfile(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await apiService.auth.login(credentials);
    if (res.success) {
      localStorage.setItem('cce_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiService.auth.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('cce_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('cce_auth_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates) => {
    const res = await apiService.auth.updateProfile(updates);
    if (res.success) {
      setProfile(res.profile);
    }
    return res;
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(profile?.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
