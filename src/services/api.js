// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://auth-backend-m2zb.onrender.com/api',
  timeout: 60000, // 60s — Render free tier can take 30-60s to wake up
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize error messages
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return Promise.reject(new Error('timeout exceeded'));
    }
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register:       (data)             => api.post('/auth/register', data),
  login:          (data)             => api.post('/auth/login', data),
  forgotPassword: (email)            => api.post('api/auth/forgot-password', { email }),
  resetPassword:  (token, password)  => api.post(`/auth/reset-password/${token}`, { password }),
};

export default api;
