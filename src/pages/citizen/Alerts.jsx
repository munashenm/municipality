import { useState } from 'react';
import { Bell, Zap, Droplets, Wrench, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import {
  getActiveAlerts, getLoadsheddingSchedule, getNotificationPrefs,
  updateNotificationPrefs, getNotifications, markNotificationRead,
} from '../../services/alerts';

const TYPE_ICONS = { loadshedding: Zap, water: Droplets, maintenance: Wrench, emergency: AlertTriangle };

export default function Alerts() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const alerts = getActiveAlerts();
  const schedule = getLoadsheddingSchedule();
  const notifications = getNotifications();
  const [prefs, setPrefs] = useState(getNotificationPrefs());

  const updatePref = (key, value) => {
    const updated = updateNotificationPrefs({ [key]: value });
    setPrefs(updated);
    refresh();
    show(`${key} notifications ${value ? 'enabled' : 'disabled'}`);
  };

  const enablePush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          updatePref('pushEnabled', true);
          show('Push notifications enabled');
        } else {
          show('Push permission denied', 'error');
        }
      });
    } else {
      show('Push notifications simulated (browser does not support Notification API)', 'info');
      updatePref('pushEnabled', true);
    }
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Loadshedding & Water Alerts" subtitle="Schedules, maintenance notices, and push notification settings" backTo="/" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="flex items-center gap-2 mb-4"><Bell size={20} /> Notification Settings</h3>
          {[
            { key: 'loadshedding', label: 'Loadshedding schedules' },
            { key: 'water', label: 'Water interruptions' },
            { key: 'maintenance', label: 'Planned maintenance' },
            { key: 'emergency', label: 'Emergency notices' },
          ].map(({ key, label }) => (
            <label key={key} className="pref-row">
              <span>{label}</span>
              <input type="checkbox" checked={prefs[key] !== false} onChange={(e) => updatePref(key, e.target.checked)} />
            </label>
          ))}
          <button type="button" className="btn btn-primary w-full mt-4" onClick={enablePush} disabled={prefs.pushEnabled}>
            {prefs.pushEnabled ? 'Push Enabled' : 'Enable Push Notifications'}
          </button>
        </div>

        <div className="card md:col-span-2">
          <h3 className="mb-4">Active Alerts</h3>
          {alerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No active alerts.</p>
          ) : (
            <ul className="alert-list">
              {alerts.map((a) => {
                const Icon = TYPE_ICONS[a.type] || AlertTriangle;
                return (
                  <li key={a.id} className="alert-item flex gap-4">
                    <Icon size={24} color={a.priority === 'high' ? 'var(--danger)' : 'var(--accent)'} />
                    <div>
                      <span className={`badge ${a.priority === 'high' ? 'badge-red' : a.priority === 'medium' ? 'badge-yellow' : 'badge-blue'} mb-2`}>{a.type}</span>
                      <p style={{ margin: 0, fontWeight: 500 }}>{a.title}</p>
                      <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{a.message}</p>
                      <small style={{ color: 'var(--text-muted)' }}>{a.area}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="flex items-center gap-2 mb-4"><Zap size={20} /> Loadshedding Schedule (Block 7)</h3>
        <div className="schedule-grid">
          {schedule.map((day, i) => (
            <div key={i} className="schedule-day">
              <strong>{day.date}</strong>
              <span className="badge badge-yellow">Stage {day.stage}</span>
              {day.slots.map((s, j) => (
                <p key={j} style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>Block {s.block}: {s.time}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Recent Notifications</h3>
          <ul className="alert-list">
            {notifications.slice(0, 10).map((n) => (
              <li key={n.id} className={`alert-item ${n.read ? 'read' : ''}`} onClick={() => { markNotificationRead(n.id); refresh(); }}>
                <p style={{ margin: 0, fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                <small style={{ color: 'var(--text-muted)' }}>{new Date(n.date).toLocaleString('en-ZA')}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
