import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AutomationWorkflowsPanel from './components/AutomationWorkflowsPanel';
import TriggerMonitoringPanel from './components/TriggerMonitoringPanel';
import ExecutionAnalyticsPanel from './components/ExecutionAnalyticsPanel';
import ComplianceAutomationPanel from './components/ComplianceAutomationPanel';
import IncidentEscalationPanel from './components/IncidentEscalationPanel';
import OptimizationActionsPanel from './components/OptimizationActionsPanel';
import { orchestrationService } from '../../services/orchestrationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const IntelligentOrchestrationControlCenter = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [orchestrationData, setOrchestrationData] = useState({
    workflows: [],
    statistics: null,
    executions: [],
    complianceTriggers: [],
    optimizationActions: []
  });

  useEffect(() => {
    loadOrchestrationData();

    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    const channel = orchestrationService?.subscribeToWorkflowExecutions((payload) => {
      if (payload?.eventType === 'INSERT') {
        setOrchestrationData(prev => ({
          ...prev,
          executions: [payload?.data, ...prev?.executions]
        }));
      } else if (payload?.eventType === 'UPDATE') {
        setOrchestrationData(prev => ({
          ...prev,
          executions: prev?.executions?.map(exec =>
            exec?.id === payload?.data?.id ? payload?.data : exec
          )
        }));
      }
    });

    return () => {
      clearInterval(interval);
      orchestrationService?.unsubscribeFromWorkflowExecutions(channel);
    };
  }, []);

  useEffect(() => {
    analytics?.trackEvent('orchestration_center_viewed', {
      active_tab: activeTab,
      total_workflows: orchestrationData?.workflows?.length || 0
    });
  }, [activeTab]);

  const loadOrchestrationData = async () => {
    try {
      setLoading(true);
      const [workflowsResult, statsResult, complianceResult, optimizationResult] = await Promise.all([
        orchestrationService?.getOrchestrationWorkflows(),
        orchestrationService?.getWorkflowStatistics('30d'),
        orchestrationService?.getComplianceTriggers(),
        orchestrationService?.getOptimizationActions({ limit: 50 })
      ]);

      setOrchestrationData({
        workflows: workflowsResult?.data || [],
        statistics: statsResult?.data,
        executions: [],
        complianceTriggers: complianceResult?.data || [],
        optimizationActions: optimizationResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load orchestration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadOrchestrationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'workflows', label: 'Automation Workflows', icon: 'Workflow', badge: orchestrationData?.statistics?.activeWorkflows || 0 },
    { id: 'triggers', label: 'Trigger Monitoring', icon: 'Zap' },
    { id: 'analytics', label: 'Execution Analytics', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance Automation', icon: 'FileCheck' },
    { id: 'escalation', label: 'Incident Escalation', icon: 'AlertTriangle' },
    { id: 'optimization', label: 'Optimization Actions', icon: 'TrendingUp' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workflows':
        return <AutomationWorkflowsPanel workflows={orchestrationData?.workflows} statistics={orchestrationData?.statistics} onRefresh={refreshData} />;
      case 'triggers':
        return <TriggerMonitoringPanel workflows={orchestrationData?.workflows} onRefresh={refreshData} />;
      case 'analytics':
        return <ExecutionAnalyticsPanel statistics={orchestrationData?.statistics} executions={orchestrationData?.executions} />;
      case 'compliance':
        return <ComplianceAutomationPanel triggers={orchestrationData?.complianceTriggers} onRefresh={refreshData} />;
      case 'escalation':
        return <IncidentEscalationPanel workflows={orchestrationData?.workflows} onRefresh={refreshData} />;
      case 'optimization':
        return <OptimizationActionsPanel actions={orchestrationData?.optimizationActions} onRefresh={refreshData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Intelligent Orchestration Control Center - Vottery</title>
      </Helmet>
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="Workflow" size={28} className="text-primary" />
                Intelligent Orchestration Control Center
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automated compliance submissions, incident escalations, and optimization actions triggered by Perplexity fraud detection and financial thresholds
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">Last Updated</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lastUpdated?.toLocaleTimeString()}
                </div>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </div>

          {orchestrationData?.statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Workflow" size={16} className="text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Active Workflows</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orchestrationData?.statistics?.activeWorkflows}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Zap" size={16} className="text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Total Executions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orchestrationData?.statistics?.totalExecutions}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="CheckCircle2" size={16} className="text-green-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orchestrationData?.statistics?.successRate}%
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={16} className="text-purple-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Avg Execution Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orchestrationData?.statistics?.averageExecutionTime}ms
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                  {tab?.badge > 0 && (
                    <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentOrchestrationControlCenter;
