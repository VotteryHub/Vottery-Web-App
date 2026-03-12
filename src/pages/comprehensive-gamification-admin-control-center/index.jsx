import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Target, Award, TrendingUp, Gift, Users, BarChart3, Settings, Power, AlertCircle, CheckCircle2, Coins, Sparkles } from 'lucide-react';

import FeatureToggleMatrix from './components/FeatureToggleMatrix';
import VPEconomyManagement from './components/VPEconomyManagement';
import ChallengeConfiguration from './components/ChallengeConfiguration';
import LeaderboardAdministration from './components/LeaderboardAdministration';
import PredictionPoolsManagement from './components/PredictionPoolsManagement';
import RedemptionShopManagement from './components/RedemptionShopManagement';
import GamificationAnalytics from './components/GamificationAnalytics';

const ComprehensiveGamificationAdminControlCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState({
    vpSystem: 'operational',
    challenges: 'operational',
    leaderboards: 'operational',
    predictions: 'operational',
    redemptions: 'operational'
  });
  const [stats, setStats] = useState({
    totalVPCirculation: 15750000,
    activeUsers: 45230,
    activeChallenges: 28,
    totalRedemptions: 8420,
    avgEngagementRate: 78.5
  });

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: BarChart3 },
    { id: 'features', label: 'Feature Toggles', icon: Power },
    { id: 'vp-economy', label: 'VP Economy', icon: Coins },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboards', label: 'Leaderboards', icon: TrendingUp },
    { id: 'predictions', label: 'Prediction Pools', icon: Sparkles },
    { id: 'redemptions', label: 'Redemption Shop', icon: Gift },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return CheckCircle2;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Comprehensive Gamification Admin Control Center
              </h1>
              <p className="mt-2 text-purple-100">
                Centralized management of all gamification features with granular on/off switches
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">System Status</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <Coins className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.totalVPCirculation / 1000000)?.toFixed(1)}M</div>
                  <div className="text-sm text-purple-100">VP Circulation</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-400/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.activeUsers / 1000)?.toFixed(1)}K</div>
                  <div className="text-sm text-purple-100">Active Users</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-400/20 rounded-lg">
                  <Target className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.activeChallenges}</div>
                  <div className="text-sm text-purple-100">Active Challenges</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-400/20 rounded-lg">
                  <Gift className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{(stats?.totalRedemptions / 1000)?.toFixed(1)}K</div>
                  <div className="text-sm text-purple-100">Redemptions</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-400/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.avgEngagementRate}%</div>
                  <div className="text-sm text-purple-100">Engagement Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => {
              const TabIcon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Gamification System Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(systemHealth)?.map(([key, status]) => {
                  const StatusIcon = getStatusIcon(status);
                  return (
                    <div key={key} className={`p-4 rounded-lg ${getStatusColor(status)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className="w-5 h-5" />
                        <span className="font-semibold capitalize">{key?.replace(/([A-Z])/g, ' $1')?.trim()}</span>
                      </div>
                      <div className="text-sm capitalize">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">VP Economy</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Manage VP earning rates, spending mechanics, and economic balance
                </p>
                <button
                  onClick={() => setActiveTab('vp-economy')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage VP Economy
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Challenges</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Create and manage daily/weekly challenges and quests
                </p>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Configure Challenges
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Redemption Shop</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Manage VP redemption items and reward catalog
                </p>
                <button
                  onClick={() => setActiveTab('redemptions')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Manage Shop Items
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Gamification Activity</h2>
              <div className="space-y-3">
                {[
                  { action: 'New challenge created', detail: '"Vote in 5 Elections" - 100 VP reward', time: '5 minutes ago', icon: Target, color: 'text-green-600' },
                  { action: 'VP redemption processed', detail: 'User redeemed Ad-Free Hour (50 VP)', time: '12 minutes ago', icon: Gift, color: 'text-purple-600' },
                  { action: 'Leaderboard updated', detail: 'Weekly VP rankings refreshed', time: '1 hour ago', icon: TrendingUp, color: 'text-blue-600' },
                  { action: 'Badge awarded', detail: '"Streak Master" badge earned by 15 users', time: '2 hours ago', icon: Award, color: 'text-yellow-600' },
                  { action: 'Prediction pool resolved', detail: 'Election #4521 predictions scored', time: '3 hours ago', icon: Sparkles, color: 'text-indigo-600' }
                ]?.map((activity, index) => {
                  const ActivityIcon = activity?.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 bg-white rounded-lg ${activity?.color}`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{activity?.action}</div>
                        <div className="text-sm text-gray-600">{activity?.detail}</div>
                      </div>
                      <div className="text-sm text-gray-500">{activity?.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && <FeatureToggleMatrix />}
        {activeTab === 'vp-economy' && <VPEconomyManagement />}
        {activeTab === 'challenges' && <ChallengeConfiguration />}
        {activeTab === 'leaderboards' && <LeaderboardAdministration />}
        {activeTab === 'predictions' && <PredictionPoolsManagement />}
        {activeTab === 'redemptions' && <RedemptionShopManagement />}
        {activeTab === 'analytics' && <GamificationAnalytics />}
      </div>
    </div>
  );
};

export default ComprehensiveGamificationAdminControlCenter;