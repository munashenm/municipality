import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Toast, { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { verifyOtp, resendOtp } from '../../services/auth';

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { toast, show, clear } = useToast();
  const userId = location.state?.userId;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!userId) {
    navigate('/login');
    return null;
  }

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    const result = verifyOtp(userId, code.trim());
    setLoading(false);
    if (!result.success) {
      show(result.error, 'error');
      return;
    }
    refreshUser();
    show('Account verified successfully!');
    navigate('/dashboard');
  };

  const handleResend = () => {
    const result = resendOtp(userId);
    if (result.success) show(`New OTP sent. Demo code: ${result.otpDemo}`, 'info');
  };

  return (
    <div className="auth-page container app-main animate-fade-in">
      <Toast message={toast?.message} type={toast?.type} onClose={clear} />
      <div className="auth-card card text-center">
        <ShieldCheck size={48} color="var(--primary)" className="mb-4" />
        <h2>Verify Your Account</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enter the 6-digit OTP sent to your email or phone</p>
        {location.state?.otpDemo && (
          <p className="badge badge-yellow mb-4">Demo OTP: {location.state.otpDemo}</p>
        )}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <input className="form-control otp-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" maxLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button type="button" className="btn btn-secondary w-full mt-2" onClick={handleResend}>Resend OTP</button>
      </div>
    </div>
  );
}
