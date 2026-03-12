import { useState, useEffect, useCallback } from 'react';
import platformFeatureToggleService from '../services/platformFeatureToggleService';

/**
 * Hook: load platform feature toggles and expose isFeatureEnabled(featureKey).
 * Used for gating routes and components by admin On/Off panel.
 */
export function usePlatformFeatureToggles() {
  const [enabledKeys, setEnabledKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const keys = await platformFeatureToggleService.getEnabledFeatureKeys();
      setEnabledKeys(keys);
    } catch (err) {
      setError(err?.message || 'Failed to load feature toggles');
      setEnabledKeys(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isFeatureEnabled = useCallback(
    (featureKey) => {
      if (!featureKey || typeof featureKey !== 'string') return false;
      const key = featureKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
      return enabledKeys.has(key);
    },
    [enabledKeys]
  );

  const refresh = useCallback(() => {
    platformFeatureToggleService.invalidateFeatureToggleCache();
    return load();
  }, [load]);

  return { isFeatureEnabled, enabledKeys, loading, error, refresh };
}

export default usePlatformFeatureToggles;
