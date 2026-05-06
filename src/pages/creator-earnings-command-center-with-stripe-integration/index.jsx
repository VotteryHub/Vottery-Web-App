import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DollarSign, TrendingUp, Clock, Zap, Award, RefreshCw, Download, BarChart3, Bell } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    { id: 'overview', label: 'Overview', icon: 'DollarSign' },
    { id: 'breakdown', label: 'Breakdown', icon: 'TrendingUp' },
    { id: 'payouts', label: 'Payouts', icon: 'Clock' },
    { id: 'stripe-connect', label: 'Stripe', icon: 'CreditCard' },
    { id: 'reconciliation', label: 'Reconciliation', icon: 'RefreshCw' },
    { id: 'tax', label: 'Tax', icon: 'FileText' },
    { id: 'performance', label: 'Performance', icon: 'Award' },
    { id: 'analytics-deep-dive', label: 'Analytics', icon: 'BarChart3' },
    { id: 'ai-optimization', label: 'AI Optimization', icon: 'Zap' },
    { id: 'webhooks', label: 'Webhooks', icon: 'Zap' },
    { id: 'realtime', label: 'Real-Time', icon: 'Activity' },
    { id: 'payment-alerts', label: 'Alerts', icon: 'Bell' }
  ];

  const quickStats = [
    {
      label: 'Total Earnings',
      value: `$${(earningsData?.overview?.totalEarnings || 0)?.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      change: '+12.5%'
    },
    {
      label: 'Pending Payouts',
      value: `$${(earningsData?.overview?.pendingPayouts || 0)?.toLocaleString()}`,
      icon: 'Clock',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      change: '+5.2%'
    },
    {
      label: 'Elections Revenue',
      value: `$${(earningsData?.overview?.successfulElectionsRevenue || 0)?.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      change: '+18.3%'
    },
    {
      label: 'Real-Time Txns',
      value: earningsData?.overview?.realtimeTransactions || 0,
      icon: 'Zap',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      change: 'Last 15s'
    }
  ];

  return (
    <GeneralPageLayout title="Creator Earnings" showSidebar={true}>
      <Helmet>
        <title>Creator Earnings Command Center | Vottery</title>
        <meta name="description" content="Comprehensive creator revenue tracking with Stripe webhook integration and real-time earnings monitoring" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Earnings Command Center
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium">
              Unified dashboard for creator payouts, revenue streams, and real-time earnings tracking
            </p>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">
              Last updated: {lastUpdated?.toLocaleTimeString()} • Auto-refresh: 15s
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-4 py-3 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-2xl bg-slate-900/60 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-md"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>

            <button
              onClick={refreshData}
              disabled={refreshing}
              className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              <Icon name="RefreshCw" size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>

            <button className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickStats?.map((stat, index) => (
            <div key={index} className={`${stat?.bgColor} backdrop-blur-md rounded-3xl border ${stat?.borderColor} p-6 hover:shadow-2xl transition-all group`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all`}>
                  <Icon name={stat?.icon} size={20} className={stat?.color} />
                </div>
                {stat?.change && (
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">{stat?.change}</span>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat?.label}</p>
              <p className="text-2xl font-black text-white tracking-tight">{stat?.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 bg-black/20 overflow-x-auto">
            <div className="flex min-w-max">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-black uppercase tracking-widest text-[10px] transition-all duration-300 border-b-4 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon name={tab?.icon} size={14} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Earnings Data...</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
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
              </div>
            )}
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
    </GeneralPageLayout>
  );
};

export default CreatorEarningsCommandCenter;
