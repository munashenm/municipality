import { Link } from 'react-router-dom';
import {
  AlertTriangle, Droplets, Zap, CreditCard, Megaphone, PhoneCall,
  Briefcase, Calendar, BellRing,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getActiveAlerts } from '../../services/alerts';
import { getReports } from '../../services/reports';

export default function Home() {
  useApp();
  const alerts = getActiveAlerts().slice(0, 3);
  const recentReports = getReports().slice(0, 4);

  const services = [
    { icon: AlertTriangle, color: 'var(--danger)', title: 'Report Issue', desc: 'Water leaks, potholes, outages & more', to: '/report' },
    { icon: CreditCard, color: 'var(--secondary)', title: 'My Account', desc: 'Bills, payments, statements & proof of residence', to: '/dashboard' },
    { icon: Zap, color: 'var(--accent)', title: 'Loadshedding & Alerts', desc: 'Schedules, water cuts & emergency notices', to: '/alerts' },
    { icon: Briefcase, color: 'var(--primary-dark)', title: 'Jobs & Tenders', desc: 'Vacancies, tenders, RFQs & quotations', to: '/jobs' },
    { icon: Calendar, color: 'var(--primary)', title: 'Queue Booking', desc: 'Book appointments — skip the queue', to: '/queue' },
    { icon: Megaphone, color: '#7c3aed', title: 'Community Notices', desc: 'Events, road closures & public participation', to: '/notices' },
    { icon: PhoneCall, color: 'var(--text-muted)', title: 'Emergency Services', desc: 'SAPS, ambulance, fire & disaster management', to: '/emergency' },
    { icon: Droplets, color: 'var(--primary-light)', title: 'Track Ticket', desc: 'Check status of your service report', to: '/track' },
  ];

  return (
    <div className="container app-main animate-fade-in">
      <div className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.85), rgba(29, 78, 216, 0.92)), url(/hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h1>Welcome to SmartCity</h1>
        <p>Your digital gateway to municipal services. Report issues, pay bills, book appointments, and stay connected.</p>
        <Link to="/report" className="btn btn-primary hero-btn">
          <AlertTriangle size={20} />
          Report an Issue Now
        </Link>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2>Our Services</h2>
        <span className="badge badge-green">All Features Live</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {services.map(({ icon: Icon, color, title, desc, to }) => (
          <Link key={to} to={to} className="card service-card text-center flex flex-col items-center">
            <Icon size={32} className="mb-4" color={color} />
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 0, fontSize: '0.875rem' }}>{desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card glass-panel">
          <div className="flex items-center gap-2 mb-4">
            <BellRing color="var(--accent)" />
            <h3 style={{ margin: 0 }}>Latest Alerts</h3>
          </div>
          <ul className="alert-list">
            {alerts.map((a) => (
              <li key={a.id} className="alert-item">
                <span className={`badge ${a.priority === 'high' ? 'badge-red' : a.priority === 'medium' ? 'badge-yellow' : 'badge-blue'} mb-2`}>
                  {a.type}
                </span>
                <p style={{ margin: 0, fontWeight: 500 }}>{a.title}</p>
                <small style={{ color: 'var(--text-muted)' }}>{a.area}</small>
              </li>
            ))}
          </ul>
          <Link to="/alerts" className="btn btn-secondary w-full mt-4">View All Alerts</Link>
        </div>

        <div className="card">
          <h3 className="mb-4">Recent Service Reports</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id}>
                    <td><Link to={`/track?ticket=${encodeURIComponent(r.ticketNumber)}`}>{r.ticketNumber}</Link></td>
                    <td>{r.type}</td>
                    <td><span className={`badge ${r.status === 'Open' ? 'badge-red' : r.status === 'In Progress' ? 'badge-yellow' : 'badge-green'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/track" className="btn btn-secondary w-full mt-4">Track Your Ticket</Link>
        </div>
      </div>

      <div className="card mt-8 text-center app-download">
        <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Download the SmartCity App</h3>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Get push notifications for loadshedding, water alerts, and billing reminders.</p>
        <div className="flex justify-center gap-4">
          <button className="btn store-btn" type="button">App Store</button>
          <button className="btn store-btn" type="button">Google Play</button>
        </div>
      </div>
    </div>
  );
}
