import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCoordinationPanel from './components/AlertCoordinationPanel';
import ChannelManagementPanel from './components/ChannelManagementPanel';
import RealTimeProcessingPanel from './components/RealTimeProcessingPanel';
import AlertTemplateManager from './components/AlertTemplateManager';
import DeliveryAnalytics from './components/DeliveryAnalytics';
import PriorityTriagePanel from './components/PriorityTriagePanel';
import IncidentCorrelationPanel from './components/IncidentCorrelationPanel';
import QuickActionsPanel from './components/QuickActionsPanel';
import ComplianceEscalationPanel from './components/ComplianceEscalationPanel';
import { alertService } from '../../services/alertService';
import { scheduledReportsService } from '../../services/scheduledReportsService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const UnifiedAlertManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertData, setAlertData] = useState({
    overview: {
      activeChannels: 4,
      queuedNotifications: 0,
      systemHealth: 98.5,
      processingRate: 0
    },
    alerts: [],
    channels: {
      sms: { status: 'operational', deliveryRate: 99.2, queueSize: 0 },
      email: { status: 'operational', deliveryRate: 98.7, queueSize: 0 },
      inApp: { status: 'operational', deliveryRate: 100, queueSize: 0 },
      push: { status: 'operational', deliveryRate: 97.5, queueSize: 0 }
    },
    statistics: null,
    templates: []
  });

  useEffect(() => {
    loadAlertData();

    // Real-time subscription for new alerts
    const channel = alertService?.subscribeToAlerts((payload) => {
      if (payload?.eventType === 'INSERT') {
        setAlertData(prev => ({
          ...prev,
          alerts: [payload?.data, ...prev?.alerts],
          overview: {
            ...prev?.overview,
            queuedNotifications: prev?.overview?.queuedNotifications + 1
          }
        }));
      } else if (payload?.eventType === 'UPDATE') {
        setAlertData(prev => ({
          ...prev,
          alerts: prev?.alerts?.map(alert => 
            alert?.id === payload?.data?.id ? payload?.data : alert
          )
        }));
      }
    });

    return () => {
      alertService?.unsubscribeFromAlerts(channel);
    };
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadAlertData,
    enabled: autoRefresh,
  });

  useEffect(() => {
    analytics?.trackEvent('unified_alert_center_viewed', {
      active_channels: alertData?.overview?.activeChannels,
      queued_notifications: alertData?.overview?.queuedNotifications,
      system_health: alertData?.overview?.systemHealth
    });
  }, [alertData?.overview]);

  const loadAlertData = async () => {
    try {
      setLoading(true);
      const [statsResult, alertsResult, templatesResult] = await Promise.all([
        alertService?.getAlertStatistics(),
        alertService?.getSystemAlerts({ limit: 100 }),
        scheduledReportsService?.getEmailTemplates()
      ]);

      const activeAlerts = alertsResult?.data?.filter(a => a?.status === 'active') || [];
      
      setAlertData(prev => ({
        ...prev,
        statistics: statsResult?.data,
        alerts: alertsResult?.data || [],
        templates: templatesResult?.data || [],
        overview: {
          ...prev?.overview,
          queuedNotifications: activeAlerts?.length,
          processingRate: calculateProcessingRate(alertsResult?.data || [])
        }
      }));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load alert data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadAlertData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const calculateProcessingRate = (alerts) => {
    const recentAlerts = alerts?.filter(a => {
      const createdAt = new Date(a?.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return createdAt > fiveMinutesAgo;
    });
    return recentAlerts?.length || 0;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'priority-triage', label: 'Priority Triage', icon: 'Target' },
    { id: 'correlation', label: 'Incident Correlation', icon: 'GitBranch' },
    { id: 'quick-actions', label: 'Quick Actions', icon: 'Zap' },
    { id: 'compliance', label: 'Compliance Escalation', icon: 'FileCheck' },
    { id: 'coordination', label: 'Alert Coordination', icon: 'GitBranch' },
    { id: 'channels', label: 'Channel Management', icon: 'Radio' },
    { id: 'processing', label: 'Real-Time Processing', icon: 'Activity' },
    { id: 'templates', label: 'Templates', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Unified Alert Management Center | Vottery</title>
        </Helmet>
        <HeaderNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading alert management center...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Unified Alert Management Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Unified Alert Management Center
              </h1>
              <p className="text-muted-foreground">
                Centralized real-time coordination of SMS, email, and in-app notifications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {refreshing ? 'Refreshing...' : `Updated ${lastUpdated?.toLocaleTimeString()}`}
                </span>
              </div>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                iconName={autoRefresh ? 'Pause' : 'Play'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={refreshData}
                disabled={refreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Icon name="Radio" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Channels</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {alertData?.overview?.activeChannels}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Icon name="Bell" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Queued Notifications</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {alertData?.overview?.queuedNotifications}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Icon name="Activity" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {alertData?.overview?.systemHealth}%
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Icon name="Zap" size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing Rate</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {alertData?.overview?.processingRate}/5min
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Channel Status</h3>
                <div className="space-y-3">
                  {Object.entries(alertData?.channels)?.map(([key, channel]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          channel?.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-medium text-foreground capitalize">{key}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground font-data">{channel?.deliveryRate}%</p>
                        <p className="text-xs text-muted-foreground">Delivery Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Alerts</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {alertData?.alerts?.slice(0, 5)?.map((alert) => (
                    <div key={alert?.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{alert?.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert?.createdAt)?.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          alert?.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          alert?.severity === 'high'? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {alert?.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'priority-triage' && (
            <PriorityTriagePanel onRefresh={refreshData} />
          )}
        
          {activeTab === 'correlation' && (
            <IncidentCorrelationPanel onRefresh={refreshData} />
          )}
        
          {activeTab === 'quick-actions' && (
            <QuickActionsPanel alerts={alertData?.alerts} onRefresh={refreshData} />
          )}
        
          {activeTab === 'compliance' && (
            <ComplianceEscalationPanel onRefresh={refreshData} />
          )}

          {activeTab === 'coordination' && (
            <AlertCoordinationPanel 
              alerts={alertData?.alerts} 
              statistics={alertData?.statistics}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'channels' && (
            <ChannelManagementPanel 
              channels={alertData?.channels}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'processing' && (
            <RealTimeProcessingPanel 
              alerts={alertData?.alerts}
              processingRate={alertData?.overview?.processingRate}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'templates' && (
            <AlertTemplateManager 
              templates={alertData?.templates}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'analytics' && (
            <DeliveryAnalytics 
              channels={alertData?.channels}
              alerts={alertData?.alerts}
              statistics={alertData?.statistics}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedAlertManagementCenter;