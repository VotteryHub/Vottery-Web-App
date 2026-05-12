import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Zap, 
  Award, 
  RefreshCw, 
  Download, 
  BarChart3, 
  Bell,
  Wallet,
  ShieldCheck,
  Activity,
  FileText,
  CreditCard,
  Settings2,
  ArrowRight
} from 'lucide-react';
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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'breakdown', label: 'Breakdown', icon: TrendingUp },
    { id: 'payouts', label: 'Payouts', icon: Clock },
    { id: 'stripe-connect', label: 'Stripe', icon: CreditCard },
    { id: 'reconciliation', label: 'Sync', icon: RefreshCw },
    { id: 'tax', label: 'Tax', icon: FileText },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'analytics-deep-dive', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-optimization', label: 'AI Optimization', icon: Zap },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'realtime', label: 'Real-Time', icon: Activity },
    { id: 'payment-alerts', label: 'Alerts', icon: Bell }
  ];

  const quickStats = [
    {
      label: 'Total Volume',
      value: `$${(earningsData?.overview?.totalEarnings || 0)?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      change: '+12.5%'
    },
    {
      label: 'Pending Payout',
      value: `$${(earningsData?.overview?.pendingPayouts || 0)?.toLocaleString()}`,
      icon: Clock,
      color: 'text-primary',
      change: '+5.2%'
    },
    {
      label: 'Election Rev',
      value: `$${(earningsData?.overview?.successfulElectionsRevenue || 0)?.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      change: '+18.3%'
    },
    {
      label: 'Live Stream',
      value: earningsData?.overview?.realtimeTransactions || 0,
      icon: Zap,
      color: 'text-yellow-400',
      change: 'Active'
    }
  ];

  return (
    <GeneralPageLayout title="Earnings" showSidebar={true}>
      <Helmet>
        <title>Creator Earnings Command Center | Vottery</title>
        <meta name="description" content="Comprehensive creator revenue tracking with Stripe webhook integration and real-time earnings monitoring" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Earnings Hub</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Revenue Intelligence & Payout Control</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-6 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="7d" className="bg-slate-900">7 Days</option>
              <option value="30d" className="bg-slate-900">30 Days</option>
              <option value="90d" className="bg-slate-900">90 Days</option>
            </select>
            <button
              onClick={refreshData}
              className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats?.map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                  <span className="text-[10px] font-black text-green-400 tracking-widest">{stat.change}</span>
                </div>
                <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              </div>
              <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform duration-700`} />
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/5 mb-10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-4 py-4" aria-label="Tabs">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {typeof TabIcon === 'string' ? <Icon name={TabIcon} className="w-4 h-4" /> : <TabIcon className="w-4 h-4" />}
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Earnings Nodes...</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {activeTab === 'overview' && <DashboardOverview data={earningsData?.overview} />}
                {activeTab === 'breakdown' && <EarningsBreakdown data={earningsData?.breakdown} timeRange={timeRange} />}
                {activeTab === 'payouts' && <PayoutQueue />}
                {activeTab === 'stripe-connect' && <StripeConnectPanel />}
                {activeTab === 'reconciliation' && <SettlementReconciliation />}
                {activeTab === 'performance' && <PerformanceMetrics data={earningsData?.performance} />}
                {activeTab === 'analytics-deep-dive' && <CreatorAnalyticsDeepDive />}
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

      <OptimizationSuggestionOverlay
        screenName="creator-earnings-command-center"
        screenData={{
          totalEarnings: earningsData?.overview?.totalEarnings || 0,
          pendingPayouts: earningsData?.overview?.pendingPayouts || 0,
          successfulElectionsRevenue: earningsData?.overview?.successfulElectionsRevenue || 0,
          timeRange
        }}
        performanceMetrics={{ loadTime: 0, apiLatency: 0 }}
      />
    </GeneralPageLayout>
  );
};

export default CreatorEarningsCommandCenter;

