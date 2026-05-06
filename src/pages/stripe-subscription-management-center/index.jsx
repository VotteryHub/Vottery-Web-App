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
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'customers', label: 'Customer Management', icon: 'Users' },
    { id: 'checkout', label: 'Checkout Sessions', icon: 'ShoppingCart' },
    { id: 'webhooks', label: 'Webhook Handler', icon: 'Webhook' },
    { id: 'billing', label: 'Billing Automation', icon: 'Calendar' },
    { id: 'retry', label: 'Payment Retry', icon: 'RefreshCw' },
    { id: 'plans', label: 'Tier Catalog', icon: 'Settings2' }
  ];

  return (
    <GeneralPageLayout title="Stripe Subscription Management" showSidebar={true}>
      <Helmet>
        <title>Stripe Subscription Management Center - Vottery</title>
        <meta name="description" content="Comprehensive subscription lifecycle management with customer creation, checkout session handling, and automated billing cycle processing." />
      </Helmet>

      <div className="w-full py-0">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                  Stripe Subscription Management Center
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive subscription lifecycle management with automated billing
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Icon name="RefreshCw" className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Subscriptions</span>
                  <Icon name="Users" className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {metrics?.activeSubscriptions?.toLocaleString()}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                  <Icon name="DollarSign" className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptionService?.formatCurrency(metrics?.monthlyRevenue)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Expiring Soon</span>
                  <Icon name="AlertTriangle" className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {metrics?.expiringSubscriptions?.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
    </GeneralPageLayout>
  );
};

export default StripeSubscriptionManagementCenter;