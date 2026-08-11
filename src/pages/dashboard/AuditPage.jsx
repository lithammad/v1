import { useState, useEffect } from 'react';
import { getAuditLogs, isChainValid } from '../../lib/mockStore.js';

const actionIcon = {
  'secret.created': '➕', 'secret.viewed': '👁', 'secret.destroyed': '💥',
  'secret.revoked': '🚫', 'secret.expired': '⏰', 'auth.login': '🔑',
  'auth.logout': '👋', 'auth.failed': '⚠️', 'auth.register': '👤',
  'verification.sent': '📧', 'verification.success': '✅', 'verification.failed': '❌',
  'access.denied': '🛡️', 'access.policy_violation': '⚖️',
};

function riskBadge(score) {
  if (score >= 76) return 'table-badge-critical';
  if (score >= 51) return 'table-badge-danger';
  if (score >= 21) return 'table-badge-warning';
  return 'table-badge-success';
}

function riskLabel(score) {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 21) return 'MEDIUM';
  return 'LOW';
}

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [chainValid, setChainValid] = useState(null);

  useEffect(() => {
    setLogs([...getAuditLogs()].reverse());
    setChainValid(isChainValid());
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">📋 Audit Log</h1>
          <p className="page-subtitle">Immutable, cryptographically chained event history</p>
        </div>
        {chainValid !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
            background: chainValid ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${chainValid ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
            borderRadius: '12px', fontSize: '0.8125rem', fontWeight: 600,
            color: chainValid ? 'var(--success)' : 'var(--danger)',
          }}>
            {chainValid ? '✓ Chain Integrity Verified' : '⚠ Chain Integrity Compromised'}
          </div>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No audit events yet</div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th><th>Action</th><th>Resource</th><th>IP Address</th>
                <th>Risk</th><th>Hash (prev→row)</th><th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{actionIcon[log.action] || '📌'}</td>
                  <td><code style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--mint)' }}>{log.action}</code></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.resourceType || '—'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{log.ipAddress || '—'}</td>
                  <td>
                    {log.riskScore > 0 ? (
                      <span className={`table-badge ${riskBadge(log.riskScore)}`}>{riskLabel(log.riskScore)} ({log.riskScore})</span>
                    ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <span title={`prev: ${log.prevHash}`}>{log.prevHash.slice(0, 8)}</span>
                    <span style={{ color: 'var(--accent)', margin: '0 0.25rem' }}>→</span>
                    <span title={`row: ${log.rowHash}`}>{log.rowHash.slice(0, 8)}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString()}
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
