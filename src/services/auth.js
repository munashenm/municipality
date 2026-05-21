import { getStore, setStore, generateId } from './storage';
import { verifyPassword, generateOtp } from './crypto';
import { getUserByEmailOrPhone, sanitizeUser, createUser, verifyUser } from './users';
import { logAudit } from './audit';

const SESSION_KEY = 'session';

export function getSession() {
  return getStore(SESSION_KEY, null);
}

export function setSession(session) {
  if (session) setStore(SESSION_KEY, session);
  else localStorage.removeItem('smartcity_session');
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) {
    setSession(null);
    return null;
  }
  const users = getStore('users', []);
  const user = users.find((u) => u.id === session.userId);
  return user ? sanitizeUser(user) : null;
}

export async function login(identifier, password) {
  const user = getUserByEmailOrPhone(identifier);
  if (!user) return { success: false, error: 'Invalid credentials' };

  const valid = await verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!valid) {
    logAudit('login_failed', { identifier }, user.id);
    return { success: false, error: 'Invalid credentials' };
  }

  if (!user.verified) {
    return { success: false, error: 'Account not verified', needsOtp: true, userId: user.id };
  }

  const session = {
    token: generateId('TKN'),
    userId: user.id,
    role: user.role,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  };
  setSession(session);
  logAudit('login_success', { role: user.role }, user.id);
  return { success: true, user: sanitizeUser(user) };
}

export async function register(data) {
  const result = await createUser(data);
  if (!result.success) return result;

  const otp = generateOtp();
  setStore('pendingOtps', {
    ...getStore('pendingOtps', {}),
    [result.user.id]: { code: otp, channel: data.phone ? 'sms' : 'email', expiresAt: Date.now() + 600000, sentTo: data.phone || data.email },
  });

  logAudit('otp_sent', { channel: data.phone ? 'sms' : 'email' }, result.user.id);
  return { success: true, userId: result.user.id, otpDemo: otp };
}

export function verifyOtp(userId, code) {
  const pending = getStore('pendingOtps', {});
  const entry = pending[userId];
  if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
    return { success: false, error: 'Invalid or expired OTP' };
  }

  const user = verifyUser(userId);
  delete pending[userId];
  setStore('pendingOtps', pending);

  const session = {
    token: generateId('TKN'),
    userId: user.id,
    role: user.role,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
  };
  setSession(session);
  logAudit('otp_verified', {}, userId);
  return { success: true, user };
}

export function resendOtp(userId) {
  const users = getStore('users', []);
  const user = users.find((u) => u.id === userId);
  if (!user) return { success: false, error: 'User not found' };

  const otp = generateOtp();
  setStore('pendingOtps', {
    ...getStore('pendingOtps', {}),
    [userId]: { code: otp, channel: user.phone ? 'sms' : 'email', expiresAt: Date.now() + 600000, sentTo: user.phone || user.email },
  });
  logAudit('otp_resent', {}, userId);
  return { success: true, otpDemo: otp };
}

export function logout() {
  const user = getCurrentUser();
  if (user) logAudit('logout', {}, user.id);
  setSession(null);
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
}

export function requireVerified() {
  const user = getCurrentUser();
  return user?.verified === true;
}
