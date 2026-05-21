import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import {
  getBusinesses, createBusiness, updateBusiness, deleteBusiness, BUSINESS_CATEGORIES,
} from '../../services/businessDirectory';

const FORM_CATEGORIES = BUSINESS_CATEGORIES.filter((c) => c !== 'All');

export default function AdminBusinessDirectory() {
  useApp();
  const { toast, show, clear } = useToast();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const businesses = getBusinesses();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());

  function emptyForm() {
    return {
      name: '', category: FORM_CATEGORIES[0], description: '', address: '', ward: '',
      phone: '', email: '', website: '', hours: '', verified: true, status: 'Published',
    };
  }

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ ...b });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      show('Name and phone are required', 'error');
      return;
    }
    if (editing) {
      updateBusiness(editing, form);
      show('Business updated');
    } else {
      createBusiness(form);
      show('Business added to directory');
    }
    refresh();
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    deleteBusiness(id);
    refresh();
    show('Business removed');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader
        title="Business Directory"
        subtitle="Manage local business listings for the citizen directory"
        backTo="/admin"
        action={<button type="button" className="btn btn-primary" onClick={openCreate}>+ Add Business</button>}
      />

      {showForm && (
        <form className="card mb-8" onSubmit={handleSubmit}>
          <h3 className="mb-4">{editing ? 'Edit Business' : 'Add Business'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Business Name *</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {FORM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Ward / Area</label>
              <input className="form-control" value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} placeholder="Ward 3" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-control" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="www.example.co.za" />
            </div>
            <div className="form-group">
              <label className="form-label">Trading Hours</label>
              <input className="form-control" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Mon–Fri 08:00–17:00" />
            </div>
          </div>
          <label className="popia-consent mt-2">
            <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
            <span>Municipal verified listing</span>
          </label>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Add'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Area</th><th>Phone</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id}>
                <td>{b.name}{b.verified && ' ✓'}</td>
                <td>{b.category}</td>
                <td>{b.ward || '—'}</td>
                <td>{b.phone}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openEdit(b)}>Edit</button>
                    <button type="button" className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
