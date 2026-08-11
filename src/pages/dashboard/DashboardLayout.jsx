import { useEffect, useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUser, clearUser, getBranding, addAuditLog } from '../../lib/mockStore.js';

const navItems = [
  { to: '/dashboard/secrets', label: 'Secrets', icon: '🔐', section: 'main' },
  { to: '/dashboard/secrets/new', label: 'New Secret', icon: '➕', section: 'main' },
  { to: '/dashboard/audit', label: 'Audit Log', icon: '📋', section: 'security' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: '📊', section: 'security' },
  { to: '/dashboard/settings/branding', label: 'Branding', icon: '🎨', section: 'settings' },
  { to: '/dashboard/settings/smtp', label: 'SMTP', icon: '📧', section: 'settings' },
];

const sections = { main: 'Workspace', security: 'Security', settings: 'Settings' };
const sectionOrder = ['main', 'security', 'settings'];

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [branding, setBrandingState] = useState(getBranding());

  useEffect(() => {
    const current = getUser();
    if (!current) {
      navigate('/login');
      return;
    }
    setUser(current);
    setBrandingState(getBranding());
  }, [navigate, pathname]);

  const handleLogout = useCallback(() => {
    addAuditLog({ action: 'auth.logout' });
    clearUser();
    navigate('/login');
  }, [navigate]);

  const grouped = sectionOrder.reduce((acc, sec) => {
    acc[sec] = navItems.filter(i => i.section === sec);
    return acc;
  }, {});

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '...';

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            {branding.logoUrl
              ? <img src={branding.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />
              : 'AV'}
          </div>
          <div>
            <div className="sidebar-logo-text">{branding.companyName || 'Aegis Vault'}</div>
            <div className="sidebar-logo-subtitle">Secure Vault</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sectionOrder.map(sec => (
            <div key={sec}>
              <div className="sidebar-section-label">{sections[sec]}</div>
              {grouped[sec].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link${pathname === item.to || pathname.startsWith(item.to + '/') ? ' active' : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Loading...'}</div>
              <div className="sidebar-user-email">{user?.email || ''}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Sign out">
              ↩
            </button>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user && <span className="table-badge">{(user.tenantTier || 'free').toUpperCase()}</span>}
            <Link to="/dashboard/secrets/new" className="btn btn-primary btn-sm">
              ➕ New Secret
            </Link>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
