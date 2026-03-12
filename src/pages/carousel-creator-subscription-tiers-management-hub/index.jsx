import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { carouselCreatorTiersService } from '../../services/carouselCreatorTiersService';
import { Crown, Zap, Building2, Star, Check, X, Settings, ToggleLeft, ToggleRight, Users, TrendingUp, DollarSign, Shield, BarChart2, RefreshCw, AlertCircle } from 'lucide-react';

const TIER_ICONS = {
  basic: <Zap className="w-6 h-6" />,
  pro: <Star className="w-6 h-6" />,
  business: <Building2 className="w-6 h-6" />,
  vip: <Crown className="w-6 h-6" />
};

const TIER_COLORS = {
  basic: { bg: 'bg-slate-700', border: 'border-slate-500', badge: 'bg-slate-600 text-slate-200', accent: 'text-slate-300' },
  pro: { bg: 'bg-blue-900', border: 'border-blue-500', badge: 'bg-blue-600 text-blue-100', accent: 'text-blue-300' },
  business: { bg: 'bg-purple-900', border: 'border-purple-500', badge: 'bg-purple-600 text-purple-100', accent: 'text-purple-300' },
  vip: { bg: 'bg-amber-900', border: 'border-amber-500', badge: 'bg-amber-600 text-amber-100', accent: 'text-amber-300' }
};

