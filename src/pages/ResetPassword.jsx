// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword, validateConfirmPassword } from '../utils/validation';
import { Card, IconBadge, PageTitle, PasswordInput, StrengthMeter, Button, Alert } from '../components/UI';

const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // /reset-password/:token
  const { resetPassword } = useAuth();

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  const handleSubmit = async () => {
    const errs = {};
    const pErr = validatePassword(password);
    const mErr = validateConfirmPassword(password, confirm);
    if (pErr) errs.password = pErr;
    if (mErr) errs.confirm  = mErr;
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true); setApiError('');
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card>
        <div style={{ textAlign:'center', padding:'16px 0' }}>
          <div style={{ width:80, height:80, margin:'0 auto 28px', animation:'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both 0.1s' }}>
            <svg viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="rgba(52,211,153,0.07)" stroke="rgba(52,211,153,0.25)" strokeWidth="2"/>
              <polyline points="24,40 36,52 56,30" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray:80, strokeDashoffset:80, animation:'drawCheck 0.5s ease forwards 0.4s' }} />
            </svg>
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, marginBottom:10 }}>Password updated!</h2>
          <p style={{ color:'var(--text-3)', fontSize:14, lineHeight:1.65, marginBottom:24 }}>You're signed in. Redirecting to your dashboard…</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <IconBadge><LockIcon /></IconBadge>
      <PageTitle title="Set new password" subtitle="Choose a strong password — at least 8 characters." />

      <Alert type="error" message={apiError} />

      <PasswordInput id="reset-pw" label="New password" value={password}
        onChange={v => { setPassword(v); setErrors(p=>({...p,password:null})); }}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('reset-confirm').focus()}
        placeholder="Min. 8 characters" error={errors.password}
        autoComplete="new-password" autoFocus />
      <StrengthMeter password={password} />

      <PasswordInput id="reset-confirm" label="Confirm password" value={confirm}
        onChange={v => { setConfirm(v); setErrors(p=>({...p,confirm:null})); }}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Repeat password" error={errors.confirm}
        autoComplete="new-password" />

      <Button onClick={handleSubmit} loading={loading}>Reset password</Button>
    </Card>
  );
}
