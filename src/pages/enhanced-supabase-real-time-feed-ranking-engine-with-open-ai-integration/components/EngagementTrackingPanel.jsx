import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const EngagementTrackingPanel = ({ userId }) => {
  const [engagementData, setEngagementData] = useState({
    swipePatterns: [],
    dwellTimeAvg: 0,
    engagementDepth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadEngagementData();
    }
  }, [userId]);

  const loadEngagementData = async () => {
    try {
      setLoading(true);

      const { data: swipeData } = await supabase
        ?.from('swipe_history')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      const swipePatterns = analyzeSwipePatterns(swipeData || []);
      const dwellTimeAvg = swipeData?.reduce((sum, s) => sum + (s?.dwell_time || 0), 0) / swipeData?.length || 0;
      const engagementDepth = calculateEngagementDepth(swipeData || []);

      setEngagementData({
        swipePatterns,
        dwellTimeAvg,
        engagementDepth
      });
    } catch (error) {
      console.error('Error loading engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSwipePatterns = (swipeData) => {
    const patterns = {
      up: swipeData?.filter((s) => s?.swipe_direction === 'up')?.length || 0,
      right: swipeData?.filter((s) => s?.swipe_direction === 'right')?.length || 0,
      down: swipeData?.filter((s) => s?.swipe_direction === 'down')?.length || 0,
      left: swipeData?.filter((s) => s?.swipe_direction === 'left')?.length || 0
    };
    return patterns;
  };

  const calculateEngagementDepth = (swipeData) => {
    const deepEngagements = swipeData?.filter((s) => (s?.dwell_time || 0) > 5)?.length || 0;
    return (deepEngagements / swipeData?.length) * 100 || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Engagement Tracking & Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive user interaction monitoring with swipe pattern analysis and engagement depth measurement
        </p>
      </div>

      {/* Swipe Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="MousePointer" size={20} />
          Swipe Pattern Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <Icon name="ArrowUp" size={32} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {engagementData?.swipePatterns?.up || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Strong Like</div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <Icon name="ArrowRight" size={32} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {engagementData?.swipePatterns?.right || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Like</div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <Icon name="ArrowDown" size={32} className="mx-auto mb-2 text-orange-600 dark:text-orange-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {engagementData?.swipePatterns?.down || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dislike</div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <Icon name="ArrowLeft" size={32} className="mx-auto mb-2 text-red-600 dark:text-red-400" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {engagementData?.swipePatterns?.left || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Strong Dislike</div>
          </div>
        </div>
      </div>

      {/* Dwell Time Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Timer" size={20} />
          Dwell Time Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {engagementData?.dwellTimeAvg?.toFixed(1)}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Dwell Time</div>
            </div>
          </div>

          <div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {engagementData?.engagementDepth?.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Deep Engagement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Refinement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="RefreshCw" size={20} />
          Real-time Algorithm Refinement
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Swipe pattern learning
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Analyzing directional preferences</div>
              </div>
            </div>
            <Icon name="Activity" size={20} className="text-green-600 dark:text-green-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dwell time optimization
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Adjusting content relevance scores</div>
              </div>
            </div>
            <Icon name="Activity" size={20} className="text-blue-600 dark:text-blue-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-purple-600 dark:text-purple-400" />
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Engagement depth tracking
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Measuring content quality impact</div>
              </div>
            </div>
            <Icon name="Activity" size={20} className="text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementTrackingPanel;