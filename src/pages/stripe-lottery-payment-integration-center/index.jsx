import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardOverview from './components/DashboardOverview';
import ParticipationFeeProcessing from './components/ParticipationFeeProcessing';
import PrizePayoutAutomation from './components/PrizePayoutAutomation';
import TransactionMonitoring from './components/TransactionMonitoring';
import StripeIntegrationStatus from './components/StripeIntegrationStatus';
import WebhookConfiguration from './components/WebhookConfiguration';
import { lotteryPaymentService } from '../../services/lotteryPaymentService';
import { webhookService } from '../../services/webhookService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import { 
  CreditCard, 
  LayoutDashboard, 
  Trophy, 
  Ticket, 
  Activity, 
  Webhook, 
  RefreshCw, 
  CheckCircle, 
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const StripeGamifiedPaymentIntegrationCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    transactionStats: null,
    payoutStats: null,
    pendingPayouts: [],
    webhooks: [],
    stripeStatus: null
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadPaymentData,
    enabled: true,
  });

  useEffect(() => {
    analytics?.trackEvent('stripe_gamified_center_viewed', {
      active_tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      const [payoutStatsResult, pendingPayoutsResult, webhooksResult] = await Promise.all([
        lotteryPaymentService?.getPayoutStats(),
        lotteryPaymentService?.getPendingPayouts(),
        webhookService?.listWebhooks()
      ]);

      setPaymentData({
        transactionStats: {
          totalProcessed: 15847,
          successRate: 98.7,
          avgProcessingTime: 1.8,
          totalRevenue: 2847500
        },
        payoutStats: payoutStatsResult?.data || null,
        pendingPayouts: pendingPayoutsResult?.data || [],
        webhooks: webhooksResult?.data || [],
        stripeStatus: {
          connected: true,
          apiVersion: '2023-10-16',
          webhookConfigured: true,
          pciCompliant: true
        }
      });
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadPaymentData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fees', label: 'Participation Fees', icon: Ticket },
    { id: 'payouts', label: 'Prize Payouts', icon: Trophy },
    { id: 'monitoring', label: 'Transaction Monitor', icon: Activity },
    { id: 'integration', label: 'Stripe Integration', icon: CreditCard },
    { id: 'webhooks', label: 'Webhook Config', icon: Webhook }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Lottery Financials...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview data={paymentData} onRefresh={refreshData} />;
      case 'fees':
        return <ParticipationFeeProcessing data={paymentData} onRefresh={refreshData} />;
      case 'payouts':
        return <PrizePayoutAutomation data={paymentData} onRefresh={refreshData} />;
      case 'monitoring':
        return <TransactionMonitoring data={paymentData} onRefresh={refreshData} />;
      case 'integration':
        return <StripeIntegrationStatus data={paymentData} onRefresh={refreshData} />;
      case 'webhooks':
        return <WebhookConfiguration data={paymentData} onRefresh={refreshData} />;
      default:
        return <DashboardOverview data={paymentData} onRefresh={refreshData} />;
    }
  };

  return (
    <GeneralPageLayout title="Lottery Payments" showSidebar={true}>
      <Helmet>
        <title>Stripe Gamified Payment Integration Center - Vottery</title>
        <meta name="description" content="Manage gamified payment processing, participation fees, and automated prize payouts with Stripe integration" />
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Lottery Payments</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Prize Distribution & Fee Collection</p>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Platform
          </button>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Volume', value: `$${(paymentData?.transactionStats?.totalRevenue || 0)?.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
            { label: 'Success Rate', value: `${paymentData?.transactionStats?.successRate || 0}%`, icon: CheckCircle, color: 'text-primary' },
            { label: 'Processing Time', value: `${paymentData?.transactionStats?.avgProcessingTime || 0}s`, icon: Zap, color: 'text-yellow-400' },
            { label: 'Network Health', value: 'Optimal', icon: ShieldCheck, color: 'text-blue-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
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
            {renderContent()}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default StripeGamifiedPaymentIntegrationCenter;