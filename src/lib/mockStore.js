const KEYS = {
  user: 'aegis_demo_user',
  secrets: 'aegis_demo_secrets',
  audit: 'aegis_demo_audit',
  branding: 'aegis_demo_branding',
  smtp: 'aegis_demo_smtp',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hash(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  const hex = h.toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

export function getUser() {
  return read(KEYS.user, null);
}

export function setUser(user) {
  write(KEYS.user, user);
}

export function clearUser() {
  localStorage.removeItem(KEYS.user);
}

export function getBranding() {
  return read(KEYS.branding, {
    companyName: '', logoUrl: '', primaryColor: '#116466', customDomain: '', supportUrl: '',
  });
}

export function setBranding(data) {
  write(KEYS.branding, data);
}

export function getSmtp() {
  return read(KEYS.smtp, {
    host: '', port: 587, username: '', password: '', fromEmail: '', fromName: '', isActive: false,
  });
}

export function setSmtp(data) {
  write(KEYS.smtp, data);
}

export function getSecrets() {
  return read(KEYS.secrets, []);
}

export function getAuditLogs() {
  return read(KEYS.audit, []);
}

export function addAuditLog({ action, resourceType = null, riskScore = 0, metadata = {} }) {
  const logs = getAuditLogs();
  const prevHash = logs.length ? logs[logs.length - 1].rowHash : '0'.repeat(64);
  const createdAt = new Date().toISOString();
  const rowHash = hash(prevHash + action + createdAt + Math.random());
  const entry = {
    id: crypto.randomUUID(),
    actorType: 'user',
    action,
    resourceType,
    ipAddress: '127.0.0.1',
    riskScore,
    metadata,
    prevHash,
    rowHash,
    createdAt,
  };
  logs.push(entry);
  write(KEYS.audit, logs);
  return entry;
}

export function isChainValid() {
  const logs = getAuditLogs();
  let prevHash = '0'.repeat(64);
  for (const entry of logs) {
    if (entry.prevHash !== prevHash) return false;
    prevHash = entry.rowHash;
  }
  return true;
}

export function createSecret({ contentType, maxViews, burnAfterReading, expiresAt }) {
  const secrets = getSecrets();
  const secret = {
    id: crypto.randomUUID(),
    token: crypto.randomUUID().replace(/-/g, ''),
    contentType,
    maxViews,
    currentViews: 0,
    expiresAt,
    burnAfterReading,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  secrets.unshift(secret);
  write(KEYS.secrets, secrets);
  addAuditLog({ action: 'secret.created', resourceType: 'secret', metadata: { token: secret.token } });
  return secret;
}

export function revokeSecret(token) {
  const secrets = getSecrets().map(s => (s.token === token ? { ...s, status: 'revoked' } : s));
  write(KEYS.secrets, secrets);
  addAuditLog({ action: 'secret.revoked', resourceType: 'secret', metadata: { token } });
}

export function getAnalytics() {
  const secrets = getSecrets();
  const logs = getAuditLogs();
  const riskLogs = logs.filter(l => l.riskScore > 0);
  return {
    totalSecrets: secrets.length,
    activeSecrets: secrets.filter(s => s.status === 'active').length,
    totalViews: secrets.reduce((sum, s) => sum + s.currentViews, 0),
    destroyedSecrets: secrets.filter(s => s.status === 'destroyed' || s.status === 'revoked').length,
    avgRiskScore: riskLogs.length ? riskLogs.reduce((sum, l) => sum + l.riskScore, 0) / riskLogs.length : 0,
    recentAccessLogs: [],
  };
}
