import { getStore, setStore, generateId } from './storage';

export function getAlerts() {
  return getStore('alerts', []);
}

export function getActiveAlerts() {
  return getAlerts().filter((a) => a.active);
}

export function createAlert(data) {
  const alerts = getAlerts();
  const alert = {
    id: generateId('ALT'),
    ...data,
    active: true,
    createdAt: new Date().toISOString(),
  };
  alerts.unshift(alert);
  setStore('alerts', alerts);
  pushNotification(alert);
  return alert;
}

export function toggleAlert(id, active) {
  const alerts = getAlerts();
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  alerts[idx].active = active;
  setStore('alerts', alerts);
  return alerts[idx];
}

export function getNotificationPrefs() {
  return getStore('notificationPrefs', {});
}

export function updateNotificationPrefs(prefs) {
  const current = getNotificationPrefs();
  setStore('notificationPrefs', { ...current, ...prefs });
  return getNotificationPrefs();
}

export function getNotifications() {
  return getStore('notifications', []);
}

export function pushNotification(alert) {
  const prefs = getNotificationPrefs();
  const typeMap = { loadshedding: 'loadshedding', water: 'water', maintenance: 'maintenance', emergency: 'emergency' };
  if (prefs[typeMap[alert.type]] === false) return;

  const notifications = getNotifications();
  notifications.unshift({
    id: generateId('NOTIF'),
    title: alert.title,
    message: alert.message,
    type: alert.type,
    read: false,
    date: new Date().toISOString(),
  });
  setStore('notifications', notifications.slice(0, 50));
}

export function markNotificationRead(id) {
  const notifications = getNotifications();
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx !== -1) notifications[idx].read = true;
  setStore('notifications', notifications);
}

export function getLoadsheddingSchedule() {
  const blocks = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayName = date.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
    blocks.push({
      date: dayName,
      stage: i % 2 === 0 ? 2 : 4,
      slots: [
        { block: 7, time: '06:00 - 08:30' },
        { block: 7, time: '18:00 - 20:30' },
      ],
    });
  }
  return blocks;
}
