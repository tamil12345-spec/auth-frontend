// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';
import { Card, IconBadge, PageTitle, Input, PasswordInput, StrengthMeter, Button, Alert, Divider, LinkButton } from '../components/UI';

const UserPlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: null }));
    setApiError('');
  };

  const handleSubmit = async () => {
    const errs = {};
    const nameErr    = validateName(form.name);
    const emailErr   = validateEmail(form.email);
    const pwErr      = validatePassword(form.password);
    const matchErr   = validateConfirmPassword(form.password, form.confirm);
    if (nameErr)  errs.name    = nameErr;
    if (emailErr) errs.email   = emailErr;
    if (pwErr)    errs.password = pwErr;
    if (matchErr) errs.confirm  = matchErr;
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <IconBadge><UserPlusIcon /></IconBadge>
      <PageTitle title="Create account" subtitle="Join us today — it's completely free." />

      <Alert type="error" message={apiError} />

      <Input id="name" label="Full name" value={form.name} onChange={v => setField('name', v)}
        placeholder="Your name" error={errors.name} autoComplete="name" autoFocus />

      <Input id="email" label="Email address" type="email" value={form.email} onChange={v => setField('email', v)}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('reg-pw').focus()}
        placeholder="you@example.com" error={errors.email} autoComplete="email" />

      <PasswordInput id="reg-pw" label="Password" value={form.password} onChange={v => setField('password', v)}
        onKeyDown={e => e.key === 'Enter' && document.getElementById('confirm-pw').focus()}
        placeholder="Min. 8 characters" error={errors.password} autoComplete="new-password" />
      <StrengthMeter password={form.password} />

      <PasswordInput id="confirm-pw" label="Confirm password" value={form.confirm} onChange={v => setField('confirm', v)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Repeat password" error={errors.confirm} autoComplete="new-password" />

      <Button onClick={handleSubmit} loading={loading}>Create account</Button>

      <Divider text="already have an account?" />
      <div style={{ textAlign:'center' }}>
        <LinkButton onClick={() => navigate('/login')}>Sign in instead</LinkButton>
      </div>
    </Card>
  );
}
