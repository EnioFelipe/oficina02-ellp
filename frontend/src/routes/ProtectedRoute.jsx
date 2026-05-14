import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../components/ui/Loading.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles?.length && (!profile || !roles.includes(profile.type))) return <Navigate to="/dashboard" replace />;

  return children || <Outlet />;
}
