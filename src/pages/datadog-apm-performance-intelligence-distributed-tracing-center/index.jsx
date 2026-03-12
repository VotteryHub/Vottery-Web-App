import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { datadogAPMService } from '../../services/datadogAPMService';
import DistributedTracingPanel from './components/DistributedTracingPanel';
import BottleneckDetectionPanel from './components/BottleneckDetectionPanel';
import PredictiveScalingPanel from './components/PredictiveScalingPanel';
import EndpointPerformancePanel from './components/EndpointPerformancePanel';
import InfrastructureUtilizationPanel from './components/InfrastructureUtilizationPanel';
import PerformanceOptimizationPanel from './components/PerformanceOptimizationPanel';

const DatadogAPMPerformanceIntelligenceDistributedTracingCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await datadogAPMService?.getEndpointPerformanceMetrics();
      if (error) throw error;
      setPerformanceData(data);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPerformanceData();

    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const tabs = [
    { id: 'overview', label: 'Endpoint Performance', icon: 'Server' },
    { id: 'tracing', label: 'Distributed Tracing', icon: 'GitBranch' },
    { id: 'bottlenecks', label: 'Bottleneck Detection', icon: 'AlertCircle' },
    { id: 'scaling', label: 'Predictive Scaling', icon: 'TrendingUp' },
    { id: 'infrastructure', label: 'Infrastructure', icon: 'Database' },
    { id: 'optimization', label: 'Optimization', icon: 'Zap' }
  ];

  const criticalBottlenecks = performanceData?.bottlenecks?.filter((b) => b?.severity === 'critical')?.length || 0;
  const totalEndpoints = performanceData?.totalEndpoints || 0;
  const avgResponseTime =
    Object.values(performanceData?.endpointMetrics || {})?.reduce(
      (sum, m) => sum + parseFloat(m?.avgResponseTime || 0),
      0
    ) / totalEndpoints || 0;

  return (
    <>
      <Helmet>
        <title>Datadog APM Performance Intelligence & Distributed Tracing Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Datadog APM Performance Intelligence & Distributed Tracing Center
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive application performance monitoring across 200+ API endpoints with distributed tracing and predictive scaling
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {criticalBottlenecks > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <Icon name="AlertTriangle" size={16} className="text-red-600 dark:text-red-400" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                      {criticalBottlenecks} Critical
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Icon name="Server" size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    {totalEndpoints} Endpoints
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
                  {autoRefresh ? `Live (${refreshInterval}s)` : 'Paused'}
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Response Time</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{avgResponseTime?.toFixed(0)}ms</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bottlenecks Detected</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {performanceData?.bottlenecks?.length || 0}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Slow Transactions</div>
                <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {performanceData?.slowTransactions?.length || 0}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
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
              {activeTab === 'overview' && <EndpointPerformancePanel performanceData={performanceData} />}
              {activeTab === 'tracing' && <DistributedTracingPanel slowTransactions={performanceData?.slowTransactions} />}
              {activeTab === 'bottlenecks' && <BottleneckDetectionPanel bottlenecks={performanceData?.bottlenecks} />}
              {activeTab === 'scaling' && <PredictiveScalingPanel />}
              {activeTab === 'infrastructure' && <InfrastructureUtilizationPanel />}
              {activeTab === 'optimization' && (
                <PerformanceOptimizationPanel
                  bottlenecks={performanceData?.bottlenecks}
                  endpointMetrics={performanceData?.endpointMetrics}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DatadogAPMPerformanceIntelligenceDistributedTracingCenter;