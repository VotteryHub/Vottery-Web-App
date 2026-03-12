import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceComparisonPanel = ({ metrics, history }) => {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="BarChart3" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No performance data available</p>
      </div>
    );
  }

  const calculateSpeedAdvantage = () => {
    const diff = metrics?.opus?.avgResponseTime - metrics?.sonnet?.avgResponseTime;
    const percentage = ((diff / metrics?.opus?.avgResponseTime) * 100)?.toFixed(1);
    return { diff, percentage };
  };

  const calculateCostSavings = () => {
    const diff = metrics?.opus?.avgCost - metrics?.sonnet?.avgCost;
    const percentage = ((diff / metrics?.opus?.avgCost) * 100)?.toFixed(1);
    return { diff: diff?.toFixed(6), percentage };
  };

  const speedAdvantage = calculateSpeedAdvantage();
  const costSavings = calculateCostSavings();

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed Advantage</div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {speedAdvantage?.percentage}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Sonnet is {speedAdvantage?.diff}ms faster on average
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost Savings</div>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {costSavings?.percentage}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Save ${costSavings?.diff} per query with Sonnet
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-white" />
            </div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Tests</div>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {metrics?.sonnet?.totalTests}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            A/B comparisons completed
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="GitCompare" size={20} />
            Side-by-Side Performance Metrics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sonnet Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={16} className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Claude 3.5 Sonnet</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {metrics?.sonnet?.avgResponseTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Cost per Query</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${metrics?.sonnet?.avgCost}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Tokens Used</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {metrics?.sonnet?.avgTokens}
                  </span>
                </div>
              </div>
            </div>

            {/* Opus Metrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="Brain" size={16} className="text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Claude 3 Opus</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {metrics?.opus?.avgResponseTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Cost per Query</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    ${metrics?.opus?.avgCost}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Tokens Used</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {metrics?.opus?.avgTokens}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Comparisons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="History" size={20} />
            Recent A/B Test Results
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {history?.slice(0, 5)?.map((test, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {test?.taskType?.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(test?.timestamp)?.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sonnet:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {test?.sonnetData?.responseTime}ms | ${test?.sonnetData?.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Opus:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {test?.opusData?.responseTime}ms | ${test?.opusData?.cost}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparisonPanel;