import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import QuotaOverviewPanel from './components/QuotaOverviewPanel';
import EndpointMonitoringPanel from './components/EndpointMonitoringPanel';
import ThrottlingControlsPanel from './components/ThrottlingControlsPanel';
import AbuseDetectionPanel from './components/AbuseDetectionPanel';
import PredictiveScalingPanel from './components/PredictiveScalingPanel';
import ViolationsHistoryPanel from './components/ViolationsHistoryPanel';
import { apiRateLimitingService } from '../../services/apiRateLimitingService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const APIRateLimitingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState('1h');
  const [dashboardData, setDashboardData] = useState({
    metrics: null,
    rateLimits: [],
    violations: [],
    quotaMonitoring: []
  });

  useEffect(() => {
    loadDashboardData();

    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData();
      }, 15000); // Refresh every 15 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  useEffect(() => {
    analytics?.trackEvent('api_rate_limiting_viewed', {
      active_tab: activeTab,
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [metricsResult, rateLimitsResult, violationsResult, quotaResult] = await Promise.all([
        apiRateLimitingService?.calculateMetrics(),
        apiRateLimitingService?.getAllRateLimits(),
        apiRateLimitingService?.getViolations(timeRange),
        apiRateLimitingService?.getQuotaMonitoring(timeRange)
      ]);

      setDashboardData({
        metrics: metricsResult?.data,
        rateLimits: rateLimitsResult?.data || [],
        violations: violationsResult?.data || [],
        quotaMonitoring: quotaResult?.data || []
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Quota Overview', icon: 'Activity' },
    { id: 'endpoints', label: 'Endpoint Monitoring', icon: 'Globe' },
    { id: 'throttling', label: 'Throttling Controls', icon: 'Sliders' },
    { id: 'abuse', label: 'Abuse Detection', icon: 'Shield' },
    { id: 'scaling', label: 'Predictive Scaling', icon: 'TrendingUp' },
    { id: 'violations', label: 'Violations History', icon: 'AlertTriangle' }
  ];

  const timeRangeOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <QuotaOverviewPanel metrics={dashboardData?.metrics} rateLimits={dashboardData?.rateLimits} />;
      case 'endpoints':
        return <EndpointMonitoringPanel rateLimits={dashboardData?.rateLimits} quotaMonitoring={dashboardData?.quotaMonitoring} onRefresh={refreshData} />;
      case 'throttling':
        return <ThrottlingControlsPanel rateLimits={dashboardData?.rateLimits} onUpdate={refreshData} />;
      case 'abuse':
        return <AbuseDetectionPanel violations={dashboardData?.violations} metrics={dashboardData?.metrics} />;
      case 'scaling':
        return <PredictiveScalingPanel rateLimits={dashboardData?.rateLimits} quotaMonitoring={dashboardData?.quotaMonitoring} />;
      case 'violations':
        return <ViolationsHistoryPanel violations={dashboardData?.violations} timeRange={timeRange} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>API Rate Limiting Dashboard - Vottery</title>
        <meta name="description" content="Real-time quota monitoring across 200+ endpoints with automated throttling, abuse detection, and predictive scaling to protect backend during viral campaign spikes." />
      </Helmet>

      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
        <LeftSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderNavigation />
          
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                      <Icon name="Activity" size={32} className="text-primary" />
                      API Rate Limiting Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Real-time quota monitoring across 200+ endpoints with automated throttling and abuse detection
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={16} />
                      <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
                    </div>
                    <Button
                      onClick={refreshData}
                      disabled={refreshing}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Icon name={refreshing ? 'Loader' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">Time Range:</label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e?.target?.value)}
                      className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {timeRangeOptions?.map(option => (
                        <option key={option?.value} value={option?.value}>{option?.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e?.target?.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="autoRefresh" className="text-sm font-medium text-foreground">
                      Auto-refresh (15s)
                    </label>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {tabs?.map(tab => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        activeTab === tab?.id
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
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
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default APIRateLimitingDashboard;