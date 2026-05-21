import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getNotices, createNotice, deleteNotice, NOTICE_CATEGORIES } from '../../services/notices';

export default function AdminNotices() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const notices = getNotices();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Event', title: '', content: '', location: '', date: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      show('Title and content required', 'error');
      return;
    }
    createNotice({ ...form, date: form.date || new Date().toISOString() });
    refresh();
    setShowForm(false);
    setForm({ category: 'Event', title: '', content: '', location: '', date: '' });
    show('Notice published');
  };

  const handleDelete = (id) => {
    deleteNotice(id);
    refresh();
    show('Notice removed');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Community Notices" subtitle="Publish events, road closures, and public participation notices" backTo="/admin" action={<button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Notice</button>} />

      {showForm && (
        <form className="card mb-8" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {NOTICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input className="form-control" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea className="form-control" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-control" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Publish Notice</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {notices.map((n) => (
          <div key={n.id} className="card flex justify-between items-start">
            <div>
              <span className="badge badge-blue">{n.category}</span>
              <h3 style={{ margin: '0.5rem 0' }}>{n.title}</h3>
              <p style={{ margin: 0 }}>{n.content}</p>
            </div>
            <button type="button" className="btn btn-danger" style={{ padding: '0.25rem 0.75rem' }} onClick={() => handleDelete(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
