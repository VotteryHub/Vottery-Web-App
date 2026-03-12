import { supabase } from '../lib/supabase';

/**
 * Subscription Pooling Service
 * Manages shared Supabase subscription instances to prevent duplicate connections
 * and memory leaks across Creator Growth Analytics, Churn Prediction, and Revenue Intelligence dashboards
 */

const MAX_SUBSCRIPTIONS = 20;
const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 30000;
const RECONNECT_MAX_ATTEMPTS = 5;

class SubscriptionPoolingService {
  constructor() {
    this.pool = new Map(); // key -> { channel, subscribers: Set, retryCount, retryTimer }
    this.subscriberCallbacks = new Map(); // key -> Map<subscriberId, callback>
  }

  /**
   * Subscribe to a Supabase channel with pooling
   * Returns a cleanup function
   */
  subscribe(key, channelFactory, callback, subscriberId) {
    // Enforce connection limit
    if (!this.pool?.has(key) && this.pool?.size >= MAX_SUBSCRIPTIONS) {
      this._evictStalestSubscription();
    }

    // Register callback
    if (!this.subscriberCallbacks?.has(key)) {
      this.subscriberCallbacks?.set(key, new Map());
    }
    this.subscriberCallbacks?.get(key)?.set(subscriberId, callback);

    // Create channel if not exists
    if (!this.pool?.has(key)) {
      this._createChannel(key, channelFactory);
    }

    const entry = this.pool?.get(key);
    if (entry) {
      entry?.subscribers?.add(subscriberId);
    }

    // Return cleanup function
    return () => this.unsubscribe(key, subscriberId);
  }

  /**
   * Unsubscribe a specific subscriber from a channel
   */
  unsubscribe(key, subscriberId) {
    const callbacks = this.subscriberCallbacks?.get(key);
    if (callbacks) {
      callbacks?.delete(subscriberId);
      if (callbacks?.size === 0) {
        this.subscriberCallbacks?.delete(key);
      }
    }

    const entry = this.pool?.get(key);
    if (entry) {
      entry?.subscribers?.delete(subscriberId);
      // Remove channel if no more subscribers
      if (entry?.subscribers?.size === 0) {
        this._destroyChannel(key);
      }
    }
  }

  /**
   * Create a new channel and add to pool
   */
  _createChannel(key, channelFactory) {
    try {
      const channel = channelFactory((payload) => {
        this._broadcast(key, payload);
      });

      this.pool?.set(key, {
        channel,
        subscribers: new Set(),
        retryCount: 0,
        retryTimer: null,
        channelFactory,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error(`[SubscriptionPool] Failed to create channel: ${key}`, err);
    }
  }

  /**
   * Broadcast payload to all subscribers of a key
   */
  _broadcast(key, payload) {
    const callbacks = this.subscriberCallbacks?.get(key);
    if (callbacks) {
      callbacks?.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[SubscriptionPool] Callback error for key: ${key}`, err);
        }
      });
    }
  }

  /**
   * Destroy a channel and remove from pool
   */
  _destroyChannel(key) {
    const entry = this.pool?.get(key);
    if (entry) {
      if (entry?.retryTimer) {
        clearTimeout(entry?.retryTimer);
      }
      try {
        supabase?.removeChannel(entry?.channel);
      } catch (err) {
        console.error(`[SubscriptionPool] Error removing channel: ${key}`, err);
      }
      this.pool?.delete(key);
    }
  }

  /**
   * Reconnect with exponential backoff
   */
  _scheduleReconnect(key) {
    const entry = this.pool?.get(key);
    if (!entry) return;
    if (entry?.retryCount >= RECONNECT_MAX_ATTEMPTS) {
      console.warn(`[SubscriptionPool] Max reconnect attempts reached for: ${key}`);
      return;
    }

    const delay = Math.min(
      RECONNECT_BASE_DELAY * Math.pow(2, entry?.retryCount),
      RECONNECT_MAX_DELAY
    );

    entry.retryTimer = setTimeout(() => {
      if (!this.pool?.has(key)) return;
      const currentEntry = this.pool?.get(key);
      if (!currentEntry || currentEntry?.subscribers?.size === 0) return;

      console.log(`[SubscriptionPool] Reconnecting: ${key} (attempt ${currentEntry?.retryCount + 1})`);
      const factory = currentEntry?.channelFactory;
      this._destroyChannel(key);
      this._createChannel(key, factory);
      const newEntry = this.pool?.get(key);
      if (newEntry) {
        newEntry.retryCount = currentEntry?.retryCount + 1;
        // Restore subscribers
        currentEntry?.subscribers?.forEach(id => newEntry?.subscribers?.add(id));
      }
    }, delay);

    entry.retryTimer = entry?.retryTimer;
  }

  /**
   * Evict the subscription with fewest subscribers (oldest if tied)
   */
  _evictStalestSubscription() {
    let evictKey = null;
    let minSubs = Infinity;
    let oldestTime = Infinity;

    this.pool?.forEach((entry, key) => {
      if (
        entry?.subscribers?.size < minSubs ||
        (entry?.subscribers?.size === minSubs && entry?.createdAt < oldestTime)
      ) {
        minSubs = entry?.subscribers?.size;
        oldestTime = entry?.createdAt;
        evictKey = key;
      }
    });

    if (evictKey) {
      console.warn(`[SubscriptionPool] Evicting subscription: ${evictKey}`);
      this._destroyChannel(evictKey);
      this.subscriberCallbacks?.delete(evictKey);
    }
  }

  /**
   * Get pool stats for monitoring
   */
  getStats() {
    const stats = [];
    this.pool?.forEach((entry, key) => {
      stats?.push({
        key,
        subscribers: entry?.subscribers?.size,
        retryCount: entry?.retryCount,
        age: Math.round((Date.now() - entry?.createdAt) / 1000)
      });
    });
    return {
      totalChannels: this.pool?.size,
      maxAllowed: MAX_SUBSCRIPTIONS,
      channels: stats
    };
  }

  /**
   * Destroy all channels (app teardown)
   */
  destroyAll() {
    this.pool?.forEach((_, key) => this._destroyChannel(key));
    this.subscriberCallbacks?.clear();
  }

  // ─── Convenience factory methods for analytics dashboards ───────────────────

  /**
   * Subscribe to creator analytics table changes
   */
  subscribeCreatorAnalytics(subscriberId, callback) {
    return this.subscribe(
      'creator_analytics',
      (broadcast) =>
        supabase?.channel('creator_analytics')?.on('postgres_changes', { event: '*', schema: 'public', table: 'creator_activity_logs' }, broadcast)?.subscribe(),
      callback,
      subscriberId
    );
  }

  /**
   * Subscribe to revenue streams table changes
   */
  subscribeRevenueStreams(subscriberId, callback) {
    return this.subscribe(
      'revenue_streams',
      (broadcast) =>
        supabase?.channel('revenue_streams')?.on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, broadcast)?.subscribe(),
      callback,
      subscriberId
    );
  }

  /**
   * Subscribe to churn prediction updates
   */
  subscribeChurnPredictions(subscriberId, callback) {
    return this.subscribe(
      'churn_predictions',
      (broadcast) =>
        supabase?.channel('churn_predictions')?.on('postgres_changes', { event: '*', schema: 'public', table: 'creator_churn_predictions' }, broadcast)?.subscribe(),
      callback,
      subscriberId
    );
  }
}

const subscriptionPoolingService = new SubscriptionPoolingService();
export default subscriptionPoolingService;
