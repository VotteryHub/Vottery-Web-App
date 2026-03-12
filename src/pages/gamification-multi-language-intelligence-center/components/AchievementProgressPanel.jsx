import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { gamificationService } from '../../../services/gamificationService';

const AchievementProgressPanel = ({ userId, detailed = false }) => {
  const [badges, setBadges] = useState([]);
  const [xpBreakdown, setXpBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const [badgeData, xpData] = await Promise.all([
        gamificationService?.getBadgeProgress(userId),
        gamificationService?.getXPBreakdown(userId, 30)
      ]);

      setBadges(badgeData || []);
      setXpBreakdown(xpData);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-400' };
      case 'epic': return { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-400' };
      case 'rare': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-400' };
      default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-400' };
    }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges?.filter(b => b?.rarityLevel === selectedCategory);

  const earnedCount = badges?.filter(b => b?.earned)?.length;
  const totalCount = badges?.length;
  const completionPercentage = (earnedCount / totalCount) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Award" size={20} className="text-purple-500" />
            Achievement Progress
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Badges</option>
              <option value="legendary">Legendary</option>
              <option value="epic">Epic</option>
              <option value="rare">Rare</option>
              <option value="common">Common</option>
            </select>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-muted-foreground">Overall Completion</div>
              <div className="text-2xl font-bold text-foreground">
                {earnedCount} / {totalCount} Badges
              </div>
            </div>
            <div className="text-4xl font-bold text-primary">
              {completionPercentage?.toFixed(0)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBadges?.map((badge) => {
            const colors = getRarityColor(badge?.rarityLevel);
            return (
              <div
                key={badge?.id}
                className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                  badge?.earned
                    ? `${colors?.border} ${colors?.bg}`
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                }`}
              >
                {badge?.earned && (
                  <div className="absolute top-2 right-2">
                    <div className="p-1 bg-green-500 rounded-full">
                      <Icon name="Check" size={16} className="text-white" />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-lg ${colors?.bg}`}>
                    <Icon name="Award" size={24} className={colors?.text} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{badge?.name}</div>
                    <div className={`text-xs font-medium uppercase ${colors?.text}`}>
                      {badge?.rarityLevel}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {badge?.description}
                </p>

                {!badge?.earned && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{badge?.currentValue} / {badge?.requirementValue}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${colors?.bg}`}
                        style={{ width: `${badge?.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {badge?.earned && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Earned</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {new Date(badge?.earnedAt)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* XP Breakdown */}
      {detailed && xpBreakdown && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Zap" size={20} className="text-yellow-500" />
              XP Breakdown (Last 30 Days)
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Vote" size={18} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-foreground">Organic</span>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {xpBreakdown?.organic?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">XP</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Star" size={18} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-foreground">Sponsored</span>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {xpBreakdown?.sponsored?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">XP</div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Flame" size={18} className="text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-foreground">Streaks</span>
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {xpBreakdown?.streaks?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">XP</div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Award" size={18} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-foreground">Badges</span>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {xpBreakdown?.badges?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">XP</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total XP Earned</div>
                <div className="text-3xl font-bold text-foreground">
                  {xpBreakdown?.total?.toLocaleString()}
                </div>
              </div>
              <Icon name="TrendingUp" size={48} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Sharing */}
      {detailed && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Share2" size={20} className="text-blue-500" />
              Share Your Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Trophy" size={32} className="text-yellow-500" />
                <div>
                  <div className="font-bold text-foreground">Share on Social Media</div>
                  <div className="text-sm text-muted-foreground">Show off your badges</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 flex items-center justify-center gap-2">
                  <Icon name="Twitter" size={16} />
                  Twitter
                </Button>
                <Button size="sm" className="flex-1 flex items-center justify-center gap-2">
                  <Icon name="Facebook" size={16} />
                  Facebook
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Download" size={32} className="text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-bold text-foreground">Download Badge</div>
                  <div className="text-sm text-muted-foreground">Save as NFT</div>
                </div>
              </div>
              <Button size="sm" className="w-full flex items-center justify-center gap-2">
                <Icon name="Download" size={16} />
                Download as NFT
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementProgressPanel;