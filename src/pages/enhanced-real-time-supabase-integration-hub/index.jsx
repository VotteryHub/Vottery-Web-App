import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RealtimeSubscriptionsPanel from './components/RealtimeSubscriptionsPanel';
import PerplexityAutomationPanel from './components/PerplexityAutomationPanel';
import CrossCenterSyncPanel from './components/CrossCenterSyncPanel';
import WorkflowOrchestrationPanel from './components/WorkflowOrchestrationPanel';
import IntegrationHealthPanel from './components/IntegrationHealthPanel';
import PerformanceAnalyticsPanel from './components/PerformanceAnalyticsPanel';
import { orchestrationService } from '../../services/orchestrationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const EnhancedRealTimeSupabaseIntegrationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [integrationData, setIntegrationData] = useState({
    subscriptions: [],
    workflows: [],
    healthStatus: [],
    executionLogs: []
  });

  useEffect(() => {
    loadIntegrationData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    const workflowChannel = orchestrationService?.subscribeToWorkflowExecutions((payload) => {
      if (payload?.eventType === 'INSERT') {
        setIntegrationData(prev => ({
          ...prev,
          executionLogs: [payload?.data, ...prev?.executionLogs]
        }));
      } else if (payload?.eventType === 'UPDATE') {
        setIntegrationData(prev => ({
          ...prev,
          executionLogs: prev?.executionLogs?.map(log =>
            log?.id === payload?.data?.id ? payload?.data : log
          )
        }));
      }
    });

    return () => {
      clearInterval(interval);
      orchestrationService?.unsubscribeFromWorkflowExecutions(workflowChannel);
    };
  }, []);

  useEffect(() => {
    analytics?.trackEvent('realtime_integration_hub_viewed', {
      active_tab: activeTab,
      active_subscriptions: integrationData?.subscriptions?.filter(s => s?.isEnabled)?.length || 0
    });
  }, [activeTab]);

  const loadIntegrationData = async () => {
    try {
      setLoading(true);
      const [subscriptionsResult, workflowsResult, healthResult, logsResult] = await Promise.all([
        orchestrationService?.getRealtimeSubscriptionConfigs(),
        orchestrationService?.getOrchestrationWorkflows(),
        orchestrationService?.getIntegrationHealthStatus(),
        orchestrationService?.getWorkflowExecutionLogs({ limit: 20 })
      ]);

      setIntegrationData({
        subscriptions: subscriptionsResult?.data || [],
        workflows: workflowsResult?.data || [],
        healthStatus: healthResult?.data || [],
        executionLogs: logsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadIntegrationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'subscriptions', label: 'Real-Time Subscriptions', icon: 'Radio', badge: integrationData?.subscriptions?.filter(s => s?.isEnabled)?.length || 0 },
    { id: 'automation', label: 'Perplexity Automation', icon: 'Zap' },
    { id: 'sync', label: 'Cross-Center Sync', icon: 'RefreshCw' },
    { id: 'orchestration', label: 'Workflow Orchestration', icon: 'GitBranch' },
    { id: 'health', label: 'Integration Health', icon: 'Activity' },
    { id: 'analytics', label: 'Performance Analytics', icon: 'TrendingUp' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Radio" className="w-8 h-8 text-blue-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {integrationData?.subscriptions?.filter(s => s?.isEnabled)?.length || 0}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Zap" className="w-8 h-8 text-purple-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Running</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {integrationData?.workflows?.filter(w => w?.status === 'active')?.length || 0}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Activity" className="w-8 h-8 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Healthy</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {integrationData?.healthStatus?.filter(h => h?.healthStatus === 'healthy')?.length || 0}/{integrationData?.healthStatus?.length || 0}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Integration Health</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Icon name="Clock" className="w-8 h-8 text-orange-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">15s</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {integrationData?.executionLogs?.filter(l => l?.executionStatus === 'completed')?.length || 0}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Executions (24h)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <Icon name="Info" className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Enhanced Real-Time Supabase Integration Hub
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Centralized control center for live data synchronization across Team Collaboration, Financial Tracking, and Fraud Detection centers with automated Perplexity workflow execution and real-time subscription management.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle2" className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">15-second refresh intervals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle2" className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Automated fraud response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="CheckCircle2" className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Cross-center data sync</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Icon name="Radio" className="w-5 h-5 text-blue-500" />
                  Active Subscriptions
                </h3>
                <div className="space-y-3">
                  {integrationData?.subscriptions?.filter(s => s?.isEnabled)?.slice(0, 5)?.map((subscription) => (
                    <div key={subscription?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{subscription?.subscriptionName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{subscription?.tableName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{subscription?.refreshIntervalSeconds}s</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Icon name="Activity" className="w-5 h-5 text-green-500" />
                  Integration Health
                </h3>
                <div className="space-y-3">
                  {integrationData?.healthStatus?.map((integration) => (
                    <div key={integration?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          integration?.healthStatus === 'healthy' ? 'bg-green-500' :
                          integration?.healthStatus === 'degraded'? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{integration?.integrationName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{integration?.integrationType}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${
                        integration?.healthStatus === 'healthy' ? 'text-green-600 dark:text-green-400' :
                        integration?.healthStatus === 'degraded'? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {integration?.successRate24h?.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'subscriptions':
        return <RealtimeSubscriptionsPanel subscriptions={integrationData?.subscriptions} onRefresh={refreshData} />;
      case 'automation':
        return <PerplexityAutomationPanel workflows={integrationData?.workflows?.filter(w => w?.triggerSource === 'perplexity_fraud')} executionLogs={integrationData?.executionLogs} />;
      case 'sync':
        return <CrossCenterSyncPanel subscriptions={integrationData?.subscriptions} healthStatus={integrationData?.healthStatus} />;
      case 'orchestration':
        return <WorkflowOrchestrationPanel workflows={integrationData?.workflows} executionLogs={integrationData?.executionLogs} onRefresh={refreshData} />;
      case 'health':
        return <IntegrationHealthPanel healthStatus={integrationData?.healthStatus} onRefresh={refreshData} />;
      case 'analytics':
        return <PerformanceAnalyticsPanel executionLogs={integrationData?.executionLogs} subscriptions={integrationData?.subscriptions} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading integration data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Enhanced Real-Time Supabase Integration Hub - Vottery</title>
        <meta name="description" content="Centralized control center for live data synchronization with automated Perplexity workflow execution and real-time subscription management" />
      </Helmet>

      <HeaderNavigation />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Enhanced Real-Time Supabase Integration Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Live data synchronization and automated workflow orchestration
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastUpdated?.toLocaleTimeString()}
                </p>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-blue-600 text-white' :'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
                {tab?.badge !== undefined && tab?.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab?.id
                      ? 'bg-white/20 text-white' :'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  }`}>
                    {tab?.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default EnhancedRealTimeSupabaseIntegrationHub;
