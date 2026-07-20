import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';
import Sidebar from '../components/Sidebar.jsx';
import ImageCard from '../components/ImageCard.jsx';

export default function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  const loadSessions = useCallback(async () => {
    const { data } = await api.get('/sessions');
    setSessions(data);
  }, []);

  const loadSession = useCallback(async () => {
    if (!sessionId) {
      setGenerations([]);
      return;
    }
    try {
      const { data } = await api.get(`/sessions/${sessionId}`);
      setGenerations(data.generations);
    } catch {
      navigate('/');
    }
  }, [sessionId, navigate]);

  useEffect(() => { loadSessions(); }, [loadSessions]);
  useEffect(() => { loadSession(); }, [loadSession]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generations, generating]);

  const generate = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || generating) return;
    setError('');
    setGenerating(true);
    try {
      const { data } = await api.post('/images/generate', {
        prompt: text,
        sessionId: sessionId || undefined,
      });
      setPrompt('');
      if (!sessionId) {
        navigate(`/chat/${data.sessionId}`);
      } else {
        setGenerations((g) => [...g, data.generation]);
      }
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed, please try again');
    } finally {
      setGenerating(false);
    }
  };

  const regenerate = async (id) => {
    setError('');
    try {
      const { data } = await api.post(`/images/${id}/regenerate`);
      setGenerations((g) => [...g, data.generation]);
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Regeneration failed');
    }
  };

  return (
    <div className="layout">
      <Sidebar
        sessions={sessions}
        activeId={sessionId}
        onSessionsChange={loadSessions}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="chat-main">
        <header className="chat-header">
          <button className="btn ghost menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <h2>{sessions.find((s) => s.id === sessionId)?.title || 'New Chat'}</h2>
        </header>

        <section className="chat-scroll">
          {generations.length === 0 && !generating && (
            <div className="empty-state">
              <h3>✨ Describe anything, get an image</h3>
              <p className="muted">e.g. “a cyberpunk city at sunset, ultra detailed”</p>
            </div>
          )}
          {generations.map((g) => (
            <div key={g.id} className="chat-turn">
              <div className="bubble user">{g.prompt}</div>
              <ImageCard generation={g} onRegenerate={regenerate} />
            </div>
          ))}
          {generating && (
            <div className="chat-turn">
              <div className="bubble user">{prompt}</div>
              <div className="image-card generating">
                <div className="spinner" />
                <p className="muted">Generating your image…</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </section>

        {error && <p className="error center">{error}</p>}

        <form className="prompt-bar" onSubmit={generate}>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want…"
            disabled={generating}
          />
          <button className="btn primary" type="submit" disabled={generating || !prompt.trim()}>
            {generating ? '…' : 'Generate'}
          </button>
        </form>
      </main>
    </div>
  );
}
