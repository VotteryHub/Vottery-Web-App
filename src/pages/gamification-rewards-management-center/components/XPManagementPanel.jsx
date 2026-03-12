import React, { useState, useEffect } from 'react';
import { gamificationService } from '../../../services/gamificationService';
import { TrendingUp, Calendar, Award } from 'lucide-react';

const XPManagementPanel = ({ userId }) => {
  const [xpLog, setXpLog] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadXPData();
  }, [userId]);

  const loadXPData = async () => {
    try {
      setLoading(true);
      const [log, breakdown30] = await Promise.all([
        gamificationService?.getXPLog(userId, 50),
        gamificationService?.getXPBreakdown(userId, 30)
      ]);
      setXpLog(log);
      setBreakdown(breakdown30);
    } catch (error) {
      console.error('Error loading XP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'VOTE_AD':
        return '🎯';
      case 'VOTE_ORGANIC':
        return '🗳️';
      case 'STREAK_BONUS':
        return '🔥';
      case 'BADGE_EARNED':
        return '🏆';
      case 'LEVEL_UP':
        return '⬆️';
      default:
        return '✨';
    }
  };

  const getActionLabel = (actionType) => {
    return actionType?.replace(/_/g, ' ')?.toLowerCase()?.replace(/\b\w/g, l => l?.toUpperCase());
  };

  if (loading) {
    return <div className="text-center py-8">Loading XP data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* XP Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          XP Earning Breakdown (Last 30 Days)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{breakdown?.sponsored || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Sponsored Elections</div>
            <div className="text-xs text-gray-500 mt-1">2x XP Multiplier</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{breakdown?.organic || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Organic Elections</div>
            <div className="text-xs text-gray-500 mt-1">Base XP</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{breakdown?.streaks || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Streak Bonuses</div>
            <div className="text-xs text-gray-500 mt-1">Daily rewards</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{breakdown?.badges || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Badge Rewards</div>
            <div className="text-xs text-gray-500 mt-1">Achievements</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{breakdown?.total || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Total XP Earned</div>
            <div className="text-xs text-gray-500 mt-1">All sources</div>
          </div>
        </div>
      </div>
      {/* Level-Based Rewards */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Level-Based Reward Unlocks
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div>
              <div className="font-semibold text-gray-900">Increased CPE Rates</div>
              <div className="text-sm text-gray-600">Higher earnings per sponsored vote</div>
            </div>
            <div className="text-sm font-medium text-yellow-600">Level 5+</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div>
              <div className="font-semibold text-gray-900">Priority Campaign Access</div>
              <div className="text-sm text-gray-600">Early access to high-value elections</div>
            </div>
            <div className="text-sm font-medium text-blue-600">Level 10+</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div>
              <div className="font-semibold text-gray-900">Exclusive Advertiser Partnerships</div>
              <div className="text-sm text-gray-600">Premium brand collaborations</div>
            </div>
            <div className="text-sm font-medium text-purple-600">Level 20+</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div>
              <div className="font-semibold text-gray-900">Enhanced Reward Multipliers</div>
              <div className="text-sm text-gray-600">Up to 3x XP on sponsored elections</div>
            </div>
            <div className="text-sm font-medium text-green-600">Level 50+</div>
          </div>
        </div>
      </div>
      {/* XP Activity Log */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Recent XP Activity
        </h2>
        <div className="space-y-2">
          {xpLog?.map((log) => (
            <div key={log?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getActionIcon(log?.action_type)}</div>
                <div>
                  <div className="font-medium text-gray-900">{getActionLabel(log?.action_type)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.timestamp)?.toLocaleString()}
                    {log?.multiplier > 1 && (
                      <span className="ml-2 text-blue-600 font-medium">{log?.multiplier}x multiplier</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">+{log?.xp_gained}</div>
                <div className="text-xs text-gray-500">XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default XPManagementPanel;