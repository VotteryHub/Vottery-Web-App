import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { DollarSign, TrendingUp, Eye, MousePointer, BarChart3, Target, RefreshCw, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import AdSense from '../../components/AdSense';
import RevenueOverviewPanel from './components/RevenueOverviewPanel';
import AdPlacementOptimizationPanel from './components/AdPlacementOptimizationPanel';
import RevenueStreamIntegrationPanel from './components/RevenueStreamIntegrationPanel';
import CreatorRevenueSharePanel from './components/CreatorRevenueSharePanel';
import AdPerformanceAnalyticsPanel from './components/AdPerformanceAnalyticsPanel';
import OptimizationRecommendationsPanel from './components/OptimizationRecommendationsPanel';

const AdSenseRevenueAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const adSenseClient = import.meta.env?.VITE_ADSENSE_CLIENT;

  useEffect(() => {
    loadRevenueData();

    const interval = setInterval(() => {
      refreshData();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      setRevenueData({
        overview: {
          totalEarnings: 12847.52,
          impressions: 2847392,
          clicks: 18472,
          ctr: 0.65,
          cpc: 0.42,
          rpm: 4.51,
        },
        placements: [
          { id: 1, location: 'Admin Dashboard Header', impressions: 847392, clicks: 5472, revenue: 2847.52, ctr: 0.65 },
          { id: 2, location: 'Creator Analytics Sidebar', impressions: 647392, clicks: 4472, revenue: 1847.52, ctr: 0.69 },
          { id: 3, location: 'Admin Control Center Footer', impressions: 547392, clicks: 3472, revenue: 1547.52, ctr: 0.63 },
          { id: 4, location: 'Revenue Analytics Panel', impressions: 447392, clicks: 2872, revenue: 1247.52, ctr: 0.64 },
          { id: 5, location: 'Creator Earnings Dashboard', impressions: 357392, clicks: 2184, revenue: 1357.44, ctr: 0.61 },
        ],
        revenueStreams: {
          participationFees: 45892.00,
          advertiserSpending: 78234.50,
          adsenseEarnings: 12847.52,
          total: 136974.02,
        },
        creatorSharing: {
          platformRevenue: 102730.52,
          creatorRevenue: 34243.50,
          sharingRatio: 75,
        },
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadRevenueData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Revenue Overview', icon: DollarSign },
    { id: 'placement', label: 'Ad Placement', icon: Target },
    { id: 'streams', label: 'Revenue Streams', icon: TrendingUp },
    { id: 'sharing', label: 'Creator Sharing', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Eye },
    { id: 'optimization', label: 'Optimization', icon: MousePointer },
  ];

  const quickStats = [
    {
      label: 'Total AdSense Revenue',
      value: `$${(revenueData?.overview?.totalEarnings || 0)?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+18.5%',
    },
    {
      label: 'Total Impressions',
      value: (revenueData?.overview?.impressions || 0)?.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12.3%',
    },
    {
      label: 'Click-Through Rate',
      value: `${(revenueData?.overview?.ctr || 0)?.toFixed(2)}%`,
      icon: MousePointer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+0.15%',
    },
    {
      label: 'Revenue Per Mille',
      value: `$${(revenueData?.overview?.rpm || 0)?.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      change: '+8.2%',
    },
  ];

  return (
    <GeneralPageLayout 
      title="AdSense Revenue Analytics Dashboard" 
      description="Monetization analytics for admin dashboards and creator analytics pages, tracking total earnings, impressions, CTR, and RPM."
      showSidebar={false}
      maxWidth="max-w-7xl"
    >
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon name="DollarSign" className="w-7 h-7 text-green-600" />
                  AdSense Revenue Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Monetization analytics for admin dashboards and creator analytics pages
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {quickStats?.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat?.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat?.color}`} />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {stat?.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat?.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat?.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {adSenseClient && (
            <div className="mb-6">
              <AdSense
                adClient={adSenseClient}
                adSlot="1234567890"
                adFormat="horizontal"
                className="mb-4"
              />
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <RevenueOverviewPanel data={revenueData} />}
              {activeTab === 'placement' && <AdPlacementOptimizationPanel data={revenueData} />}
              {activeTab === 'streams' && <RevenueStreamIntegrationPanel data={revenueData} />}
              {activeTab === 'sharing' && <CreatorRevenueSharePanel data={revenueData} />}
              {activeTab === 'performance' && <AdPerformanceAnalyticsPanel data={revenueData} />}
              {activeTab === 'optimization' && <OptimizationRecommendationsPanel data={revenueData} />}
            </>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default AdSenseRevenueAnalyticsDashboard;