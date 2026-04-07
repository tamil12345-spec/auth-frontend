// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }       = useAuth();
  const navigate        = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');          // ← redirect on success
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign In</h2>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 20 }}>
            <Link to="/forgot-password" style={styles.link}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#0d1017',
  },
  card: {
    background: '#1a1f2e', borderRadius: 16, padding: '40px 36px',
    width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  title: {
    margin: '0 0 28px', fontSize: 24, fontWeight: 700,
    color: '#fff', fontFamily: 'Segoe UI, sans-serif',
  },
  errorBox: {
    background: '#2d1f1f', border: '1px solid #f87171',
    color: '#f87171', borderRadius: 8, padding: '10px 14px',
    marginBottom: 20, fontSize: 14, fontFamily: 'Segoe UI, sans-serif',
  },
  field:  { marginBottom: 18 },
  label:  { display: 'block', marginBottom: 6, fontSize: 13, color: '#8891a4', fontFamily: 'Segoe UI, sans-serif' },
  input:  {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: '#0d1017', border: '1px solid #2d3348',
    color: '#dde1eb', fontSize: 14, outline: 'none',
    fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    color: '#fff', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif',
  },
  link:   { color: '#6366f1', textDecoration: 'none', fontSize: 13 },
  footer: { marginTop: 24, textAlign: 'center', fontSize: 13, color: '#8891a4', fontFamily: 'Segoe UI, sans-serif' },
};