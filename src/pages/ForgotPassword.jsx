// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { Card, IconBadge, PageTitle, Input, Button, Alert, LinkButton } from '../components/UI';

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const STATUS_STEPS = [
  'Connecting to server…',
  'Server is waking up, please wait…',
  'Almost there…',
  'Sending your email…',
];

function RenderWakeNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div style={{ background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.25)', borderRadius:10, padding:'11px 14px', marginBottom:18, fontSize:13, color:'#fbbf24', lineHeight:1.6, animation:'fadeIn 0.4s ease' }}>
      ⏳ <strong>Free server is waking up.</strong> This can take up to 60 seconds on first request. Please don't close the page.
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const [email, setEmail]           = useState('');
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError]     = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [statusMsg, setStatusMsg]   = useState('');

  const handleSubmit = async () => {
    setFieldError(''); setApiError(''); setSuccess(''); setStatusMsg('');
    const err = validateEmail(email);
    if (err) return setFieldError(err);

    setLoading(true);
    setStatusMsg(STATUS_STEPS[0]);

    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, STATUS_STEPS.length - 1);
      setStatusMsg(STATUS_STEPS[step]);
    }, 8000);

    try {
      const data = await forgotPassword(email.trim());
      clearInterval(interval);
      setStatusMsg('');
      setSuccess(data.message || 'Reset link sent! Check your inbox.');
    } catch (e) {
      clearInterval(interval);
      setStatusMsg('');
      if (
        e.message?.toLowerCase().includes('timeout') ||
        e.message?.toLowerCase().includes('exceeded') ||
        e.code === 'ECONNABORTED'
      ) {
        setApiError('Server was sleeping — it is now awake! Please wait 30 seconds and try again.');
      } else {
        setApiError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <IconBadge><MailIcon /></IconBadge>
      <PageTitle
        title="Forgot password?"
        subtitle="Enter your email — we'll send a reset link valid for 15 minutes."
      />

      <Alert type="error"   message={apiError || fieldError} />
      <Alert type="success" message={success} />

      {loading && statusMsg && (
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:10, padding:'11px 14px', marginBottom:18, fontSize:13.5, color:'#818cf8' }}>
          <div style={{ display:'flex', gap:3, flexShrink:0 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'#6366f1', animation:`dotPulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
          {statusMsg}
        </div>
      )}

      {loading && <RenderWakeNotice />}

      {!success && (
        <>
          <Input
            id="fp-email"
            label="Email address"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setFieldError(''); setApiError(''); }}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
            placeholder="you@example.com"
            error={fieldError}
            autoComplete="email"
            autoFocus
          />
          <Button onClick={handleSubmit} loading={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </>
      )}

      {success && (
        <>
          <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
            <div style={{ width:64, height:64, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p style={{ color:'var(--text-2)', fontSize:13, lineHeight:1.7 }}>
              Check your spam folder too if you don't see it within a minute.
            </p>
          </div>
          <Button onClick={() => navigate('/login')}>Back to sign in</Button>
        </>
      )}

      {!success && !loading && (
        <div style={{ textAlign:'center', marginTop:20 }}>
          <LinkButton onClick={() => navigate('/login')}>← Back to sign in</LinkButton>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </Card>
  );
}
