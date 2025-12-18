import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const RoleProtectedRoute = ({ children, allowedRoles, redirectTo = '/admin/login' }) => {
  const { isAuthenticated, loading, hasRole, hasAnyRole, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const hasAccess = Array.isArray(allowedRoles)
    ? hasAnyRole(allowedRoles)
    : hasRole(allowedRoles);

  if (!hasAccess) {
    const role = user?.role;
    let defaultRedirect = redirectTo;
    
    if (role === 'CUSTOMER') {
      defaultRedirect = '/login';
    } else if (role === 'CHEF') {
      defaultRedirect = '/chef/login';
    } else if (role === 'ORDER') {
      defaultRedirect = '/order-staff/login';
    }
    
    return <Navigate to={defaultRedirect} replace />;
  }

  return children;
};

export default RoleProtectedRoute;

