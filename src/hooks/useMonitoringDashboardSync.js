import { useCallback, useEffect, useRef, useState } from 'react';
import { registerDashboard, getAdaptiveSyncConfig } from '../services/monitoringDashboardOfflineSyncService';

/**
 * Offline-first sync for monitoring dashboards: 3-way merge + adaptive poll interval.
 * Use with production-deployment-hub, real-time monitoring, etc.
 * When server data arrives (e.g. from Supabase or fetch), call setServerData(serverData)
 * and use mergedData for rendering; when user edits locally (e.g. offline), call setLocalData(localData).
 * @param {string} dashboardId - e.g. 'production-deployment-hub'
 * @param {{ strategy?: 'remote_wins'|'local_wins'|'merge_deep' }} [options]
 * @returns {{ mergedData: object|null, conflicts: string[], setServerData: (data: object) => void, setLocalData: (data: object) => void, syncConfig: { pollIntervalMs, batchSize, effectiveType } }}
 */
export function useMonitoringDashboardSync(dashboardId, options = {}) {
  const [mergedData, setMergedData] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const syncConfig = getAdaptiveSyncConfig();
  const regRef = useRef(null);

  if (!regRef.current) {
    regRef.current = registerDashboard(dashboardId, options);
  }
  const reg = regRef.current;

  const setServerData = useCallback((serverData) => {
    const { merged, conflicts: c } = reg.applyRemote(serverData ?? {});
    setMergedData(merged);
    setConflicts(c || []);
  }, [reg]);

  const setLocalData = useCallback((localData) => {
    const { merged, conflicts: c } = reg.setLocal(localData ?? {});
    setMergedData(merged);
    setConflicts(c || []);
  }, [reg]);

  useEffect(() => {
    const current = reg.getMergedState?.();
    if (current != null) setMergedData(current);
  }, [reg]);

  return { mergedData, conflicts, setServerData, setLocalData, syncConfig };
}
