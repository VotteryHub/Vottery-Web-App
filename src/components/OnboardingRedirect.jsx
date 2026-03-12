import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';

const SKIP_ONBOARDING_PATHS = [
  '/interactive-onboarding-wizard',
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

  if (!user || profileLoading || !shouldShowOnboarding) return children;
  if (SKIP_ONBOARDING_PATHS.some((p) => path?.startsWith(p))) return children;

  return <Navigate to="/interactive-onboarding-wizard" state={{ from: location }} replace />;
}
