import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp, useRefresh } from '../../context/AppContext';
import { getReports, updateReportStatus, REPORT_STATUSES } from '../../services/reports';

export default function AdminReports() {
  useApp();
  const refresh = useRefresh();
  const { toast, show, clear } = useToast();
  const reports = getReports();
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [message, setMessage] = useState('');

  const handleUpdate = () => {
    if (!selected) return;
    updateReportStatus(selected.id, newStatus, message);
    refresh();
    show(`Updated ${selected.ticketNumber} to ${newStatus}`);
    setSelected(null);
    setMessage('');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Service Reports" subtitle="Manage citizen-reported issues" backTo="/admin" />

      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Ticket</th><th>Type</th><th>Location</th><th>Reporter</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.ticketNumber}</td>
                <td>{r.type}</td>
                <td>{r.location}</td>
                <td>{r.reporterName}<br /><small>{r.reporterPhone}</small></td>
                <td><StatusBadge status={r.status} /></td>
                <td>{new Date(r.createdAt).toLocaleDateString('en-ZA')}</td>
                <td><button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }} onClick={() => { setSelected(r); setNewStatus(r.status); }}>Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Update {selected.ticketNumber}</h3>
            <p>{selected.description}</p>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {REPORT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Message to citizen</label>
              <textarea className="form-control" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
