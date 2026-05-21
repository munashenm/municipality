import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Toast, { useToast } from '../../components/ui/Toast';
import { useApp } from '../../context/AppContext';
import { getAccounts, uploadBill, getAllPayments } from '../../services/billing';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AdminBillsManage() {
  useApp();
  const { toast, show, clear } = useToast();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const accounts = getAccounts();
  const payments = getAllPayments();
  const [form, setForm] = useState({ accountNumber: accounts[0]?.accountNumber || '', period: '', amount: '', dueDate: '' });

  const handleUpload = (e) => {
    e.preventDefault();
    const result = uploadBill(form.accountNumber, { period: form.period, amount: form.amount, dueDate: form.dueDate });
    refresh();
    if (result.success) show(`Bill uploaded for ${form.period}`);
    else show(result.error, 'error');
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader title="Bill Management" subtitle="Upload monthly bills and view payment records" backTo="/admin" />

      <form className="card mb-8" onSubmit={handleUpload}>
        <h3 className="mb-4">Upload / Sync Monthly Bill</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Account</label>
            <select className="form-control" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}>
              {accounts.map((a) => <option key={a.id} value={a.accountNumber}>{a.accountNumber} — {a.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Billing Period</label>
            <input className="form-control" placeholder="April 2026" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Amount (R)</label>
            <input className="form-control" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input className="form-control" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Upload Bill</button>
      </form>

      <div className="card">
        <h3 className="mb-4">Payment Records</h3>
        <table className="data-table">
          <thead><tr><th>Reference</th><th>Account</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payment records yet.</td></tr>
            ) : payments.map((p) => (
              <tr key={p.id}>
                <td>{p.reference}</td>
                <td>{p.accountNumber}</td>
                <td>R{p.amount.toFixed(2)}</td>
                <td>{p.method}</td>
                <td><StatusBadge status={p.status === 'successful' ? 'Paid' : p.status === 'pending' ? 'In Progress' : 'Rejected'} /></td>
                <td>{p.date ? new Date(p.date).toLocaleDateString('en-ZA') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
