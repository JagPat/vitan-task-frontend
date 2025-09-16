import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

/**
 * AdminRoute - Protects routes that require admin role
 * Redirects to login if not authenticated, or dashboard if not admin
 */
const AdminRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not admin - redirect to dashboard or show access denied
  if (!isAdmin()) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Access Denied</div>
          <div className="text-gray-600 mb-4">You don\'t have permission to access this page.</div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is admin - render the protected content
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
};

export default AdminRoute;

