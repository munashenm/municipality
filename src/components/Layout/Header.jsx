import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, LayoutDashboard, Bell, LogIn, LogOut, User } from 'lucide-react';
import { getNotifications } from '../../services/alerts';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');
  const unread = getNotifications().filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 logo-link">
          <Building2 size={28} />
          <span>SmartCity Muni</span>
        </Link>
        <nav className="flex gap-4 items-center nav-links">
          {!isAdmin && (
            <>
              <Link to="/">Home</Link>
              {user?.role === 'citizen' && <Link to="/dashboard">My Account</Link>}
              <Link to="/report">Report</Link>
              <Link to="/alerts" className="flex items-center gap-1">
                <Bell size={16} /> Alerts
                {unread > 0 && <span className="nav-badge">{unread}</span>}
              </Link>
              <Link to="/jobs">Jobs</Link>
              <Link to="/queue">Book</Link>
              <Link to="/emergency">Emergency</Link>
            </>
          )}
          {user ? (
            <>
              {(user.role === 'staff' || user.role === 'admin') && !isAdmin && (
                <Link to="/admin" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                  <LayoutDashboard size={18} /> Staff Portal
                </Link>
              )}
              {isAdmin && (
                <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Citizen Portal</Link>
              )}
              <span className="nav-user flex items-center gap-1" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <User size={16} /> {user.firstName}
              </span>
              <button type="button" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
