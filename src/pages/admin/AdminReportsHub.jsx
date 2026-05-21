import PageHeader from '../../components/ui/PageHeader';
import { useApp } from '../../context/AppContext';
import { getPaymentReport } from '../../services/billing';
import { getDisputes } from '../../services/disputes';
import { getAuditLogs } from '../../services/audit';
import { getProofRequests } from '../../services/proofOfResidence';

export default function AdminReportsHub() {
  useApp();
  const paymentReport = getPaymentReport();
  const disputes = getDisputes();
  const docDownloads = getAuditLogs().filter((l) => l.action === 'document_downloaded');
  const proofRequests = getProofRequests();

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Reports & Analytics" subtitle="Payments, disputes, and document download reports" backTo="/admin" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Successful Payments</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{paymentReport.successful}</p>
          <small>R{paymentReport.totalAmount.toFixed(2)} total</small>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Pending Payments</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{paymentReport.pending}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Open Disputes</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{disputes.filter((d) => !['Resolved', 'Rejected'].includes(d.status)).length}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Document Downloads</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>{docDownloads.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="mb-4">Payment Summary</h3>
          <table className="data-table">
            <tbody>
              <tr><td>Total transactions</td><td>{paymentReport.total}</td></tr>
              <tr><td>Successful</td><td>{paymentReport.successful}</td></tr>
              <tr><td>Pending</td><td>{paymentReport.pending}</td></tr>
              <tr><td>Failed</td><td>{paymentReport.failed}</td></tr>
              <tr><td><strong>Total collected</strong></td><td><strong>R{paymentReport.totalAmount.toFixed(2)}</strong></td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 className="mb-4">Proof of Residence</h3>
          <table className="data-table">
            <tbody>
              <tr><td>Total requests</td><td>{proofRequests.length}</td></tr>
              <tr><td>Pending</td><td>{proofRequests.filter((p) => p.status === 'Pending').length}</td></tr>
              <tr><td>Approved</td><td>{proofRequests.filter((p) => p.status === 'Approved').length}</td></tr>
              <tr><td>Rejected</td><td>{proofRequests.filter((p) => p.status === 'Rejected').length}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
