import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getSecrets, revokeSecret } from '../../lib/mockStore.js';

const statusBadge = {
  active: 'table-badge-success',
  destroyed: 'table-badge-neutral',
  expired: 'table-badge-warning',
  revoked: 'table-badge-danger',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function SecretsPage() {
  const [secrets, setSecrets] = useState([]);
  const [revoking, setRevoking] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  const refresh = useCallback(() => setSecrets(getSecrets()), []);

  useEffect(() => { refresh(); }, [refresh]);

  const copyLink = async (token) => {
    const url = `${window.location.origin}/s/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const revoke = (token) => {
    if (!window.confirm('Permanently revoke and shred this secret?')) return;
    setRevoking(token);
    revokeSecret(token);
    refresh();
    setRevoking(null);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">🔐 My Secrets</h1>
          <p className="page-subtitle">Manage your encrypted secret links</p>
        </div>
        <Link to="/dashboard/secrets/new" className="btn btn-primary">
          ➕ New Secret
        </Link>
      </div>

      {secrets.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔐</div>
            <div className="empty-state-title">No secrets yet</div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Create your first encrypted secret link to get started.
            </p>
            <Link to="/dashboard/secrets/new" className="btn btn-primary">
              Create First Secret
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Type</th>
                <th>Views</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {secrets.map(s => (
                <tr key={s.id}>
                  <td>
                    <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--mint)' }}>
                      {s.token.slice(0, 16)}...
                    </code>
                  </td>
                  <td><span className="table-badge table-badge-neutral">{s.contentType}</span></td>
                  <td>
                    <span style={{ color: s.currentViews >= s.maxViews ? 'var(--danger)' : 'var(--text)', fontWeight: 600 }}>
                      {s.currentViews}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>/{s.maxViews}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <span className={`table-badge ${statusBadge[s.status] || 'table-badge-neutral'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{timeAgo(s.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {s.status === 'active' && (
                        <>
                          <button onClick={() => copyLink(s.token)} className="btn btn-ghost btn-sm" title="Copy link">
                            {copiedToken === s.token ? '✓' : '📋'}
                          </button>
                          <button
                            onClick={() => revoke(s.token)}
                            className="btn btn-ghost btn-sm"
                            disabled={revoking === s.token}
                            title="Revoke"
                            style={{ color: 'var(--danger)' }}
                          >
                            {revoking === s.token ? '...' : '🗑'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
