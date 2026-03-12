import React from 'react';
import Icon from '../../../components/AppIcon';

const SuccessMetricsPanel = ({ history }) => {
  const calculateMetrics = () => {
    const completed = history?.filter(h => h?.status === 'completed') || [];
    const totalApprovals = history?.length || 0;
    const successRate = totalApprovals > 0 ? ((completed?.length / totalApprovals) * 100)?.toFixed(1) : 0;

    const avgExpectedImpact = completed?.length > 0
      ? (completed?.reduce((sum, h) => sum + (h?.expectedImpact || 0), 0) / completed?.length)?.toFixed(1)
      : 0;

    const avgActualImpact = completed?.filter(h => h?.actualImpact)?.length > 0
      ? (completed?.filter(h => h?.actualImpact)?.reduce((sum, h) => sum + (h?.actualImpact || 0), 0) /
          completed?.filter(h => h?.actualImpact)?.length)?.toFixed(1)
      : 0;

    const avgConfidence = totalApprovals > 0
      ? (history?.reduce((sum, h) => sum + (h?.confidenceScore || 0), 0) / totalApprovals)?.toFixed(1)
      : 0;

    return {
      totalApprovals,
      successRate,
      avgExpectedImpact,
      avgActualImpact,
      avgConfidence,
      completed: completed?.length
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Approvals</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics?.totalApprovals}</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {metrics?.completed} completed successfully
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics?.successRate}%</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Recommendations completed vs approved
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics?.avgConfidence}%</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Average AI confidence score
          </div>
        </div>
      </div>

      {/* Impact Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Impact Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Expected Impact</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">+{metrics?.avgExpectedImpact}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">average</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Actual Impact</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">+{metrics?.avgActualImpact}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">average</div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <Icon name="Info" size={14} className="inline mr-1" />
            Actual impact data available for {history?.filter(h => h?.actualImpact)?.length} recommendations
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="PieChart" size={20} />
          Category Breakdown
        </h3>
        <div className="space-y-3">
          {['campaign', 'moderation', 'engagement', 'revenue', 'performance']?.map(category => {
            const count = history?.filter(h => h?.recommendationData?.category === category)?.length || 0;
            const percentage = history?.length > 0 ? ((count / history?.length) * 100)?.toFixed(0) : 0;
            return (
              <div key={category} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} approvals</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuccessMetricsPanel;