import React, { useState, useEffect } from 'react';
import { gamificationService } from '../../../services/gamificationService';
import { Trophy, TrendingUp, Crown } from 'lucide-react';

const LeaderboardPanel = ({ currentUserId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all-time');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gamificationService?.getLeaderboard(100);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeframe('all-time')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              timeframe === 'all-time' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              timeframe === 'monthly' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              timeframe === 'weekly' ?'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
        </div>
      </div>
      {/* Top 3 Podium */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Top Performers
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {leaderboard?.slice(0, 3)?.map((user, index) => (
            <div
              key={user?.id}
              className={`bg-white rounded-lg p-4 text-center ${
                index === 0 ? 'transform scale-105' : ''
              }`}
            >
              <div className="text-4xl mb-2">{getRankIcon(index + 1)}</div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="font-bold text-gray-900 truncate">{user?.user?.username || 'Anonymous'}</div>
              <div className="text-sm text-gray-600 mt-1">Level {user?.level}</div>
              <div className="text-lg font-bold text-blue-600 mt-2">{user?.current_xp} XP</div>
              <div className="text-xs text-gray-500 mt-1">{user?.total_sponsored_votes} sponsored votes</div>
            </div>
          ))}
        </div>
      </div>
      {/* Full Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Global Rankings
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboard?.map((user, index) => {
            const isCurrentUser = user?.user_id === currentUserId;
            return (
              <div
                key={user?.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold ${getRankColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-900">{user?.user?.username || 'Anonymous'}</div>
                    {isCurrentUser && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Level {user?.level} • {user?.total_sponsored_votes} sponsored votes
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{user?.current_xp}</div>
                  <div className="text-xs text-gray-500">XP</div>
                </div>
                {user?.streak_count > 0 && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <span className="text-lg">🔥</span>
                    <span className="font-medium">{user?.streak_count}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Competitive Engagement Info */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Crown className="w-5 h-5" />
          Compete for Rewards
        </h3>
        <p className="text-green-100 mb-4">
          Top 10 users each month receive exclusive badges, bonus XP, and priority access to premium campaigns
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">🥇</div>
            <div className="text-sm mt-1">5000 XP</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">🥈</div>
            <div className="text-sm mt-1">3000 XP</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">🥉</div>
            <div className="text-sm mt-1">2000 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPanel;