import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { gamificationService } from '../../services/gamificationService';
import { openAIQuestService } from '../../services/openAIQuestService';

import { useAuth } from '../../contexts/AuthContext';
import VPBalanceWidget from './components/VPBalanceWidget';
import ActiveChallengesPanel from './components/ActiveChallengesPanel';
import LeaderboardSummary from './components/LeaderboardSummary';
import AchievementProgress from './components/AchievementProgress';
import QuickActionsGrid from './components/QuickActionsGrid';

const UnifiedGamificationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vpData, setVpData] = useState({ balance: 0, level: 1 });
  const [gamification, setGamification] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [xpLog, setXpLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    const loadAll = async () => {
      setLoading(true);
      try {
        const [vpResult, gamResult, leaderboardResult, badgesResult, xpResult] = await Promise.allSettled([
          gamificationService?.getVPBalance(user?.id),
          gamificationService?.getUserGamification(user?.id),
          gamificationService?.getLeaderboard(100),
          gamificationService?.getUserBadges(user?.id),
          gamificationService?.getXPLog(user?.id, 20)
        ]);

        if (vpResult?.status === 'fulfilled') setVpData(vpResult?.value);
        if (gamResult?.status === 'fulfilled') setGamification(gamResult?.value);
        if (leaderboardResult?.status === 'fulfilled') {
          const lb = leaderboardResult?.value || [];
          setLeaderboard(lb);
          const rank = lb?.findIndex(e => e?.user_id === user?.id);
          setUserRank(rank >= 0 ? rank + 1 : null);
        }
        if (badgesResult?.status === 'fulfilled') setBadges(badgesResult?.value || []);
        if (xpResult?.status === 'fulfilled') setXpLog(xpResult?.value || []);

        // Load active quests
        try {
          const questData = await openAIQuestService?.getActiveQuests?.(user?.id);
          setChallenges(questData || []);
        } catch { setChallenges([]); }
      } catch (err) {
        console.error('Failed to load gamification data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [user?.id]);

  const nextLevelXP = gamificationService?.calculateXPForNextLevel(vpData?.level);
  const currentLevelXP = vpData?.balance % 100;
  const progressPercent = Math.min(100, (currentLevelXP / nextLevelXP) * 100);

  if (!user) {
    return (
      <GeneralPageLayout title="Gamification Dashboard">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sign in to view your gamification dashboard</h2>
            <button onClick={() => navigate('/authentication-portal')} className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Gamification Dashboard">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-400 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gamification Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your complete gamification overview • Real-time sync</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your gamification data...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Row: VP Balance + Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <VPBalanceWidget
                vpData={vpData}
                gamification={gamification}
                progressPercent={progressPercent}
                currentLevelXP={currentLevelXP}
                nextLevelXP={nextLevelXP}
              />
              {/* Active Challenges Count */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{challenges?.length || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active Challenges</p>
                  </div>
                </div>
                <button onClick={() => navigate('/dynamic-quest-management-dashboard')} className="text-xs text-orange-600 dark:text-orange-400 hover:underline">View all →</button>
              </div>
              {/* Leaderboard Rank */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{userRank ? `#${userRank}` : '—'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Leaderboard Rank</p>
                  </div>
                </div>
                <button onClick={() => navigate('/gamification-progression-achievement-hub')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View leaderboard →</button>
              </div>
              {/* Badges Earned */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏅</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{badges?.length || 0}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Badges Earned</p>
                  </div>
                </div>
                <button onClick={() => navigate('/user-profile-hub')} className="text-xs text-green-600 dark:text-green-400 hover:underline">View badges →</button>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Challenges + Achievement */}
              <div className="lg:col-span-2 space-y-6">
                <ActiveChallengesPanel challenges={challenges} navigate={navigate} />
                <AchievementProgress badges={badges} xpLog={xpLog} gamification={gamification} />
              </div>
              {/* Right: Leaderboard + Quick Actions */}
              <div className="space-y-6">
                <LeaderboardSummary leaderboard={leaderboard} userId={user?.id} userRank={userRank} navigate={navigate} />
                <QuickActionsGrid navigate={navigate} />
              </div>
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default UnifiedGamificationDashboard;
