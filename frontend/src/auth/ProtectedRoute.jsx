import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
