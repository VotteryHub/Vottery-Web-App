import React, { useState, useEffect } from 'react';
import { gamificationService } from '../../../services/gamificationService';
import { Flame, Clock, Shield, AlertCircle } from 'lucide-react';

const StreakTrackingPanel = ({ userId, gamificationData }) => {
  const [streakStatus, setStreakStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakStatus();
  }, [userId]);

  const loadStreakStatus = async () => {
    try {
      setLoading(true);
      const status = await gamificationService?.getStreakStatus(userId);
      setStreakStatus(status);
    } catch (error) {
      console.error('Error loading streak status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading streak data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Streak Status */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Current Streak Status</h2>
            <p className="text-orange-100">
              {streakStatus?.streakActive
                ? `Keep it going! ${Math.floor(streakStatus?.hoursRemaining)} hours remaining`
                : streakStatus?.gracePeriodActive
                ? 'Grace period active - vote now to save your streak!' :'Start a new streak by voting today'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold">{streakStatus?.streak_count || 0}</div>
            <div className="text-orange-100">Days</div>
          </div>
        </div>
      </div>
      {/* Daily Participation Counter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Daily Participation Counter
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(30)]?.map((_, i) => {
            const isActive = i < (streakStatus?.streak_count || 0);
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? 'bg-orange-500 text-white' :'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>🔥 Vote every day to maintain your streak</p>
          <p className="mt-1">💎 Earn bonus XP for consecutive days</p>
        </div>
      </div>
      {/* Weekly Engagement Goals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Engagement Goals</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Vote 7 days in a row</span>
              <span className="text-sm text-gray-600">{Math.min(streakStatus?.daily_streak || 0, 7)}/7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(Math.min((streakStatus?.daily_streak || 0) / 7) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Vote on 10 sponsored elections</span>
              <span className="text-sm text-gray-600">{Math.min(streakStatus?.total_sponsored_votes || 0, 10)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(Math.min((streakStatus?.total_sponsored_votes || 0) / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Maintain 30-day streak</span>
              <span className="text-sm text-gray-600">{Math.min(streakStatus?.streak_count || 0, 30)}/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(Math.min((streakStatus?.streak_count || 0) / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {/* Streak Preservation Mechanics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Streak Preservation
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Grace Period (24 hours)</div>
                <div className="text-sm text-gray-600 mt-1">
                  If you miss a day, you have 24 hours to vote and save your streak
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">Streak Freeze</div>
                  <div className="text-sm font-medium text-purple-600">
                    {streakStatus?.streak_freeze_used ? 'Used' : 'Available'}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  One-time protection to save your streak if you miss a day
                </div>
                {!streakStatus?.streak_freeze_used && (
                  <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Purchase Streak Freeze (500 XP)
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
              <div>
                <div className="font-semibold text-gray-900">Recovery Options</div>
                <div className="text-sm text-gray-600 mt-1">
                  Vote on 3 sponsored elections in one day to restore a broken streak
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Streak Milestones */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Streak Milestones</h3>
        <div className="space-y-3">
          {[
            { days: 7, reward: '100 XP', unlocked: (streakStatus?.streak_count || 0) >= 7 },
            { days: 14, reward: '250 XP', unlocked: (streakStatus?.streak_count || 0) >= 14 },
            { days: 30, reward: '500 XP + Badge', unlocked: (streakStatus?.streak_count || 0) >= 30 },
            { days: 60, reward: '1000 XP + Exclusive Badge', unlocked: (streakStatus?.streak_count || 0) >= 60 },
            { days: 100, reward: '2500 XP + Legendary Badge', unlocked: (streakStatus?.streak_count || 0) >= 100 }
          ]?.map((milestone) => (
            <div
              key={milestone?.days}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                milestone?.unlocked
                  ? 'bg-green-50 border-green-200' :'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{milestone?.unlocked ? '✅' : '🔒'}</div>
                <div>
                  <div className="font-semibold text-gray-900">{milestone?.days} Day Streak</div>
                  <div className="text-sm text-gray-600">Reward: {milestone?.reward}</div>
                </div>
              </div>
              {milestone?.unlocked && (
                <div className="text-sm font-medium text-green-600">Unlocked!</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakTrackingPanel;