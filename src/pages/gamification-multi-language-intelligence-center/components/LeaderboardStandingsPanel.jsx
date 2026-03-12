import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { gamificationService } from '../../../services/gamificationService';

const LeaderboardStandingsPanel = ({ userId, detailed = false }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeRange, setTimeRange] = useState('all_time');
  const [category, setCategory] = useState('xp');
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeRange, category]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gamificationService?.getLeaderboard(100);
      setLeaderboard(data || []);
      
      // Find user's rank
      const userIndex = data?.findIndex(entry => entry?.user_id === userId);
      if (userIndex !== -1) {
        setUserRank({
          rank: userIndex + 1,
          ...data?.[userIndex]
        });
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: 'Crown', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    if (rank === 2) return { icon: 'Medal', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' };
    if (rank === 3) return { icon: 'Award', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { icon: 'User', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
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
      {/* Leaderboard Header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Leaderboard Standings
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all_time">All Time</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="xp">Total XP</option>
              <option value="streak">Longest Streak</option>
              <option value="badges">Most Badges</option>
              <option value="votes">Total Votes</option>
            </select>
          </div>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-primary rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-white rounded-lg">
                  <Icon name="User" size={24} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Your Current Rank</div>
                  <div className="text-2xl font-bold text-foreground">#{userRank?.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total XP</div>
                <div className="text-2xl font-bold text-primary">
                  {userRank?.current_xp?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {detailed && leaderboard?.length >= 3 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            {/* 2nd Place */}
            <div className="pt-8">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Icon name="Medal" size={32} className="text-gray-500" />
                </div>
                <div className="font-bold text-foreground mb-1">
                  {leaderboard?.[1]?.user?.name || 'User'}
                </div>
                <div className="text-2xl font-bold text-gray-500 mb-2">2nd</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboard?.[1]?.current_xp?.toLocaleString()} XP
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div>
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                  <Icon name="Crown" size={40} className="text-yellow-700 dark:text-yellow-200" />
                </div>
                <div className="font-bold text-foreground mb-1">
                  {leaderboard?.[0]?.user?.name || 'User'}
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">1st</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboard?.[0]?.current_xp?.toLocaleString()} XP
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="pt-8">
              <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 border-2 border-orange-300 dark:border-orange-700 rounded-lg text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-orange-300 dark:bg-orange-700 rounded-full flex items-center justify-center">
                  <Icon name="Award" size={32} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div className="font-bold text-foreground mb-1">
                  {leaderboard?.[2]?.user?.name || 'User'}
                </div>
                <div className="text-2xl font-bold text-orange-500 mb-2">3rd</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboard?.[2]?.current_xp?.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard?.slice(detailed ? 3 : 0, detailed ? 50 : 10)?.map((entry, index) => {
            const rank = detailed ? index + 4 : index + 1;
            const badge = getRankBadge(rank);
            const isCurrentUser = entry?.user_id === userId;

            return (
              <div
                key={entry?.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                  isCurrentUser
                    ? 'bg-primary/10 border-2 border-primary' :'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${badge?.bg} rounded-lg flex items-center justify-center`}>
                    {rank <= 3 ? (
                      <Icon name={badge?.icon} size={24} className={badge?.color} />
                    ) : (
                      <span className="text-lg font-bold text-foreground">#{rank}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {entry?.user?.name || 'Anonymous User'}
                      {isCurrentUser && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry?.level} • {entry?.streak_count} day streak
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">
                    {entry?.current_xp?.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </div>
            );
          })}
        </div>

        {detailed && (
          <div className="mt-6 text-center">
            <Button className="flex items-center gap-2 mx-auto">
              <Icon name="ChevronDown" size={18} />
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Competitive Rankings */}
      {detailed && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Trophy" size={20} className="text-yellow-500" />
              Competitive Rankings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 text-white rounded-lg">
                  <Icon name="Zap" size={24} />
                </div>
                <div>
                  <div className="font-bold text-foreground">XP Champions</div>
                  <div className="text-sm text-muted-foreground">Top XP earners</div>
                </div>
              </div>
              <div className="space-y-2">
                {leaderboard?.slice(0, 3)?.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-foreground">
                      {idx + 1}. {entry?.user?.name || 'User'}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {entry?.current_xp?.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500 text-white rounded-lg">
                  <Icon name="Flame" size={24} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Streak Masters</div>
                  <div className="text-sm text-muted-foreground">Longest streaks</div>
                </div>
              </div>
              <div className="space-y-2">
                {leaderboard
                  ?.sort((a, b) => (b?.streak_count || 0) - (a?.streak_count || 0))
                  ?.slice(0, 3)
                  ?.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-foreground">
                        {idx + 1}. {entry?.user?.name || 'User'}
                      </span>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        {entry?.streak_count} days
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardStandingsPanel;