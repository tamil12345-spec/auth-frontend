// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BackgroundOrbs } from './components/UI';

import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import Dashboard      from './pages/Dashboard';

// ── Route guards ──────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// ── Full-page loader ──────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:32, height:32, border:'2.5px solid rgba(99,102,241,0.3)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
}

// ── Auth layout (centered card with orbs) ─────────────────────
function AuthLayout({ children }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <BackgroundOrbs />
      <div style={{ position:'relative', zIndex:1, width:'100%', display:'flex', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"            element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>} />
          <Route path="/register"         element={<PublicRoute><AuthLayout><Register /></AuthLayout></PublicRoute>} />
          <Route path="/forgot-password"  element={<PublicRoute><AuthLayout><ForgotPassword /></AuthLayout></PublicRoute>} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/dashboard"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* Default */}
          <Route path="/"                 element={<Navigate to="/login" replace />} />
          <Route path="*"                 element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
