// src/utils/validation.js

export const validateEmail = (email) => {
  if (!email?.trim()) return 'Email is required.';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email address.';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
};

export const validateName = (name) => {
  if (!name?.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
};

export const validateConfirmPassword = (password, confirm) => {
  if (!confirm) return 'Please confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return null;
};

export const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Too weak',  color: '#f87171' },
    { label: 'Fair',      color: '#fbbf24' },
    { label: 'Good',      color: '#34d399' },
    { label: 'Strong',    color: '#6366f1' },
  ];
  return { score, ...levels[score] };
};
