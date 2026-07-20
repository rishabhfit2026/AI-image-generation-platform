import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import ImageCard from '../components/ImageCard.jsx';

export default function History() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get('/images/history', { params: { page, limit: 12, search: query } })
      .then(({ data }) => {
        if (cancelled) return;
        setItems(data.items);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [page, query]);

  return (
    <div className="history-page">
      <header className="history-header">
        <Link to="/" className="btn ghost">← Back to chat</Link>
        <h2>📜 Your history {total ? `(${total})` : ''}</h2>
        <input
          className="search-input"
          placeholder="Search prompts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {loading ? (
        <div className="center-fill"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p className="muted">{query ? 'No prompts match your search.' : 'Generate your first image to see it here.'}</p>
        </div>
      ) : (
        <div className="history-grid">
          {items.map((g) => (
            <ImageCard key={g.id} generation={g} sessionTitle={g.session?.title} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <footer className="pagination">
          <button className="btn ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>Page {page} / {totalPages}</span>
          <button
            className="btn ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </footer>
      )}
    </div>
  );
}
