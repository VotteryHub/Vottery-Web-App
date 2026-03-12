import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart2, RefreshCw, ChevronRight, Globe, Zap } from 'lucide-react';
import subscriptionPoolingService from '../../services/subscriptionPoolingService';
import analyticsCacheService from '../../services/analyticsCacheService';

const REVENUE_STREAMS = [
  { name: 'SMS Ads', amount: 28400, growth: 12.3, icon: '📱', color: 'text-blue-400' },
  { name: 'Elections', amount: 19200, growth: 8.7, icon: '🗳️', color: 'text-purple-400' },
  { name: 'Marketplace', amount: 15600, growth: 24.1, icon: '🛒', color: 'text-green-400' },
  { name: 'Creator Tiers', amount: 12800, growth: 18.9, icon: '⭐', color: 'text-yellow-400' },
  { name: 'Templates', amount: 8900, growth: 31.2, icon: '📄', color: 'text-pink-400' },
  { name: 'Sponsorships', amount: 22100, growth: 15.4, icon: '🤝', color: 'text-orange-400' }
];

const ZONE_DATA = [
  { name: 'US & Canada', revenue: 42000, growth: 14.2, flag: '🇺🇸' },
  { name: 'Western Europe', revenue: 31000, growth: 9.8, flag: '🇪🇺' },
  { name: 'Latin America', revenue: 18000, growth: 28.4, flag: '🌎' },
  { name: 'Asia Pacific', revenue: 24000, growth: 22.1, flag: '🌏' }
];

const UnifiedRevenueIntelligenceMobile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [forecastDays, setForecastDays] = useState(30);
  const cleanupRef = useRef(null);
  const subscriberIdRef = useRef(`mobile-revenue-${Date.now()}`);

  const totalRevenue = REVENUE_STREAMS?.reduce((sum, s) => sum + s?.amount, 0);
  const avgGrowth = (REVENUE_STREAMS?.reduce((sum, s) => sum + s?.growth, 0) / REVENUE_STREAMS?.length)?.toFixed(1);

  useEffect(() => {
    cleanupRef.current = subscriptionPoolingService?.subscribeRevenueStreams(
      subscriberIdRef?.current,
      (payload) => {
        setLastUpdated(new Date());
        analyticsCacheService?.invalidate('revenue_streams');
      }
    );

    return () => {
      if (cleanupRef?.current) cleanupRef?.current();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await analyticsCacheService?.invalidate('revenue_streams');
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'streams', label: 'Streams' },
    { id: 'zones', label: 'Zones' },
    { id: 'forecast', label: 'Forecast' }
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
          <h1 className="text-base font-bold text-white">Revenue Intelligence</h1>
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
      <div className="flex bg-gray-900 border-b border-gray-800">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab?.id
                ? 'text-green-400 border-b-2 border-green-400' :'text-gray-400'
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
            {/* Hero metric */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 rounded-2xl p-5 border border-green-800/30">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-4xl font-bold text-white mt-1">${totalRevenue?.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">+{avgGrowth}% avg growth</span>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <p className="text-xs text-gray-400">Revenue Streams</p>
                <p className="text-2xl font-bold text-white mt-1">6</p>
                <p className="text-xs text-gray-500">Active sources</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <p className="text-xs text-gray-400">Top Stream</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">SMS Ads</p>
                <p className="text-xs text-gray-500">${REVENUE_STREAMS?.[0]?.amount?.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick nav */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <p className="text-sm font-semibold text-white px-4 pt-4 pb-2">Navigate</p>
              {[
                { label: 'Full Revenue Dashboard', path: '/unified-revenue-intelligence-dashboard', icon: BarChart2 },
                { label: 'Creator Growth Mobile', path: '/creator-growth-analytics-mobile', icon: TrendingUp },
                { label: 'Cache Management', path: '/automated-data-cache-management-hub', icon: Zap }
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

        {activeTab === 'streams' && (
          <div className="p-4 space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Revenue Streams</p>
            {REVENUE_STREAMS?.map((stream, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stream?.icon}</span>
                    <p className="text-white font-medium">{stream?.name}</p>
                  </div>
                  <span className="text-green-400 text-sm">+{stream?.growth}%</span>
                </div>
                <p className={`text-xl font-bold ${stream?.color}`}>${stream?.amount?.toLocaleString()}</p>
                <div className="mt-2 bg-gray-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                    style={{ width: `${(stream?.amount / totalRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">{Math.round((stream?.amount / totalRevenue) * 100)}% of total</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'zones' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-gray-400 uppercase tracking-wider">Zone Performance</p>
            </div>
            {ZONE_DATA?.map((zone, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{zone?.flag}</span>
                    <div>
                      <p className="text-white font-medium">{zone?.name}</p>
                      <p className="text-green-400 text-xs">+{zone?.growth}% growth</p>
                    </div>
                  </div>
                  <p className="text-white font-bold">${(zone?.revenue / 1000)?.toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'forecast' && (
          <div className="p-4 space-y-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Revenue Forecast</p>

            {/* Forecast period selector */}
            <div className="flex gap-2">
              {[30, 60, 90]?.map(days => (
                <button
                  key={days}
                  onClick={() => setForecastDays(days)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    forecastDays === days
                      ? 'bg-green-600 text-white' :'bg-gray-800 text-gray-400'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            {/* Forecast cards */}
            {[
              { label: `${forecastDays}-Day Projection`, value: Math.round(totalRevenue * (1 + (avgGrowth / 100) * (forecastDays / 30))), color: 'text-green-400' },
              { label: 'Conservative Estimate', value: Math.round(totalRevenue * 0.95), color: 'text-yellow-400' },
              { label: 'Optimistic Estimate', value: Math.round(totalRevenue * 1.35), color: 'text-blue-400' }
            ]?.map((item, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <p className="text-gray-400 text-sm">{item?.label}</p>
                <p className={`text-2xl font-bold ${item?.color} mt-1`}>${item?.value?.toLocaleString()}</p>
              </div>
            ))}

            <button
              onClick={() => navigate('/unified-revenue-intelligence-dashboard')}
              className="w-full py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-2xl text-white font-medium text-sm transition-colors"
            >
              View Full AI Forecast
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedRevenueIntelligenceMobile;
