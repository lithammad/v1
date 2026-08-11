import { useState, useEffect } from 'react';
import { getSmtp, setSmtp } from '../../lib/mockStore.js';

export default function SmtpSettingsPage() {
  const [data, setData] = useState(getSmtp());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => { setData(getSmtp()); }, []);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    setSmtp(data);
    setTimeout(() => {
      setMsg({ type: 'success', text: 'SMTP settings updated successfully.' });
      setSaving(false);
    }, 300);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">📧 Custom SMTP</h1>
        <p className="page-subtitle">Configure your own mail server for white-labeled email delivery</p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1rem',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enable Custom SMTP</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send emails from your own domain rather than our global fallback</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={data.isActive} onChange={e => setData(d => ({ ...d, isActive: e.target.checked }))} />
                <span className="toggle-track" />
                <span className="toggle-thumb" />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="smtp-host">SMTP Host</label>
                <input
                  id="smtp-host" type="text" className="input-field" placeholder="smtp.mailgun.org"
                  value={data.host || ''}
                  onChange={e => setData(d => ({ ...d, host: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="smtp-port">Port</label>
                <input
                  id="smtp-port" type="number" className="input-field" placeholder="587"
                  value={data.port || 587}
                  onChange={e => setData(d => ({ ...d, port: parseInt(e.target.value) || 587 }))}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="smtp-user">SMTP Username</label>
              <input
                id="smtp-user" type="text" className="input-field" placeholder="postmaster@yourdomain.com"
                value={data.username || ''}
                onChange={e => setData(d => ({ ...d, username: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="smtp-pass">SMTP Password</label>
              <input
                id="smtp-pass" type="password" className="input-field" placeholder="••••••••••••"
                value={data.password || ''}
                onChange={e => setData(d => ({ ...d, password: e.target.value }))}
              />
            </div>

            <div className="divider" />

            <div className="input-group">
              <label className="input-label" htmlFor="from-email">Sender Email Address</label>
              <input
                id="from-email" type="email" className="input-field" placeholder="secure@yourdomain.com"
                value={data.fromEmail || ''}
                onChange={e => setData(d => ({ ...d, fromEmail: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="from-name">Sender Name</label>
              <input
                id="from-name" type="text" className="input-field" placeholder="Acme Security"
                value={data.fromName || ''}
                onChange={e => setData(d => ({ ...d, fromName: e.target.value }))}
              />
            </div>

            {msg.text && (
              <div style={{
                padding: '0.75rem 1rem', marginBottom: '1rem',
                background: msg.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                border: `1px solid ${msg.type === 'success' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                borderRadius: '12px', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                fontSize: '0.875rem',
              }}>
                {msg.type === 'success' ? '✓ ' : '⚠ '}{msg.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save SMTP Config'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
