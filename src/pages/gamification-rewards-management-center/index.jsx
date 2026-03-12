import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';
import { Trophy, Zap, Flame, Award, TrendingUp, Target, Star, Crown } from 'lucide-react';
import XPManagementPanel from './components/XPManagementPanel';
import StreakTrackingPanel from './components/StreakTrackingPanel';
import BadgeSystemPanel from './components/BadgeSystemPanel';
import LevelBenefitsPanel from './components/LevelBenefitsPanel';
import LeaderboardPanel from './components/LeaderboardPanel';
import Icon from '../../components/AppIcon';


const GamificationRewardsManagementCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [gamificationData, setGamificationData] = useState(null);
  const [xpBreakdown, setXpBreakdown] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const [gamification, breakdown, badges] = await Promise.all([
        gamificationService?.getUserGamification(user?.id),
        gamificationService?.getXPBreakdown(user?.id, 30),
        gamificationService?.getUserBadges(user?.id)
      ]);

      setGamificationData(gamification);
      setXpBreakdown(breakdown);
      setUserBadges(badges);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLevelProgress = () => {
    if (!gamificationData) return 0;
    const currentLevelXP = (gamificationData?.level - 1) * 100;
    const nextLevelXP = gamificationData?.level * 100;
    const progressXP = gamificationData?.current_xp - currentLevelXP;
    return (progressXP / 100) * 100;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'xp', label: 'XP Management', icon: Zap },
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'benefits', label: 'Level Benefits', icon: Crown },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gamification data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                Gamification & Rewards Center
              </h1>
              <p className="mt-2 text-purple-100">
                Track your XP, maintain streaks, and unlock exclusive rewards
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{gamificationData?.current_xp || 0}</div>
              <div className="text-sm text-purple-100">Total XP</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Level {gamificationData?.level || 1}</div>
                  <div className="text-sm text-purple-100">Current Level</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculateLevelProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-purple-100 mt-1">
                  {Math.round(calculateLevelProgress())}% to Level {(gamificationData?.level || 1) + 1}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-400/20 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gamificationData?.streak_count || 0}</div>
                  <div className="text-sm text-purple-100">Day Streak</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-400/20 rounded-lg">
                  <Award className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{userBadges?.length || 0}</div>
                  <div className="text-sm text-purple-100">Badges Earned</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-400/20 rounded-lg">
                  <Target className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gamificationData?.total_sponsored_votes || 0}</div>
                  <div className="text-sm text-purple-100">Sponsored Votes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                XP Breakdown (Last 30 Days)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{xpBreakdown?.sponsored || 0}</div>
                  <div className="text-sm text-gray-600">Sponsored Elections</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{xpBreakdown?.organic || 0}</div>
                  <div className="text-sm text-gray-600">Organic Elections</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{xpBreakdown?.streaks || 0}</div>
                  <div className="text-sm text-gray-600">Streak Bonuses</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{xpBreakdown?.badges || 0}</div>
                  <div className="text-sm text-gray-600">Badge Rewards</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Badges</h3>
                <div className="space-y-3">
                  {userBadges?.slice(0, 5)?.map((userBadge) => (
                    <div key={userBadge?.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={userBadge?.badge?.icon_url}
                        alt={userBadge?.badge?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{userBadge?.badge?.name}</div>
                        <div className="text-sm text-gray-500">
                          Earned {new Date(userBadge.earned_at)?.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-blue-600">+{userBadge?.badge?.xp_reward} XP</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Streaks</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-orange-500" />
                        <div>
                          <div className="font-medium text-gray-900">Daily Participation</div>
                          <div className="text-sm text-gray-600">Vote every day</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">
                        {gamificationData?.daily_streak || 0}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Target className="w-6 h-6 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900">Consecutive Votes</div>
                          <div className="text-sm text-gray-600">Vote without skipping</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {gamificationData?.consecutive_votes_streak || 0}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-green-500" />
                        <div>
                          <div className="font-medium text-gray-900">Advertiser Engagement</div>
                          <div className="text-sm text-gray-600">Sponsored election votes</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {gamificationData?.advertiser_engagement_streak || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'xp' && <XPManagementPanel userId={user?.id} />}
        {activeTab === 'streaks' && <StreakTrackingPanel userId={user?.id} gamificationData={gamificationData} />}
        {activeTab === 'badges' && <BadgeSystemPanel userId={user?.id} />}
        {activeTab === 'benefits' && <LevelBenefitsPanel level={gamificationData?.level || 1} />}
        {activeTab === 'leaderboard' && <LeaderboardPanel currentUserId={user?.id} />}
      </div>
    </div>
  );
};

export default GamificationRewardsManagementCenter;