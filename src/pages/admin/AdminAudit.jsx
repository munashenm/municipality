import PageHeader from '../../components/ui/PageHeader';
import { useApp } from '../../context/AppContext';
import { getAuditLogs } from '../../services/audit';
import { getUsers } from '../../services/users';

export default function AdminAudit() {
  useApp();
  const logs = getAuditLogs();
  const users = getUsers();

  const getUserName = (userId) => {
    const u = users.find((x) => x.id === userId);
    return u ? `${u.firstName} ${u.lastName}` : userId || 'System';
  };

  return (
    <div className="container app-main animate-fade-in">
      <PageHeader title="Audit Logs" subtitle="POPIA-compliant audit trail for logins, payments, downloads, and document generation" backTo="/admin" />

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Timestamp</th><th>Action</th><th>User</th><th>Details</th></tr></thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs yet. Actions will be recorded here.</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString('en-ZA')}</td>
                <td><span className="badge badge-blue">{log.action}</span></td>
                <td>{getUserName(log.userId)}</td>
                <td style={{ fontSize: '0.85rem' }}>{JSON.stringify(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
