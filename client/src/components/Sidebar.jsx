import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';

export default function Sidebar({ sessions, activeId, onSessionsChange, open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (s) => {
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const saveRename = async (id) => {
    const title = editTitle.trim();
    setEditingId(null);
    if (!title) return;
    await api.patch(`/sessions/${id}`, { title });
    onSessionsChange();
  };

  const remove = async (id) => {
    if (!confirm('Delete this chat and all its images?')) return;
    await api.delete(`/sessions/${id}`);
    onSessionsChange();
    if (id === activeId) navigate('/');
  };

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="brand" onClick={onClose}>🎨 Imagine</Link>
          <button className="btn primary full" onClick={() => { navigate('/'); onClose(); }}>
            + New Chat
          </button>
          <Link to="/history" className="btn ghost full" onClick={onClose}>
            📜 History
          </Link>
        </div>

        <nav className="session-list">
          {sessions.map((s) => (
            <div key={s.id} className={`session-item ${s.id === activeId ? 'active' : ''}`}>
              {editingId === s.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveRename(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename(s.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <Link to={`/chat/${s.id}`} className="session-title" onClick={onClose}>
                    {s.title}
                    <span className="count">{s._count?.generations ?? 0}</span>
                  </Link>
                  <span className="session-actions">
                    <button title="Rename" onClick={() => startRename(s)}>✏️</button>
                    <button title="Delete" onClick={() => remove(s.id)}>🗑️</button>
                  </span>
                </>
              )}
            </div>
          ))}
          {sessions.length === 0 && <p className="muted">No chats yet</p>}
        </nav>

        <div className="sidebar-bottom">
          <span className="muted">{user?.name || user?.email}</span>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
