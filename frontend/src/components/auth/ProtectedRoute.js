// components/auth/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated and authorized.
 * @param {string[]} [props.allowedRoles] - Array of roles allowed to access this route. If undefined, only authentication is checked.
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated.
 * @param {string} [props.redirectUnauthorizedTo='/unauthorized'] - Path to redirect to if authenticated but not authorized for the role.
 */
const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/login',
  redirectUnauthorizedTo = '/unauthorized', // Or a common dashboard, or back
}) => {
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);
  const location = useLocation();

  // Show loading spinner while checking authentication or user data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 1. Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Check roles if 'allowedRoles' is provided
  // Ensure user and user.role exist before trying to access them
  const userRole = user?.role; // Using optional chaining

  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      // User is authenticated but does not have the required role
      return <Navigate to={redirectUnauthorizedTo} state={{ from: location }} replace />;
    }
  }

  // 3. If authenticated and (no roles are specified OR user has the required role)
  return children;
};

export default ProtectedRoute;