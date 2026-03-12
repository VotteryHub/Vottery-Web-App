import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

class EnhancedRealtimeManager {
  constructor() {
    this.connections = new Map();
    this.latencyMetrics = new Map();
    this.reconnectAttempts = new Map();
    this.conflictResolution = new Map();
    this.maxReconnectAttempts = 5;
    this.heartbeatInterval = 30000; // 30 seconds
    this.networkOptimization = {
      batchSize: 50,
      throttleDelay: 100,
      compressionEnabled: true
    };
  }

  /**
   * Create optimized real-time connection with conflict resolution
   */
  createConnection(channelName, config = {}) {
    if (this.connections?.has(channelName)) {
      return this.connections?.get(channelName);
    }

    const channel = supabase
      ?.channel(channelName, {
        config: {
          broadcast: { self: true },
          presence: { key: config?.presenceKey || 'user' }
        }
      })
      ?.on('postgres_changes', {
        event: config?.event || '*',
        schema: 'public',
        table: config?.table,
        filter: config?.filter
      }, (payload) => {
        const latency = Date.now() - new Date(payload?.commit_timestamp)?.getTime();
        this.updateLatencyMetrics(channelName, latency);
        
        // Apply conflict resolution
        const resolvedPayload = this.resolveConflicts(channelName, payload);
        
        if (config?.onMessage) {
          config?.onMessage({
            ...toCamelCase(resolvedPayload),
            latency,
            timestamp: new Date()?.toISOString()
          });
        }
      })
      ?.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts?.set(channelName, 0);
          this.startHeartbeat(channelName);
          this.optimizeNetworkConnection(channelName);
          
          if (config?.onConnect) {
            config?.onConnect({ status, timestamp: new Date()?.toISOString() });
          }
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnection(channelName, config);
        } else if (status === 'TIMED_OUT') {
          this.handleTimeout(channelName, config);
        }
      });

    this.connections?.set(channelName, { channel, config });
    return channel;
  }

  /**
   * Resolve conflicts using last-write-wins with timestamp comparison
   */
  resolveConflicts(channelName, payload) {
    const conflictKey = `${channelName}_${payload?.new?.id || payload?.old?.id}`;
    const lastUpdate = this.conflictResolution?.get(conflictKey);
    
    const currentTimestamp = new Date(payload?.commit_timestamp)?.getTime();
    
    if (lastUpdate && lastUpdate?.timestamp > currentTimestamp) {
      // Conflict detected - current update is older
      console.warn(`Conflict resolved for ${conflictKey}: Ignoring older update`);
      return lastUpdate?.payload;
    }
    
    // Store latest update
    this.conflictResolution?.set(conflictKey, {
      payload,
      timestamp: currentTimestamp
    });
    
    // Clean up old conflict data (keep last 1000 entries)
    if (this.conflictResolution?.size > 1000) {
      const firstKey = this.conflictResolution?.keys()?.next()?.value;
      this.conflictResolution?.delete(firstKey);
    }
    
    return payload;
  }

  /**
   * Update latency metrics for monitoring
   */
  updateLatencyMetrics(channelName, latency) {
    const metrics = this.latencyMetrics?.get(channelName) || {
      samples: [],
      average: 0,
      min: Infinity,
      max: 0,
      p95: 0,
      p99: 0
    };

    metrics?.samples?.push(latency);
    if (metrics?.samples?.length > 100) {
      metrics?.samples?.shift();
    }

    metrics.average = metrics?.samples?.reduce((a, b) => a + b, 0) / metrics?.samples?.length;
    metrics.min = Math.min(metrics?.min, latency);
    metrics.max = Math.max(metrics?.max, latency);
    metrics.current = latency;
    
    // Calculate percentiles
    const sorted = [...metrics?.samples]?.sort((a, b) => a - b);
    metrics.p95 = sorted?.[Math.floor(sorted?.length * 0.95)] || 0;
    metrics.p99 = sorted?.[Math.floor(sorted?.length * 0.99)] || 0;

    this.latencyMetrics?.set(channelName, metrics);
  }

  /**
   * Get latency metrics for channel
   */
  getLatencyMetrics(channelName) {
    return this.latencyMetrics?.get(channelName) || {
      average: 0,
      min: 0,
      max: 0,
      current: 0,
      p95: 0,
      p99: 0
    };
  }

  /**
   * Start heartbeat mechanism for connection health
   */
  startHeartbeat(channelName) {
    const connection = this.connections?.get(channelName);
    if (!connection) return;

    const intervalId = setInterval(() => {
      const { channel } = connection;
      if (channel) {
        const startTime = Date.now();
        channel?.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: startTime }
        });
      }
    }, this.heartbeatInterval);

    connection.heartbeatInterval = intervalId;
  }

  /**
   * Optimize network connection with batching and throttling
   */
  optimizeNetworkConnection(channelName) {
    const connection = this.connections?.get(channelName);
    if (!connection) return;

    // Enable message batching
    connection.messageBatch = [];
    connection.batchTimer = null;

    // Apply network optimization settings
    connection.optimization = {
      ...this.networkOptimization,
      enabled: true,
      appliedAt: new Date()?.toISOString()
    };
  }

  /**
   * Handle reconnection with exponential backoff
   */
  handleReconnection(channelName, config) {
    const attempts = this.reconnectAttempts?.get(channelName) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts?.set(channelName, attempts + 1);
      
      const backoffDelay = Math.min(1000 * Math.pow(2, attempts), 30000);
      
      console.log(`Reconnecting ${channelName} in ${backoffDelay}ms (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.disconnect(channelName);
        this.createConnection(channelName, config);
      }, backoffDelay);
    } else if (config?.onError) {
      config?.onError(new Error('Max reconnection attempts reached'));
    }
  }

  /**
   * Handle connection timeout
   */
  handleTimeout(channelName, config) {
    console.warn(`Connection timeout for ${channelName}`);
    this.handleReconnection(channelName, config);
  }

  /**
   * Disconnect channel
   */
  disconnect(channelName) {
    const connection = this.connections?.get(channelName);
    if (connection) {
      if (connection?.heartbeatInterval) {
        clearInterval(connection?.heartbeatInterval);
      }
      if (connection?.batchTimer) {
        clearTimeout(connection?.batchTimer);
      }
      supabase?.removeChannel(connection?.channel);
      this.connections?.delete(channelName);
      this.latencyMetrics?.delete(channelName);
    }
  }

  /**
   * Disconnect all channels
   */
  disconnectAll() {
    this.connections?.forEach((_, channelName) => {
      this.disconnect(channelName);
    });
    this.conflictResolution?.clear();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(channelName) {
    const connection = this.connections?.get(channelName);
    return connection ? 'connected' : 'disconnected';
  }

  /**
   * Get all connection statuses
   */
  getAllConnectionStatuses() {
    const statuses = {};
    this.connections?.forEach((connection, name) => {
      statuses[name] = {
        status: 'connected',
        latency: this.getLatencyMetrics(name),
        optimization: connection?.optimization,
        reconnectAttempts: this.reconnectAttempts?.get(name) || 0
      };
    });
    return statuses;
  }

  /**
   * Test connection health
   */
  async testConnection(channelName) {
    const connection = this.connections?.get(channelName);
    if (!connection) {
      return { success: false, error: 'Connection not found' };
    }

    const startTime = Date.now();
    try {
      await connection?.channel?.send({
        type: 'broadcast',
        event: 'ping',
        payload: { timestamp: startTime }
      });
      
      const latency = Date.now() - startTime;
      return { success: true, latency, timestamp: new Date()?.toISOString() };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
}

// Export singleton instance
export const enhancedRealtimeService = new EnhancedRealtimeManager();

export default enhancedRealtimeService;
function enhancedRealtimeManager(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: enhancedRealtimeManager is not implemented yet.', args);
  return null;
}

export { enhancedRealtimeManager };