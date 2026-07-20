import { useState } from 'react';
import { downloadImage } from '../api.js';

export default function ImageCard({ generation, onRegenerate, sessionTitle }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  const regenerate = async () => {
    setBusy(true);
    try {
      await onRegenerate(generation.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <figure className="image-card">
      <div className="image-wrap">
        {!loaded && !failed && <div className="spinner" />}
        {failed ? (
          <div className="image-error">⚠️ Failed to load image</div>
        ) : (
          <img
            src={generation.imageUrl}
            alt={generation.prompt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>
      <figcaption>
        <p className="prompt-text" title={generation.prompt}>{generation.prompt}</p>
        <div className="card-meta">
          {sessionTitle && <span className="tag">{sessionTitle}</span>}
          <span className="muted">{new Date(generation.createdAt).toLocaleString()}</span>
        </div>
        <div className="card-actions">
          <button
            className="btn ghost"
            onClick={() => downloadImage(generation.imageUrl, `imagine-${generation.id}.png`)}
          >
            ⬇️ Download
          </button>
          {onRegenerate && (
            <button className="btn ghost" onClick={regenerate} disabled={busy}>
              {busy ? '…' : '↻ Regenerate'}
            </button>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
