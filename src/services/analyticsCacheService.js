/**
 * Analytics Cache Service
 * Implements stale-while-revalidate pattern with IndexedDB storage
 * TTL per data type: tier data (5 min), earnings (1 min), predictions (10 min)
 */

const DB_NAME = 'analytics_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'cache_entries';

const TTL_CONFIG = {
  tier_data: 5 * 60 * 1000,       // 5 minutes
  earnings: 1 * 60 * 1000,        // 1 minute
  predictions: 10 * 60 * 1000,    // 10 minutes
  revenue_streams: 2 * 60 * 1000, // 2 minutes
  churn_risk: 5 * 60 * 1000,      // 5 minutes
  zone_data: 10 * 60 * 1000,      // 10 minutes
  default: 5 * 60 * 1000          // 5 minutes default
};

class AnalyticsCacheService {
  constructor() {
    this.db = null;
    this.memoryCache = new Map(); // L1 in-memory cache
    this.pendingFetches = new Map(); // Dedup in-flight requests
    this.metrics = { hits: 0, misses: 0, staleServed: 0, backgroundRefreshes: 0 };
    this.invalidationCallbacks = new Map();
    this._initDB();
  }

  async _initDB() {
    try {
      this.db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            store.createIndex('expiresAt', 'expiresAt', { unique: false });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (err) {
      console.warn('[CacheService] IndexedDB unavailable, using memory only:', err);
    }
  }

  _getTTL(dataType) {
    return TTL_CONFIG?.[dataType] || TTL_CONFIG?.default;
  }

  _getCacheKey(dataType, params = {}) {
    return `${dataType}:${JSON.stringify(params)}`;
  }

  /**
   * Get from IndexedDB
   */
  async _getFromDB(key) {
    if (!this.db) return null;
    try {
      return await new Promise((resolve) => {
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Write to IndexedDB
   */
  async _writeToDB(key, data, expiresAt) {
    if (!this.db) return;
    try {
      await new Promise((resolve) => {
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({ key, data, expiresAt, cachedAt: Date.now() });
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch (err) {
      console.warn('[CacheService] DB write error:', err);
    }
  }

  /**
   * Delete from IndexedDB
   */
  async _deleteFromDB(key) {
    if (!this.db) return;
    try {
      await new Promise((resolve) => {
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch {}
  }

  /**
   * Core stale-while-revalidate fetch
   * Serves cached data immediately, fetches fresh in background
   */
  async get(dataType, params, fetchFn) {
    const key = this._getCacheKey(dataType, params);
    const ttl = this._getTTL(dataType);
    const now = Date.now();

    // L1: Check memory cache
    const memEntry = this.memoryCache?.get(key);
    if (memEntry) {
      if (now < memEntry?.expiresAt) {
        this.metrics.hits++;
        return memEntry?.data;
      }
      // Stale in memory — serve stale, refresh in background
      this.metrics.staleServed++;
      this._backgroundRefresh(key, dataType, params, fetchFn, ttl);
      return memEntry?.data;
    }

    // L2: Check IndexedDB
    const dbEntry = await this._getFromDB(key);
    if (dbEntry) {
      // Restore to memory cache
      this.memoryCache?.set(key, { data: dbEntry?.data, expiresAt: dbEntry?.expiresAt });

      if (now < dbEntry?.expiresAt) {
        this.metrics.hits++;
        return dbEntry?.data;
      }
      // Stale in DB — serve stale, refresh in background
      this.metrics.staleServed++;
      this._backgroundRefresh(key, dataType, params, fetchFn, ttl);
      return dbEntry?.data;
    }

    // Cache miss — fetch fresh
    this.metrics.misses++;
    return this._fetchAndStore(key, dataType, params, fetchFn, ttl);
  }

  /**
   * Background refresh (stale-while-revalidate)
   */
  _backgroundRefresh(key, dataType, params, fetchFn, ttl) {
    if (this.pendingFetches?.has(key)) return; // Already in-flight
    this.metrics.backgroundRefreshes++;
    this._fetchAndStore(key, dataType, params, fetchFn, ttl)?.catch(() => {});
  }

  /**
   * Fetch fresh data and store in cache
   */
  async _fetchAndStore(key, dataType, params, fetchFn, ttl) {
    // Dedup concurrent requests
    if (this.pendingFetches?.has(key)) {
      return this.pendingFetches?.get(key);
    }

    const fetchPromise = (async () => {
      try {
        const data = await fetchFn();
        const expiresAt = Date.now() + ttl;
        this.memoryCache?.set(key, { data, expiresAt });
        await this._writeToDB(key, data, expiresAt);
        return data;
      } finally {
        this.pendingFetches?.delete(key);
      }
    })();

    this.pendingFetches?.set(key, fetchPromise);
    return fetchPromise;
  }

  /**
   * Invalidate cache entries by dataType or specific key
   */
  async invalidate(dataType, params = null) {
    if (params !== null) {
      const key = this._getCacheKey(dataType, params);
      this.memoryCache?.delete(key);
      await this._deleteFromDB(key);
    } else {
      // Invalidate all entries for this dataType
      const prefix = `${dataType}:`;
      const keysToDelete = [];
      this.memoryCache?.forEach((_, k) => {
        if (k?.startsWith(prefix)) keysToDelete?.push(k);
      });
      keysToDelete?.forEach(k => this.memoryCache?.delete(k));

      // Also clear from IndexedDB
      if (this.db) {
        try {
          await new Promise((resolve) => {
            const tx = this.db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.openCursor();
            req.onsuccess = (e) => {
              const cursor = e.target.result;
              if (cursor) {
                if (cursor.key.startsWith(prefix)) cursor.delete();
                cursor.continue();
              }
            };
            tx.oncomplete = resolve;
            tx.onerror = resolve;
          });
        } catch {}
      }
    }

    // Notify invalidation callbacks
    const cb = this.invalidationCallbacks?.get(dataType);
    if (cb) cb(dataType, params);
  }

  /**
   * Invalidation triggers for user actions
   */
  async onPayoutCompleted(creatorId) {
    await Promise.all([
      this.invalidate('earnings', { creatorId }),
      this.invalidate('earnings'),
      this.invalidate('revenue_streams')
    ]);
  }

  async onTierUpgraded(creatorId) {
    await Promise.all([
      this.invalidate('tier_data', { creatorId }),
      this.invalidate('tier_data'),
      this.invalidate('predictions')
    ]);
  }

  /**
   * Cache warming — prefetch critical analytics data on app load
   */
  async warmCache(fetchMap) {
    const warmingPromises = Object.entries(fetchMap)?.map(async ([dataType, { params, fetchFn }]) => {
      try {
        await this.get(dataType, params, fetchFn);
      } catch (err) {
        console.warn(`[CacheService] Warming failed for ${dataType}:`, err);
      }
    });
    await Promise.allSettled(warmingPromises);
  }

  /**
   * Register callback for cache invalidation events
   */
  onInvalidation(dataType, callback) {
    this.invalidationCallbacks?.set(dataType, callback);
    return () => this.invalidationCallbacks?.delete(dataType);
  }

  /**
   * Get cache performance metrics
   */
  getMetrics() {
    const total = this.metrics?.hits + this.metrics?.misses + this.metrics?.staleServed;
    return {
      ...this.metrics,
      hitRate: total > 0 ? Math.round((this.metrics?.hits / total) * 100) : 0,
      staleRate: total > 0 ? Math.round((this.metrics?.staleServed / total) * 100) : 0,
      memoryCacheSize: this.memoryCache?.size,
      pendingFetches: this.pendingFetches?.size
    };
  }

  /**
   * Get storage quota info
   */
  async getStorageInfo() {
    try {
      if (navigator?.storage?.estimate) {
        const { usage, quota } = await navigator.storage?.estimate();
        return {
          usedMB: Math.round(usage / 1024 / 1024 * 100) / 100,
          quotaMB: Math.round(quota / 1024 / 1024 * 100) / 100,
          usagePercent: Math.round((usage / quota) * 100)
        };
      }
    } catch {}
    return { usedMB: 0, quotaMB: 0, usagePercent: 0 };
  }

  /**
   * Cleanup expired entries from IndexedDB
   */
  async pruneExpired() {
    if (!this.db) return;
    const now = Date.now();
    // Prune memory cache
    this.memoryCache?.forEach((entry, key) => {
      if (now > entry?.expiresAt) this.memoryCache?.delete(key);
    });
    // Prune IndexedDB
    try {
      await new Promise((resolve) => {
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const idx = store.index('expiresAt');
        const range = IDBKeyRange.upperBound(now);
        const req = idx.openCursor(range);
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor) { cursor.delete(); cursor.continue(); }
        };
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    } catch {}
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = { hits: 0, misses: 0, staleServed: 0, backgroundRefreshes: 0 };
  }
}

const analyticsCacheService = new AnalyticsCacheService();
export { TTL_CONFIG };
export default analyticsCacheService;
