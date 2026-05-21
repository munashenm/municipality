import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Toast, { useToast } from '../../components/ui/Toast';
import { register } from '../../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const { toast, show, clear } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', idNumber: '', accountNumber: '', password: '', confirmPassword: '', popiaConsent: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      show('Passwords do not match', 'error');
      return;
    }
    if (!form.popiaConsent) {
      show('POPIA consent is required', 'error');
      return;
    }
    if (form.idNumber.length !== 13) {
      show('Enter a valid 13-digit SA ID number', 'error');
      return;
    }

    setLoading(true);
    const result = await register(form);
    setLoading(false);

    if (!result.success) {
      show(result.error, 'error');
      return;
    }

    show(`OTP sent! Demo code: ${result.otpDemo}`, 'info');
    navigate('/verify-otp', { state: { userId: result.userId, otpDemo: result.otpDemo } });
  };

  return (
    <div className="auth-page container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <div className="auth-card card auth-card-wide">
        <h2 className="text-center">Resident Registration</h2>
        <p className="text-center" style={{ color: 'var(--text-muted)' }}>Register with email, phone, ID number, and municipal account</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-control" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="082 123 4567" required />
            </div>
            <div className="form-group">
              <label className="form-label">SA ID Number *</label>
              <input className="form-control" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} maxLength={13} required />
            </div>
            <div className="form-group">
              <label className="form-label">Municipal Account Number</label>
              <input className="form-control" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} placeholder="MUN-2024-XXXXX" />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-control" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
          </div>

          <label className="popia-consent mt-4">
            <input type="checkbox" checked={form.popiaConsent} onChange={(e) => setForm({ ...form, popiaConsent: e.target.checked })} />
            <span>I consent to the processing of my personal information in accordance with POPIA for municipal service delivery.</span>
          </label>

          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Register & Verify'}
          </button>
        </form>

        <p className="text-center mt-4">Already registered? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
