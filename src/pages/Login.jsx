// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import { Card, IconBadge, PageTitle, Input, PasswordInput, Button, Alert, Divider, LinkButton } from '../components/UI';

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    const errs = {};
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (eErr) errs.email    = eErr;
    if (pErr) errs.password = pErr;
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setApiError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <IconBadge><ShieldIcon /></IconBadge>
      <PageTitle title="Welcome back" subtitle="Sign in to your account to continue." />

      <Alert type="error" message={apiError} />

      <Input id="email" label="Email" type="email" value={email}
        onChange={v => { setEmail(v); setErrors(p=>({...p,email:null})); setApiError(''); }}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('login-pw').focus()}
        placeholder="you@example.com" error={errors.email} autoComplete="email" autoFocus />

      <PasswordInput id="login-pw" label="Password" value={password}
        onChange={v => { setPassword(v); setErrors(p=>({...p,password:null})); setApiError(''); }}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Your password" error={errors.password} autoComplete="current-password" />

      <div style={{ textAlign:'right', marginTop:-10, marginBottom:18 }}>
        <LinkButton onClick={() => navigate('/forgot-password')}>Forgot password?</LinkButton>
      </div>

      <Button onClick={handleSubmit} loading={loading}>Sign in</Button>

      <Divider text="don't have an account?" />
      <div style={{ textAlign:'center' }}>
        <LinkButton onClick={() => navigate('/register')}>Create account</LinkButton>
      </div>
    </Card>
  );
}
