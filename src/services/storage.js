const PREFIX = 'smartcity_';

export function getStore(key, fallback = []) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setStore(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data));
}

export function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function generateTicketNumber() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `#IS-${num}`;
}
