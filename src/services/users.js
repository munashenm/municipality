import { getStore, setStore, generateId } from './storage';
import { hashPassword } from './crypto';
import { logAudit } from './audit';

export const ROLES = { CITIZEN: 'citizen', STAFF: 'staff', ADMIN: 'admin' };

export function getUsers() {
  return getStore('users', []);
}

export function getUserById(id) {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmailOrPhone(identifier) {
  const raw = identifier.trim();
  const emailId = raw.toLowerCase();
  const phoneId = raw.replace(/\D/g, '').replace(/^27/, '0');
  return getUsers().find((u) => {
    const userPhone = u.phone.replace(/\D/g, '').replace(/^27/, '0');
    return u.email.toLowerCase() === emailId || (phoneId.length >= 9 && userPhone === phoneId);
  });
}

export function getCitizens() {
  return getUsers().filter((u) => u.role === ROLES.CITIZEN);
}

export async function createUser(data) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }
  if (users.some((u) => u.idNumber === data.idNumber)) {
    return { success: false, error: 'ID number already registered' };
  }

  const { salt, hash } = await hashPassword(data.password);
  const user = {
    id: generateId('USR'),
    email: data.email,
    phone: data.phone,
    idNumber: data.idNumber,
    accountNumber: data.accountNumber || null,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role || ROLES.CITIZEN,
    passwordSalt: salt,
    passwordHash: hash,
    verified: false,
    popiaConsent: data.popiaConsent || false,
    popiaConsentDate: data.popiaConsent ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setStore('users', users);
  logAudit('user_registered', { email: user.email, role: user.role }, user.id);
  return { success: true, user: sanitizeUser(user) };
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordSalt, passwordHash, ...safe } = user;
  return safe;
}

export function linkAccountToUser(userId, accountNumber) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { success: false, error: 'User not found' };
  users[idx].accountNumber = accountNumber;
  setStore('users', users);
  logAudit('account_linked', { accountNumber }, userId);
  return { success: true, user: sanitizeUser(users[idx]) };
}

export function verifyUser(userId) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  users[idx].verified = true;
  users[idx].verifiedAt = new Date().toISOString();
  setStore('users', users);
  logAudit('user_verified', {}, userId);
  return sanitizeUser(users[idx]);
}
