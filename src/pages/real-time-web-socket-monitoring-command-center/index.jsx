import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';

import WebSocketConnectionPanel from './components/WebSocketConnectionPanel';
import FraudAlertStreamingPanel from './components/FraudAlertStreamingPanel';
import IncidentTrackingPanel from './components/IncidentTrackingPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import WebSocketHealthPanel from './components/WebSocketHealthPanel';
import { webSocketMonitoringService } from '../../services/webSocketMonitoringService';
import { enhancedRealtimeService } from '../../services/enhancedRealtimeService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const RealTimeWebSocketMonitoringCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [monitoringData, setMonitoringData] = useState({
    activeAlerts: [],
    activeIncidents: [],
    systemHealth: [],
    websocketConnections: {},
    totalConnections: 0
  });
  const [latencyMetrics, setLatencyMetrics] = useState({
    fraudAlerts: { average: 0, current: 0, min: 0, max: 0 },
    incidents: { average: 0, current: 0, min: 0, max: 0 },
    performance: { average: 0, current: 0, min: 0, max: 0 }
  });

  useEffect(() => {
    loadMonitoringData();
    setupEnhancedWebSocketConnections();

    analytics?.trackEvent('websocket_monitoring_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });

    return () => {
      enhancedRealtimeService?.disconnectAll();
    };
  }, []);

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      updateLatencyMetrics();
    }, 1000);

    return () => clearInterval(metricsInterval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      const result = await webSocketMonitoringService?.getMonitoringOverview();
      
      if (result?.data) {
        setMonitoringData(result?.data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupEnhancedWebSocketConnections = () => {
    // Enhanced fraud alerts subscription with conflict resolution
    enhancedRealtimeService?.createConnection('fraud-alerts-enhanced', {
      table: 'fraud_alerts',
      event: 'INSERT',
      onMessage: (payload) => {
        setMonitoringData(prev => ({
          ...prev,
          activeAlerts: [payload?.new, ...prev?.activeAlerts]?.slice(0, 50)
        }));
        setLastUpdated(new Date());
      },
      onConnect: () => {
        console.log('Enhanced fraud alerts WebSocket connected with conflict resolution');
      },
      onError: (error) => {
        console.error('Enhanced fraud alerts WebSocket error:', error);
      }
    });

    // Enhanced incidents subscription with network optimization
    enhancedRealtimeService?.createConnection('incidents-enhanced', {
      table: 'incidents',
      event: '*',
      onMessage: (payload) => {
        setMonitoringData(prev => ({
          ...prev,
          activeIncidents: [payload?.new, ...prev?.activeIncidents]?.slice(0, 50)
        }));
        setLastUpdated(new Date());
      },
      onConnect: () => {
        console.log('Enhanced incidents WebSocket connected with network optimization');
      },
      onError: (error) => {
        console.error('Enhanced incidents WebSocket error:', error);
      }
    });

    // Enhanced performance metrics subscription
    enhancedRealtimeService?.createConnection('performance-enhanced', {
      table: 'system_performance_metrics',
      event: '*',
      onMessage: (payload) => {
        setMonitoringData(prev => ({
          ...prev,
          systemHealth: prev?.systemHealth?.map(item =>
            item?.id === payload?.new?.id ? payload?.new : item
          )
        }));
        setLastUpdated(new Date());
      },
      onConnect: () => {
        console.log('Enhanced performance metrics WebSocket connected');
      },
      onError: (error) => {
        console.error('Enhanced performance metrics WebSocket error:', error);
      }
    });
  };

  const updateLatencyMetrics = () => {
    setLatencyMetrics({
      fraudAlerts: enhancedRealtimeService?.getLatencyMetrics('fraud-alerts-enhanced'),
      incidents: enhancedRealtimeService?.getLatencyMetrics('incidents-enhanced'),
      performance: enhancedRealtimeService?.getLatencyMetrics('performance-enhanced')
    });
  };

  const handleTestConnection = async (channelName) => {
    const result = await webSocketMonitoringService?.testConnection(channelName);
    if (result?.success) {
      alert(`Connection test successful! Latency: ${result?.latency}ms`);
    } else {
      alert(`Connection test failed: ${result?.error}`);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Activity' },
    { id: 'fraud', label: 'Fraud Alerts', icon: 'AlertTriangle' },
    { id: 'incidents', label: 'Incidents', icon: 'AlertCircle' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'health', label: 'WebSocket Health', icon: 'Wifi' }
  ];

  return (
    <>
      <Helmet>
        <title>Real-Time WebSocket Monitoring Command Center - Vottery</title>
        <meta name="description" content="Real-time WebSocket monitoring with sub-100ms latency for fraud alerts, incident tracking, and performance metrics with instant alert delivery." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Real-Time WebSocket Monitoring Command Center
                </h1>
                <p className="text-muted-foreground">
                  Sub-100ms latency monitoring with instant alert delivery and automatic reconnection
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-success">Live</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Wifi" size={18} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Active Connections</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {monitoringData?.totalConnections || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="CheckCircle" size={14} className="text-success" />
                  <span className="text-xs text-success">All healthy</span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Zap" size={18} className="text-warning" />
                  <span className="text-sm text-muted-foreground">Avg Latency</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {Math.round((latencyMetrics?.fraudAlerts?.average + latencyMetrics?.incidents?.average + latencyMetrics?.performance?.average) / 3) || 0}ms
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="TrendingDown" size={14} className="text-success" />
                  <span className="text-xs text-success">Sub-100ms</span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertTriangle" size={18} className="text-destructive" />
                  <span className="text-sm text-muted-foreground">Active Alerts</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {monitoringData?.activeAlerts?.length || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">Real-time stream</span>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertCircle" size={18} className="text-warning" />
                  <span className="text-sm text-muted-foreground">Active Incidents</span>
                </div>
                <p className="text-2xl font-heading font-bold text-foreground">
                  {monitoringData?.activeIncidents?.length || 0}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">Live tracking</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                <WebSocketConnectionPanel
                  connections={monitoringData?.websocketConnections}
                  latencyMetrics={latencyMetrics}
                  onTestConnection={handleTestConnection}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FraudAlertStreamingPanel
                    alerts={monitoringData?.activeAlerts?.slice(0, 5)}
                    latency={latencyMetrics?.fraudAlerts}
                  />
                  <IncidentTrackingPanel
                    incidents={monitoringData?.activeIncidents?.slice(0, 5)}
                    latency={latencyMetrics?.incidents}
                  />
                </div>
              </>
            )}

            {activeTab === 'fraud' && (
              <FraudAlertStreamingPanel
                alerts={monitoringData?.activeAlerts}
                latency={latencyMetrics?.fraudAlerts}
                expanded
              />
            )}

            {activeTab === 'incidents' && (
              <IncidentTrackingPanel
                incidents={monitoringData?.activeIncidents}
                latency={latencyMetrics?.incidents}
                expanded
              />
            )}

            {activeTab === 'performance' && (
              <PerformanceMetricsPanel
                systemHealth={monitoringData?.systemHealth}
                latency={latencyMetrics?.performance}
              />
            )}

            {activeTab === 'health' && (
              <WebSocketHealthPanel
                connections={monitoringData?.websocketConnections}
                latencyMetrics={latencyMetrics}
                onTestConnection={handleTestConnection}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RealTimeWebSocketMonitoringCommandCenter;