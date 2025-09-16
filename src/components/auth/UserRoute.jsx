import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

/**
 * UserRoute - Protects routes that require user authentication
 * Redirects to login if not authenticated
 */
const UserRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading } = useAuth();
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
    if (fallback) return fallback;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated - render the protected content
  return children;
};

UserRoute.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node,
};

export default UserRoute;