function TierCard({ tier, subscription, onSubscribe, onCancel, onToggle, isAdmin }) {
  const colors = TIER_COLORS?.[tier?.tierName] || TIER_COLORS?.basic;
  const isCurrentTier = subscription?.tierId === tier?.id;
  const features = tier?.features?.features || [];

  return (
    <div className={`rounded-xl border-2 ${colors?.border} ${colors?.bg} p-6 flex flex-col gap-4 relative`}>
      {isCurrentTier && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors?.badge}`}>CURRENT PLAN</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors?.badge}`}>{TIER_ICONS?.[tier?.tierName]}</div>
          <div>
            <h3 className="text-white font-bold text-lg">{tier?.tierDisplayName}</h3>
            <p className={`text-sm font-semibold ${colors?.accent}`}>
              {tier?.priceMonthly === 0 ? 'Free Forever' : `$${tier?.priceMonthly}/mo`}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => onToggle(tier?.id, !tier?.isActive)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
          >
            {tier?.isActive ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-red-400" />}
            {tier?.isActive ? 'Active' : 'Disabled'}
          </button>
        )}
      </div>
      <div className="space-y-2">
        {features?.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700 space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Max Carousels</span>
          <span className="text-white font-medium">{tier?.maxCarousels ?? 'Unlimited'}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Analytics Access</span>
          <span className={`font-medium capitalize ${colors?.accent}`}>{tier?.analyticsAccess}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Sponsorship Priority</span>
          <span className="text-white font-medium">{tier?.sponsorshipPriority}</span>
        </div>
      </div>
      {!isAdmin && (
        <div className="pt-2">
          {isCurrentTier ? (
            <button
              onClick={() => onCancel(subscription?.id)}
              className="w-full py-2 rounded-lg bg-red-800 hover:bg-red-700 text-red-200 text-sm font-medium transition-colors"
            >
              Cancel Subscription
            </button>
          ) : (
            <button
              onClick={() => onSubscribe(tier?.id)}
              disabled={!tier?.isActive}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                tier?.isActive
                  ? `${colors?.badge} hover:opacity-90 cursor-pointer`
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {tier?.isActive ? (tier?.priceMonthly === 0 ? 'Get Started Free' : `Subscribe – $${tier?.priceMonthly}/mo`) : 'Unavailable'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatsPanel({ stats, tiers }) {
  const totalSubscribers = Object.values(stats || {})?.reduce((a, b) => a + b, 0);
  const paidSubscribers = Object.entries(stats || {})?.reduce((acc, [tierId, count]) => {
    const tier = tiers?.find(t => t?.id === tierId);
    return acc + (tier?.priceMonthly > 0 ? count : 0);
  }, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Subscribers', value: totalSubscribers, icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
        { label: 'Paid Subscribers', value: paidSubscribers, icon: <DollarSign className="w-5 h-5" />, color: 'text-green-400' },
        { label: 'Active Tiers', value: tiers?.filter(t => t?.isActive)?.length || 0, icon: <Shield className="w-5 h-5" />, color: 'text-purple-400' },
        { label: 'Conversion Rate', value: `${totalSubscribers > 0 ? Math.round((paidSubscribers / totalSubscribers) * 100) : 0}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' }
      ]?.map((stat, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className={`${stat?.color} mb-2`}>{stat?.icon}</div>
          <div className="text-2xl font-bold text-white">{stat?.value}</div>
          <div className="text-xs text-gray-400 mt-1">{stat?.label}</div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsAccessPanel({ tiers }) {
  const accessLevels = [
    { level: 'basic', label: 'Basic Analytics', features: ['Page views', 'Click-through rates', 'Basic engagement'], tiers: ['basic'] },
    { level: 'standard', label: 'Standard Analytics', features: ['All Basic features', 'Conversion funnels', 'A/B test results', 'Audience demographics'], tiers: ['pro'] },
    { level: 'premium', label: 'Premium Analytics', features: ['All Standard features', 'Revenue attribution', 'Predictive analytics', 'Custom dashboards', 'API export'], tiers: ['business'] },
    { level: 'enterprise', label: 'Enterprise Analytics', features: ['All Premium features', 'White-label reports', 'Real-time streaming', 'ML insights', 'Dedicated support'], tiers: ['vip'] }
  ];

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-blue-400" />
        Tier-Specific Analytics Access Levels
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {accessLevels?.map((access, i) => {
          const tierName = access?.tiers?.[0];
          const colors = TIER_COLORS?.[tierName] || TIER_COLORS?.basic;
          return (
            <div key={i} className={`rounded-lg border ${colors?.border} p-4`}>
              <div className={`text-sm font-bold mb-3 ${colors?.accent}`}>{access?.label}</div>
              <div className="space-y-1">
                {access?.features?.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-gray-300">
                    <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminFeatureFlagsPanel({ tiers, onToggle }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-purple-400" />
        Admin Feature Flag Controls
      </h3>
      <div className="space-y-3">
        {tiers?.map(tier => {
          const colors = TIER_COLORS?.[tier?.tierName] || TIER_COLORS?.basic;
          return (
            <div key={tier?.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${colors?.badge}`}>{TIER_ICONS?.[tier?.tierName]}</div>
                <div>
                  <div className="text-white text-sm font-medium">{tier?.tierDisplayName}</div>
                  <div className="text-gray-400 text-xs">
                    {tier?.priceMonthly === 0 ? 'Free' : `$${tier?.priceMonthly}/mo`} · {tier?.analyticsAccess} analytics
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tier?.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {tier?.isActive ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={() => onToggle(tier?.id, !tier?.isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    tier?.isActive ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tier?.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CarouselCreatorSubscriptionTiersManagementHub() {
  const [tiers, setTiers] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tiers');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tiersResult, statsResult] = await Promise.all([
        carouselCreatorTiersService?.getAllTiers(),
        carouselCreatorTiersService?.getTierStatistics()
      ]);
      if (tiersResult?.data) setTiers(tiersResult?.data);
      if (statsResult?.data) setStats(statsResult?.data);
    } catch (err) {
      setError('Failed to load subscription tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tierId) => {
    setActionLoading(true);
    try {
      const result = await carouselCreatorTiersService?.subscribeTier(tierId, null);
      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccessMsg('Successfully subscribed to tier!');
        setSubscription(result?.data);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError('Failed to subscribe');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (subscriptionId) => {
    setActionLoading(true);
    try {
      const result = await carouselCreatorTiersService?.cancelSubscription(subscriptionId);
      if (result?.error) {
        setError(result?.error?.message);
      } else {
        setSuccessMsg('Subscription cancelled.');
        setSubscription(null);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTier = async (tierId, isActive) => {
    try {
      await carouselCreatorTiersService?.toggleTierAvailability(tierId, isActive);
      setTiers(prev => prev?.map(t => t?.id === tierId ? { ...t, isActive } : t));
      setSuccessMsg(`Tier ${isActive ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to toggle tier');
    }
  };

  const tabs = [
    { id: 'tiers', label: 'Subscription Tiers' },
    { id: 'analytics', label: 'Analytics Access' },
    { id: 'admin', label: 'Admin Controls' },
    { id: 'stats', label: 'Statistics' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Helmet>
        <title>Carousel Creator Subscription Tiers Management Hub</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-900 rounded-lg">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Carousel Creator Subscription Tiers</h1>
              <p className="text-gray-400 text-sm">Manage 4-tier subscription system with Stripe integration and feature flags</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg flex items-center gap-2 text-green-300 text-sm">
            <Check className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        {/* Stats */}
        {!loading && <div className="mb-6"><StatsPanel stats={stats} tiers={tiers} /></div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-0">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab?.id
                  ? 'bg-gray-800 text-white border border-b-0 border-gray-700' :'text-gray-400 hover:text-white'
              }`}
            >
              {tab?.label}
            </button>
          ))}
          <button
            onClick={loadData}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-white px-3 py-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'tiers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {tiers?.map(tier => (
                  <TierCard
                    key={tier?.id}
                    tier={tier}
                    subscription={subscription}
                    onSubscribe={handleSubscribe}
                    onCancel={handleCancel}
                    onToggle={handleToggleTier}
                    isAdmin={false}
                  />
                ))}
              </div>
            )}

            {activeTab === 'analytics' && <AnalyticsAccessPanel tiers={tiers} />}

            {activeTab === 'admin' && (
              <div className="space-y-6">
                <AdminFeatureFlagsPanel tiers={tiers} onToggle={handleToggleTier} />
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Stripe Integration Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tiers?.filter(t => t?.priceMonthly > 0)?.map(tier => {
                      const colors = TIER_COLORS?.[tier?.tierName] || TIER_COLORS?.basic;
                      return (
                        <div key={tier?.id} className="p-4 bg-gray-700 rounded-lg">
                          <div className={`text-sm font-bold mb-2 ${colors?.accent}`}>{tier?.tierDisplayName}</div>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Price</span>
                              <span className="text-white">${tier?.priceMonthly}/mo</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stripe Price ID</span>
                              <span className="text-green-400">{tier?.stripePriceId ? '✓ Configured' : '⚠ Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Status</span>
                              <span className={tier?.isActive ? 'text-green-400' : 'text-red-400'}>
                                {tier?.isActive ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Subscription Distribution
                  </h3>
                  <div className="space-y-3">
                    {tiers?.map(tier => {
                      const count = stats?.[tier?.id] || 0;
                      const total = Object.values(stats || {})?.reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      const colors = TIER_COLORS?.[tier?.tierName] || TIER_COLORS?.basic;
                      return (
                        <div key={tier?.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={`font-medium ${colors?.accent}`}>{tier?.tierDisplayName}</span>
                            <span className="text-gray-400">{count} subscribers ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${colors?.badge?.split(' ')?.[0]}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
