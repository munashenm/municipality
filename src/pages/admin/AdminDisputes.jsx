import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { getDisputes, updateDisputeStatus, DISPUTE_STATUSES } from '../../services/disputes';
import { useAuth } from '../../context/AuthContext';

export default function AdminDisputes() {
  useApp();
  const { user } = useAuth();
  const { toast, show, clear } = useToast();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const disputes = getDisputes();
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('Under Review');
  const [message, setMessage] = useState('');

  const handleUpdate = () => {
    if (!selected) return;
    updateDisputeStatus(selected.id, status, message, user.id);
    refresh();
    show('Dispute updated');
    setSelected(null);
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Billing Disputes" subtitle="Manage billing disputes and service queries" backTo="/admin" />

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Reference</th><th>Type</th><th>Subject</th><th>Account</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {disputes.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No disputes.</td></tr>
            ) : disputes.map((d) => (
              <tr key={d.id}>
                <td>{d.reference}</td>
                <td>{d.type}</td>
                <td>{d.subject}</td>
                <td>{d.accountNumber}</td>
                <td><StatusBadge status={d.status} /></td>
                <td>{new Date(d.createdAt).toLocaleDateString('en-ZA')}</td>
                <td><button type="button" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => { setSelected(d); setStatus(d.status); }}>Manage</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{selected.reference}</h3>
            <p>{selected.description}</p>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                {DISPUTE_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Response</label>
              <textarea className="form-control" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
}
