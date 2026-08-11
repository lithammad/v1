import { useState, useEffect } from 'react';
import { getAnalytics } from '../../lib/mockStore.js';

const riskColors = {
  low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)', critical: '#ff4d4d',
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => { setData(getAnalytics()); }, []);

  const stats = [
    { label: 'Total Secrets', value: data?.totalSecrets ?? 0, icon: '🔐' },
    { label: 'Active', value: data?.activeSecrets ?? 0, icon: '✅' },
    { label: 'Total Views', value: data?.totalViews ?? 0, icon: '👁' },
    { label: 'Avg Risk Score', value: data?.avgRiskScore?.toFixed(0) ?? '—', icon: '🛡️' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">📊 Security Analytics</h1>
        <p className="page-subtitle">Access intelligence, risk analysis, and threat visibility</p>
      </div>

      <div className="dashboard-grid">
        {stats.map(s => (
          <div key={s.label} className="dash-card">
            <div className="dash-card-title">{s.icon} {s.label}</div>
            <div className="dash-card-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Access Events</h2>
        </div>
        {!data?.recentAccessLogs?.length ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌍</div>
            <div className="empty-state-title">No access events yet</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th><th>IP / Location</th><th>Threat Flags</th>
                  <th>Device</th><th>Risk Score</th><th>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAccessLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className={`table-badge ${log.action === 'allowed' ? 'table-badge-success' : 'table-badge-danger'}`}>
                        {log.action === 'allowed' ? '✓ Allowed' : '✗ Denied'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ipAddress}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{[log.city, log.country].filter(Boolean).join(', ') || 'Unknown'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {log.isVpn && <span className="table-badge table-badge-warning">VPN</span>}
                        {log.isTor && <span className="table-badge table-badge-danger">TOR</span>}
                        {!log.isVpn && !log.isTor && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {[log.browser, log.os, log.deviceType].filter(Boolean).join(' · ') || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="risk-bar" style={{ width: 60 }}>
                          <div className="risk-fill" style={{ width: `${log.riskScore}%`, background: riskColors[log.riskLevel] }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: riskColors[log.riskLevel] || 'var(--text-muted)' }}>
                          {log.riskScore}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
