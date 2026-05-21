import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getAlerts, createAlert, toggleAlert } from '../../services/alerts';

export default function AdminAlerts() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const alerts = getAlerts();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'water', priority: 'medium', title: '', message: '', area: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      show('Title and message required', 'error');
      return;
    }
    createAlert(form);
    refresh();
    setShowForm(false);
    setForm({ type: 'water', priority: 'medium', title: '', message: '', area: '' });
    show('Alert published and notifications sent');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader
        title="Alerts Management"
        subtitle="Publish loadshedding, water, maintenance, and emergency notices"
        backTo="/admin"
        action={<button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Alert</button>}
      />

      {showForm && (
        <form className="card mb-8" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="loadshedding">Loadshedding</option>
                <option value="water">Water</option>
                <option value="maintenance">Maintenance</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-control" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea className="form-control" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Area</label>
            <input className="form-control" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Publish Alert</button>
        </form>
      )}

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>Title</th><th>Area</th><th>Priority</th><th>Active</th><th>Action</th></tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td><span className="badge badge-blue">{a.type}</span></td>
                <td>{a.title}</td>
                <td>{a.area}</td>
                <td><span className={`badge ${a.priority === 'high' ? 'badge-red' : a.priority === 'medium' ? 'badge-yellow' : 'badge-blue'}`}>{a.priority}</span></td>
                <td>{a.active ? 'Yes' : 'No'}</td>
                <td>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => { toggleAlert(a.id, !a.active); refresh(); show(a.active ? 'Alert deactivated' : 'Alert activated'); }}>
                    {a.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
