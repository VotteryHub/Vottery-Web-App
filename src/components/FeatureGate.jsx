import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePlatformFeatureToggles } from '../hooks/usePlatformFeatureToggles';
import { getFeatureKeyForPath } from '../config/routeFeatureKeys';

/**
 * Gates content by platform feature toggle. If the feature is disabled in the admin panel,
 * shows a simple "Feature disabled" message or redirects to home.
 */
export default function FeatureGate({ featureKey, children, redirectTo = '/', showMessage = false }) {
  const { isFeatureEnabled, loading } = usePlatformFeatureToggles();

  if (!featureKey) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Checking feature...</div>
      </div>
    );
  }

  if (!isFeatureEnabled(featureKey)) {
    if (showMessage) {
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Feature not available</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This feature is currently turned off by the platform. It may be enabled later.
            </p>
            <a href={redirectTo} className="mt-4 inline-block text-primary hover:underline">
              Go to home
            </a>
          </div>
        </div>
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

/** Wraps children in FeatureGate when the current path maps to a feature_key. Use in Routes. */
export function FeatureGateByPath({ path, children, redirectTo = '/', showMessage = false }) {
  const featureKey = getFeatureKeyForPath(path);
  if (!featureKey) return <>{children}</>;
  return (
    <FeatureGate featureKey={featureKey} redirectTo={redirectTo} showMessage={showMessage}>
      {children}
    </FeatureGate>
  );
}
