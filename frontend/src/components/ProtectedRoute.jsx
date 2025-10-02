import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to the appropriate dashboard based on role
    if (currentUser.role === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (currentUser.role === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
