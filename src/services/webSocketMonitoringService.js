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

/**
 * OPTIMIZED: WebSocket performance improvements
 * Connection pooling, message batching, and automatic reconnection
 */

const wsConnections = new Map();
const messageQueue = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 100; // ms
let batchTimer = null;

/**
 * Process batched messages
 */
const processBatchedMessages = () => {
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  
  if (messageQueue?.length === 0) return;
  
  const batch = messageQueue?.splice(0, BATCH_SIZE);
  
  // Group by connection
  const grouped = batch?.reduce((acc, msg) => {
    if (!acc?.[msg?.connectionKey]) acc[msg.connectionKey] = [];
    acc?.[msg?.connectionKey]?.push(msg?.payload);
    return acc;
  }, {});
  
  // Deliver batched messages
  for (const [connectionKey, payloads] of Object.entries(grouped)) {
    const connection = wsConnections?.get(connectionKey);
    if (connection) {
      connection?.callbacks?.forEach(callback => {
        payloads?.forEach(payload => callback(payload));
      });
      connection.lastActivity = Date.now();
    }
  }
};

/**
 * Optimized WebSocket connection with pooling
 */
export const createOptimizedWebSocketConnection = (channel, callback) => {
  const connectionKey = `${channel}`;
  
  // Reuse existing connection if available
  if (wsConnections?.has(connectionKey)) {
    const existing = wsConnections?.get(connectionKey);
    existing?.callbacks?.push(callback);
    return existing?.subscription;
  }
  
  // Create new connection with optimizations
  const subscription = supabase?.channel(channel)?.on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
      // Batch messages for efficiency
      queueMessage(connectionKey, payload);
    })?.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`WebSocket connected: ${channel}`);
      } else if (status === 'CLOSED') {
        console.log(`WebSocket closed: ${channel}`);
        handleReconnection(connectionKey);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`WebSocket error: ${channel}`);
        handleReconnection(connectionKey);
      }
    });
  
  wsConnections?.set(connectionKey, {
    subscription,
    callbacks: [callback],
    lastActivity: Date.now(),
    reconnectAttempts: 0
  });
  
  return subscription;
};

/**
 * Queue messages for batching
 */
const queueMessage = (connectionKey, payload) => {
  messageQueue?.push({ connectionKey, payload });
  
  if (messageQueue?.length >= BATCH_SIZE) {
    processBatchedMessages();
  } else if (!batchTimer) {
    batchTimer = setTimeout(processBatchedMessages, BATCH_INTERVAL);
  }
};

/**
 * Handle reconnection with exponential backoff
 */
