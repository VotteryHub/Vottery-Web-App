import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Star, ChevronRight, RefreshCw, Brain, Award } from 'lucide-react';
import subscriptionPoolingService from '../../services/subscriptionPoolingService';
import analyticsCacheService from '../../services/analyticsCacheService';

const TIER_DATA = [
  { name: 'Bronze', icon: '🥉', color: '#cd7f32', bg: 'bg-amber-900/30', count: 1240, revenue: 3720 },
  { name: 'Silver', icon: '🥈', color: '#c0c0c0', bg: 'bg-gray-700/30', count: 680, revenue: 8160 },
  { name: 'Gold', icon: '🥇', color: '#ffd700', bg: 'bg-yellow-900/30', count: 312, revenue: 12480 },
  { name: 'Platinum', icon: '💫', color: '#e5e4e2', bg: 'bg-slate-700/30', count: 89, revenue: 8900 },
  { name: 'Elite', icon: '💎', color: '#b9f2ff', bg: 'bg-cyan-900/30', count: 23, revenue: 6900 }
];

const CAROUSEL_EARNINGS = [
  { type: 'Horizontal Snap', revenue: 18420, growth: 14.2, icon: '⇔', color: 'text-blue-400' },
  { type: 'Vertical Stack', revenue: 15680, growth: 22.8, icon: '⇕', color: 'text-purple-400' },
  { type: 'Gradient Flow', revenue: 11240, growth: 31.4, icon: '🌈', color: 'text-pink-400' }
];

const CreatorGrowthAnalyticsMobile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    currentTier: 'Gold',
    totalEarnings: 45340,
    monthlyGrowth: 18.4,
    activeCreators: 2344
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const cleanupRef = useRef(null);
  const subscriberIdRef = useRef(`mobile-growth-${Date.now()}`);

  useEffect(() => {
    // Subscribe via pooling service
    cleanupRef.current = subscriptionPoolingService?.subscribeCreatorAnalytics(
      subscriberIdRef?.current,
      (payload) => {
        setLastUpdated(new Date());
      }
    );

    // Warm cache on mount
    analyticsCacheService?.warmCache({
      tier_data: {
        params: { mobile: true },
        fetchFn: async () => TIER_DATA
      }
    });

    return () => {
      if (cleanupRef?.current) cleanupRef?.current();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await analyticsCacheService?.invalidate('tier_data');
    await analyticsCacheService?.invalidate('earnings');
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tiers', label: 'Tiers' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'coaching', label: 'AI Coach' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col max-w-md mx-auto">
      {/* Mobile Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 active:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold text-white">Creator Analytics</h1>
          <p className="text-xs text-gray-400">Updated {lastUpdated?.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 active:bg-gray-700"
        >
          <RefreshCw className={`w-5 h-5 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {/* Tab Navigation */}
      <div className="flex bg-gray-900 border-b border-gray-800 overflow-x-auto">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 min-w-0 py-3 px-2 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab?.id
                ? 'text-blue-400 border-b-2 border-blue-400' :'text-gray-400'
            }`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Critical Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Current Tier</span>
                </div>
                <p className="text-xl font-bold text-yellow-400">{metrics?.currentTier}</p>
                <p className="text-xs text-gray-500 mt-1">🥇 312 creators</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Total Earnings</span>
                </div>
                <p className="text-xl font-bold text-green-400">${metrics?.totalEarnings?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Monthly Growth</span>
                </div>
                <p className="text-xl font-bold text-blue-400">+{metrics?.monthlyGrowth}%</p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Active Creators</span>
                </div>
                <p className="text-xl font-bold text-purple-400">{metrics?.activeCreators?.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Platform-wide</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <p className="text-sm font-semibold text-white px-4 pt-4 pb-2">Quick Actions</p>
              {[
                { label: 'View Full Dashboard', path: '/creator-growth-analytics-dashboard', icon: TrendingUp },
                { label: 'Churn Predictions', path: '/creator-churn-prediction-intelligence-center', icon: Brain },
                { label: 'Revenue Intelligence', path: '/unified-revenue-intelligence-mobile', icon: DollarSign }
              ]?.map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action?.path)}
                  className="w-full flex items-center justify-between px-4 py-3 border-t border-gray-800 active:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-white">{action?.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Tier Progression</p>
            {TIER_DATA?.map((tier, i) => (
              <div key={i} className={`${tier?.bg} rounded-2xl p-4 border border-gray-800`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{tier?.icon}</span>
                    <div>
                      <p className="font-bold" style={{ color: tier?.color }}>{tier?.name}</p>
                      <p className="text-gray-400 text-xs">{tier?.count?.toLocaleString()} creators</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">${tier?.revenue?.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">/month avg</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 bg-gray-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${Math.min(100, (tier?.count / 1240) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Earnings by Carousel Type</p>
            {CAROUSEL_EARNINGS?.map((c, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c?.icon}</span>
                    <p className="text-white font-medium">{c?.type}</p>
                  </div>
                  <span className="text-green-400 text-sm font-medium">+{c?.growth}%</span>
                </div>
                <p className={`text-2xl font-bold ${c?.color}`}>${c?.revenue?.toLocaleString()}</p>
                <div className="mt-2 bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    style={{ width: `${(c?.revenue / 18420) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'coaching' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-purple-400" />
              <p className="text-sm font-semibold text-white">AI Coaching Recommendations</p>
            </div>
            {[
              { title: 'Optimize posting frequency', detail: 'Post 3-5x/week for 2.3x faster tier progression', priority: 'High', color: 'text-red-400', bg: 'bg-red-500/10' },
              { title: 'Diversify carousel types', detail: 'Multi-type creators earn 40% more at same tier', priority: 'High', color: 'text-red-400', bg: 'bg-red-500/10' },
              { title: 'Template marketplace entry', detail: 'Gold+ creators earn avg $340/mo from templates', priority: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { title: 'Sponsorship readiness', detail: '89 creators are within 2 weeks of qualifying', priority: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
            ]?.map((rec, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-medium text-sm flex-1">{rec?.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rec?.bg} ${rec?.color} whitespace-nowrap`}>{rec?.priority}</span>
                </div>
                <p className="text-gray-400 text-xs mt-2">{rec?.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorGrowthAnalyticsMobile;
