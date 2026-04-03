import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function PrivateRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 24, color: 'white' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // If role mismatch, keep user in the "customer" section or send to login.
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

