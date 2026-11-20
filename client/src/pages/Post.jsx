import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Post() {
  const [form, setForm] = useState({
    company: '', role: '', difficulty: 'Medium', outcome: 'Selected', tips: '',
    rounds: [{ title: '', details: '' }],
  });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const upd = (k, v) => setForm({ ...form, [k]: v });
  const updRound = (i, k, v) => upd('rounds', form.rounds.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const x = await api('/experiences', { method: 'POST', body: form });
      nav('/experience/' + x._id);
    } catch (e) { setErr(e.message); }
  };

  return (
    <form onSubmit={submit} className="card">
      <h2>Share your experience</h2>
      <input placeholder="Company" value={form.company} onChange={(e) => upd('company', e.target.value)} required />
      <input placeholder="Role (e.g. SDE Intern)" value={form.role} onChange={(e) => upd('role', e.target.value)} required />
      <select value={form.difficulty} onChange={(e) => upd('difficulty', e.target.value)}>
        <option>Easy</option><option>Medium</option><option>Hard</option>
      </select>
      <select value={form.outcome} onChange={(e) => upd('outcome', e.target.value)}>
        <option>Selected</option><option>Rejected</option><option>Waiting</option>
      </select>

      <h4>Rounds</h4>
      {form.rounds.map((r, i) => (
        <div key={i} className="round">
          <input placeholder={`Round ${i + 1} title (e.g. Online Assessment)`} value={r.title} onChange={(e) => updRound(i, 'title', e.target.value)} />
          <textarea rows="4" placeholder="Questions asked, what happened…" value={r.details} onChange={(e) => updRound(i, 'details', e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={() => upd('rounds', [...form.rounds, { title: '', details: '' }])}>+ Add round</button>

      <textarea rows="4" placeholder="Tips for juniors" value={form.tips} onChange={(e) => upd('tips', e.target.value)} />
      {err && <p className="err">{err}</p>}
      <button>Publish</button>
    </form>
  );
}