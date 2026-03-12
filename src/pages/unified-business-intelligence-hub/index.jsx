import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/AppIcon';
import { unifiedBusinessIntelligenceService } from '../../services/unifiedBusinessIntelligenceService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';
import SecurityAnalyticsPanel from './components/SecurityAnalyticsPanel';
import ComplianceStatusPanel from './components/ComplianceStatusPanel';
import PlatformKPIsPanel from './components/PlatformKPIsPanel';
import AIPoweredInsightsPanel from './components/AIPoweredInsightsPanel';
import PredictiveForecastingPanel from './components/PredictiveForecastingPanel';

const UnifiedBusinessIntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligence, setIntelligence] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [forecasting, setForecasting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadIntelligence = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await unifiedBusinessIntelligenceService?.consolidateBusinessIntelligence();
      
      if (error) {
        console.error('Error loading intelligence:', error);
        return;
      }

      setIntelligence(data);
      setLastUpdated(new Date());

      // Generate AI insights
      const insightsResult = await unifiedBusinessIntelligenceService?.generateAIPoweredInsights(data);
      if (insightsResult?.data) {
        setAiInsights(insightsResult?.data);
      }

      // Generate predictive forecasting
      const forecastResult = await unifiedBusinessIntelligenceService?.generatePredictiveForecasting(data);
      if (forecastResult?.data) {
        setForecasting(forecastResult?.data);
      }
    } catch (error) {
      console.error('Error loading intelligence:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntelligence();
  }, [loadIntelligence]);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadIntelligence,
    enabled: autoRefresh,
  });

  const tabs = [
    { id: 'overview', label: 'Intelligence Overview', icon: 'LayoutDashboard' },
    { id: 'performance', label: 'Performance Metrics', icon: 'Activity' },
    { id: 'security', label: 'Security Analytics', icon: 'Shield' },
    { id: 'compliance', label: 'Compliance Status', icon: 'FileCheck' },
    { id: 'kpis', label: 'Platform KPIs', icon: 'TrendingUp' },
    { id: 'insights', label: 'AI Insights', icon: 'Brain' },
    { id: 'forecasting', label: 'Predictive Forecasting', icon: 'LineChart' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Unified Business Intelligence Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Centralized Dashboard Consolidating Performance, Security, Compliance & Platform KPIs Across 159 Screens
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon name={autoRefresh ? 'RefreshCw' : 'Pause'} size={16} className={autoRefresh ? 'animate-spin' : ''} />
                {autoRefresh ? 'Auto-Refresh' : 'Paused'}
              </button>
              <button
                onClick={loadIntelligence}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated?.toLocaleTimeString()}
            </div>
          )}

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
        {loading && !intelligence ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Activity" size={24} className="text-blue-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Performance</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {intelligence?.performanceMetrics?.avgResponseTime || 0}ms
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Response Time</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Shield" size={24} className="text-green-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Security</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {intelligence?.securityAnalytics?.securityScore || 0}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Security Score</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="FileCheck" size={24} className="text-purple-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Compliance</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {intelligence?.complianceStatus?.complianceScore || 0}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Compliance Score</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="TrendingUp" size={24} className="text-orange-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">Growth</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {intelligence?.platformKPIs?.platformGrowthRate || 0}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Growth Rate</p>
                  </div>
                </div>

                {/* AI Insights Preview */}
                {aiInsights && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <Icon name="Brain" size={20} />
                      AI-Powered Insights
                    </h3>
                    <div className="space-y-2">
                      {aiInsights?.insights?.slice(0, 3)?.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Icon name="Sparkles" size={16} className="text-primary mt-1" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platform Coverage */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Platform Coverage
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">159</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Screens</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {intelligence?.performanceMetrics?.totalScreens || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monitored Screens</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {intelligence?.platformKPIs?.totalUsers || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {intelligence?.platformKPIs?.activeElections || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Elections</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'performance' && <PerformanceMetricsPanel data={intelligence?.performanceMetrics} />}
            {activeTab === 'security' && <SecurityAnalyticsPanel data={intelligence?.securityAnalytics} />}
            {activeTab === 'compliance' && <ComplianceStatusPanel data={intelligence?.complianceStatus} />}
            {activeTab === 'kpis' && <PlatformKPIsPanel data={intelligence?.platformKPIs} />}
            {activeTab === 'insights' && <AIPoweredInsightsPanel data={aiInsights} />}
            {activeTab === 'forecasting' && <PredictiveForecastingPanel data={forecasting} />}
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedBusinessIntelligenceHub;