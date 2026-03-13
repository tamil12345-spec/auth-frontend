// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // checking stored token on mount

  // ── Restore session from localStorage ────────────────────
  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  // ── Register ──────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // ── Forgot password ───────────────────────────────────────
  const forgotPassword = useCallback(async (email) => {
    const { data } = await authAPI.forgotPassword(email);
    return data;
  }, []);

  // ── Reset password ────────────────────────────────────────
  const resetPassword = useCallback(async (token, password) => {
    const { data } = await authAPI.resetPassword(token, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading,
      register, login, logout,
      forgotPassword, resetPassword,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
