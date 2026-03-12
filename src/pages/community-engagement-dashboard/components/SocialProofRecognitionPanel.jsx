import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const SocialProofRecognitionPanel = ({ timeRange, userId }) => {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    loadRecognitionData();
  }, [timeRange, userId]);

  const loadRecognitionData = async () => {
    setLoading(true);
    try {
      const [badgesData, achievementsData, contributorsData] = await Promise.all([
        feedbackService?.getUserBadges(userId),
        feedbackService?.getUserAchievements(userId, { timeRange }),
        feedbackService?.getTopContributors({ timeRange, limit: 10 })
      ]);

      if (badgesData?.data) {
        setBadges(badgesData?.data);
      }

      if (achievementsData?.data) {
        setAchievements(achievementsData?.data);
      }

      if (contributorsData?.data) {
        setTopContributors(contributorsData?.data);
      }
    } catch (error) {
      console.error('Error loading recognition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const badgeColors = {
    gold: 'from-yellow-400 to-yellow-600',
    silver: 'from-gray-300 to-gray-500',
    bronze: 'from-orange-400 to-orange-600',
    platinum: 'from-purple-400 to-purple-600'
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Award" className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Social Proof & Recognition
        </h2>
      </div>
      {/* Badge Collection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges?.map(badge => (
            <div
              key={badge?.id}
              className={`bg-gradient-to-br ${badgeColors?.[badge?.tier] || 'from-blue-400 to-blue-600'} rounded-lg p-4 text-white shadow-lg hover:scale-105 transition-transform`}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
                  <Icon name={badge?.icon || 'Award'} className="w-8 h-8 text-gray-800" />
                </div>
                <h4 className="font-bold mb-1">{badge?.name}</h4>
                <p className="text-xs opacity-90">{badge?.description}</p>
                <div className="mt-2 text-xs">
                  Earned: {new Date(badge?.earnedAt)?.toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {badges?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon name="Award" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No badges earned yet. Keep contributing to earn recognition!</p>
          </div>
        )}
      </div>
      {/* Recent Achievements */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {achievements?.map(achievement => (
            <div
              key={achievement?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white">
                  <Icon name={achievement?.icon || 'Star'} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {achievement?.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement?.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-500">
                    +{achievement?.points || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(achievement?.achievedAt)?.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {achievements?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Icon name="Star" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent achievements. Complete actions to unlock achievements!</p>
          </div>
        )}
      </div>
      {/* Top Contributors Hall of Fame */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Contributors Hall of Fame
        </h3>
        <div className="space-y-3">
          {topContributors?.map((contributor, index) => (
            <div
              key={contributor?.userId}
              className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${
                contributor?.userId === userId
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :'hover:shadow-md'
              } transition-shadow`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                      : index === 2
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600' :'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}
                >
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {contributor?.username || 'Anonymous'}
                    </h4>
                    {contributor?.userId === userId && (
                      <span className="text-xs text-blue-500">(You)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Icon name="MessageSquare" className="w-4 h-4" />
                      {contributor?.totalContributions || 0} contributions
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Award" className="w-4 h-4" />
                      {contributor?.badgesEarned || 0} badges
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-500">
                    {contributor?.totalPoints || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofRecognitionPanel;