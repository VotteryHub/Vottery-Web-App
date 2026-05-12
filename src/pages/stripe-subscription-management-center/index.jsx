import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionService } from '../../services/subscriptionService';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';
import DashboardOverview from './components/DashboardOverview';
import CustomerManagement from './components/CustomerManagement';
import CheckoutSessionPanel from './components/CheckoutSessionPanel';
import WebhookHandler from './components/WebhookHandler';
import BillingAutomation from './components/BillingAutomation';
import PaymentRetryLogic from './components/PaymentRetryLogic';
import PlanCatalogManager from './components/PlanCatalogManager';
import { 
  CreditCard, 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Webhook, 
  Calendar, 
  RefreshCw, 
  Settings2,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

const StripeSubscriptionManagementCenter = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [billingQueue, setBillingQueue] = useState([]);
  const [retryQueue, setRetryQueue] = useState([]);

  useEffect(() => {
    if (user?.id) loadSubscriptionData();
  }, [user?.id]);

  useRealtimeMonitoring({
    tables: ['user_subscriptions', 'subscription_plans'],
    onRefresh: loadSubscriptionData,
    enabled: !!user?.id,
  });

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [metricsResult, subscriptionsResult, plansResult, billingResult, retryResult] = await Promise.all([
        subscriptionService?.getSubscriptionMetrics(),
        subscriptionService?.getSubscriptionAnalytics(),
        subscriptionService?.getAllSubscriptionPlansForAdmin(),
        subscriptionService?.getBillingCycleQueue(),
        subscriptionService?.getPaymentRetryQueue()
      ]);

      if (metricsResult?.data) setMetrics(metricsResult?.data);
      if (subscriptionsResult?.data) setSubscriptions(subscriptionsResult?.data);
      if (plansResult?.data) setPlans(plansResult?.data);
      if (billingResult?.data) setBillingQueue(billingResult?.data);
      if (retryResult?.data) setRetryQueue(retryResult?.data);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadSubscriptionData();
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'checkout', label: 'Sessions', icon: ShoppingCart },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'billing', label: 'Billing', icon: Calendar },
    { id: 'retry', label: 'Retries', icon: RefreshCw },
    { id: 'plans', label: 'Catalog', icon: Settings2 }
  ];

  return (
    <GeneralPageLayout title="Subscriptions" showSidebar={true}>
      <Helmet>
        <title>Stripe Subscription Management Center - Vottery</title>
        <meta name="description" content="Comprehensive subscription lifecycle management with customer creation, checkout session handling, and automated billing cycle processing." />
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Subscription Engine</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Recurring Revenue & Lifecycle Management</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Catalog
          </button>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total MRR', value: subscriptionService?.formatCurrency(metrics?.monthlyRevenue || 0), icon: DollarSign, color: 'text-green-400' },
            { label: 'Active Users', value: (metrics?.activeSubscriptions || 0)?.toLocaleString(), icon: Users, color: 'text-primary' },
            { label: 'Churn Risk', value: (metrics?.expiringSubscriptions || 0)?.toLocaleString(), icon: AlertTriangle, color: 'text-orange-400' },
            { label: 'Node Status', value: 'Healthy', icon: ShieldCheck, color: 'text-blue-400' }
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
                    <TabIcon className="w-4 h-4" />
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
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Subscription Nodes...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <DashboardOverview
                    subscriptions={subscriptions}
                    plans={plans}
                    metrics={metrics}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'customers' && (
                  <CustomerManagement
                    subscriptions={subscriptions}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'checkout' && (
                  <CheckoutSessionPanel
                    plans={plans}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'webhooks' && (
                  <WebhookHandler
                    subscriptions={subscriptions}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'billing' && (
                  <BillingAutomation
                    billingQueue={billingQueue}
                    plans={plans}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'retry' && (
                  <PaymentRetryLogic
                    retryQueue={retryQueue}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeTab === 'plans' && (
                  <PlanCatalogManager plans={plans} onRefresh={handleRefresh} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default StripeSubscriptionManagementCenter;