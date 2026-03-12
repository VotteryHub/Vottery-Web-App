import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, TrendingUp, Clock, Zap, Award, RefreshCw, Download, BarChart3, Bell } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import DashboardOverview from './components/DashboardOverview';
import EarningsBreakdown from './components/EarningsBreakdown';
import PayoutQueue from './components/PayoutQueue';
import PerformanceMetrics from './components/PerformanceMetrics';
import StripeWebhookStatus from './components/StripeWebhookStatus';
import RealTimeTracking from './components/RealTimeTracking';
import { creatorEarningsService } from '../../services/creatorEarningsService';
import OptimizationSuggestionOverlay from '../../components/OptimizationSuggestionOverlay';
import AIOptimizationRecommendations from './components/AIOptimizationRecommendations';
import CreatorAnalyticsDeepDive from './components/CreatorAnalyticsDeepDive';
import { StripeConnectPanel, SettlementReconciliation } from './components/StripeConnectPanel';
import TaxLiabilityPanel from './components/TaxLiabilityPanel';
import PaymentAlertsPanel from './components/PaymentAlertsPanel';

const CreatorEarningsCommandCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [earningsData, setEarningsData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadEarningsData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const loadEarningsData = async () => {
    try {
      setLoading(true);

      const [overviewResult, breakdownResult, performanceResult] = await Promise.all([
        creatorEarningsService?.getCreatorEarningsOverview(),
        creatorEarningsService?.getEarningsBreakdown(null, timeRange),
        creatorEarningsService?.getCreatorPerformanceMetrics()
      ]);

      setEarningsData({
        overview: overviewResult?.data,
        breakdown: breakdownResult?.data,
        performance: performanceResult?.data
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadEarningsData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'breakdown', label: 'Earnings Breakdown', icon: TrendingUp },
    { id: 'payouts', label: 'Payout Queue', icon: Clock },
    { id: 'stripe-connect', label: 'Stripe Connect', icon: BarChart3 },
    { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
    { id: 'tax', label: 'Tax Liability', icon: BarChart3 },
    { id: 'performance', label: 'Performance Metrics', icon: Award },
    { id: 'analytics-deep-dive', label: 'Analytics Deep Dive', icon: BarChart3 },
    { id: 'ai-optimization', label: 'AI Optimization', icon: Zap },
    { id: 'webhooks', label: 'Stripe Webhooks', icon: Zap },
    { id: 'realtime', label: 'Real-Time Tracking', icon: RefreshCw },
    { id: 'payment-alerts', label: 'Payment Alerts', icon: Bell }
  ];

  const quickStats = [
    {
      label: 'Total Earnings',
      value: `$${(earningsData?.overview?.totalEarnings || 0)?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%'
    },
    {
      label: 'Pending Payouts',
      value: `$${(earningsData?.overview?.pendingPayouts || 0)?.toLocaleString()}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5.2%'
    },
    {
      label: 'Elections Revenue',
      value: `$${(earningsData?.overview?.successfulElectionsRevenue || 0)?.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+18.3%'
    },
    {
      label: 'Real-Time Transactions',
      value: earningsData?.overview?.realtimeTransactions || 0,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Last 15s'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Creator Earnings Command Center | Election Platform</title>
        <meta name="description" content="Comprehensive creator revenue tracking with Stripe webhook integration and real-time earnings monitoring" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Icon icon={DollarSign} className="w-8 h-8 text-green-600" />
                  Creator Earnings Command Center
                </h1>
                <p className="mt-2 text-gray-600">
                  Unified dashboard for creator payouts, revenue streams, and real-time earnings tracking with Stripe integration
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>

                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <Icon icon={RefreshCw} className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button variant="outline" className="flex items-center gap-2">
                  <Icon icon={Download} className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-4 text-sm text-gray-500">
              Last updated: {lastUpdated?.toLocaleTimeString()} • Auto-refresh: 15s
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats?.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
                    <Icon icon={stat?.icon} className={`w-6 h-6 ${stat?.color}`} />
                  </div>
                  {stat?.change && (
                    <span className="text-sm font-medium text-green-600">{stat?.change}</span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{stat?.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat?.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab?.id
                          ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon icon={tab?.icon} className="w-5 h-5" />
                    {tab?.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon icon={RefreshCw} className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && <DashboardOverview data={earningsData?.overview} />}
                  {activeTab === 'breakdown' && <EarningsBreakdown data={earningsData?.breakdown} timeRange={timeRange} />}
                  {activeTab === 'payouts' && <PayoutQueue />}
                  {activeTab === 'stripe-connect' && <StripeConnectPanel />}
                  {activeTab === 'reconciliation' && <SettlementReconciliation />}
                  {activeTab === 'performance' && <PerformanceMetrics data={earningsData?.performance} />}
                  {activeTab === 'analytics-deep-dive' && (
                    <CreatorAnalyticsDeepDive creatorId={user?.id} />
                  )}
                  {activeTab === 'ai-optimization' && (
                    <AIOptimizationRecommendations 
                      earningsData={earningsData?.overview} 
                      performanceData={earningsData?.performance}
                    />
                  )}
                  {activeTab === 'webhooks' && <StripeWebhookStatus />}
                  {activeTab === 'realtime' && <RealTimeTracking />}
                  {activeTab === 'tax' && <TaxLiabilityPanel />}
                  {activeTab === 'payment-alerts' && <PaymentAlertsPanel />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Suggestion Overlay */}
      <OptimizationSuggestionOverlay
        screenName="creator-earnings-command-center"
        screenData={{
          totalEarnings: earningsData?.overview?.totalEarnings || 0,
          pendingPayouts: earningsData?.overview?.pendingPayouts || 0,
          successfulElectionsRevenue: earningsData?.overview?.successfulElectionsRevenue || 0,
          timeRange
        }}
        performanceMetrics={{
          loadTime: 0,
          apiLatency: 0
        }}
      />
    </>
  );
};

export default CreatorEarningsCommandCenter;
