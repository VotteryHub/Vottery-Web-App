import { useMemo } from 'react';
import useFeatureStore from '../store/useFeatureStore';

/**
 * Unified UI Hook for feature gating.
 * @param {string} featureKey - The key defined in platform_feature_toggles.
 * @returns {{ enabled: boolean, loading: boolean, error: any }}
 */
export function useFeature(featureKey) {
  const enabledKeys = useFeatureStore((state) => state.enabledKeys);
  const loading = useFeatureStore((state) => state.loading);
  const error = useFeatureStore((state) => state.error);

  const enabled = useMemo(() => {
    if (!featureKey) return true;
    const normalizedKey = featureKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    return enabledKeys.has(normalizedKey);
  }, [enabledKeys, featureKey]);

  return { enabled, loading, error };
}

export default useFeature;
