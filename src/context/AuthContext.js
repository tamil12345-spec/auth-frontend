// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token    = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await authAPI.register({ name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('❌ Register failed:', err.message);
      throw err; // re-throw so Register.jsx catch block handles it
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('❌ Login failed:', err.message);
      throw err; // re-throw so Login.jsx catch block handles it
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const { data } = await authAPI.forgotPassword(email);
      return data;
    } catch (err) {
      console.error('❌ Forgot password failed:', err.message);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    try {
      const { data } = await authAPI.resetPassword(token, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('❌ Reset password failed:', err.message);
      throw err;
    }
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