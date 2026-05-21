import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getReports } from '../../services/reports';
import { getActiveAlerts } from '../../services/alerts';
import { getBookings } from '../../services/queue';
import { getOpenJobs } from '../../services/jobs';
import { getPublishedBusinesses } from '../../services/businessDirectory';

export default function AdminDashboard() {
  useApp();
  const reports = getReports();
  const openIssues = reports.filter((r) => r.status === 'Open' || r.status === 'In Progress').length;
  const resolvedToday = reports.filter((r) => r.status === 'Resolved' && new Date(r.createdAt).toDateString() === new Date().toDateString()).length;
  const alerts = getActiveAlerts().length;
  const bookings = getBookings().filter((b) => b.status === 'Confirmed').length;

  const modules = [
    { to: '/admin/residents', label: 'Residents & PoR', count: null, color: 'var(--primary)' },
    { to: '/admin/bills', label: 'Bill Management', count: null, color: 'var(--secondary)' },
    { to: '/admin/disputes', label: 'Disputes', count: null, color: 'var(--danger)' },
    { to: '/admin/reports-hub', label: 'Reports & Analytics', count: null, color: '#7c3aed' },
    { to: '/admin/audit', label: 'Audit Logs', count: null, color: 'var(--text-muted)' },
    { to: '/admin/reports', label: 'Service Reports', count: openIssues, color: 'var(--danger)' },
    { to: '/admin/billing', label: 'Account Overview', count: null, color: 'var(--secondary)' },
    { to: '/admin/alerts', label: 'Alerts', count: alerts, color: 'var(--accent)' },
    { to: '/admin/jobs', label: 'Jobs & Tenders', count: getOpenJobs().length, color: 'var(--primary-dark)' },
    { to: '/admin/queue', label: 'Queue Bookings', count: bookings, color: 'var(--primary)' },
    { to: '/admin/notices', label: 'Community Notices', count: null, color: '#7c3aed' },
    { to: '/admin/businesses', label: 'Business Directory', count: getPublishedBusinesses().length, color: '#0d9488' },
  ];

  return (
    <div className="container app-main animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2>Municipal Staff Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Open Issues</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{openIssues}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Resolved Today</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{resolvedToday}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Total Reports</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{reports.length}</p>
        </div>
        <div className="card stat-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h4 style={{ color: 'var(--text-muted)', margin: 0 }}>Active Alerts</h4>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{alerts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {modules.map((m) => (
          <Link key={m.to} to={m.to} className="card admin-module-card">
            <h3>{m.label}</h3>
            {m.count !== null && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: m.color }}>{m.count}</p>}
            <span style={{ color: 'var(--primary)' }}>Manage &rarr;</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3 className="mb-4">Recent Reported Issues</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Type</th><th>Location</th><th>Status</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {reports.slice(0, 10).map((r) => (
                <tr key={r.id}>
                  <td>{r.ticketNumber}</td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td><span className={`badge ${r.status === 'Open' ? 'badge-red' : r.status === 'In Progress' ? 'badge-yellow' : 'badge-green'}`}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString('en-ZA')}</td>
                  <td><Link to="/admin/reports" className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
