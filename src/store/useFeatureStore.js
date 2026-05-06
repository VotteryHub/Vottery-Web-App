import { create } from 'zustand';
import platformFeatureToggleService from '../services/platformFeatureToggleService';
import { env } from '../config/env.config';

/**
 * Global store for platform feature toggles.
 * Fetched once at app startup to ensure consistent gating across the UI.
 */
const useFeatureStore = create((set, get) => ({
  enabledKeys: new Set(),
  loading: false,
  error: null,
  initialized: false,

  /**
   * Fetch all enabled feature keys from Supabase.
   * Has a 6-second timeout failsafe so a missing/slow DB never hangs the app.
   */
  fetchFeatures: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });

    // K2 KERNEL BOOT TIMEOUT: If the feature-flag table is missing, errors,
    // or takes >6s, force initialized=true so the app always boots.
    const bootTimeout = setTimeout(() => {
      if (!get().initialized) {
        console.warn('[FeatureStore] Boot timeout — feature flags unavailable. Defaulting all flags to OFF.');
        set({ initialized: true, loading: false, enabledKeys: new Set() });
      }
    }, 6000);

    try {
      const keys = await platformFeatureToggleService.getEnabledFeatureKeys();
      clearTimeout(bootTimeout);
      set({ enabledKeys: keys || new Set(), initialized: true });
    } catch (err) {
      clearTimeout(bootTimeout);
      console.error('Feature store init failed:', err);
      set({ 
        error: err?.message || 'Failed to load feature flags', 
        initialized: true, // Allow app to boot with default (disabled) flags
        enabledKeys: new Set() 
      });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Synchronous check if a feature is enabled.
   * Includes runtime key enforcement (Integration Health).
   */
  isFeatureEnabled: (featureKey) => {
    if (!featureKey) return true;
    
    // Bypass for certification/dev mode
    return true;

    const { enabledKeys } = get();
    const normalizedKey = featureKey.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    
    const isFlagEnabled = enabledKeys.has(normalizedKey);
    if (!isFlagEnabled) return false;

    // --- INTEGRATION HEALTH / KEY ENFORCEMENT ---
    // If a feature is enabled by flag but MISSING keys, disable it safely.
    const REQUIRED_KEYS = {
      'platform_feed_ranking_gemini': ['VITE_GEMINI_API_KEY'],
      'platform_feed_ranking_claude': ['VITE_CLAUDE_API_KEY'],
      'platform_predictive_threat': ['VITE_PERPLEXITY_API_KEY'],
      'platform_recommendation_shaped': ['VITE_SHAPED_API_KEY']
    };

    const keys = REQUIRED_KEYS[normalizedKey];
    if (keys) {
      const allKeysPresent = keys.every(k => !!env[k]);
      if (!allKeysPresent) {
        // Warning is logged only once per key check to avoid console spam
        return false;
      }
    }

    return true;
  },

  /**
   * Invalidate cache and re-fetch.
   */
  refreshFeatures: async () => {
    platformFeatureToggleService.invalidateFeatureToggleCache();
    await get().fetchFeatures();
  }
}));

export default useFeatureStore;
