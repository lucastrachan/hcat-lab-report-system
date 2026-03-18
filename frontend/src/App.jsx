import { Routes, Route, Navigate } from 'react-router-dom';
import SubmitPage from './pages/SubmitPage';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminReportPage from './pages/AdminReportPage';
import CustomerReportPage from './pages/CustomerReportPage';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthProvider';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/submit" replace />} />
      <Route path="/submit" element={<SubmitPage />} />

      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ) : (
            <AdminLoginPage />
          )
        }
      />
      <Route
        path="/admin/report/:reportId"
        element={
          <ProtectedRoute>
            <AdminReportPage />
          </ProtectedRoute>
        }
      />

      <Route path="/reports/:reportId" element={<CustomerReportPage />} />
    </Routes>
  );
}
