import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Feed() {
  const [f, setF] = useState({ search: '', difficulty: '', outcome: '', page: 1 });
  const [data, setData] = useState({ items: [], pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
      api('/experiences?' + qs).then(setData).finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [f]);

  const set = (k, v) => setF({ ...f, [k]: v, page: 1 });

  return (
    <>
      <div className="filters">
        <input placeholder="Search company or role" value={f.search} onChange={(e) => set('search', e.target.value)} />
        <select value={f.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
          <option value="">Any difficulty</option>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select value={f.outcome} onChange={(e) => set('outcome', e.target.value)}>
          <option value="">Any outcome</option>
          <option>Selected</option><option>Rejected</option><option>Waiting</option>
        </select>
      </div>

      {loading && <p>Loading… (first load can take ~30s while the server wakes up)</p>}
      {!loading && data.items.length === 0 && <p>No experiences found. Be the first to share one.</p>}

      {data.items.map((e) => (
        <Link key={e._id} to={`/experience/${e._id}`} className="card item">
          <h3>{e.company} <span>· {e.role}</span></h3>
          <p>
            <b className={e.outcome}>{e.outcome}</b> · {e.difficulty} · ▲ {e.upvotes.length} · by {e.authorName} ·{' '}
            {new Date(e.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}

      <div className="pager">
        <button disabled={f.page <= 1} onClick={() => setF({ ...f, page: f.page - 1 })}>Prev</button>
        <span>{f.page} / {data.pages}</span>
        <button disabled={f.page >= data.pages} onClick={() => setF({ ...f, page: f.page + 1 })}>Next</button>
      </div>
    </>
  );
}