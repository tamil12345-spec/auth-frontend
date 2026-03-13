// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'48px 44px', width:'100%', maxWidth:480, animation:'fadeSlideUp 0.5s ease both', textAlign:'center' }}>

        {/* Avatar */}
        <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:28, fontWeight:700, fontFamily:'var(--font-display)', color:'white', boxShadow:'0 0 28px rgba(99,102,241,0.4)' }}>
          {initial}
        </div>

        <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, marginBottom:6 }}>
          Welcome, {user?.name}!
        </h1>
        <p style={{ color:'var(--text-3)', fontSize:14, marginBottom:32 }}>{user?.email}</p>

        {/* Info cards */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {[
            { label:'Status', value:'✅ Authenticated' },
            { label:'Role',   value:'👤 User' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px', textAlign:'left' }}>
              <p style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:4 }}>{label}</p>
              <p style={{ fontSize:14, fontWeight:500 }}>{value}</p>
            </div>
          ))}
        </div>

        <button onClick={handleLogout}
          style={{ width:'100%', padding:'14px', background:'transparent', border:'1px solid rgba(248,113,113,0.3)', borderRadius:10, color:'#f87171', fontSize:14, fontWeight:600, fontFamily:'var(--font-body)', cursor:'pointer', transition:'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(248,113,113,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          Sign out
        </button>
      </div>
    </div>
  );
}
