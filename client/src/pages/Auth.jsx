import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Auth({ mode }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const d = await api(`/auth/${mode}`, { method: 'POST', body: form });
      login(d.token, d.user);
      nav('/');
    } catch (e) { setErr(e.message); }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="card">
      <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
      {mode === 'signup' && <input placeholder="Name" value={form.name} onChange={set('name')} required />}
      <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
      <input type="password" placeholder="Password (6+ chars)" value={form.password} onChange={set('password')} required />
      {err && <p className="err">{err}</p>}
      <button>{mode === 'login' ? 'Login' : 'Sign up'}</button>
    </form>
  );
}