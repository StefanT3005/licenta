import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  // Conectează la AuthContext în loc de hardcoded values
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Se încarcă...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated - show protected content wrapped in DashboardLayout
  return (
    <DashboardLayout>
      {children ? children : <Outlet />}
    </DashboardLayout>
  );
};

export default ProtectedRoute;

