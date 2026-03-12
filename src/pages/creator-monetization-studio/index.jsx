import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Crown, Megaphone, CheckCircle } from 'lucide-react';
import OnboardingWorkflow from './components/OnboardingWorkflow';
import EarningsDashboard from './components/EarningsDashboard';
import PayoutConfigPanel from './components/PayoutConfigPanel';
import SubscriptionTierManagement from './components/SubscriptionTierManagement';
import SponsorshipOpportunities from './components/SponsorshipOpportunities';
import Icon from '../../components/AppIcon';
import CreatorPricingOptimization from './components/CreatorPricingOptimization';


const TABS = [
  { id: 'onboarding', label: 'Onboarding', icon: CheckCircle },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'payout', label: 'Payout Setup', icon: Sparkles },
  { id: 'tiers', label: 'Subscription Tiers', icon: Crown },
  { id: 'sponsorships', label: 'Sponsorships', icon: Megaphone },
  { id: 'pricing', label: 'Pricing Optimizer', icon: Sparkles },
];

const STATS = [
  { label: 'Total Earnings', value: '$4,281', sub: 'This month', color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Active Tier', value: 'Silver', sub: '$29/month', color: 'text-gray-300', bg: 'bg-gray-300/10' },
  { label: 'Sponsorships', value: '4', sub: 'Available now', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Payout Status', value: 'Ready', sub: 'Next: Friday', color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

const CreatorMonetizationStudio = () => {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setActiveTab('earnings');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return onboardingComplete ? (
          <div className="bg-gray-900 rounded-xl border border-green-500/30 p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Onboarding Complete!</h3>
            <p className="text-gray-400 mb-6">Your creator account is fully set up. Start earning by creating elections and applying for sponsorships.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setActiveTab('earnings')} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">View Earnings</button>
              <button onClick={() => setActiveTab('sponsorships')} className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">Browse Sponsorships</button>
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
      case 'sponsorships':
        return <SponsorshipOpportunities />;
      case 'pricing':
        return <CreatorPricingOptimization />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-amber-500/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Creator Monetization Studio</h1>
              <p className="text-gray-400 text-sm">Onboarding · Earnings · Payouts · Tiers · Sponsorships</p>
            </div>
          </div>
          {onboardingComplete && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Account Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS?.map(stat => (
          <div key={stat?.label} className={`${stat?.bg} border border-gray-800 rounded-xl p-4`}>
            <p className="text-gray-400 text-xs mb-1">{stat?.label}</p>
            <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{stat?.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 overflow-x-auto">
          {TABS?.map(tab => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab?.id
                    ? 'bg-amber-600 text-white' :'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default CreatorMonetizationStudio;
