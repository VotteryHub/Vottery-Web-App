import React, { useState, useEffect } from 'react';
import { Trophy, Award, Target, TrendingUp, Star, Calendar, Medal, Crown, Flame, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gamificationService } from '../../services/gamificationService';

const GamificationProgressionAchievementHub = () => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('progression');
  const [gamificationData, setGamificationData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakStatus, setStreakStatus] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const [gamification, userBadges, badgeProgress, leaderboardData, streak] = await Promise.all([
        gamificationService?.getUserGamification(user?.id),
        gamificationService?.getUserBadges(user?.id),
        gamificationService?.getBadgeProgress(user?.id),
        gamificationService?.getLeaderboard(100),
        gamificationService?.getStreakStatus(user?.id)
      ]);

      setGamificationData(gamification);
      setBadges(badgeProgress || []);
      setLeaderboard(leaderboardData || []);
      setStreakStatus(streak);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'progression', label: 'Level Progression', icon: TrendingUp },
    { id: 'badges', label: 'Badges & Achievements', icon: Award },
    { id: 'challenges', label: 'Daily Challenges', icon: Target },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Achievement Hub</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your progression, unlock badges, and compete globally</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Current Level</span>
                <Star className="w-5 h-5 text-purple-200" />
              </div>
              <div className="text-3xl font-bold">{gamificationData?.level || 1}</div>
              <div className="text-purple-100 text-sm">{gamificationData?.current_xp || 0} XP</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Badges Earned</span>
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {badges?.filter(b => b?.earned)?.length || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">of {badges?.length || 0} total</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {streakStatus?.streak_count || 0}
              </div>
              <div className="text-orange-600 text-sm">days active</div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Global Rank</span>
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                #{leaderboard?.findIndex(u => u?.user_id === user?.id) + 1 || 'N/A'}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">of {leaderboard?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-gray-700' :'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab?.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'progression' && <ProgressionPanel gamificationData={gamificationData} />}
            {activeTab === 'badges' && <BadgesPanel badges={badges} />}
            {activeTab === 'challenges' && <ChallengesPanel streakStatus={streakStatus} />}
            {activeTab === 'leaderboards' && <LeaderboardsPanel leaderboard={leaderboard} currentUserId={user?.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Progression Panel Component
const ProgressionPanel = ({ gamificationData }) => {
  const currentLevel = gamificationData?.level || 1;
  const currentXP = gamificationData?.current_xp || 0;
  const xpForNextLevel = gamificationService?.calculateXPForNextLevel(currentLevel);
  const progress = (currentXP % xpForNextLevel) / xpForNextLevel * 100;

  const levelBenefits = [
    { level: 5, benefit: 'Gold Oracle - 1.5x VP multiplier', unlocked: currentLevel >= 5 },
    { level: 10, benefit: 'Elite Influencer - Custom themes', unlocked: currentLevel >= 10 },
    { level: 15, benefit: 'Master Voter - Priority feed boost', unlocked: currentLevel >= 15 },
    { level: 20, benefit: 'Legendary - Exclusive badges', unlocked: currentLevel >= 20 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Level Progression</h3>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Level</div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">Level {currentLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Level</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Level {currentLevel + 1}</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span>{currentXP % xpForNextLevel} XP</span>
              <span>{xpForNextLevel} XP needed</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            {Math.round(progress)}% to next level
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Level Benefits</h3>
        <div className="space-y-3">
          {levelBenefits?.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border-2 ${
                item?.unlocked
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    item?.unlocked ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {item?.unlocked ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Star className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Level {item?.level}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item?.benefit}</div>
                  </div>
                </div>
                {item?.unlocked && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    Unlocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Badges Panel Component
const BadgesPanel = ({ badges }) => {
  const categories = ['ADVERTISER_ADVOCATE', 'MARKET_RESEARCHER', 'BRAND_AMBASSADOR', 'ORACLE'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Badge Collection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges?.map((badge, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border-2 transition-all ${
                badge?.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-500' :'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl ${
                  badge?.earned ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  <Award className="w-8 h-8 text-white" />
                </div>
                {badge?.earned && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div className="font-bold text-gray-900 dark:text-white mb-1">{badge?.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{badge?.description}</div>
              
              {!badge?.earned && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{badge?.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${badge?.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {badge?.currentValue} / {badge?.requirement_value}
                  </div>
                </div>
              )}

              {badge?.earned && (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Earned on {new Date(badge?.earned_at)?.toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Challenges Panel Component
const ChallengesPanel = ({ streakStatus }) => {
  const dailyChallenges = [
    { id: 1, title: 'Vote in 3 elections', reward: 50, progress: 0, total: 3, completed: false },
    { id: 2, title: 'Complete 5 ad votes', reward: 75, progress: 0, total: 5, completed: false },
    { id: 3, title: 'Earn 100 VP', reward: 100, progress: 0, total: 100, completed: false },
  ];

  const weeklyChallenges = [
    { id: 1, title: 'Maintain 7-day streak', reward: 500, progress: streakStatus?.streak_count || 0, total: 7, completed: false },
    { id: 2, title: 'Vote in 20 elections', reward: 300, progress: 0, total: 20, completed: false },
    { id: 3, title: 'Earn 3 new badges', reward: 400, progress: 0, total: 3, completed: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daily Challenges</h3>
        <div className="space-y-3">
          {dailyChallenges?.map((challenge) => (
            <div key={challenge?.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{challenge?.title}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">+{challenge?.reward} VP</div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {challenge?.progress}/{challenge?.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(challenge?.progress / challenge?.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Challenges</h3>
        <div className="space-y-3">
          {weeklyChallenges?.map((challenge) => (
            <div key={challenge?.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{challenge?.title}</div>
                    <div className="text-sm text-green-600 dark:text-green-400">+{challenge?.reward} VP</div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {challenge?.progress}/{challenge?.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${(challenge?.progress / challenge?.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Leaderboards Panel Component
const LeaderboardsPanel = ({ leaderboard, currentUserId }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Global Leaderboard</h3>
        <div className="space-y-2">
          {leaderboard?.slice(0, 50)?.map((entry, index) => (
            <div
              key={entry?.user_id}
              className={`rounded-xl p-4 flex items-center justify-between ${
                entry?.user_id === currentUserId
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' :'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white': 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  {index === 0 ? <Crown className="w-6 h-6" /> :
                   index === 1 ? <Medal className="w-6 h-6" /> :
                   index === 2 ? <Medal className="w-6 h-6" /> :
                   `#${index + 1}`}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {entry?.user?.username || 'Anonymous User'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Level {entry?.level || 1}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-600 dark:text-purple-400">
                  {entry?.current_xp?.toLocaleString()} VP
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {entry?.streak_count || 0} day streak
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationProgressionAchievementHub;