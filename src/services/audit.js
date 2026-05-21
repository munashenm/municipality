import { getStore, setStore, generateId } from './storage';

export function logAudit(action, details = {}, userId = null) {
  const logs = getStore('auditLogs', []);
  logs.unshift({
    id: generateId('AUD'),
    action,
    userId,
    details,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1',
  });
  setStore('auditLogs', logs.slice(0, 500));
}

export function getAuditLogs(filters = {}) {
  let logs = getStore('auditLogs', []);
  if (filters.userId) logs = logs.filter((l) => l.userId === filters.userId);
  if (filters.action) logs = logs.filter((l) => l.action.includes(filters.action));
  return logs;
}
