// src/components/UI.jsx  — all shared UI components
import React, { useState } from 'react';
import { getPasswordStrength } from '../utils/validation';

// ── Icons ─────────────────────────────────────────────────────
export const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const Spinner = ({ size = 18 }) => (
  <div style={{ width: size, height: size, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
);

export const BackgroundOrbs = () => (
  <>
    <div style={{ position:'fixed', width:600, height:600, background:'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', top:-150, left:-150, pointerEvents:'none', zIndex:0, animation:'orb1 12s ease-in-out infinite' }} />
    <div style={{ position:'fixed', width:500, height:500, background:'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', bottom:-100, right:-100, pointerEvents:'none', zIndex:0, animation:'orb2 15s ease-in-out infinite' }} />
    <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none', zIndex:0 }} />
  </>
);

export const Card = ({ children }) => (
  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'48px 44px', width:'100%', maxWidth:440, boxShadow:'var(--shadow), 0 0 0 1px rgba(255,255,255,0.02)', animation:'fadeSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) both', position:'relative' }}>
    {children}
  </div>
);

export const IconBadge = ({ children }) => (
  <div style={{ width:56, height:56, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, background:'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.18))', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8', boxShadow:'0 0 20px rgba(99,102,241,0.18)' }}>
    {children}
  </div>
);

export const PageTitle = ({ title, subtitle }) => (
  <>
    <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, letterSpacing:'-0.5px', marginBottom:8, background:'linear-gradient(135deg, #dde1eb 30%, #8891a4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{title}</h1>
    <p style={{ color:'var(--text-3)', fontSize:14, lineHeight:1.65, marginBottom:32 }}>{subtitle}</p>
  </>
);

export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const styles = {
    error:   { bg:'rgba(248,113,113,0.08)',  border:'rgba(248,113,113,0.25)',  color:'#f87171' },
    success: { bg:'rgba(52,211,153,0.08)',   border:'rgba(52,211,153,0.25)',   color:'#34d399' },
    info:    { bg:'rgba(99,102,241,0.08)',   border:'rgba(99,102,241,0.25)',   color:'#818cf8' },
  };
  const s = styles[type];
  return (
    <div style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color, borderRadius:'var(--radius-sm)', padding:'11px 14px', fontSize:13.5, marginBottom:18, display:'flex', alignItems:'flex-start', gap:9, lineHeight:1.5, animation:'fadeIn 0.2s ease' }}>
      <span>{message}</span>
    </div>
  );
};

export const Input = ({ id, label, type='text', value, onChange, onKeyDown, placeholder, error, autoComplete, autoFocus, style }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18, ...style }}>
      {label && <label htmlFor={id} style={{ display:'block', fontSize:11.5, fontWeight:600, color: error ? 'var(--error)' : 'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:8 }}>{label}</label>}
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown} placeholder={placeholder}
        autoComplete={autoComplete} autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width:'100%', background:'var(--bg)', border:`1px solid ${error ? 'rgba(248,113,113,0.5)' : focused ? 'var(--accent)' : 'var(--border)'}`, borderRadius:'var(--radius-sm)', padding:'14px 16px', fontFamily:'var(--font-body)', fontSize:15, color:'var(--text)', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', caretColor:'var(--accent)', boxShadow: error ? '0 0 0 3px rgba(248,113,113,0.1)' : focused ? '0 0 0 3px var(--accent-glow)' : 'none' }}
      />
      {error && <p style={{ fontSize:12, color:'var(--error)', marginTop:5 }}>{error}</p>}
    </div>
  );
};

export const PasswordInput = ({ id, label, value, onChange, onKeyDown, placeholder, error, autoComplete, autoFocus }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:18 }}>
      {label && <label htmlFor={id} style={{ display:'block', fontSize:11.5, fontWeight:600, color: error ? 'var(--error)' : 'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:8 }}>{label}</label>}
      <div style={{ position:'relative' }}>
        <input
          id={id} type={show ? 'text' : 'password'} value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown} placeholder={placeholder}
          autoComplete={autoComplete} autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ width:'100%', background:'var(--bg)', border:`1px solid ${error ? 'rgba(248,113,113,0.5)' : focused ? 'var(--accent)' : 'var(--border)'}`, borderRadius:'var(--radius-sm)', padding:'14px 48px 14px 16px', fontFamily:'var(--font-body)', fontSize:15, color:'var(--text)', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', caretColor:'var(--accent)', boxShadow: error ? '0 0 0 3px rgba(248,113,113,0.1)' : focused ? '0 0 0 3px var(--accent-glow)' : 'none' }}
        />
        <button type="button" onClick={() => setShow(p => !p)} tabIndex={-1}
          style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color: show ? 'var(--text-2)' : 'var(--text-3)', display:'flex', alignItems:'center', padding:4 }}>
          <EyeIcon open={show} />
        </button>
      </div>
      {error && <p style={{ fontSize:12, color:'var(--error)', marginTop:5 }}>{error}</p>}
    </div>
  );
};

export const StrengthMeter = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop:-10, marginBottom:18 }}>
      <div style={{ display:'flex', gap:4, marginBottom:6 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ flex:1, height:3, borderRadius:3, background: i <= score ? color : 'var(--border)', transition:'background 0.3s' }} />)}
      </div>
      {label && <p style={{ fontSize:12, color, transition:'color 0.3s' }}>{label}</p>}
    </div>
  );
};

export const Button = ({ children, onClick, loading, disabled, variant='primary', style }) => {
  const isPrimary = variant === 'primary';
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      style={{ width:'100%', padding:'15px', background: isPrimary ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'transparent', color:'white', fontFamily:'var(--font-body)', fontSize:15, fontWeight:600, border: isPrimary ? 'none' : '1px solid var(--border)', borderRadius:'var(--radius-sm)', cursor:(disabled||loading) ? 'not-allowed' : 'pointer', opacity:(disabled||loading) ? 0.5 : 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: isPrimary ? '0 4px 20px rgba(99,102,241,0.3)' : 'none', transition:'opacity 0.2s, transform 0.15s, box-shadow 0.2s', minHeight:52, marginTop:8, ...style }}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

export const Divider = ({ text }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
    <div style={{ flex:1, height:1, background:'var(--border)' }} />
    {text && <span style={{ color:'var(--text-3)', fontSize:12 }}>{text}</span>}
    <div style={{ flex:1, height:1, background:'var(--border)' }} />
  </div>
);

export const LinkButton = ({ children, onClick }) => (
  <button type="button" onClick={onClick}
    style={{ background:'none', border:'none', color:'var(--accent)', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:500, transition:'opacity 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
    onMouseLeave={e => e.currentTarget.style.opacity='1'}>
    {children}
  </button>
);
