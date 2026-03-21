/**
 * Post-login geo snapshot for velocity / anomaly detection (Edge: record-login-geo).
 * Sync throttle with Mobile: `CreatorChurnPredictionService.invokeRecordLoginGeoIfDue`.
 */

import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'last_record_login_geo_epoch_ms';
const COOLDOWN_MS = 5 * 60 * 1000;
const FN_NAME = 'record-login-geo';

export const securityLoginGeoService = {
  invokeRecordLoginGeoIfDue() {
    (async () => {
      try {
        if (typeof window === 'undefined' || !window?.localStorage) return;
        const { data: { session } } = await supabase?.auth?.getSession?.();
        if (!session) return;
        const last = parseInt(window.localStorage.getItem(STORAGE_KEY) || '0', 10);
        const now = Date.now();
        if (now - last < COOLDOWN_MS) return;
        const { error } = await supabase?.functions?.invoke(FN_NAME);
        if (!error) {
          window.localStorage.setItem(STORAGE_KEY, String(now));
        }
      } catch (e) {
        console.warn('[securityLoginGeoService] invokeRecordLoginGeoIfDue', e);
      }
    })();
  },
};

export default securityLoginGeoService;
