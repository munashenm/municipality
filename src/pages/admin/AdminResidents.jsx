import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { getCitizens, linkAccountToUser } from '../../services/users';
import { getAccount } from '../../services/billing';
import { getProofRequests, approveProofRequest, rejectProofRequest } from '../../services/proofOfResidence';
import { useAuth } from '../../context/AuthContext';

export default function AdminResidents() {
  useApp();
  const { user } = useAuth();
  const { toast, show, clear } = useToast();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const citizens = getCitizens();
  const proofRequests = getProofRequests();
  const [linkForm, setLinkForm] = useState({ userId: '', accountNumber: '' });

  const handleLink = () => {
    const acc = getAccount(linkForm.accountNumber);
    if (!acc) { show('Account number not found', 'error'); return; }
    const result = linkAccountToUser(linkForm.userId, linkForm.accountNumber);
    refresh();
    if (result.success) show('Account linked successfully');
  };

  const handleApprove = (id) => {
    approveProofRequest(id, user.id);
    refresh();
    show('Proof of residence approved');
  };

  const handleReject = (id) => {
    rejectProofRequest(id, 'Documentation incomplete', user.id);
    refresh();
    show('Request rejected');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Registered Residents" subtitle="View residents, link accounts, approve proof of residence" backTo="/admin" />

      <div className="card mb-8">
        <h3 className="mb-4">Link Account to Resident</h3>
        <div className="flex gap-4 flex-wrap">
          <select className="form-control" style={{ maxWidth: 250 }} value={linkForm.userId} onChange={(e) => setLinkForm({ ...linkForm, userId: e.target.value })}>
            <option value="">Select resident</option>
            {citizens.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.email})</option>)}
          </select>
          <input className="form-control" style={{ maxWidth: 200 }} placeholder="MUN-2024-XXXXX" value={linkForm.accountNumber} onChange={(e) => setLinkForm({ ...linkForm, accountNumber: e.target.value })} />
          <button type="button" className="btn btn-primary" onClick={handleLink}>Link Account</button>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="mb-4">All Residents ({citizens.length})</h3>
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>ID</th><th>Account</th><th>Verified</th></tr></thead>
          <tbody>
            {citizens.map((c) => (
              <tr key={c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.idNumber}</td>
                <td>{c.accountNumber || '—'}</td>
                <td>{c.verified ? <span className="badge badge-green">Yes</span> : <span className="badge badge-red">No</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="mb-4">Proof of Residence Requests</h3>
        <table className="data-table">
          <thead><tr><th>Resident</th><th>Account</th><th>Status</th><th>Requested</th><th>Action</th></tr></thead>
          <tbody>
            {proofRequests.map((req) => {
              const resident = citizens.find((c) => c.id === req.userId);
              return (
                <tr key={req.id}>
                  <td>{resident ? `${resident.firstName} ${resident.lastName}` : req.userId}</td>
                  <td>{req.accountNumber}</td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>{new Date(req.requestedAt).toLocaleDateString('en-ZA')}</td>
                  <td>
                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button type="button" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleApprove(req.id)}>Approve</button>
                        <button type="button" className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleReject(req.id)}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
