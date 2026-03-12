import { supabase } from '../lib/supabase';
import { enhancedRealtimeManager } from './enhancedRealtimeService';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

class CrossScreenRealtimeManager {
  constructor() {
    this.screenSubscriptions = new Map();
    this.syncHealthMetrics = new Map();
    this.aiRecommendationTracking = new Map();
    this.conflictLog = [];
    this.dataConsistencyScores = new Map();
    this.propagationLatency = new Map();
    this.monitoringInterval = null;
  }

  /**
   * Initialize cross-screen synchronization monitoring
   */
  async initializeCrossScreenSync() {
    try {
      // Start monitoring all critical tables
      const criticalTables = [
        'elections',
        'votes',
        'user_profiles',
        'fraud_alerts',
        'ai_recommendations',
        'campaign_analytics',
        'financial_transactions',
        'compliance_reports'
      ];

      for (const table of criticalTables) {
        await this.subscribeToTable(table);
      }

      // Start health monitoring
      this.startHealthMonitoring();

      return { success: true, subscribedTables: criticalTables };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }

  /**
   * Subscribe to table changes with conflict resolution
   */
  async subscribeToTable(tableName) {
    const channelName = `cross_screen_${tableName}`;

    const channel = enhancedRealtimeManager?.createConnection(channelName, {
      table: tableName,
      event: '*',
      onMessage: (payload) => {
        this.handleCrossScreenUpdate(tableName, payload);
      },
      onConnect: () => {
        this.updateSyncHealth(tableName, 'connected');
      },
      onError: (error) => {
        this.updateSyncHealth(tableName, 'error', error);
      }
    });

    this.screenSubscriptions?.set(tableName, {
      channel,
      status: 'active',
      lastUpdate: new Date()?.toISOString(),
      updateCount: 0,
      conflictCount: 0
    });

    return channel;
  }

  /**
   * Handle cross-screen data updates with conflict detection
   */
  handleCrossScreenUpdate(tableName, payload) {
    const subscription = this.screenSubscriptions?.get(tableName);
    if (!subscription) return;

    // Update subscription metrics
    subscription.updateCount++;
    subscription.lastUpdate = new Date()?.toISOString();

    // Detect and resolve conflicts
    const conflict = this.detectConflict(tableName, payload);
    if (conflict) {
      subscription.conflictCount++;
      this.logConflict(tableName, conflict);
      this.resolveConflict(tableName, conflict);
    }

    // Track AI recommendation propagation
    if (tableName === 'ai_recommendations') {
      this.trackAIRecommendationPropagation(payload);
    }

    // Update data consistency score
    this.updateDataConsistencyScore(tableName);

    // Calculate propagation latency
    this.calculatePropagationLatency(tableName, payload);
  }

  /**
   * Detect conflicts in real-time updates
   */
  detectConflict(tableName, payload) {
    const recordId = payload?.new?.id || payload?.old?.id;
    const conflictKey = `${tableName}_${recordId}`;
    
    const lastKnownState = this.dataConsistencyScores?.get(conflictKey);
    
    if (!lastKnownState) {
      // First update, no conflict
      this.dataConsistencyScores?.set(conflictKey, {
        data: payload?.new || payload?.old,
        timestamp: payload?.commit_timestamp,
        version: 1
      });
      return null;
    }

    // Check for concurrent modifications
    const currentTimestamp = new Date(payload?.commit_timestamp)?.getTime();
    const lastTimestamp = new Date(lastKnownState?.timestamp)?.getTime();
    const timeDiff = currentTimestamp - lastTimestamp;

    // Conflict if updates within 5 seconds
    if (timeDiff < 5000 && timeDiff > 0) {
      return {
        type: 'concurrent_modification',
        tableName,
        recordId,
        currentData: payload?.new,
        previousData: lastKnownState?.data,
        timeDiff,
        severity: 'medium'
      };
    }

    // Update known state
    this.dataConsistencyScores?.set(conflictKey, {
      data: payload?.new || payload?.old,
      timestamp: payload?.commit_timestamp,
      version: lastKnownState?.version + 1
    });

    return null;
  }

  /**
   * Log conflict for analytics
   */
  logConflict(tableName, conflict) {
    this.conflictLog?.push({
      ...conflict,
      detectedAt: new Date()?.toISOString(),
      resolved: false
    });

    // Keep only last 1000 conflicts
    if (this.conflictLog?.length > 1000) {
      this.conflictLog?.shift();
    }
  }

  /**
   * Resolve conflict using last-write-wins strategy
   */
  resolveConflict(tableName, conflict) {
    // Last-write-wins: Use the most recent timestamp
    const resolution = {
      strategy: 'last_write_wins',
      winner: conflict?.currentData,
      resolvedAt: new Date()?.toISOString()
    };

    // Mark conflict as resolved
    const conflictEntry = this.conflictLog?.find(
      c => c?.recordId === conflict?.recordId && !c?.resolved
    );
    if (conflictEntry) {
      conflictEntry.resolved = true;
      conflictEntry.resolution = resolution;
    }

    return resolution;
  }

  /**
   * Track AI recommendation propagation across screens
   */
  trackAIRecommendationPropagation(payload) {
    const recommendation = payload?.new;
    if (!recommendation) return;

    const trackingKey = recommendation?.id;
    const aiProvider = recommendation?.ai_provider || 'unknown';

    this.aiRecommendationTracking?.set(trackingKey, {
      id: recommendation?.id,
      aiProvider,
      createdAt: recommendation?.created_at,
      propagatedAt: new Date()?.toISOString(),
      targetScreens: recommendation?.target_screens || [],
      status: 'propagated',
      latency: Date.now() - new Date(recommendation?.created_at)?.getTime()
    });
  }

  /**
   * Update data consistency score for table
   */
  updateDataConsistencyScore(tableName) {
    const subscription = this.screenSubscriptions?.get(tableName);
    if (!subscription) return;

    const totalUpdates = subscription?.updateCount;
    const conflicts = subscription?.conflictCount;
    
    const consistencyScore = totalUpdates > 0 
      ? ((totalUpdates - conflicts) / totalUpdates) * 100 
      : 100;

    this.syncHealthMetrics?.set(tableName, {
      ...this.syncHealthMetrics?.get(tableName),
      consistencyScore: consistencyScore?.toFixed(2),
      totalUpdates,
      conflicts,
      lastCalculated: new Date()?.toISOString()
    });
  }

  /**
   * Calculate propagation latency
   */
  calculatePropagationLatency(tableName, payload) {
    const commitTime = new Date(payload?.commit_timestamp)?.getTime();
    const receiveTime = Date.now();
    const latency = receiveTime - commitTime;

    const latencyData = this.propagationLatency?.get(tableName) || {
      samples: [],
      average: 0,
      min: Infinity,
      max: 0
    };

    latencyData?.samples?.push(latency);
    if (latencyData?.samples?.length > 100) {
      latencyData?.samples?.shift();
    }

    latencyData.average = latencyData?.samples?.reduce((a, b) => a + b, 0) / latencyData?.samples?.length;
    latencyData.min = Math.min(latencyData?.min, latency);
    latencyData.max = Math.max(latencyData?.max, latency);
    latencyData.current = latency;

    this.propagationLatency?.set(tableName, latencyData);
  }

  /**
   * Update sync health status
   */
  updateSyncHealth(tableName, status, error = null) {
    this.syncHealthMetrics?.set(tableName, {
      ...this.syncHealthMetrics?.get(tableName),
      status,
      error: error?.message || null,
      lastChecked: new Date()?.toISOString()
    });
  }

  /**
   * Start health monitoring interval
   */
  startHealthMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, 3000); // Every 3 seconds
  }

  /**
   * Perform health check on all subscriptions
   */
  performHealthCheck() {
    for (const [tableName, subscription] of this.screenSubscriptions) {
      const lastUpdate = new Date(subscription?.lastUpdate)?.getTime();
      const now = Date.now();
      const timeSinceUpdate = now - lastUpdate;

      // Alert if no updates in 60 seconds
      if (timeSinceUpdate > 60000) {
        this.updateSyncHealth(tableName, 'stale', new Error('No updates received'));
      } else {
        this.updateSyncHealth(tableName, 'healthy');
      }
    }
  }

  /**
   * Get synchronization overview
   */
  getSynchronizationOverview() {
    const overview = {
      totalScreens: 117,
      activeSubscriptions: this.screenSubscriptions?.size,
      healthyConnections: 0,
      staleConnections: 0,
      errorConnections: 0,
      totalConflicts: this.conflictLog?.length,
      resolvedConflicts: this.conflictLog?.filter(c => c?.resolved)?.length,
      averageConsistencyScore: 0,
      aiRecommendations: this.aiRecommendationTracking?.size
    };

    // Calculate health statistics
    for (const [, metrics] of this.syncHealthMetrics) {
      if (metrics?.status === 'healthy') overview.healthyConnections++;
      else if (metrics?.status === 'stale') overview.staleConnections++;
      else if (metrics?.status === 'error') overview.errorConnections++;
    }

    // Calculate average consistency score
    const scores = Array.from(this.syncHealthMetrics?.values())
      ?.map(m => parseFloat(m?.consistencyScore || 100));
    overview.averageConsistencyScore = scores?.length > 0
      ? (scores?.reduce((a, b) => a + b, 0) / scores?.length)?.toFixed(2)
      : 100;

    return overview;
  }

  /**
   * Get screen-by-screen monitoring data
   */
  getScreenMonitoringData() {
    const screenData = [];

    for (const [tableName, subscription] of this.screenSubscriptions) {
      const metrics = this.syncHealthMetrics?.get(tableName) || {};
      const latency = this.propagationLatency?.get(tableName) || {};

      screenData?.push({
        screenName: tableName,
        status: subscription?.status,
        updateCount: subscription?.updateCount,
        conflictCount: subscription?.conflictCount,
        consistencyScore: metrics?.consistencyScore || 100,
        averageLatency: latency?.average || 0,
        lastUpdate: subscription?.lastUpdate
      });
    }

    return screenData;
  }

  /**
   * Get AI recommendation propagation data
   */
  getAIRecommendationData() {
    const recommendations = [];

    for (const [, tracking] of this.aiRecommendationTracking) {
      recommendations?.push({
        id: tracking?.id,
        aiProvider: tracking?.aiProvider,
        propagationLatency: tracking?.latency,
        status: tracking?.status,
        targetScreens: tracking?.targetScreens?.length || 0,
        propagatedAt: tracking?.propagatedAt
      });
    }

    // Group by AI provider
    const byProvider = recommendations?.reduce((acc, rec) => {
      const provider = rec?.aiProvider;
      if (!acc?.[provider]) {
        acc[provider] = {
          count: 0,
          averageLatency: 0,
          recommendations: []
        };
      }
      acc[provider].count++;
      acc?.[provider]?.recommendations?.push(rec);
      return acc;
    }, {});

    // Calculate average latencies
    for (const provider in byProvider) {
      const recs = byProvider?.[provider]?.recommendations;
      const avgLatency = recs?.reduce((sum, r) => sum + r?.propagationLatency, 0) / recs?.length;
      byProvider[provider].averageLatency = avgLatency?.toFixed(2);
    }

    return {
      total: recommendations?.length,
      byProvider,
      recent: recommendations?.slice(-10)
    };
  }

  /**
   * Get conflict analytics
   */
  getConflictAnalytics() {
    const analytics = {
      totalConflicts: this.conflictLog?.length,
      resolvedConflicts: this.conflictLog?.filter(c => c?.resolved)?.length,
      unresolvedConflicts: this.conflictLog?.filter(c => !c?.resolved)?.length,
      conflictsByTable: {},
      conflictsBySeverity: {
        low: 0,
        medium: 0,
        high: 0
      },
      recentConflicts: this.conflictLog?.slice(-20)
    };

    // Group by table
    for (const conflict of this.conflictLog) {
      const table = conflict?.tableName;
      if (!analytics?.conflictsByTable?.[table]) {
        analytics.conflictsByTable[table] = 0;
      }
      analytics.conflictsByTable[table]++;

      // Count by severity
      const severity = conflict?.severity || 'medium';
      analytics.conflictsBySeverity[severity]++;
    }

    return analytics;
  }

  /**
   * Trigger manual synchronization
   */
  async triggerManualSync(tableName) {
    try {
      // Fetch latest data from table
      const { data, error } = await supabase
        ?.from(tableName)
        ?.select('*')
        ?.order('updated_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;

      // Update local consistency tracking
      for (const record of data || []) {
        const conflictKey = `${tableName}_${record?.id}`;
        this.dataConsistencyScores?.set(conflictKey, {
          data: record,
          timestamp: record?.updated_at || new Date()?.toISOString(),
          version: 1
        });
      }

      return { success: true, recordsSynced: data?.length };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }

  /**
   * Cleanup and disconnect all subscriptions
   */
  cleanup() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    for (const [tableName] of this.screenSubscriptions) {
      enhancedRealtimeManager?.disconnect(`cross_screen_${tableName}`);
    }

    this.screenSubscriptions?.clear();
    this.syncHealthMetrics?.clear();
    this.aiRecommendationTracking?.clear();
    this.conflictLog = [];
    this.dataConsistencyScores?.clear();
    this.propagationLatency?.clear();
  }
}

export const crossScreenRealtimeManager = new CrossScreenRealtimeManager();

export const crossScreenRealtimeService = {
  initializeSync: () => crossScreenRealtimeManager?.initializeCrossScreenSync(),
  getSyncOverview: () => crossScreenRealtimeManager?.getSynchronizationOverview(),
  getScreenData: () => crossScreenRealtimeManager?.getScreenMonitoringData(),
  getAIRecommendations: () => crossScreenRealtimeManager?.getAIRecommendationData(),
  getConflictAnalytics: () => crossScreenRealtimeManager?.getConflictAnalytics(),
  triggerManualSync: (tableName) => crossScreenRealtimeManager?.triggerManualSync(tableName),
  cleanup: () => crossScreenRealtimeManager?.cleanup()
};