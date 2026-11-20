import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

export default function Detail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [e, setE] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { api('/experiences/' + id).then(setE).catch((x) => setErr(x.message)); }, [id]);

  const upvote = async () => {
    if (!user) return nav('/login');
    const d = await api(`/experiences/${id}/upvote`, { method: 'POST' });
    setE({ ...e, upvotes: d.upvotes });
  };
  const remove = async () => {
    if (!confirm('Delete this experience?')) return;
    await api('/experiences/' + id, { method: 'DELETE' });
    nav('/');
  };

  if (err) return <p className="err">{err}</p>;
  if (!e) return <p>Loading…</p>;

  return (
    <div className="card">
      <h2>{e.company} <span>· {e.role}</span></h2>
      <p><b className={e.outcome}>{e.outcome}</b> · {e.difficulty} · by {e.authorName} · {new Date(e.createdAt).toLocaleDateString()}</p>
      {e.rounds.map((r, i) => (
        <div key={i} className="round"><h4>Round {i + 1}: {r.title}</h4><p style={{ whiteSpace: 'pre-wrap' }}>{r.details}</p></div>
      ))}
      {e.tips && <><h4>Tips</h4><p style={{ whiteSpace: 'pre-wrap' }}>{e.tips}</p></>}
      <div className="actions">
        <button onClick={upvote}>▲ {e.upvotes.length}</button>
        <button onClick={() => { navigator.clipboard.writeText(location.href); alert('Link copied'); }}>Copy link</button>
        {user && user.id === e.author && <button onClick={remove}>Delete</button>}
      </div>
    </div>
  );
}