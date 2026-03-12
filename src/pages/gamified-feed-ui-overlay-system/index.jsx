import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Gamepad2, Target, Trophy, Flame, Zap, TrendingUp } from 'lucide-react';
import FeedQuestProgressBar from './components/FeedQuestProgressBar';
import InFeedMiniGame from './components/InFeedMiniGame';
import FeedAchievementPopup from './components/FeedAchievementPopup';
import FeedStreakTracker from './components/FeedStreakTracker';
import AnimatedVPReward from './components/AnimatedVPReward';
import { platformGamificationService } from '../../services/platformGamificationService';

const GamifiedFeedUIOverlaySystem = () => {
  const [activeQuests, setActiveQuests] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [streakData, setStreakData] = useState(null);
  const [vpRewards, setVpRewards] = useState([]);
  const [gamificationIntensity, setGamificationIntensity] = useState('medium');
  const [loading, setLoading] = useState(true);

  const mockQuests = [
    {
      id: 'daily-voter',
      title: 'Daily Voter',
      description: 'Vote in 3 elections today',
      progress: 2,
      target: 3,
      vpReward: 50,
      type: 'daily'
    },
    {
      id: 'engagement-master',
      title: 'Engagement Master',
      description: 'React to 10 posts this week',
      progress: 7,
      target: 10,
      vpReward: 100,
      type: 'weekly'
    }
  ];

  const mockStreak = {
    currentStreak: 7,
    longestStreak: 15,
    multiplier: 2.0,
    nextMilestone: 10
  };

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const [quests, achievements, streak] = await Promise.all([
        platformGamificationService?.getActiveQuests(),
        platformGamificationService?.getRecentAchievements(),
        platformGamificationService?.getStreakData()
      ]);
      setActiveQuests(quests || mockQuests);
      setRecentAchievements(achievements || []);
      setStreakData(streak || mockStreak);
    } catch (error) {
      console.error('Error loading gamification data:', error);
      setActiveQuests(mockQuests);
      setStreakData(mockStreak);
    } finally {
      setLoading(false);
    }
  };

  const handleVPEarned = (amount, source) => {
    const newReward = {
      id: Date.now(),
      amount,
      source,
      timestamp: Date.now()
    };
    setVpRewards(prev => [...prev, newReward]);
    setTimeout(() => {
      setVpRewards(prev => prev?.filter(r => r?.id !== newReward?.id));
    }, 3000);
  };

  const handleAchievementUnlocked = (achievement) => {
    setRecentAchievements(prev => [achievement, ...prev]?.slice(0, 5));
  };

  const intensityOptions = [
    { value: 'low', label: 'Minimal', description: 'Essential overlays only' },
    { value: 'medium', label: 'Balanced', description: 'Recommended experience' },
    { value: 'high', label: 'Maximum', description: 'Full gamification' },
    { value: 'off', label: 'Disabled', description: 'No overlays' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Gamified Feed UI Overlay System - Vottery</title>
        <meta name="description" content="Experience the gamified social feed with quest progress tracking, mini-games, achievements, and VP reward animations" />
      </Helmet>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-blue-600" />
                Gamified Feed UI Overlay System
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Transform your feed experience with interactive gamification elements
              </p>
            </div>
          </div>

          {/* Gamification Intensity Controls */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Gamification Intensity
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {intensityOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => setGamificationIntensity(option?.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    gamificationIntensity === option?.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{option?.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{option?.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gamificationIntensity === 'off' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Gamification overlays are disabled</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Select an intensity level above to enable</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Feed Quest Progress Bars */}
            {(gamificationIntensity === 'medium' || gamificationIntensity === 'high') && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Feed Quests</h2>
                </div>
                <div className="space-y-4">
                  {activeQuests?.map((quest) => (
                    <FeedQuestProgressBar
                      key={quest?.id}
                      quest={quest}
                      onComplete={() => handleVPEarned(quest?.vpReward, 'Quest Completed')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Feed Streak Tracker */}
            {streakData && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Engagement Streak</h2>
                </div>
                <FeedStreakTracker streakData={streakData} />
              </div>
            )}

            {/* In-Feed Mini-Games */}
            {gamificationIntensity === 'high' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Mini-Games</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InFeedMiniGame
                    type="poll"
                    question="Which election type do you prefer?"
                    options={['Plurality', 'Ranked Choice', 'Approval', 'Plus/Minus']}
                    vpReward={10}
                    correctAnswer=""
                    onComplete={(answer) => handleVPEarned(10, 'Poll Completed')}
                  />
                  <InFeedMiniGame
                    type="quiz"
                    question="What does VP stand for?"
                    options={['Voting Points', 'Vottery Points', 'Victory Points', 'Value Points']}
                    correctAnswer="Vottery Points"
                    vpReward={20}
                    onComplete={(correct) => handleVPEarned(correct ? 20 : 5, 'Quiz Completed')}
                  />
                </div>
              </div>
            )}

            {/* Recent Achievements */}
            {recentAchievements?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Achievements</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentAchievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
                    >
                      <div className="text-3xl mb-2">{achievement?.icon || '🏆'}</div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{achievement?.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{achievement?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Active Quests</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{activeQuests?.length}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Current Streak</span>
                </div>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">{streakData?.currentStreak || 0} days</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-300">VP Multiplier</span>
                </div>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{streakData?.multiplier || 1}x</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">Achievements</span>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">{recentAchievements?.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Floating VP Reward Animations */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {vpRewards?.map((reward) => (
          <AnimatedVPReward
            key={reward?.id}
            amount={reward?.amount}
            source={reward?.source}
          />
        ))}
      </div>
      {/* Achievement Popup Overlay */}
      {recentAchievements?.length > 0 && gamificationIntensity !== 'off' && (
        <FeedAchievementPopup
          achievement={recentAchievements?.[0]}
          onClose={() => setRecentAchievements(prev => prev?.slice(1))}
        />
      )}
    </div>
  );
};

export default GamifiedFeedUIOverlaySystem;