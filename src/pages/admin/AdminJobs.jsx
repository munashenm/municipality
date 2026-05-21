import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getJobs, createJob, updateApplicationStatus, JOB_TYPES } from '../../services/jobs';

export default function AdminJobs() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const jobs = getJobs();
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [form, setForm] = useState({ type: 'Vacancy', title: '', department: '', description: '', requirements: '', closingDate: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    createJob({ ...form, closingDate: form.closingDate || new Date(Date.now() + 86400000 * 30).toISOString() });
    refresh();
    setShowForm(false);
    show('Job/Tender published');
  };

  const handleAppUpdate = (status) => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.jobId, selectedApp.app.id, status);
    refresh();
    show(`Application updated to ${status}`);
    setSelectedApp(null);
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Jobs & Tenders" subtitle="Publish vacancies, tenders, RFQs and manage applications" backTo="/admin" action={<button type="button" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Publish</button>} />

      {showForm && (
        <form className="card mb-8" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea className="form-control" rows={2} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Publish</button>
        </form>
      )}

      {jobs.map((job) => (
        <div key={job.id} className="card mb-6">
          <div className="flex justify-between mb-4">
            <div>
              <span className="badge badge-blue">{job.type}</span>
              <h3 style={{ margin: '0.5rem 0' }}>{job.title}</h3>
              <small>{job.department} — Closes {new Date(job.closingDate).toLocaleDateString('en-ZA')}</small>
            </div>
            <StatusBadge status={job.status} />
          </div>
          {job.applications.length > 0 && (
            <table className="data-table">
              <thead><tr><th>Applicant</th><th>Contact</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead>
              <tbody>
                {job.applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.companyName}</td>
                    <td>{app.email}<br />{app.phone}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>{new Date(app.submittedAt).toLocaleDateString('en-ZA')}</td>
                    <td><button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => setSelectedApp({ jobId: job.id, app })}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {job.applications.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No applications yet.</p>}
        </div>
      ))}

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedApp.app.companyName}</h3>
            <p>{selectedApp.app.coverLetter}</p>
            <p>Docs: {selectedApp.app.documents?.length || 0} uploaded</p>
            <div className="flex gap-2 flex-wrap">
              {['Under Review', 'Shortlisted', 'Rejected'].map((s) => (
                <button key={s} type="button" className="btn btn-secondary" onClick={() => handleAppUpdate(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
