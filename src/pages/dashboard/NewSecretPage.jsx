import { useState, useCallback } from 'react';
import { createSecret } from '../../lib/mockStore.js';

const steps = ['content', 'policy', 'security', 'review'];
const stepLabels = ['Content', 'Policy', 'Security', 'Generate'];

export default function NewSecretPage() {
  const [step, setStep] = useState('content');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [policy, setPolicy] = useState({ maxViews: 1, burnAfterReading: true, expiresInHours: 24 });
  const [security, setSecurity] = useState({
    allowedEmails: '', allowedCountries: '',
    blockVpn: false, blockTor: false, blockDatacenter: false, watermarkEnabled: false,
  });

  const currentIndex = steps.indexOf(step);

  const handleGenerate = useCallback(async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(content);
      await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

      const rawKey = await window.crypto.subtle.exportKey('raw', key);
      const keyB64url = btoa(String.fromCharCode(...new Uint8Array(rawKey))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      const now = new Date();
      now.setHours(now.getHours() + policy.expiresInHours);

      const secret = createSecret({
        contentType: 'text',
        maxViews: policy.maxViews,
        burnAfterReading: policy.burnAfterReading,
        expiresAt: now.toISOString(),
      });

      const url = `${window.location.origin}/s/${secret.token}#${keyB64url}`;
      setShareUrl(url);
      setStep('review');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [content, policy]);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">➕ New Secret</h1>
        <p className="page-subtitle">Encrypt and share a secret securely</p>
      </div>

      <div className="steps" style={{ marginBottom: '2rem' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step${s === step ? ' active' : ''}${i < currentIndex ? ' done' : ''}`}>
              <div className="step-number">{i < currentIndex ? '✓' : i + 1}</div>
              <span>{stepLabels[i]}</span>
            </div>
            {i < steps.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {step === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="secret-content">Secret Content</label>
                <textarea
                  id="secret-content"
                  className="input-field"
                  placeholder="Enter the sensitive information to share securely...&#10;Examples: API keys, passwords, SSH keys, connection strings, private notes"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  style={{ minHeight: 200, fontFamily: 'monospace', fontSize: '0.9rem' }}
                />
                <p className="form-hint">🔒 This content is encrypted in your browser. It never leaves your device in plaintext.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setStep('policy')} disabled={!content.trim()}>
                  Next: Access Policy →
                </button>
              </div>
            </div>
          )}

          {step === 'policy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="max-views">Maximum Views</label>
                  <input
                    id="max-views"
                    type="number"
                    className="input-field"
                    min={1} max={100}
                    value={policy.maxViews}
                    onChange={e => setPolicy(p => ({ ...p, maxViews: parseInt(e.target.value) || 1 }))}
                  />
                  <p className="form-hint">Secret auto-expires after this many views</p>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="expires-hours">Expires After</label>
                  <select
                    id="expires-hours"
                    className="input-field"
                    value={policy.expiresInHours}
                    onChange={e => setPolicy(p => ({ ...p, expiresInHours: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1 hour</option>
                    <option value={6}>6 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={72}>3 days</option>
                    <option value={168}>7 days</option>
                    <option value={720}>30 days</option>
                  </select>
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>🔥 Burn After Reading</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Cryptographically shred the secret immediately after first view
                  </div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={policy.burnAfterReading} onChange={e => setPolicy(p => ({ ...p, burnAfterReading: e.target.checked }))} />
                  <span className="toggle-track" />
                  <span className="toggle-thumb" />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-secondary" onClick={() => setStep('content')}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep('security')}>Next: Security →</button>
              </div>
            </div>
          )}

          {step === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="allowed-emails">Allowed Email Addresses</label>
                <input
                  id="allowed-emails"
                  type="text"
                  className="input-field"
                  placeholder="alice@company.com, bob@company.com"
                  value={security.allowedEmails}
                  onChange={e => setSecurity(s => ({ ...s, allowedEmails: e.target.value }))}
                />
                <p className="form-hint">Comma-separated emails. Leave empty to allow anyone with the link.</p>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="allowed-countries">Allowed Countries (ISO codes)</label>
                <input
                  id="allowed-countries"
                  type="text"
                  className="input-field"
                  placeholder="US, GB, PK"
                  value={security.allowedCountries}
                  onChange={e => setSecurity(s => ({ ...s, allowedCountries: e.target.value }))}
                />
                <p className="form-hint">2-letter ISO country codes. Leave empty to allow all countries.</p>
              </div>

              {[
                ['blockVpn', '🔒 Block VPN Connections', 'Deny access from VPN providers'],
                ['blockTor', '🧅 Block Tor Network', 'Deny access from Tor exit nodes'],
                ['blockDatacenter', '🏭 Block Datacenter IPs', 'Deny access from cloud/hosting providers'],
                ['watermarkEnabled', '💧 Enable Watermark', 'Overlay recipient info on the decrypted content'],
              ].map(([key, label, hint]) => (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.875rem 1rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{hint}</div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={security[key]}
                      onChange={e => setSecurity(s => ({ ...s, [key]: e.target.checked }))}
                    />
                    <span className="toggle-track" />
                    <span className="toggle-thumb" />
                  </label>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep('policy')}>← Back</button>
                <button className="btn btn-accent" onClick={handleGenerate} disabled={loading}>
                  {loading ? 'Encrypting...' : '🔐 Encrypt & Generate Link'}
                </button>
              </div>
            </div>
          )}

          {step === 'review' && shareUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, var(--accent), var(--brand))',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              }}>✓</div>

              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.375rem' }}>Secret Encrypted Successfully!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Share this link with your recipient. The encryption key is embedded in the URL fragment.
                </p>
              </div>

              <div style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem',
                wordBreak: 'break-all', textAlign: 'left', color: 'var(--mint)',
              }}>
                {shareUrl.split('#')[0]}
                <span style={{ color: 'var(--accent)' }}>#{shareUrl.split('#')[1]}</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  }}
                >
                  📋 Copy Full Link
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setContent(''); setShareUrl(''); setStep('content'); }}
                >
                  Create Another
                </button>
              </div>

              <div style={{
                padding: '0.875rem 1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '100%', textAlign: 'left',
              }}>
                ⚠️ <strong>Security Note:</strong> The link fragment (after #) is your decryption key. Once you close this page, it cannot be recovered. Share via a secure channel.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
