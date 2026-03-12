import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { aiPerformanceOrchestrationService } from '../../services/aiPerformanceOrchestrationService';
import SystemHealthOverview from './components/SystemHealthOverview';
import AnomalyCorrelationPanel from './components/AnomalyCorrelationPanel';
import PredictiveScalingPanel from './components/PredictiveScalingPanel';
import OneClickResolutionPanel from './components/OneClickResolutionPanel';
import AIInsightsPanel from './components/AIInsightsPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';

const AIPerformanceOrchestrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [aiAnalyses, setAiAnalyses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadSystemMetrics = async () => {
    try {
      const { data, error } = await aiPerformanceOrchestrationService?.getSystemHealthMetrics();
      if (error) throw error;
      setSystemMetrics(data);
    } catch (error) {
      console.error('Error loading system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadSystemMetrics, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const analyzeAnomalies = async () => {
    if (!systemMetrics) return;
    
    setLoading(true);
    try {
      const { data, error } = await aiPerformanceOrchestrationService?.analyzeAnomaliesWithAI(systemMetrics);
      if (error) throw error;
      setAiAnalyses(data);
      setActiveTab('anomalies');
    } catch (error) {
      console.error('Error analyzing anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'System Health', icon: 'Activity' },
    { id: 'anomalies', label: 'Anomaly Correlation', icon: 'AlertTriangle' },
    { id: 'scaling', label: 'Predictive Scaling', icon: 'TrendingUp' },
    { id: 'resolution', label: '1-Click Resolution', icon: 'Zap' },
    { id: 'ai-insights', label: 'AI Insights', icon: 'Brain' },
    { id: 'metrics', label: 'Performance Metrics', icon: 'BarChart3' },
  ];

  const getHealthColor = (score) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 85) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <>
      <Helmet>
        <title>AI Performance Orchestration Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  AI Performance Orchestration Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Claude, Perplexity & OpenAI Unified Intelligence Portal
                </p>
              </div>
              <div className="flex items-center gap-3">
                {systemMetrics?.overallHealth && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${systemMetrics?.overallHealth?.score >= 95 ? 'bg-green-500' : systemMetrics?.overallHealth?.score >= 85 ? 'bg-blue-500' : systemMetrics?.overallHealth?.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      System Health:
                    </span>
                    <span className={`text-lg font-bold ${getHealthColor(systemMetrics?.overallHealth?.score)}`}>
                      {systemMetrics?.overallHealth?.score}%
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    autoRefresh
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={16} className={autoRefresh ? 'animate-spin' : ''} />
                  {autoRefresh ? 'Auto-Refresh' : 'Paused'}
                </button>
                <button
                  onClick={analyzeAnomalies}
                  disabled={!systemMetrics || loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  <Icon name="Brain" size={16} />
                  Analyze with AI
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {loading && !systemMetrics ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <SystemHealthOverview metrics={systemMetrics} />}
              {activeTab === 'anomalies' && <AnomalyCorrelationPanel analyses={aiAnalyses} metrics={systemMetrics} />}
              {activeTab === 'scaling' && <PredictiveScalingPanel metrics={systemMetrics} />}
              {activeTab === 'resolution' && <OneClickResolutionPanel analyses={aiAnalyses} />}
              {activeTab === 'ai-insights' && <AIInsightsPanel analyses={aiAnalyses} />}
              {activeTab === 'metrics' && <PerformanceMetricsPanel metrics={systemMetrics} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AIPerformanceOrchestrationDashboard;
