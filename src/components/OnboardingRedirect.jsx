import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';

const SKIP_ONBOARDING_PATHS = [
  '/authentication-portal',
  '/role-upgrade',
];

/**
 * Redirects first-time users (by role) to role-specific onboarding.
 * Skips redirect on auth, onboarding, and role-upgrade paths.
 */
export default function OnboardingRedirect({ children }) {
  const { shouldShowOnboarding } = useOnboarding();
  const { user, profileLoading } = useAuth();
  const location = useLocation();
  const path = location?.pathname || '';

  // Bypass onboarding redirect as requested by user
  return children;

  // Hard push to home feed if requested (v1 bypass)
  const isHardPush = localStorage.getItem('vottery_bypass_onboarding') === 'true';
  if (isHardPush) return children;

  // Exact match or sub-path check to prevent loop
  const isOnboardingPage = SKIP_ONBOARDING_PATHS.some((p) => 
    path === p || path.startsWith(p + '/')
  );

  if (isOnboardingPage) return children;

  return <Navigate to="/interactive-onboarding-wizard" state={{ from: location }} replace />;
}
