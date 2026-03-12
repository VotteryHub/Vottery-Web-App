/**
 * Platform feature toggles — read-only for app gating.
 * Used by Web and Mobile to show/hide or enable/disable features based on admin panel.
 * Admin write remains in adminControlsService.
 */

import { supabase } from '../lib/supabase';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache = { enabledKeys: null, timestamp: 0 };

function isCacheValid() {
  return cache.enabledKeys !== null && Date.now() - cache.timestamp < CACHE_TTL_MS;
}

/**
 * Fetch all platform feature toggles (feature_key, is_enabled). Public read allowed by RLS.
 * @returns {{ success: boolean, toggles?: Array<{ feature_key: string, is_enabled: boolean }>, error?: string }}
 */
export async function getPlatformFeatureToggles() {
  try {
    const { data, error } = await supabase
      ?.from('platform_feature_toggles')
      ?.select('feature_key, feature_name, is_enabled')
      ?.order('feature_name', { ascending: true });

    if (error) throw error;
    const toggles = (data || []).map((row) => ({
      feature_key: row?.feature_key ?? row?.feature_name?.toLowerCase?.()?.replace(/\s+/g, '_')?.replace(/-/g, '_'),
      feature_name: row?.feature_name,
      is_enabled: Boolean(row?.is_enabled),
    }));
    return { success: true, toggles };
  } catch (err) {
    console.error('getPlatformFeatureToggles error:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Get set of enabled feature keys (cached). Use for gating routes/components.
 * @returns {Promise<Set<string>>}
 */
export async function getEnabledFeatureKeys() {
  if (isCacheValid()) return cache.enabledKeys;

  const result = await getPlatformFeatureToggles();
  const enabled = new Set();
  if (result?.success && result?.toggles) {
    result.toggles.forEach((t) => {
      const key = t?.feature_key;
      if (key && t?.is_enabled) enabled.add(key);
    });
  }
  cache = { enabledKeys: enabled, timestamp: Date.now() };
  return enabled;
}

/**
 * Check if a feature is enabled by feature_key. Uses cache when available.
 * @param {string} featureKey - e.g. 'election_creation', 'participatory_ads_studio'
 * @returns {Promise<boolean>}
 */
export async function isFeatureEnabled(featureKey) {
  if (!featureKey || typeof featureKey !== 'string') return false;
  const key = featureKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  const enabled = await getEnabledFeatureKeys();
  return enabled.has(key);
}

/**
 * Invalidate cache (call after admin changes toggles if same session).
 */
export function invalidateFeatureToggleCache() {
  cache = { enabledKeys: null, timestamp: 0 };
}

const platformFeatureToggleService = {
  getPlatformFeatureToggles,
  getEnabledFeatureKeys,
  isFeatureEnabled,
  invalidateFeatureToggleCache,
};

export default platformFeatureToggleService;
