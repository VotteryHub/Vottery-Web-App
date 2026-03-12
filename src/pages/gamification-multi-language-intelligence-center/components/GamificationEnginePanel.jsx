import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { gamificationService } from '../../../services/gamificationService';
import { platformGamificationService } from '../../../services/platformGamificationService';

const GamificationEnginePanel = ({ userId }) => {
  const [xpLog, setXpLog] = useState([]);
  const [badges, setBadges] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    loadGamificationData();
  }, [userId]);

  const loadGamificationData = async () => {
    try {
      setLoading(true);
      const [xpData, badgeData, campaignData] = await Promise.all([
        gamificationService?.getXPLog(userId, 20),
        gamificationService?.getBadgeProgress(userId),
        platformGamificationService?.getCampaigns({ status: 'active' })
      ]);

      setXpLog(xpData || []);
      setBadges(badgeData || []);
      setCampaigns(campaignData?.data || []);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipBadge = async (badgeId) => {
    try {
      await gamificationService?.equipBadge(userId, badgeId);
      await loadGamificationData();
    } catch (error) {
      console.error('Error equipping badge:', error);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'epic': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'rare': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* XP Point Allocation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-yellow-500" />
            XP Point Allocation
          </h3>
          <Button size="sm" className="flex items-center gap-2">
            <Icon name="Download" size={16} />
            Export History
          </Button>
        </div>

        <div className="space-y-3">
          {xpLog?.slice(0, 10)?.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Award" size={18} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {log?.actionType?.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log?.timestamp)?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{log?.xpGained} XP
                </div>
                {log?.multiplier > 1 && (
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    {log?.multiplier}x multiplier
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badge Creation */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Award" size={20} className="text-purple-500" />
            NFT Achievement Badges
          </h3>
          <Button size="sm" className="flex items-center gap-2">
            <Icon name="Plus" size={16} />
            Create Badge
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges?.map((badge) => (
            <div
              key={badge?.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                badge?.earned
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
              }`}
              onClick={() => setSelectedBadge(badge)}
            >
              {badge?.earned && (
                <div className="absolute top-2 right-2">
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-lg ${getRarityColor(badge?.rarityLevel)}`}>
                  <Icon name="Award" size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{badge?.name}</div>
                  <div className={`text-xs font-medium ${getRarityColor(badge?.rarityLevel)}`}>
                    {badge?.rarityLevel?.toUpperCase()}
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
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${badge?.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {badge?.earned && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleEquipBadge(badge?.id);
                  }}
                  className="w-full mt-2"
                >
                  {badge?.isEquipped ? 'Equipped' : 'Equip Badge'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seasonal Challenge Orchestration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Target" size={20} className="text-orange-500" />
            Seasonal Challenges
          </h3>
          <Button size="sm" className="flex items-center gap-2">
            <Icon name="Plus" size={16} />
            Create Challenge
          </Button>
        </div>

        <div className="space-y-4">
          {campaigns?.map((campaign) => (
            <div key={campaign?.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-foreground mb-1">
                    {campaign?.campaignName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {campaign?.description}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign?.status === 'active' ?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {campaign?.status?.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {campaign?.totalPrizePool?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Prize Pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {campaign?.participantCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {campaign?.winnersCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Winners</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Automated Distribution</span>
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationEnginePanel;