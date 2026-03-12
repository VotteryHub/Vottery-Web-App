import React, { useState, useEffect } from 'react';
import { gamificationService } from '../../../services/gamificationService';
import { Star, Lock, Check } from 'lucide-react';

const BadgeSystemPanel = ({ userId }) => {
  const [badgeProgress, setBadgeProgress] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadgeProgress();
  }, [userId]);

  const loadBadgeProgress = async () => {
    try {
      setLoading(true);
      const progress = await gamificationService?.getBadgeProgress(userId);
      setBadgeProgress(progress);
    } catch (error) {
      console.error('Error loading badge progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'ADVERTISER_ADVOCATE', 'MARKET_RESEARCHER', 'BRAND_AMBASSADOR', 'ORACLE'];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'COMMON':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'RARE':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'EPIC':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'LEGENDARY':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredBadges = selectedCategory === 'ALL'
    ? badgeProgress
    : badgeProgress?.filter(b => b?.category === selectedCategory);

  if (loading) {
    return <div className="text-center py-8">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category?.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges?.map((badge) => (
          <div
            key={badge?.id}
            className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
              badge?.earned
                ? 'border-green-300 shadow-green-100'
                : 'border-gray-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <img
                src={badge?.icon_url}
                alt={badge?.name}
                className={`w-16 h-16 rounded-full ${
                  badge?.earned ? '' : 'grayscale opacity-50'
                }`}
              />
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getRarityColor(badge?.rarity_level)}`}>
                  {badge?.rarity_level}
                </span>
                {badge?.earned && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Earned</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{badge?.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{badge?.description}</p>

            {/* Progress Bar */}
            {!badge?.earned && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-blue-600">{badge?.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${badge?.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {badge?.currentValue} / {badge?.requirement_value} {badge?.requirement_type?.toLowerCase()?.replace(/_/g, ' ')}
                </div>
              </div>
            )}

            {/* Reward */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Reward</span>
              <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                <Star className="w-4 h-4" />
                +{badge?.xp_reward} XP
              </span>
            </div>

            {/* Unlock Requirements */}
            {!badge?.earned && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Unlock requirement:</span> {badge?.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Achievement Sharing */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">Share Your Achievements</h3>
        <p className="text-blue-100 mb-4">
          Show off your badges and inspire others to participate in sponsored elections
        </p>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Share on Social Media
        </button>
      </div>
    </div>
  );
};

export default BadgeSystemPanel;