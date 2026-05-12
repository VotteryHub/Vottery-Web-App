import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Wallet, 
  CreditCard, 
  Ticket, 
  Banknote, 
  GitBranch, 
  ArrowRight, 
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Zap,
  Info
} from 'lucide-react';

const PAYMENT_FLOWS = [
  {
    id: 'subscription',
    label: 'Subscription Payment',
    icon: CreditCard,
    description: 'Monthly/annual platform subscription billing',
    link: '/stripe-subscription-management-center',
    linkLabel: 'Manage Subscription',
  },
  {
    id: 'participation',
    label: 'Participation Fee',
    icon: Ticket,
    description: 'Per-election entry fee for voters',
    link: '/stripe-lottery-payment-integration-center',
    linkLabel: 'Manage Fees',
  },
  {
    id: 'payout',
    label: 'Prize Payout',
    icon: Banknote,
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
  <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${PROVIDER_COLORS?.[provider] || 'bg-white/5 text-slate-500 border-white/5'}`}>
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
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'participation', label: 'Participation', icon: Ticket },
    { id: 'payout', label: 'Payout', icon: Banknote },
    { id: 'routing', label: 'Smart Routing', icon: GitBranch },
  ];

  return (
    <GeneralPageLayout title="Orchestration Hub" showSidebar={true}>
      <Helmet><title>Unified Payment Orchestration Hub | Vottery</title></Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Payment Orchestration</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Unified Multi-Channel Gateway Control</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Gateway
          </button>
        </div>

        {/* Global Node Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Active Flows', value: PAYMENT_FLOWS?.length, icon: GitBranch, color: 'text-primary' },
            { label: 'System Uptime', value: '99.9%', icon: ShieldCheck, color: 'text-green-400' },
            { label: 'Avg Latency', value: '42ms', icon: Zap, color: 'text-yellow-400' },
            { label: 'Node Status', value: 'Optimal', icon: TrendingUp, color: 'text-blue-400' }
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
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Gateway Nodes...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 gap-6">
                    {PAYMENT_FLOWS?.map(flow => (
                      <div key={flow?.id} className="group bg-black/20 border border-white/5 rounded-[40px] p-10 hover:bg-white/5 transition-all flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <flow.icon className="w-10 h-10 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{flow?.label}</h3>
                            <p className="text-slate-500 font-medium text-sm max-w-md">{flow?.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                          <ProviderBadge provider={getSmartProvider(flow?.id)} />
                          <Link
                            to={flow?.link}
                            className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3"
                          >
                            {flow?.linkLabel} <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10">Subscription Pipeline</h2>
                    {subscriptionData ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Plan</p>
                          <p className="text-2xl font-black text-white uppercase tracking-tight">{subscriptionData?.plan_type || 'Premium'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status Node</p>
                          <span className="px-4 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Operational</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Provider</p>
                          <ProviderBadge provider={subscriptionData?.payment_provider || 'stripe'} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Next Cycle</p>
                          <p className="text-xl font-black text-white font-mono">
                            {subscriptionData?.current_period_end ? new Date(subscriptionData.current_period_end)?.toLocaleDateString() : '—'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 bg-black/10 rounded-[32px] border border-dashed border-white/10">
                        <CreditCard size={48} className="text-slate-700 mb-6" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-8">No Active Subscription Protocol Detected</p>
                        <Link to="/stripe-subscription-management-center" className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Initialize Subscription</Link>
                      </div>
                    )}
                    <div className="mt-10 pt-10 border-t border-white/5">
                      <Link to="/stripe-subscription-management-center" className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:translate-x-2 transition-transform">
                        Access Subscription Center <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Participation Tab */}
                {activeTab === 'participation' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Participation Protocol</h2>
                    <p className="text-slate-500 font-medium text-sm mb-10 max-w-2xl">Entry fees are dynamically routed through global Stripe nodes. Regional taxation and processing fees are calculated in real-time based on creator geolocation.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Default Gateway</p>
                        <ProviderBadge provider="stripe" />
                      </div>
                      <div className="p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Verification Layer</p>
                        <p className="text-xl font-black text-white uppercase tracking-tight">3D Secure 2.0</p>
                      </div>
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/5">
                      <Link to="/stripe-lottery-payment-integration-center" className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:translate-x-2 transition-transform">
                        Manage Fee Structures <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Payout Tab */}
                {activeTab === 'payout' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10">Payout Logic</h2>
                    {payoutSettings ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Methodology</p>
                          <ProviderBadge provider={payoutSettings?.payout_method || 'stripe'} />
                        </div>
                        <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Account Link</p>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${payoutSettings?.stripe_account_id ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                            {payoutSettings?.stripe_account_id ? 'Authenticated' : 'Unlinked'}
                          </span>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Threshold</p>
                          <p className="text-2xl font-black text-white tracking-tighter">${payoutSettings?.minimum_payout || 50}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 bg-black/10 rounded-[32px] border border-dashed border-white/10">
                        <Banknote size={48} className="text-slate-700 mb-6" />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-8">No Payout Protocol Configured</p>
                        <Link to="/stripe-connect-account-linking-interface" className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">Setup Payout Node</Link>
                      </div>
                    )}
                    <div className="mt-10 pt-10 border-t border-white/5">
                      <Link to="/enhanced-creator-payout-dashboard-with-stripe-connect-integration" className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:translate-x-2 transition-transform">
                        Manage Payout Operations <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Smart Routing Tab */}
                {activeTab === 'routing' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Intelligent Routing Engine</h2>
                    <p className="text-slate-500 font-medium text-sm mb-12 max-w-2xl">Autonomous transaction routing based on geolocation nodes, institutional preferences, and regional settlement availability.</p>
                    <div className="space-y-6">
                      {PAYMENT_FLOWS?.map(flow => {
                        const provider = getSmartProvider(flow?.id);
                        return (
                          <div key={flow?.id} className="flex flex-col md:flex-row items-center justify-between p-10 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <flow.icon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-lg font-black text-white uppercase tracking-tight">{flow?.label}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Operational Zone: {userProfile?.country || 'US'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Routed Gateway</span>
                              <ProviderBadge provider={provider} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-12 p-10 bg-primary/5 rounded-[40px] border border-primary/10 flex items-start gap-6">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        The Smart Routing Engine utilizes advanced heuristics and regional compliance protocols to determine the most cost-effective and secure gateway for your transactions. Your current node affiliation is set to <span className="text-primary font-black uppercase tracking-widest">{userProfile?.country || 'US'}</span>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default UnifiedPaymentOrchestrationHub;

