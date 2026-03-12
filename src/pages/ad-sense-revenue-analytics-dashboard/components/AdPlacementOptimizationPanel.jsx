import React from 'react';
import { Target, TrendingUp, MapPin, Zap } from 'lucide-react';

const AdPlacementOptimizationPanel = ({ data }) => {
  const heatmapData = [
    { zone: 'Admin Dashboard Header', engagement: 92, revenue: 2847.52, optimization: 'excellent' },
    { zone: 'Creator Analytics Sidebar', engagement: 88, revenue: 1847.52, optimization: 'excellent' },
    { zone: 'Admin Control Footer', engagement: 78, revenue: 1547.52, optimization: 'good' },
    { zone: 'Revenue Analytics Panel', engagement: 75, revenue: 1247.52, optimization: 'good' },
    { zone: 'Creator Earnings Dashboard', engagement: 68, revenue: 1357.44, optimization: 'moderate' },
  ];

  const getOptimizationColor = (level) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'good':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Strategic Ad Placement Performance
          </h2>
        </div>

        <div className="space-y-4">
          {heatmapData?.map((zone, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {zone?.zone}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getOptimizationColor(
                    zone?.optimization
                  )}`}
                >
                  {zone?.optimization?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Engagement Score
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {zone?.engagement}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Revenue Generated
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${zone?.revenue?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Impressions
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {data?.placements?.[index]?.impressions?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${zone?.engagement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-3">
            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Placement Optimization Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Admin Dashboard Header and Creator Analytics Sidebar show excellent performance with 90%+ engagement correlation. Consider A/B testing additional placements in high-traffic creator pages.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">5 active placements</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">82% avg engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPlacementOptimizationPanel;