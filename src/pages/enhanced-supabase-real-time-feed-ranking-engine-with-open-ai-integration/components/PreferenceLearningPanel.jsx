import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const PreferenceLearningPanel = ({ userId, feedRankings }) => {
  const [learningMetrics, setLearningMetrics] = useState({
    totalInteractions: 0,
    positiveEngagements: 0,
    learningRate: 0,
    confidenceScore: 0
  });
  const [behaviorPatterns, setBehaviorPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadLearningMetrics();
    }
  }, [userId]);

  const loadLearningMetrics = async () => {
    try {
      setLoading(true);

      // Get swipe history for behavior analysis
      const { data: swipeData } = await supabase
        ?.from('swipe_history')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      const totalInteractions = swipeData?.length || 0;
      const positiveEngagements = swipeData?.filter(
        (s) => s?.swipe_direction === 'right' || s?.swipe_direction === 'up'
      )?.length || 0;

      const learningRate = totalInteractions > 0 ? (positiveEngagements / totalInteractions) * 100 : 0;
      const confidenceScore = Math.min(100, (totalInteractions / 50) * 100);

      setLearningMetrics({
        totalInteractions,
        positiveEngagements,
        learningRate,
        confidenceScore
      });

      // Analyze behavior patterns
      const patterns = analyzeBehaviorPatterns(swipeData || []);
      setBehaviorPatterns(patterns);
    } catch (error) {
      console.error('Error loading learning metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeBehaviorPatterns = (swipeData) => {
    const patterns = [];

    // Time-based patterns
    const hourCounts = {};
    swipeData?.forEach((swipe) => {
      const hour = new Date(swipe?.created_at)?.getHours();
      hourCounts[hour] = (hourCounts?.[hour] || 0) + 1;
    });

    const peakHour = Object.keys(hourCounts)?.reduce((a, b) =>
      hourCounts?.[a] > hourCounts?.[b] ? a : b
    , '0');

    patterns?.push({
      type: 'Peak Activity Time',
      value: `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`,
      icon: 'Clock',
      color: 'text-blue-600 dark:text-blue-400'
    });

    // Engagement pattern
    const avgDwellTime = swipeData?.reduce((sum, s) => sum + (s?.dwell_time || 0), 0) / swipeData?.length || 0;
    patterns?.push({
      type: 'Avg Dwell Time',
      value: `${avgDwellTime?.toFixed(1)}s`,
      icon: 'Timer',
      color: 'text-green-600 dark:text-green-400'
    });

    // Preference strength
    const strongPreferences = swipeData?.filter((s) => s?.swipe_direction === 'up')?.length || 0;
    patterns?.push({
      type: 'Strong Preferences',
      value: `${strongPreferences} items`,
      icon: 'Heart',
      color: 'text-red-600 dark:text-red-400'
    });

    return patterns;
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
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Brain" size={20} />
          Preference Learning Engine
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time user behavior analysis with engagement pattern recognition and adaptive algorithm optimization
        </p>
      </div>

      {/* Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={24} className="text-blue-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {learningMetrics?.totalInteractions}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Interactions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="ThumbsUp" size={24} className="text-green-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {learningMetrics?.positiveEngagements}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Positive Engagements</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="text-purple-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {learningMetrics?.learningRate?.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Learning Rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Target" size={24} className="text-orange-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {learningMetrics?.confidenceScore?.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</p>
        </div>
      </div>

      {/* Behavior Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Engagement Pattern Recognition
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {behaviorPatterns?.map((pattern, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name={pattern?.icon} size={20} className={pattern?.color} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pattern?.type}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pattern?.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Optimization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Adaptive Algorithm Optimization
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Continuous learning loop active
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Real-time algorithm refinement
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
              ENABLED
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Check" size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Swipe pattern analysis
              </span>
            </div>
            <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-full font-semibold">
              RUNNING
            </span>
          </div>
        </div>
      </div>

      {/* Recommendation Effectiveness */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Award" size={20} />
          Recommendation Effectiveness Tracking
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy Score</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {learningMetrics?.learningRate?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                style={{ width: `${learningMetrics?.learningRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Model Confidence</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {learningMetrics?.confidenceScore?.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${learningMetrics?.confidenceScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceLearningPanel;