import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { enhancedRealtimeService } from '../../services/enhancedRealtimeService';
import OptimizationSuggestionOverlay from '../../components/OptimizationSuggestionOverlay';

const EnhancedRealtimeMonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadConnectionStatuses();

    const interval = setInterval(() => {
      loadConnectionStatuses();
    }, 5000);

    return () => {
      clearInterval(interval);
      enhancedRealtimeService?.disconnectAll();
    };
  }, []);

  const loadConnectionStatuses = () => {
    const statuses = enhancedRealtimeService?.getAllConnectionStatuses();
    setConnectionStatuses(statuses);
    setLastUpdated(new Date());
  };

  const handleTestConnection = async (channelName) => {
    setLoading(true);
    try {
      const result = await enhancedRealtimeService?.testConnection(channelName);
      if (result?.success) {
        alert(`Connection test successful! Latency: ${result?.latency}ms`);
      } else {
        alert(`Connection test failed: ${result?.error}`);
      }
    } catch (error) {
      console.error('Test connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'connections', label: 'Active Connections', icon: 'Wifi' },
    { id: 'latency', label: 'Latency Metrics', icon: 'Activity' },
    { id: 'conflicts', label: 'Conflict Resolution', icon: 'GitMerge' },
    { id: 'optimization', label: 'Network Optimization', icon: 'Zap' }
  ];

  return (
    <>
      <Helmet>
        <title>Enhanced Real-Time Monitoring Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Icon name="Radio" size={28} className="text-blue-600" />
                  Enhanced Real-Time Monitoring
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Supabase Real-Time with Conflict Resolution & Network Optimization
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button onClick={loadConnectionStatuses} disabled={loading}>
                  <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'connections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(connectionStatuses)?.map(([name, status]) => (
                <div key={name} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {status?.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Latency:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {status?.latency?.average?.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">P95 Latency:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {status?.latency?.p95?.toFixed(2)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reconnect Attempts:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {status?.reconnectAttempts}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTestConnection(name)}
                    disabled={loading}
                    className="w-full mt-4"
                    size="sm"
                  >
                    <Icon name="Zap" size={14} />
                    Test Connection
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'latency' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Latency Metrics
              </h2>
              <div className="space-y-4">
                {Object.entries(connectionStatuses)?.map(([name, status]) => (
                  <div key={name} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Current</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {status?.latency?.current?.toFixed(2)}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Average</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {status?.latency?.average?.toFixed(2)}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Min</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {status?.latency?.min?.toFixed(2)}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Max</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {status?.latency?.max?.toFixed(2)}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">P99</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {status?.latency?.p99?.toFixed(2)}ms
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conflicts' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Conflict Resolution
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Automatic Conflict Resolution:</strong> Last-write-wins strategy with timestamp comparison
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                      <li>Detects conflicting updates based on commit timestamps</li>
                      <li>Automatically resolves conflicts by keeping the latest update</li>
                      <li>Maintains conflict history for the last 1000 entries</li>
                      <li>Logs conflicts for debugging and monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={48} className="mx-auto text-green-600 dark:text-green-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Conflict resolution is active and monitoring all real-time connections
                </p>
              </div>
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Network Optimization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Zap" size={20} className="text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Heartbeat Mechanism</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    30-second intervals to maintain connection health and detect failures early
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="RefreshCw" size={20} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Auto Reconnection</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exponential backoff strategy with up to 5 reconnection attempts
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Package" size={20} className="text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Message Batching</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Batch size of 50 messages with 100ms throttle delay for optimal performance
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Active Optimizations</h3>
                <div className="space-y-2">
                  {Object.entries(connectionStatuses)?.map(([name, status]) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                      <div className="flex items-center gap-2">
                        {status?.optimization?.enabled ? (
                          <>
                            <Icon name="CheckCircle" size={16} className="text-green-600 dark:text-green-400" />
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Optimized</span>
                          </>
                        ) : (
                          <>
                            <Icon name="AlertCircle" size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-400">Not optimized</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimization Suggestion Overlay */}
        <OptimizationSuggestionOverlay
          screenName="enhanced-realtime-monitoring-dashboard"
          screenData={{
            totalConnections: Object.keys(connectionStatuses)?.length,
            avgLatency: Object.values(connectionStatuses)?.reduce((acc, s) => acc + (s?.latency?.average || 0), 0) / Object.keys(connectionStatuses)?.length || 0,
            activeOptimizations: Object.values(connectionStatuses)?.filter(s => s?.optimization?.enabled)?.length
          }}
          performanceMetrics={{
            loadTime: 0,
            apiLatency: 0
          }}
        />
      </div>
    </>
  );
};

export default EnhancedRealtimeMonitoringDashboard;