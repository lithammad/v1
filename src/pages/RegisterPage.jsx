import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, setBranding, getBranding, addAuditLog } from '../lib/mockStore.js';

export default function RegisterPage() {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ name: email.split('@')[0] || 'User', email, tenantTier: 'free' });
    setBranding({ ...getBranding(), companyName: orgName });
    addAuditLog({ action: 'auth.register' });
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div className="logo-mark">AV</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
            Aegis
          </span>
        </div>

        <h1 className="auth-title">Get Started Free</h1>
        <p className="auth-subtitle">Create your organization vault in seconds</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Organization Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Acme Security Corp"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Work Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="alex@acmesec.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Create Free Account
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand-2)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
