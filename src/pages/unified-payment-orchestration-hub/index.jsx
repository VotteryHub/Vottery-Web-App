import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const PAYMENT_FLOWS = [
  {
    id: 'subscription',
    label: 'Subscription Payment',
    icon: 'CreditCard',
    description: 'Monthly/annual platform subscription billing',
    link: '/stripe-subscription-management-center',
    linkLabel: 'Manage Subscription',
  },
  {
    id: 'participation',
    label: 'Participation Fee',
    icon: 'Ticket',
    description: 'Per-election entry fee for voters',
    link: '/stripe-lottery-payment-integration-center',
    linkLabel: 'Manage Fees',
  },
  {
    id: 'payout',
    label: 'Prize Payout',
    icon: 'Banknote',
    description: 'Winner prize distribution via Stripe Connect or bank transfer',
    link: '/enhanced-creator-payout-dashboard-with-stripe-connect-integration',
    linkLabel: 'Manage Payouts',
  },
];

const PROVIDER_COLORS = {
  stripe: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  bank: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const ProviderBadge = ({ provider }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PROVIDER_COLORS?.[provider] || 'bg-muted text-muted-foreground border-border'}`}>
    {provider?.toUpperCase()}
  </span>
);

const UnifiedPaymentOrchestrationHub = () => {
  const { user, userProfile } = useAuth();
  const [payoutSettings, setPayoutSettings] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const [payoutResult, subResult] = await Promise.all([
        supabase?.from('payout_settings')?.select('*')?.eq('user_id', user?.id)?.single(),
        supabase?.from('subscriptions')?.select('*')?.eq('user_id', user?.id)?.eq('status', 'active')?.single()
      ]);
      setPayoutSettings(payoutResult?.data);
      setSubscriptionData(subResult?.data);
    } catch (err) {
      console.error('UnifiedPaymentHub load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Smart routing: determine provider by zone/preference (Stripe and bank only)
  const getSmartProvider = (flowId) => {
    const zone = userProfile?.country || userProfile?.zone || 'US';
    const euZones = ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'NO'];
    if (flowId === 'payout') {
      const method = payoutSettings?.payout_method;
      // Only stripe and bank_transfer supported; normalize legacy values
      if (method === 'paypal' || method === 'crypto_wallet') return 'stripe';
      return method || (euZones?.includes(zone) ? 'bank' : 'stripe');
    }
    if (flowId === 'subscription') {
      return subscriptionData?.payment_provider || 'stripe';
    }
    return 'stripe';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'subscription', label: 'Subscription', icon: 'CreditCard' },
    { id: 'participation', label: 'Participation', icon: 'Ticket' },
    { id: 'payout', label: 'Payout', icon: 'Banknote' },
    { id: 'routing', label: 'Smart Routing', icon: 'GitBranch' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 pt-20 lg:ml-64 xl:ml-72 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Unified Payment Orchestration Hub | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Icon name="Wallet" size={24} className="text-primary" />
                Unified Payment Orchestration Hub
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Centralized view of all payment methods: subscriptions, participation fees, and prize payouts</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-muted/30 rounded-xl p-1 overflow-x-auto">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab?.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={14} />
                  {tab?.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {PAYMENT_FLOWS?.map(flow => (
                  <div key={flow?.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon name={flow?.icon} size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{flow?.label}</h3>
                          <p className="text-xs text-muted-foreground">{flow?.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ProviderBadge provider={getSmartProvider(flow?.id)} />
                        <Link
                          to={flow?.link}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {flow?.linkLabel} <Icon name="ArrowRight" size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Subscription Payment Method</h2>
                {subscriptionData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <span className="text-sm font-medium text-foreground capitalize">{subscriptionData?.plan_type || 'Premium'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm font-medium text-green-500">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Provider</span>
                      <ProviderBadge provider={subscriptionData?.payment_provider || 'stripe'} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Next Billing</span>
                      <span className="text-sm font-medium text-foreground">
                        {subscriptionData?.current_period_end ? new Date(subscriptionData.current_period_end)?.toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="CreditCard" size={32} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm mb-4">No active subscription found</p>
                    <Link to="/stripe-subscription-management-center" className="text-primary text-sm hover:underline">Set up subscription →</Link>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link to="/stripe-subscription-management-center" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Manage Subscription <Icon name="ArrowRight" size={12} />
                  </Link>
                </div>
              </div>
            )}

            {/* Participation Tab */}
            {activeTab === 'participation' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Participation Fee Payment</h2>
                <p className="text-sm text-muted-foreground mb-4">Per-election entry fees are processed via Stripe. Each election may have a different fee set by the creator.</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Default Provider</span>
                    <ProviderBadge provider="stripe" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="text-sm font-medium text-foreground">Card / Wallet</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link to="/stripe-lottery-payment-integration-center" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Manage Participation Fees <Icon name="ArrowRight" size={12} />
                  </Link>
                </div>
              </div>
            )}

            {/* Payout Tab */}
            {activeTab === 'payout' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Payout Method</h2>
                {payoutSettings ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Payout Method</span>
                      <ProviderBadge provider={payoutSettings?.payout_method || 'stripe'} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stripe Connect</span>
                      <span className={`text-sm font-medium ${payoutSettings?.stripe_account_id ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {payoutSettings?.stripe_account_id ? 'Connected' : 'Not connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Payout</span>
                      <span className="text-sm font-medium text-foreground">${payoutSettings?.minimum_payout || 50}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Banknote" size={32} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm mb-4">No payout settings configured</p>
                    <Link to="/stripe-connect-account-linking-interface" className="text-primary text-sm hover:underline">Set up payout →</Link>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link to="/enhanced-creator-payout-dashboard-with-stripe-connect-integration" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Manage Payouts <Icon name="ArrowRight" size={12} />
                  </Link>
                </div>
              </div>
            )}

            {/* Smart Routing Tab */}
            {activeTab === 'routing' && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Smart Payment Routing</h2>
                <p className="text-sm text-muted-foreground mb-6">Automatically routes payments to the optimal provider based on user zone, preference, and availability.</p>
                <div className="space-y-4">
                  {PAYMENT_FLOWS?.map(flow => {
                    const provider = getSmartProvider(flow?.id);
                    return (
                      <div key={flow?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                          <Icon name={flow?.icon} size={16} className="text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{flow?.label}</p>
                            <p className="text-xs text-muted-foreground">Zone: {userProfile?.country || 'US'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Routed to</span>
                          <ProviderBadge provider={provider} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    <Icon name="Info" size={12} className="inline mr-1" />
                    Smart routing uses your account zone ({userProfile?.country || 'US'}) and payout preferences to select the optimal payment provider. Update your payout settings to change routing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedPaymentOrchestrationHub;
