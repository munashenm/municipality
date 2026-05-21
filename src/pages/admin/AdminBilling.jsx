import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { useApp } from '../../context/AppContext';
import { getAccounts } from '../../services/billing';

export default function AdminBilling() {
  useApp();
  const accounts = getAccounts();

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Billing Administration" subtitle="View municipal accounts and payment activity" backTo="/admin" />

      {accounts.map((account) => (
        <div key={account.id} className="card mb-8">
          <div className="flex justify-between flex-wrap gap-4 mb-4">
            <div>
              <h3 style={{ margin: 0 }}>{account.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{account.accountNumber} — {account.address}</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>R{account.balance.toFixed(2)}</p>
              <small style={{ color: 'var(--text-muted)' }}>Due {new Date(account.dueDate).toLocaleDateString('en-ZA')}</small>
            </div>
          </div>
          <h4>Bills</h4>
          <table className="data-table mb-4">
            <thead><tr><th>Period</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {account.bills.map((b) => (
                <tr key={b.id}><td>{b.period}</td><td>R{b.amount.toFixed(2)}</td><td><StatusBadge status={b.status} /></td></tr>
              ))}
            </tbody>
          </table>
          <h4>Payments</h4>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr></thead>
            <tbody>
              {account.payments.map((p) => (
                <tr key={p.id}><td>{new Date(p.date).toLocaleDateString('en-ZA')}</td><td>R{p.amount.toFixed(2)}</td><td>{p.method}</td><td>{p.reference}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
