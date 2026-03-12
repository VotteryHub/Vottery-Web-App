import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { hasAnyRole } from '../constants/roles';
import { navigationService } from '../services/navigationService';

/**
 * Protects routes by role. Redirects to home if user lacks required roles.
 * Pass requiredRoles to avoid double lookup when wrapping from wrapWithRoleGuard.
 */
export default function ProtectedRoute({ children, path, requiredRoles }) {
  const { user, userProfile, loading, profileLoading } = useAuth();
  const location = useLocation();
  const currentPath = path ?? location?.pathname;
  const roles = requiredRoles ?? navigationService?.getRequiredRolesForPath(currentPath);
  const accessDeniedShown = useRef(false);

  if (!user) return <Navigate to="/authentication-portal" state={{ from: location }} replace />;
  if (!roles?.length) return children;

  if (user && profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAnyRole(userProfile?.role, roles)) return children;

  if (!accessDeniedShown.current) {
    accessDeniedShown.current = true;
    toast.error("You don't have permission to access this page.");
  }
  return <Navigate to="/" replace />;
}
