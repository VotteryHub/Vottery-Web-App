import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Crown, Megaphone, CheckCircle, Heart, Users } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import OnboardingWorkflow from './components/OnboardingWorkflow';
import EarningsDashboard from './components/EarningsDashboard';
import PayoutConfigPanel from './components/PayoutConfigPanel';
import SubscriptionTierManagement from './components/SubscriptionTierManagement';
import SponsorshipOpportunities from './components/SponsorshipOpportunities';
import Icon from '../../components/AppIcon';
import CreatorPricingOptimization from './components/CreatorPricingOptimization';
import FanTierDesigner from './components/FanTierDesigner';


const TABS = [
  { id: 'onboarding', label: 'Onboarding', icon: 'CheckCircle' },
  { id: 'earnings', label: 'Earnings', icon: 'DollarSign' },
  { id: 'payout', label: 'Payout Setup', icon: 'Sparkles' },
  { id: 'tiers', label: 'Platform Tiers', icon: 'Crown' },
  { id: 'fan_tiers', label: 'Fan Tiers', icon: 'Heart' },
  { id: 'sponsorships', label: 'Sponsorships', icon: 'Megaphone' },
  { id: 'pricing', label: 'Pricing Optimizer', icon: 'Sparkles' },
];

const CreatorMonetizationStudio = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [liveStats, setLiveStats] = useState([
    { label: 'Total Earnings', value: '...', sub: 'This month', color: 'text-green-400', bg: 'bg-green-500/10', borderColor: 'border-green-500/20' },
    { label: 'Active Fans', value: '...', sub: 'Subscribed now', color: 'text-pink-400', bg: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
    { label: 'Fan MRR', value: '...', sub: 'Monthly recurring', color: 'text-purple-400', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    { label: 'Payout Status', value: 'Ready', sub: 'Next: Friday', color: 'text-blue-400', bg: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  ]);

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const { supabase } = await import('../../lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLiveStats([
            { label: 'Total Earnings', value: '$4,870', sub: 'This month', color: 'text-green-400', bg: 'bg-green-500/10', borderColor: 'border-green-500/20' },
            { label: 'Active Fans', value: '42', sub: 'Subscribed now', color: 'text-pink-400', bg: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
            { label: 'Fan MRR', value: '$1,190', sub: 'Monthly recurring', color: 'text-purple-400', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
            { label: 'Payout Status', value: 'Ready', sub: 'Next: Friday', color: 'text-blue-400', bg: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
          ]);
          return;
        }
        const { data: subs } = await supabase
          .from('creator_fan_subscriptions')
          .select('id, status, price_usd')
          .eq('creator_id', user.id);
        const active = subs?.filter(s => s.status === 'active') ?? [];
        const mrr = active.reduce((acc, s) => acc + (s.price_usd ?? 0), 0);
        setLiveStats(s => [
          { ...s[0] },
          { label: 'Active Fans', value: String(active.length), sub: 'Subscribed now', color: 'text-pink-400', bg: 'bg-pink-500/10', borderColor: 'border-pink-500/20' },
          { label: 'Fan MRR', value: `$${mrr.toFixed(0)}`, sub: 'Monthly recurring', color: 'text-purple-400', bg: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
          { ...s[3] },
        ]);
      } catch (e) { /* silent */ }
    };
    fetchLiveStats();
  }, []);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setActiveTab('earnings');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return onboardingComplete ? (
          <div className="bg-card backdrop-blur-md rounded-3xl border border-green-500/20 p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">Onboarding Complete!</h3>
            <p className="text-muted-foreground font-medium mb-8 max-w-md mx-auto">Your creator account is fully set up. Start earning by creating elections and applying for sponsorships.</p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setActiveTab('earnings')} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-green-500/20">View Earnings</button>
              <button onClick={() => setActiveTab('sponsorships')} className="bg-muted/50 hover:bg-muted text-foreground px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-border">Browse Sponsorships</button>
            </div>
          </div>
        ) : (
          <OnboardingWorkflow onComplete={handleOnboardingComplete} />
        );
      case 'earnings':
        return <EarningsDashboard />;
      case 'payout':
        return <PayoutConfigPanel />;
      case 'tiers':
        return <SubscriptionTierManagement />;
      case 'fan_tiers':
        return <FanTierDesigner />;
      case 'sponsorships':
        return <SponsorshipOpportunities />;
      case 'pricing':
        return <CreatorPricingOptimization />;
      default:
        return null;
    }
  };

  return (
    <GeneralPageLayout title="Creator Monetization Studio" showSidebar={true}>
      <div className="w-full py-0">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-3xl border border-border rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-foreground tracking-tight uppercase">Monetization Studio</h1>
                <p className="text-muted-foreground font-medium">Onboarding · Earnings · Payouts · Tiers · Sponsorships</p>
              </div>
            </div>
            {onboardingComplete && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Account Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {liveStats?.map(stat => (
            <div key={stat?.label} className={`${stat?.bg} border ${stat?.borderColor} rounded-2xl p-5 backdrop-blur-md hover:shadow-2xl transition-all`}>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat?.label}</p>
              <p className={`text-2xl font-black ${stat?.color}`}>{stat?.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground/70 mt-1">{stat?.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-muted/30 backdrop-blur-md rounded-2xl p-2 border border-border shadow-inner mb-10 overflow-x-auto">
          {TABS?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === tab?.id
                  ? 'bg-primary/10 text-primary shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default CreatorMonetizationStudio;
