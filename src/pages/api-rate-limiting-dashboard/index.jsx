import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="API Rate Limiting" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="Activity" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">API Infrastructure</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Real-time quota monitoring & endpoint security</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 px-4 border-r border-white/10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Range</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
              >
                {timeRangeOptions?.map(option => (
                  <option key={option?.value} value={option?.value} className="bg-slate-900">{option?.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 px-4 border-r border-white/10">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e?.target?.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-black/40 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0"
                />
                <label htmlFor="autoRefresh" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">
                  Auto-Sync
                </label>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-4 pr-2">
              <div className="hidden md:block">
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Last Updated</p>
                <p className="text-[10px] text-white font-mono">{lastUpdated?.toLocaleTimeString()}</p>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all disabled:opacity-50"
              >
                <Icon name={refreshing ? 'Loader' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-black/20 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 mb-10 overflow-x-auto no-scrollbar">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 min-h-[400px]">
          {renderTabContent()}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default APIRateLimitingDashboard;