import { supabase } from '../lib/supabase.js';

const CACHE_TTL = 60 * 1000; // 1 minute
let flagCache = {
  data: new Set(),
  expiry: 0
};

/**
 * Fetches enabled feature keys from the database with a short-lived cache.
 */
async function getEnabledFeatures() {
  if (Date.now() < flagCache.expiry) {
    return flagCache.data;
  }

  try {
    const { data, error } = await supabase
      .from('platform_feature_toggles')
      .select('feature_key')
      .eq('is_enabled', true);

    if (error) throw error;

    const enabledSet = new Set(data.map(item => item.feature_key));
    flagCache = {
      data: enabledSet,
      expiry: Date.now() + CACHE_TTL
    };
    return enabledSet;
  } catch (err) {
    console.error('[FeatureGate] Error fetching features:', err);
    // Fallback to cache on error if available
    return flagCache.data;
  }
}

/**
 * Express middleware to gate endpoints by feature key.
 * If the feature is disabled, returns 403 Forbidden.
 * 
 * @param {string} featureKey - The key defined in platform_feature_toggles.
 */
export const requireFeature = (featureKey) => {
  return async (req, res, next) => {
    try {
      const enabledFeatures = await getEnabledFeatures();
      
      const normalizedKey = featureKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
      
      if (!enabledFeatures.has(normalizedKey)) {
        console.warn(`[FeatureGate] Access denied to ${req.originalUrl}: Feature '${featureKey}' is disabled.`);
        return res.status(403).json({
          error: 'Feature Disabled',
          message: `The '${featureKey}' feature is currently disabled by the platform.`,
          feature_key: normalizedKey
        });
      }

      next();
    } catch (err) {
      console.error('[FeatureGate] Middleware error:', err);
      // Fail-safe: allow core features, but maybe block modules?
      // For now, we allow if check fails to prevent global API blackout
      next();
    }
  };
};
