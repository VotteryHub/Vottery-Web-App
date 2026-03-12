import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { platformGamificationService } from '../../../services/platformGamificationService';

const SeasonalChallengePanel = ({ userId }) => {
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, [userId]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const result = await platformGamificationService?.getCampaigns({ status: 'active' });
      if (result?.success) {
        setChallenges(result?.data || []);
        // Simulate user progress
        const progress = {};
        result?.data?.forEach(challenge => {
          progress[challenge?.id] = {
            completed: Math.floor(Math.random() * 100),
            total: 100,
            rank: Math.floor(Math.random() * 1000) + 1
          };
        });
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChallengeStatus = (challenge) => {
    const now = new Date();
    const startDate = new Date(challenge?.startDate);
    const endDate = new Date(challenge?.endDate);

    if (now < startDate) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    if (now > endDate) return { label: 'Ended', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
    return { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
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
      {/* Active Challenges Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Target" size={20} className="text-orange-500" />
            Seasonal Challenges
          </h3>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
              {challenges?.length} Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {challenges?.map((challenge) => {
            const status = getChallengeStatus(challenge);
            const progress = userProgress?.[challenge?.id] || { completed: 0, total: 100, rank: 0 };
            const progressPercentage = (progress?.completed / progress?.total) * 100;

            return (
              <div
                key={challenge?.id}
                className="p-5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedChallenge(challenge)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="font-bold text-lg text-foreground mb-1">
                      {challenge?.campaignName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {challenge?.description}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                    {status?.label}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-semibold text-foreground">
                      {progress?.completed} / {progress?.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-primary">
                      {challenge?.totalPrizePool?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Prize Pool</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-foreground">
                      {challenge?.participantCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      #{progress?.rank}
                    </div>
                    <div className="text-xs text-muted-foreground">Your Rank</div>
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center justify-between pt-4 border-t border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>{getTimeRemaining(challenge?.endDate)}</span>
                  </div>
                  <Button size="sm" className="flex items-center gap-2">
                    <Icon name="Play" size={14} />
                    Participate
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Events */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Users" size={20} className="text-purple-500" />
            Community Events
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Weekend Voting Marathon',
              description: 'Vote in 50 elections this weekend for bonus XP',
              participants: 2847,
              reward: '5000 XP',
              icon: 'Zap',
              color: 'yellow'
            },
            {
              title: 'Prediction Master Challenge',
              description: 'Correctly predict 10 election outcomes',
              participants: 1523,
              reward: 'Legendary Badge',
              icon: 'Award',
              color: 'purple'
            },
            {
              title: 'Social Butterfly',
              description: 'Invite 5 friends and earn rewards',
              participants: 3421,
              reward: '2500 XP',
              icon: 'UserPlus',
              color: 'blue'
            }
          ]?.map((event, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-${event?.color}-100 dark:bg-${event?.color}-900/30 rounded-lg`}>
                  <Icon name={event?.icon} size={24} className={`text-${event?.color}-600 dark:text-${event?.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-foreground mb-1">{event?.title}</div>
                  <div className="text-sm text-muted-foreground mb-3">{event?.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Users" size={14} />
                        <span>{event?.participants?.toLocaleString()} joined</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                        <Icon name="Gift" size={14} />
                        <span>{event?.reward}</span>
                      </div>
                    </div>
                    <Button size="sm">Join Event</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Achievements */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Trophy" size={20} className="text-green-500" />
            Collaborative Achievements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <Icon name="Target" size={24} />
              </div>
              <div>
                <div className="font-bold text-foreground">Platform Milestone</div>
                <div className="text-sm text-muted-foreground">Reach 1M total votes</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">847,392 / 1,000,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full"
                  style={{ width: '84.7%' }}
                />
              </div>
              <div className="text-xs text-muted-foreground">152,608 votes remaining</div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Icon name="Users" size={24} />
              </div>
              <div>
                <div className="font-bold text-foreground">Community Goal</div>
                <div className="text-sm text-muted-foreground">100K active users</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">67,234 / 100,000</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: '67.2%' }}
                />
              </div>
              <div className="text-xs text-muted-foreground">32,766 users remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Automated Progression Tracking */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-blue-500" />
            Automated Progression Tracking
          </h3>
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Icon name="CheckCircle" size={16} />
            <span>Real-time Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Icon name="TrendingUp" size={24} className="text-blue-600 dark:text-blue-400" />
              <div className="text-2xl font-bold text-foreground">87%</div>
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Completion Rate</div>
            <div className="text-xs text-muted-foreground">Across all challenges</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Icon name="Award" size={24} className="text-purple-600 dark:text-purple-400" />
              <div className="text-2xl font-bold text-foreground">12</div>
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Rewards Earned</div>
            <div className="text-xs text-muted-foreground">This season</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Icon name="Zap" size={24} className="text-green-600 dark:text-green-400" />
              <div className="text-2xl font-bold text-foreground">45K</div>
            </div>
            <div className="text-sm font-medium text-foreground mb-1">Total XP Earned</div>
            <div className="text-xs text-muted-foreground">From challenges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalChallengePanel;