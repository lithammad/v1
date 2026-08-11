import { Routes, Route, Navigate } from 'react-router-dom';
import MarketingLayout from './layouts/MarketingLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx';
import SecretsPage from './pages/dashboard/SecretsPage.jsx';
import NewSecretPage from './pages/dashboard/NewSecretPage.jsx';
import AuditPage from './pages/dashboard/AuditPage.jsx';
import AnalyticsPage from './pages/dashboard/AnalyticsPage.jsx';
import BrandingSettingsPage from './pages/dashboard/BrandingSettingsPage.jsx';
import SmtpSettingsPage from './pages/dashboard/SmtpSettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="secrets" replace />} />
        <Route path="secrets" element={<SecretsPage />} />
        <Route path="secrets/new" element={<NewSecretPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings/branding" element={<BrandingSettingsPage />} />
        <Route path="settings/smtp" element={<SmtpSettingsPage />} />
      </Route>
    </Routes>
  );
}
