import { useState } from 'react';
import {
  Wallet, FileText, CreditCard, Download, Home, History, Gauge,
  MessageSquare, Camera, CheckCircle, Clock, AlertCircle,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Toast, { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  getAccountForUser, PAYMENT_METHODS, initiatePayment, completePayment,
  getAllPayments, PAYMENT_STATUS,
} from '../../services/billing';
import { generateStatementPDF, generateProofOfResidencePDF, generateReceiptPDF } from '../../services/documents';
import { createProofRequest, getProofRequests } from '../../services/proofOfResidence';
import { submitMeterReading, getMeterReadings } from '../../services/meterReadings';
import { createDispute, getDisputes, DISPUTE_TYPES } from '../../services/disputes';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Wallet },
  { id: 'bills', label: 'Bills', icon: FileText },
  { id: 'pay', label: 'Pay Online', icon: CreditCard },
  { id: 'statements', label: 'Statements', icon: Download },
  { id: 'por', label: 'Proof of Residence', icon: Home },
  { id: 'history', label: 'Payment History', icon: History },
  { id: 'meter', label: 'Meter Readings', icon: Gauge },
  { id: 'disputes', label: 'Disputes & Queries', icon: MessageSquare },
];

export default function CitizenDashboard() {
  useApp();
  const { user } = useAuth();
  const { toast, show, clear } = useToast();
  const [tab, setTab] = useState('overview');
  const [paymentMethod, setPaymentMethod] = useState('payfast');
  const [paying, setPaying] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const account = getAccountForUser(user);
  const proofRequests = getProofRequests(user.id);
  const meterReadings = getMeterReadings(user.id);
  const disputes = getDisputes(user.id);
  const payments = getAllPayments().filter((p) => p.userId === user.id);

  const [meterForm, setMeterForm] = useState({ meterType: 'Water', reading: '', photo: null });
  const [disputeForm, setDisputeForm] = useState({ type: DISPUTE_TYPES[0], subject: '', description: '' });

  if (!account) {
    return (
      <div className="container app-main">
        <div className="card text-center empty-state">
          <AlertCircle size={48} color="var(--accent)" className="mb-4" />
          <h3>No Municipal Account Linked</h3>
          <p>Your account number is not linked yet. Contact the municipality or wait for staff to link your account.</p>
          <p style={{ color: 'var(--text-muted)' }}>Registered account: {user.accountNumber || 'Not provided'}</p>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    if (account.balance <= 0) { show('No outstanding balance', 'error'); return; }
    setPaying(true);
    const payment = initiatePayment(account.accountNumber, account.balance, paymentMethod, user.id);
    setTimeout(() => {
      const result = completePayment(payment.id, Math.random() > 0.05);
      setPaying(false);
      refresh();
      if (result.success) {
        show(`Payment successful! Receipt: ${result.payment.receiptRef}`);
        generateReceiptPDF(user, result.account, result.payment);
      } else {
        show('Payment failed. Please try again.', 'error');
      }
    }, 2000);
  };

  const handleProofRequest = () => {
    const result = createProofRequest(user.id, account.accountNumber);
    refresh();
    if (!result.success) { show(result.error, 'error'); return; }
    show('Proof of residence request submitted for approval');
  };

  const handleDownloadPor = async (req) => {
    if (req.status !== 'Approved') { show('Document not yet approved', 'error'); return; }
    await generateProofOfResidencePDF(user, account, req.documentRef);
    show('Proof of residence downloaded');
  };

  const handleMeterSubmit = (e) => {
    e.preventDefault();
    if (!meterForm.reading) { show('Enter meter reading', 'error'); return; }
    submitMeterReading({ userId: user.id, accountNumber: account.accountNumber, ...meterForm });
    setMeterForm({ meterType: 'Water', reading: '', photo: null });
    refresh();
    show('Meter reading submitted');
  };

  const handleMeterPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMeterForm((f) => ({ ...f, photo: { name: file.name, data: reader.result } }));
    reader.readAsDataURL(file);
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeForm.subject || !disputeForm.description) { show('Fill in all fields', 'error'); return; }
    const d = createDispute({ userId: user.id, accountNumber: account.accountNumber, ...disputeForm });
    setDisputeForm({ type: DISPUTE_TYPES[0], subject: '', description: '' });
    refresh();
    show(`Dispute submitted. Reference: ${d.reference}`);
  };

  return (
    <div className="container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <PageHeader
        title={`Welcome, ${user.firstName}`}
        subtitle={`Account ${account.accountNumber} · ${account.address}`}
      />

      <div className="dashboard-stats grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Balance Due</h4>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.25rem 0 0' }}>R{account.balance.toFixed(2)}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Due Date</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.25rem 0 0' }}>{new Date(account.dueDate).toLocaleDateString('en-ZA')}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Open Disputes</h4>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0.25rem 0 0' }}>{disputes.filter((d) => d.status !== 'Resolved' && d.status !== 'Rejected').length}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Verified</h4>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.25rem 0 0', color: 'var(--secondary)' }}>
            <CheckCircle size={18} style={{ verticalAlign: 'middle' }} /> POPIA Compliant
          </p>
        </div>
      </div>

      <div className="dashboard-layout">
        <nav className="dashboard-tabs card">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" className={`dash-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>

        <div className="dashboard-content card">
          {tab === 'overview' && (
            <div>
              <h3>Account Overview</h3>
              <p>Current balance: <strong>R{account.balance.toFixed(2)}</strong></p>
              <p>Latest bill: {account.bills[0]?.period} — R{account.bills[0]?.amount.toFixed(2)} ({account.bills[0]?.status})</p>
              <p>Recent payment: {account.payments[0] ? `R${account.payments[0].amount.toFixed(2)} on ${new Date(account.payments[0].date).toLocaleDateString('en-ZA')}` : 'None'}</p>
            </div>
          )}

          {tab === 'bills' && (
            <div>
              <h3>Current & Previous Bills</h3>
              <table className="data-table">
                <thead><tr><th>Period</th><th>Amount</th><th>Issued</th><th>Status</th></tr></thead>
                <tbody>
                  {account.bills.map((b) => (
                    <tr key={b.id}><td>{b.period}</td><td>R{b.amount.toFixed(2)}</td><td>{new Date(b.issuedAt).toLocaleDateString('en-ZA')}</td><td><StatusBadge status={b.status} /></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'pay' && (
            <div>
              <h3>Pay Bills Online</h3>
              <p>Amount due: <strong>R{account.balance.toFixed(2)}</strong></p>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.id} className={`payment-option ${paymentMethod === m.id ? 'selected' : ''}`}>
                    <input type="radio" name="pay" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                    <div><strong>{m.name}</strong><small>{m.description}</small></div>
                  </label>
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment status flow: pending → successful/failed. Receipt generated automatically on success.</p>
              <button type="button" className="btn btn-primary mt-4" onClick={handlePay} disabled={paying || account.balance <= 0}>
                {paying ? 'Processing payment...' : `Pay R${account.balance.toFixed(2)}`}
              </button>
            </div>
          )}

          {tab === 'statements' && (
            <div>
              <h3>Download Account Statement</h3>
              <p>Download your full account statement as a PDF with municipality branding.</p>
              <button type="button" className="btn btn-primary" onClick={async () => { await generateStatementPDF(user, account); show('Statement downloaded'); }}>
                <Download size={18} /> Download Statement PDF
              </button>
            </div>
          )}

          {tab === 'por' && (
            <div>
              <h3>Proof of Residence</h3>
              <p>Request an official proof of residence document. Manual approval may be required.</p>
              <button type="button" className="btn btn-primary mb-4" onClick={handleProofRequest}>Request Proof of Residence</button>
              {proofRequests.map((req) => (
                <div key={req.id} className="por-item flex justify-between items-center mb-2 p-3" style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <StatusBadge status={req.status} />
                    <small style={{ display: 'block', color: 'var(--text-muted)' }}>Requested {new Date(req.requestedAt).toLocaleDateString('en-ZA')}</small>
                  </div>
                  {req.status === 'Approved' && (
                    <button type="button" className="btn btn-secondary" onClick={() => handleDownloadPor(req)}>
                      <Download size={16} /> Download PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div>
              <h3>Payment History</h3>
              <table className="data-table">
                <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Receipt</th></tr></thead>
                <tbody>
                  {(payments.length ? payments : account.payments.map((p) => ({ ...p, status: 'successful', userId: user.id }))).map((p) => (
                    <tr key={p.id}>
                      <td>{p.date ? new Date(p.date).toLocaleDateString('en-ZA') : '—'}</td>
                      <td>R{p.amount.toFixed(2)}</td>
                      <td>{p.method}</td>
                      <td><StatusBadge status={p.status === PAYMENT_STATUS.SUCCESSFUL ? 'Paid' : p.status === PAYMENT_STATUS.PENDING ? 'In Progress' : p.status === PAYMENT_STATUS.FAILED ? 'Rejected' : 'Paid'} /></td>
                      <td>
                        {(p.status === PAYMENT_STATUS.SUCCESSFUL || p.status === 'successful') && (
                          <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={async () => { await generateReceiptPDF(user, account, p); show('Receipt downloaded'); }}>
                            PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'meter' && (
            <div>
              <h3>Submit Meter Reading</h3>
              <form onSubmit={handleMeterSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Meter Type</label>
                    <select className="form-control" value={meterForm.meterType} onChange={(e) => setMeterForm({ ...meterForm, meterType: e.target.value })}>
                      <option>Water</option><option>Electricity</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reading</label>
                    <input className="form-control" type="number" value={meterForm.reading} onChange={(e) => setMeterForm({ ...meterForm, reading: e.target.value })} required />
                  </div>
                </div>
                <label className="file-upload-btn">
                  <Camera size={18} /> Upload Meter Photo
                  <input type="file" accept="image/*" hidden onChange={handleMeterPhoto} />
                </label>
                <button type="submit" className="btn btn-primary mt-4">Submit Reading</button>
              </form>
              <h4>Previous Submissions</h4>
              {meterReadings.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No readings yet.</p> : (
                <table className="data-table">
                  <thead><tr><th>Type</th><th>Reading</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {meterReadings.map((m) => (
                      <tr key={m.id}><td>{m.meterType}</td><td>{m.reading}</td><td>{new Date(m.submittedAt).toLocaleDateString('en-ZA')}</td><td>{m.status}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'disputes' && (
            <div>
              <h3>Billing Disputes & Service Queries</h3>
              <form onSubmit={handleDisputeSubmit} className="mb-6">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-control" value={disputeForm.type} onChange={(e) => setDisputeForm({ ...disputeForm, type: e.target.value })}>
                    {DISPUTE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-control" value={disputeForm.subject} onChange={(e) => setDisputeForm({ ...disputeForm, subject: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={4} value={disputeForm.description} onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit Dispute</button>
              </form>
              <h4>Your Disputes</h4>
              {disputes.map((d) => (
                <div key={d.id} className="dispute-item mb-4 p-4" style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex justify-between mb-2">
                    <strong>{d.reference} — {d.subject}</strong>
                    <StatusBadge status={d.status} />
                  </div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{d.description}</p>
                  <ul className="timeline">
                    {d.updates.map((u, i) => (
                      <li key={i} className="timeline-item">
                        <Clock size={14} />
                        <span><StatusBadge status={u.status} /> {u.message} — {new Date(u.date).toLocaleString('en-ZA')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