const handleReconnection = async (connectionKey) => {
  const connection = wsConnections?.get(connectionKey);
  if (!connection) return;
  
  connection.reconnectAttempts++;
  
  const delay = Math.min(1000 * Math.pow(2, connection?.reconnectAttempts), 30000);
  
  console.log(`Reconnecting ${connectionKey} in ${delay}ms (attempt ${connection?.reconnectAttempts})`);
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  try {
    // Unsubscribe old connection
    await connection?.subscription?.unsubscribe();
    
    // Create new connection
    const channel = connectionKey;
    const newSubscription = supabase?.channel(channel)?.on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        queueMessage(connectionKey, payload);
      })?.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Reconnected: ${channel}`);
          connection.reconnectAttempts = 0;
        }
      });
    
    connection.subscription = newSubscription;
    wsConnections?.set(connectionKey, connection);
  } catch (error) {
    console.error('Reconnection failed:', error);
    
    // Retry if under max attempts
    if (connection?.reconnectAttempts < 5) {
      handleReconnection(connectionKey);
    } else {
      console.error('Max reconnection attempts reached');
      wsConnections?.delete(connectionKey);
    }
  }
};

/**
 * Close WebSocket connection
 */
export const closeOptimizedWebSocketConnection = async (channel) => {
  const connectionKey = `${channel}`;
  const connection = wsConnections?.get(connectionKey);
  
  if (connection) {
    await connection?.subscription?.unsubscribe();
    wsConnections?.delete(connectionKey);
  }
};

/**
 * Clean up inactive connections
 */
export const cleanupInactiveConnections = async () => {
  const now = Date.now();
  const INACTIVITY_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  
  for (const [key, connection] of wsConnections?.entries()) {
    if (now - connection?.lastActivity > INACTIVITY_THRESHOLD) {
      console.log(`Cleaning up inactive connection: ${key}`);
      await connection?.subscription?.unsubscribe();
      wsConnections?.delete(key);
    }
  }
};

/**
 * Get WebSocket connection statistics
 */
export const getWebSocketStats = () => {
  return {
    activeConnections: wsConnections?.size,
    queuedMessages: messageQueue?.length,
    connections: Array.from(wsConnections?.entries())?.map(([key, conn]) => ({
      channel: key,
      callbacks: conn?.callbacks?.length,
      lastActivity: new Date(conn.lastActivity)?.toISOString(),
      reconnectAttempts: conn?.reconnectAttempts
    }))
  };
};

/**
 * Monitor WebSocket health
 */
export const monitorWebSocketHealth = () => {
  // Clean up inactive connections every minute
  setInterval(cleanupInactiveConnections, 60 * 1000);
  
  // Log statistics every 5 minutes
  setInterval(() => {
    const stats = getWebSocketStats();
    console.log('WebSocket Health:', stats);
    
    // Send to monitoring service
    supabase?.from('websocket_metrics')?.insert({
      active_connections: stats?.activeConnections,
      queued_messages: stats?.queuedMessages,
      timestamp: new Date()?.toISOString()
    });
  }, 5 * 60 * 1000);
};

/**
 * Optimized real-time subscription for elections
 */
export const subscribeToElectionUpdatesOptimized = (electionId, callback) => {
  return createOptimizedWebSocketConnection(
    `election:${electionId}`,
    callback
  );
};

/**
 * Optimized real-time subscription for VP updates
 */
export const subscribeToVPUpdatesOptimized = (userId, callback) => {
  return createOptimizedWebSocketConnection(
    `vp:${userId}`,
    callback
  );
};

/**
 * Optimized real-time subscription for messages
 */
export const subscribeToMessageUpdatesOptimized = (userId, callback) => {
  return createOptimizedWebSocketConnection(
    `messages:${userId}`,
    callback
  );
};

// Initialize monitoring
if (typeof window !== 'undefined') {
  monitorWebSocketHealth();
}

class WebSocketMonitoringManager {
  constructor() {
    this.connections = new Map();
    this.latencyMetrics = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.heartbeatInterval = 30000; // 30 seconds
  }

  createConnection(channelName, config = {}) {
    if (this.connections?.has(channelName)) {
      return this.connections?.get(channelName);
    }

    const channel = supabase
      ?.channel(channelName)
      ?.on('postgres_changes', {
        event: config?.event || '*',
        schema: 'public',
        table: config?.table || 'system_alerts',
        filter: config?.filter
      }, (payload) => {
        const latency = Date.now() - new Date(payload?.commit_timestamp)?.getTime();
        this.updateLatencyMetrics(channelName, latency);
        
        if (config?.onMessage) {
          config?.onMessage({
            ...toCamelCase(payload),
            latency
          });
        }
      })
      ?.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts?.set(channelName, 0);
          this.startHeartbeat(channelName);
          
          if (config?.onConnect) {
            config?.onConnect();
          }
        } else if (status === 'CHANNEL_ERROR') {
          this.handleReconnection(channelName, config);
        }
      });

    this.connections?.set(channelName, channel);
    return channel;
  }

  updateLatencyMetrics(channelName, latency) {
    const metrics = this.latencyMetrics?.get(channelName) || {
      samples: [],
      average: 0,
      min: Infinity,
      max: 0
    };

    metrics?.samples?.push(latency);
    if (metrics?.samples?.length > 100) {
      metrics?.samples?.shift();
    }

    metrics.average = metrics?.samples?.reduce((a, b) => a + b, 0) / metrics?.samples?.length;
    metrics.min = Math.min(metrics?.min, latency);
    metrics.max = Math.max(metrics?.max, latency);
    metrics.current = latency;

    this.latencyMetrics?.set(channelName, metrics);
  }

  getLatencyMetrics(channelName) {
    return this.latencyMetrics?.get(channelName) || {
      average: 0,
      min: 0,
      max: 0,
      current: 0
    };
  }

  startHeartbeat(channelName) {
    const intervalId = setInterval(() => {
      const channel = this.connections?.get(channelName);
      if (channel) {
        const startTime = Date.now();
        channel?.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: startTime }
        });
      }
    }, this.heartbeatInterval);

    this.connections.get(channelName).heartbeatInterval = intervalId;
  }

  handleReconnection(channelName, config) {
    const attempts = this.reconnectAttempts?.get(channelName) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      this.reconnectAttempts?.set(channelName, attempts + 1);
      
      setTimeout(() => {
        this.disconnect(channelName);
        this.createConnection(channelName, config);
      }, Math.min(1000 * Math.pow(2, attempts), 30000));
    } else if (config?.onError) {
      config?.onError(new Error('Max reconnection attempts reached'));
    }
  }

  disconnect(channelName) {
    const channel = this.connections?.get(channelName);
    if (channel) {
      if (channel?.heartbeatInterval) {
        clearInterval(channel?.heartbeatInterval);
      }
      supabase?.removeChannel(channel);
      this.connections?.delete(channelName);
      this.latencyMetrics?.delete(channelName);
    }
  }

  disconnectAll() {
    this.connections?.forEach((_, channelName) => {
      this.disconnect(channelName);
    });
  }

  getConnectionStatus(channelName) {
    const channel = this.connections?.get(channelName);
    return channel ? 'connected' : 'disconnected';
  }

  getAllConnectionStatuses() {
    const statuses = {};
    this.connections?.forEach((channel, name) => {
      statuses[name] = {
        status: 'connected',
        latency: this.getLatencyMetrics(name),
        reconnectAttempts: this.reconnectAttempts?.get(name) || 0
      };
    });
    return statuses;
  }
}

const wsManager = new WebSocketMonitoringManager();

export const webSocketMonitoringService = {
  async getMonitoringOverview() {
    try {
      const [alertsData, incidentsData, performanceData] = await Promise.all([
        supabase
          ?.from('system_alerts')
          ?.select('*')
          ?.eq('status', 'active')
          ?.order('created_at', { ascending: false })
          ?.limit(10),
        supabase
          ?.from('incident_response_workflows')
          ?.select('*')
          ?.in('status', ['detected', 'in_progress'])
          ?.order('detected_at', { ascending: false })
          ?.limit(10),
        supabase
          ?.from('integration_health_monitoring')
          ?.select('*')
          ?.order('last_health_check', { ascending: false })
      ]);

      const connectionStatuses = wsManager?.getAllConnectionStatuses();

      return {
        data: {
          activeAlerts: toCamelCase(alertsData?.data || []),
          activeIncidents: toCamelCase(incidentsData?.data || []),
          systemHealth: toCamelCase(performanceData?.data || []),
          websocketConnections: connectionStatuses,
          totalConnections: Object.keys(connectionStatuses)?.length
        },
        error: null
      };
    } catch (error) {
      console.error('Failed to get monitoring overview:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToFraudAlerts(onMessage, onConnect, onError) {
    return wsManager?.createConnection('fraud-alerts', {
      table: 'system_alerts',
      event: '*',
      filter: 'category=eq.fraud_detection',
      onMessage,
      onConnect,
      onError
    });
  },

  subscribeToIncidents(onMessage, onConnect, onError) {
    return wsManager?.createConnection('incidents', {
      table: 'incident_response_workflows',
      event: '*',
      onMessage,
      onConnect,
      onError
    });
  },

  subscribeToPerformanceMetrics(onMessage, onConnect, onError) {
    return wsManager?.createConnection('performance', {
      table: 'integration_health_monitoring',
      event: 'UPDATE',
      onMessage,
      onConnect,
      onError
    });
  },

  getLatencyMetrics(channelName) {
    return wsManager?.getLatencyMetrics(channelName);
  },

  getConnectionStatus(channelName) {
    return wsManager?.getConnectionStatus(channelName);
  },

  disconnect(channelName) {
    wsManager?.disconnect(channelName);
  },

  disconnectAll() {
    wsManager?.disconnectAll();
  },

  async testConnection(channelName) {
    try {
      const startTime = Date.now();
      const testChannel = supabase?.channel(`test-${channelName}`);
      
      return new Promise((resolve) => {
        testChannel
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              const latency = Date.now() - startTime;
              supabase.removeChannel(testChannel);
              resolve({ success: true, latency });
            } else if (status === 'CHANNEL_ERROR') {
              resolve({ success: false, error: 'Connection failed' });
            }
          });

        setTimeout(() => {
          supabase.removeChannel(testChannel);
          resolve({ success: false, error: 'Connection timeout' });
        }, 5000);
      });
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

export default webSocketMonitoringService;