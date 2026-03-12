import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { performanceOptimizationService } from '../../services/performanceOptimizationService';
import PerformanceOverviewPanel from './components/PerformanceOverviewPanel';
import QueryOptimizationPanel from './components/QueryOptimizationPanel';
import CachingStrategyPanel from './components/CachingStrategyPanel';
import InfrastructureScalingPanel from './components/InfrastructureScalingPanel';
import PredictiveLoadForecastingPanel from './components/PredictiveLoadForecastingPanel';
import OptimizationRecommendationsPanel from './components/OptimizationRecommendationsPanel';

const PerformanceOptimizationEngineDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadPerformanceData = async () => {
    try {
      const { data, error } = await performanceOptimizationService?.getSystemPerformanceOverview();
      if (error) throw error;
      setPerformanceData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformanceData();
    
    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: 'Activity' },
    { id: 'query', label: 'Query Optimization', icon: 'Database' },
    { id: 'caching', label: 'Caching Strategy', icon: 'Zap' },
    { id: 'infrastructure', label: 'Infrastructure Scaling', icon: 'Server' },
    { id: 'forecasting', label: 'Load Forecasting', icon: 'TrendingUp' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' },
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-50 dark:bg-green-900/20';
    if (score >= 75) return 'bg-blue-50 dark:bg-blue-900/20';
    if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <>
      <Helmet>
        <title>Performance Optimization Engine Dashboard | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Performance Optimization Engine Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Real-time performance monitoring with automated optimization recommendations
                </p>
              </div>
              <div className="flex items-center gap-3">
                {performanceData?.overallScore && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getScoreBg(performanceData?.overallScore?.score)}`}>
                    <div className={`w-3 h-3 rounded-full ${performanceData?.overallScore?.score >= 90 ? 'bg-green-500' : performanceData?.overallScore?.score >= 75 ? 'bg-blue-500' : performanceData?.overallScore?.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Score:
                    </span>
                    <span className={`text-lg font-bold ${getScoreColor(performanceData?.overallScore?.score)}`}>
                      {performanceData?.overallScore?.score}%
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {autoRefresh ? `Live • ${lastUpdated?.toLocaleTimeString()}` : 'Paused'}
                  </span>
                </div>
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
          {loading && !performanceData ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <PerformanceOverviewPanel data={performanceData} />}
              {activeTab === 'query' && <QueryOptimizationPanel data={performanceData?.queryMetrics} />}
              {activeTab === 'caching' && <CachingStrategyPanel data={performanceData?.cacheMetrics} />}
              {activeTab === 'infrastructure' && <InfrastructureScalingPanel data={performanceData?.infrastructureMetrics} />}
              {activeTab === 'forecasting' && <PredictiveLoadForecastingPanel />}
              {activeTab === 'recommendations' && <OptimizationRecommendationsPanel />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PerformanceOptimizationEngineDashboard;