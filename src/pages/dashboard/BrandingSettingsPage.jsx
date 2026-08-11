import { useState, useEffect } from 'react';
import { getBranding, setBranding } from '../../lib/mockStore.js';

export default function BrandingSettingsPage() {
  const [data, setData] = useState(getBranding());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => { setData(getBranding()); }, []);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });
    setBranding(data);
    setTimeout(() => {
      setMsg({ type: 'success', text: 'Branding settings updated successfully.' });
      setSaving(false);
    }, 300);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">🎨 White-Label Branding</h1>
        <p className="page-subtitle">Customize the appearance of your secure vault and secret viewer</p>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label className="input-label" htmlFor="company-name">Company Name</label>
              <input
                id="company-name" type="text" className="input-field" placeholder="Acme Corp"
                value={data.companyName || ''}
                onChange={e => setData(d => ({ ...d, companyName: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="logo-url">Logo URL</label>
              <input
                id="logo-url" type="url" className="input-field" placeholder="https://example.com/logo.png"
                value={data.logoUrl || ''}
                onChange={e => setData(d => ({ ...d, logoUrl: e.target.value }))}
              />
              <p className="form-hint">Displayed on the public secret viewer and emails.</p>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="primary-color">Brand Primary Color (Hex)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  id="primary-color-picker" type="color"
                  value={data.primaryColor || '#116466'}
                  onChange={e => setData(d => ({ ...d, primaryColor: e.target.value }))}
                  style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer', background: 'transparent' }}
                />
                <input
                  id="primary-color" type="text" className="input-field" placeholder="#116466"
                  value={data.primaryColor || ''}
                  onChange={e => setData(d => ({ ...d, primaryColor: e.target.value }))}
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="custom-domain">Custom Domain</label>
              <input
                id="custom-domain" type="text" className="input-field" placeholder="secrets.acmecorp.com"
                value={data.customDomain || ''}
                onChange={e => setData(d => ({ ...d, customDomain: e.target.value }))}
              />
              <p className="form-hint">Requires Enterprise plan. DNS setup instructions will be emailed.</p>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="support-url">Support URL</label>
              <input
                id="support-url" type="url" className="input-field" placeholder="https://support.acmecorp.com"
                value={data.supportUrl || ''}
                onChange={e => setData(d => ({ ...d, supportUrl: e.target.value }))}
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
              {saving ? 'Saving...' : '💾 Save Branding Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
