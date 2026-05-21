import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';
import Toast, { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/auth';

const DEMO_ACCOUNTS = [
  { label: 'Citizen', identifier: 'thabo@demo.co.za', password: 'Demo@123' },
  { label: 'Staff', identifier: 'staff@municipality.gov.za', password: 'Staff@123' },
  { label: 'Admin', identifier: 'admin@municipality.gov.za', password: 'Admin@123' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, ready } = useAuth();
  const { toast, show, clear } = useToast();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready) {
      show('Still loading accounts, please wait...', 'info');
      return;
    }
    setLoading(true);
    const result = await login(form.identifier, form.password);
    setLoading(false);

    if (result.needsOtp) {
      navigate('/verify-otp', { state: { userId: result.userId } });
      return;
    }
    if (!result.success) {
      show(result.error, 'error');
      return;
    }

    refreshUser();
    show('Welcome back!');
    if (result.user.role === 'admin' || result.user.role === 'staff') {
      navigate('/admin');
    } else {
      navigate(from);
    }
  };

  const fillDemo = (account) => {
    setForm({ identifier: account.identifier, password: account.password });
  };

  return (
    <div className="auth-page container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <div className="auth-card card">
        <div className="auth-header text-center mb-8">
          <Building2 size={40} color="var(--primary)" className="mb-4" />
          <h2>Resident Login</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Access your municipal account securely</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Phone</label>
            <input className="form-control" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} placeholder="thabo@demo.co.za or 0821234567" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading || !ready}>
            <LogIn size={18} /> {!ready ? 'Loading...' : loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo mt-4">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><strong>Demo accounts (click to fill):</strong></p>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              className="demo-fill-btn"
              onClick={() => fillDemo(acc)}
            >
              {acc.label}: {acc.identifier} / {acc.password}
            </button>
          ))}
        </div>

        <p className="text-center mt-4" style={{ marginBottom: 0 }}>
          New resident? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
