import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { adSlotManagerService } from '../../services/adSlotManagerService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import PerformanceOverviewPanel from './components/PerformanceOverviewPanel';
import ParticipatoryAdsAnalyticsPanel from './components/ParticipatoryAdsAnalyticsPanel';
import AdSensePerformancePanel from './components/AdSensePerformancePanel';
import ComparativeAnalysisPanel from './components/ComparativeAnalysisPanel';
import RevenueAttributionPanel from './components/RevenueAttributionPanel';
import FillRateTrackingPanel from './components/FillRateTrackingPanel';

const DualAdvertisingSystemAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(dateRange);
      const data = await adSlotManagerService?.getDashboardAnalytics(startDate, endDate);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (range) => {
    const endDate = new Date()?.toISOString();
    const startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate?.setHours(startDate?.getHours() - 24);
        break;
      case '7d':
        startDate?.setDate(startDate?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(startDate?.getDate() - 30);
        break;
      case '90d':
        startDate?.setDate(startDate?.getDate() - 90);
        break;
      default:
        startDate?.setDate(startDate?.getDate() - 7);
    }
    
    return { startDate: startDate?.toISOString(), endDate };
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  useRealtimeMonitoring({
    tables: ['sponsored_elections', 'system_alerts'],
    onRefresh: loadDashboardData,
    enabled: true,
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'participatory', label: 'Participatory Ads', icon: 'Users' },
    { id: 'adsense', label: 'AdSense', icon: 'DollarSign' },
    { id: 'comparative', label: 'Comparative Analysis', icon: 'BarChart3' },
    { id: 'revenue', label: 'Revenue Attribution', icon: 'TrendingUp' },
    { id: 'fillrate', label: 'Fill Rate Tracking', icon: 'Activity' }
  ];

  return (
    <GeneralPageLayout 
      title="Dual Advertising System Analytics Dashboard" 
      description="Comparative analysis hub for Vottery internal ads and Google AdSense fallback, tracking fill rates, revenue per mille, and orchestration efficiency."
      showSidebar={false}
      maxWidth="max-w-[1600px]"
    >
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Dual Advertising System Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive performance intelligence comparing participatory ads with Google AdSense
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e?.target?.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icon name="RefreshCw" size={18} />
                Refresh
              </button>
            </div>
          </div>

          {/* System Health Indicator */}
          {dashboardData?.systemHealth && (
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  dashboardData?.systemHealth?.internalAdsActive ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Internal Ads: {dashboardData?.systemHealth?.internalAdsActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  dashboardData?.systemHealth?.adsenseFallbackWorking ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  AdSense Fallback: {dashboardData?.systemHealth?.adsenseFallbackWorking ? 'Working' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} className="text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Conflicts Prevented: {dashboardData?.systemHealth?.conflictsPrevented}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-blue-600 text-white' :'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panels */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <PerformanceOverviewPanel data={dashboardData} />
            )}
            
            {activeTab === 'participatory' && (
              <ParticipatoryAdsAnalyticsPanel data={dashboardData} />
            )}
            
            {activeTab === 'adsense' && (
              <AdSensePerformancePanel data={dashboardData} />
            )}
            
            {activeTab === 'comparative' && (
              <ComparativeAnalysisPanel data={dashboardData} />
            )}
            
            {activeTab === 'revenue' && (
              <RevenueAttributionPanel data={dashboardData} />
            )}
            
            {activeTab === 'fillrate' && (
              <FillRateTrackingPanel data={dashboardData} />
            )}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default DualAdvertisingSystemAnalyticsDashboard;
