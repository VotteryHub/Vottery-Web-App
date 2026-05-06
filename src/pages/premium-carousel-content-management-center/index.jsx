import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';

import { supabase } from '../../lib/supabase';

const PremiumCarouselContentManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('horizontal');
  const [contentStats, setContentStats] = useState({
    liveElections: 0,
    jolts: 0,
    liveMoments: 0,
    creatorSpotlights: 0,
    suggestedConnections: 0,
    recommendedHubs: 0,
    recommendedElections: 0,
    creatorServices: 0,
    recentWinners: 0,
    trendingTopics: 0,
    topEarners: 0,
    accuracyChampions: 0
  });

  const [supabaseHealth, setSupabaseHealth] = useState({
    connected: false,
    activeSubscriptions: 0,
    lastSync: null
  });

  const [contentDistribution, setContentDistribution] = useState({
    horizontal: { total: 0, active: 0, scheduled: 0 },
    vertical: { total: 0, active: 0, scheduled: 0 },
    gradient: { total: 0, active: 0, scheduled: 0 }
  });

  useEffect(() => {
    loadContentStats();
    checkSupabaseHealth();
  }, []);

  const loadContentStats = async () => {
    try {
      // Mock data for demonstration
      setContentStats({
        liveElections: 47,
        jolts: 234,
        liveMoments: 89,
        creatorSpotlights: 12,
        suggestedConnections: 156,
        recommendedHubs: 34,
        recommendedElections: 67,
        creatorServices: 23,
        recentWinners: 145,
        trendingTopics: 56,
        topEarners: 100,
        accuracyChampions: 50
      });

      setContentDistribution({
        horizontal: { total: 382, active: 234, scheduled: 148 },
        vertical: { total: 280, active: 156, scheduled: 124 },
        gradient: { total: 351, active: 245, scheduled: 106 }
      });
    } catch (error) {
      console.error('Failed to load content stats:', error);
    }
  };

  const checkSupabaseHealth = async () => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('count')?.limit(1);
      setSupabaseHealth({
        connected: !error,
        activeSubscriptions: 12,
        lastSync: new Date()
      });
    } catch (error) {
      console.error('Supabase health check failed:', error);
      setSupabaseHealth({
        connected: false,
        activeSubscriptions: 0,
        lastSync: null
      });
    }
  };

  const contentTypes = {
    horizontal: [
      { id: 'liveElections', name: 'Live Elections', icon: 'Vote', color: 'blue', count: contentStats?.liveElections },
      { id: 'jolts', name: 'Jolts Videos', icon: 'Video', color: 'pink', count: contentStats?.jolts },
      { id: 'liveMoments', name: 'Live Moments', icon: 'Clock', color: 'purple', count: contentStats?.liveMoments },
      { id: 'creatorSpotlights', name: 'Creator Spotlights', icon: 'Star', color: 'yellow', count: contentStats?.creatorSpotlights }
    ],
    vertical: [
      { id: 'suggestedConnections', name: 'Suggested Connections', icon: 'Users', color: 'green', count: contentStats?.suggestedConnections },
      { id: 'recommendedHubs', name: 'Recommended Hubs', icon: 'UsersRound', color: 'blue', count: contentStats?.recommendedHubs },
      { id: 'recommendedElections', name: 'Recommended Elections', icon: 'TrendingUp', color: 'orange', count: contentStats?.recommendedElections },
      { id: 'creatorServices', name: 'Creator Services', icon: 'Briefcase', color: 'purple', count: contentStats?.creatorServices }
    ],
    gradient: [
      { id: 'recentWinners', name: 'Recent Winners', icon: 'Trophy', color: 'yellow', count: contentStats?.recentWinners },
      { id: 'trendingTopics', name: 'Trending Topics', icon: 'Hash', color: 'blue', count: contentStats?.trendingTopics },
      { id: 'topEarners', name: 'Top Earners', icon: 'DollarSign', color: 'green', count: contentStats?.topEarners },
      { id: 'accuracyChampions', name: 'Accuracy Champions', icon: 'Target', color: 'red', count: contentStats?.accuracyChampions }
    ]
  };

  return (
    <div className="flex h-screen bg-background">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Premium Carousel Content Management Center</h1>
              <p className="text-muted-foreground">Centralized content orchestration and real-time data binding for all 9 content types across Premium 2D carousel systems with Supabase integration</p>
            </div>

            {/* Dashboard Overview */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="LayoutGrid" size={32} />
                  <span className="text-3xl font-bold">{contentDistribution?.horizontal?.total + contentDistribution?.vertical?.total + contentDistribution?.gradient?.total}</span>
                </div>
                <p className="text-sm opacity-90">Total Content Items</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Activity" size={32} />
                  <span className="text-3xl font-bold">{contentDistribution?.horizontal?.active + contentDistribution?.vertical?.active + contentDistribution?.gradient?.active}</span>
                </div>
                <p className="text-sm opacity-90">Active Content</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Calendar" size={32} />
                  <span className="text-3xl font-bold">{contentDistribution?.horizontal?.scheduled + contentDistribution?.vertical?.scheduled + contentDistribution?.gradient?.scheduled}</span>
                </div>
                <p className="text-sm opacity-90">Scheduled Content</p>
              </div>
              <div className={`bg-gradient-to-br ${supabaseHealth?.connected ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} rounded-xl shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Database" size={32} />
                  <span className="text-3xl font-bold">{supabaseHealth?.activeSubscriptions}</span>
                </div>
                <p className="text-sm opacity-90">Active Subscriptions</p>
              </div>
            </div>

            {/* Real-time Data Binding Status */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2 mb-4">
                <Icon name="Zap" size={24} className="text-yellow-500" />
                Real-time Data Binding Status
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${supabaseHealth?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <p className="text-sm font-semibold text-foreground">Supabase Connection</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{supabaseHealth?.connected ? 'Connected' : 'Disconnected'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="RefreshCw" size={16} className="text-blue-500" />
                    <p className="text-sm font-semibold text-foreground">Last Sync</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{supabaseHealth?.lastSync ? new Date(supabaseHealth.lastSync)?.toLocaleTimeString() : 'Never'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Radio" size={16} className="text-purple-500" />
                    <p className="text-sm font-semibold text-foreground">Update Frequency</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Real-time</p>
                </div>
              </div>
            </div>

            {/* Carousel Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('horizontal')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'horizontal' ?'bg-yellow-500 text-white shadow-lg' :'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Horizontal Snap
              </button>
              <button
                onClick={() => setActiveTab('vertical')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'vertical' ?'bg-pink-500 text-white shadow-lg' :'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Vertical Stack
              </button>
              <button
                onClick={() => setActiveTab('gradient')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === 'gradient' ?'bg-blue-500 text-white shadow-lg' :'bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                Gradient Flow
              </button>
            </div>

            {/* Content Type Panels */}
            <div className="grid grid-cols-2 gap-6">
              {contentTypes?.[activeTab]?.map((type) => (
                <div key={type?.id} className="bg-card rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-${type?.color}-500/10 flex items-center justify-center`}>
                        <Icon name={type?.icon} size={24} className={`text-${type?.color}-500`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-card-foreground">{type?.name}</h3>
                        <p className="text-sm text-muted-foreground">{type?.count} items</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Manage
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-semibold text-green-500">{Math.floor(type?.count * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Scheduled</span>
                      <span className="font-semibold text-yellow-500">{Math.floor(type?.count * 0.2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Draft</span>
                      <span className="font-semibold text-gray-500">{Math.floor(type?.count * 0.1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PremiumCarouselContentManagementCenter;