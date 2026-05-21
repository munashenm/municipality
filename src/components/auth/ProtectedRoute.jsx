import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles = [], requireVerified = false }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="container app-main text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireVerified && !user.verified) {
    return <Navigate to="/verify-otp" state={{ userId: user.id }} replace />;
  }

  return children;
}
