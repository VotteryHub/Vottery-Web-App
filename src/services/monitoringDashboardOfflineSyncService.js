/**
 * Centralized offline-first 3-way merge and adaptive sync for monitoring dashboards.
 * Use from production-deployment-hub, real-time monitoring, and other admin dashboards
 * so local edits and server updates merge correctly when back online.
 */

const DASHBOARD_STORAGE_KEY = 'vottery_monitoring_dashboard_sync';

/**
 * 3-way merge: combine base, local changes, and remote (server) into a single merged result.
 * Prefers remote for conflicts when both local and remote changed from base; optional strategy can override.
 * @param {object} base - Last known server state (or initial)
 * @param {object} local - Current local/offline state
 * @param {object} remote - Latest server state
 * @param {'remote_wins'|'local_wins'|'merge_deep'} [strategy='remote_wins'] - Conflict strategy
 * @returns {{ merged: object, conflicts: string[] }}
 */
export function threeWayMerge(base, local, remote, strategy = 'remote_wins') {
  const conflicts = [];
  if (!base || typeof base !== 'object') base = {};
  if (!local || typeof local !== 'object') local = {};
  if (!remote || typeof remote !== 'object') remote = {};

  const merged = {};
  const allKeys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);

  for (const key of allKeys) {
    const b = base[key];
    const l = local[key];
    const r = remote[key];

    const baseEq = JSON.stringify(b);
    const localEq = JSON.stringify(l);
    const remoteEq = JSON.stringify(r);

    if (localEq === remoteEq) {
      merged[key] = l ?? r ?? b;
      continue;
    }
    if (baseEq === remoteEq) {
      merged[key] = l;
      continue;
    }
    if (baseEq === localEq) {
      merged[key] = r;
      continue;
    }
    // Both local and remote changed from base — conflict
    conflicts.push(key);
    if (strategy === 'local_wins') {
      merged[key] = l;
    } else if (strategy === 'merge_deep' && typeof l === 'object' && l !== null && typeof r === 'object' && r !== null && !Array.isArray(l) && !Array.isArray(r)) {
      const sub = threeWayMerge(b || {}, l, r, strategy);
      merged[key] = sub.merged;
      conflicts.pop();
      conflicts.push(...sub.conflicts.map(c => `${key}.${c}`));
    } else {
      merged[key] = r;
    }
  }

  return { merged, conflicts };
}

/**
 * Adaptive sync: returns poll interval and batch size based on connection (Network Information API when available).
 * @returns {{ pollIntervalMs: number, batchSize: number, effectiveType: string }}
 */
export function getAdaptiveSyncConfig() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  let pollIntervalMs = 30_000;
  let batchSize = 100;
  let effectiveType = 'unknown';

  if (conn) {
    effectiveType = conn.effectiveType || 'unknown';
    if (conn.saveData) {
      pollIntervalMs = 120_000;
      batchSize = 50;
    } else if (effectiveType === '4g') {
      pollIntervalMs = 15_000;
      batchSize = 200;
    } else if (effectiveType === '3g') {
      pollIntervalMs = 45_000;
      batchSize = 75;
    } else if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      pollIntervalMs = 90_000;
      batchSize = 30;
    }
  }

  return { pollIntervalMs, batchSize, effectiveType };
}

/**
 * In-memory store for dashboard sync state (base/local/remote) per dashboard.
 * Persists to sessionStorage when available so refresh keeps last known state.
 */
const store = {
  _cache: {},
  get(dashboardId) {
    try {
      const raw = sessionStorage?.getItem?.(`${DASHBOARD_STORAGE_KEY}_${dashboardId}`);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return this._cache[dashboardId] || null;
  },
  set(dashboardId, state) {
    this._cache[dashboardId] = state;
    try {
      sessionStorage?.setItem?.(`${DASHBOARD_STORAGE_KEY}_${dashboardId}`, JSON.stringify(state));
    } catch (_) {}
  },
};

/**
 * Register a monitoring dashboard for offline-first sync with 3-way merge.
 * Call applyRemote(dashboardId, remoteData) when fresh server data arrives;
 * call getMergedState(dashboardId) for the merged state to render.
 * @param {string} dashboardId - e.g. 'production-deployment-hub', 'realtime-monitoring'
 * @param {{ strategy?: 'remote_wins'|'local_wins'|'merge_deep' }} [options]
 * @returns {{ applyRemote: (remote: object) => { merged: object, conflicts: string[] }, getMergedState: () => object, setLocal: (local: object) => void }}
 */
export function registerDashboard(dashboardId, options = {}) {
  const strategy = options.strategy || 'remote_wins';

  function getState() {
    return store.get(dashboardId) || { base: null, local: null, remote: null, merged: null };
  }

  function setState(partial) {
    const prev = getState();
    store.set(dashboardId, { ...prev, ...partial });
  }

  function setLocal(local) {
    const s = getState();
    setState({ local });
    if (s.remote != null) {
      const { merged, conflicts } = threeWayMerge(s.base, local, s.remote, strategy);
      setState({ merged, conflicts });
      return { merged, conflicts };
    }
    setState({ merged: local });
    return { merged: local, conflicts: [] };
  }

  function applyRemote(remote) {
    const s = getState();
    const local = s.local ?? s.merged ?? s.base;
    const base = s.base ?? s.remote ?? s.merged ?? local;
    const { merged, conflicts } = threeWayMerge(base, local, remote, strategy);
    setState({ base: remote, remote, merged, local });
    return { merged, conflicts };
  }

  function getMergedState() {
    return getState().merged ?? getState().local ?? getState().remote ?? getState().base ?? null;
  }

  return { applyRemote, getMergedState, setLocal, getState };
}

export default {
  threeWayMerge,
  getAdaptiveSyncConfig,
  registerDashboard,
};
