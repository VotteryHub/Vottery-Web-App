import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { hasAnyRole } from '../constants/roles';
import { navigationService } from '../services/navigationService';
import { FULL_FEATURE_CERTIFICATION_MODE } from '../config/batch1RouteAllowlist';

/**
 * Protects routes by role. Redirects to home if user lacks required roles.
 * Pass requiredRoles to avoid double lookup when wrapping from wrapWithRoleGuard.
 */
export default function ProtectedRoute({ children, path, requiredRoles }) {
  const { user, userProfile, loading, profileLoading, can } = useAuth();
  const location = useLocation();
  const currentPath = path ?? location?.pathname;
  
  // Bypass for certification/dev mode (Syncs with the global router bypass)
  const isCertificationMode = FULL_FEATURE_CERTIFICATION_MODE || import.meta.env?.VITE_FULL_FEATURE_CERTIFICATION === 'true';
  if (isCertificationMode) return children;
  
  const requiredPermission = navigationService?.getRequiredPermissionForPath(currentPath);
  const roles = requiredRoles ?? navigationService?.getRequiredRolesForPath(currentPath);
  const accessDeniedShown = useRef(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground animate-pulse">Synchronizing session...</p>
        </div>
      </div>
    );
  }

  // Route is public (no roles required) — allow through without auth
  if (!roles?.length) return children;
  
  if (!user) return <Navigate to="/authentication-portal" state={{ from: location }} replace />;

  if (user && profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 1. Check Permission (Single source of truth)
  if (requiredPermission) {
    if (can(requiredPermission)) return children;
  } 
  // 2. Fallback to Role check (Legacy support)
  else if (roles?.length) {
    if (hasAnyRole(userProfile?.role, roles)) return children;
  } 
  // 3. Public route
  else {
    return children;
  }

  if (!accessDeniedShown.current) {
    accessDeniedShown.current = true;
    toast.error("You don't have permission to access this page.");
  }
  return <Navigate to="/403" replace />;
}
