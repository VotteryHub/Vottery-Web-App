import React from 'react';
import Icon from '../../../components/AppIcon';

const CostEfficiencyPanel = ({ metrics, history }) => {
  if (!metrics) return null;

  const calculateMonthlyProjection = (avgCost, queriesPerDay = 1000) => {
    return (avgCost * queriesPerDay * 30)?.toFixed(2);
  };

  const sonnetMonthly = calculateMonthlyProjection(metrics?.sonnet?.avgCost);
  const opusMonthly = calculateMonthlyProjection(metrics?.opus?.avgCost);
  const monthlySavings = (opusMonthly - sonnetMonthly)?.toFixed(2);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="DollarSign" size={20} />
          Cost Efficiency Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Savings</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              ${monthlySavings}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Using Sonnet @ 1,000 queries/day
            </div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sonnet Monthly Cost</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              ${sonnetMonthly}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              ${metrics?.sonnet?.avgCost} per query
            </div>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Opus Monthly Cost</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              ${opusMonthly}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              ${metrics?.opus?.avgCost} per query
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <Icon name="TrendingDown" size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Cost Optimization:</strong> Sonnet offers {((1 - (metrics?.sonnet?.avgCost / metrics?.opus?.avgCost)) * 100)?.toFixed(0)}% cost savings per query while maintaining high accuracy. Ideal for high-volume operations.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          ROI Calculator
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Daily Query Volume</div>
              <input
                type="number"
                defaultValue="1000"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Projection Period (days)</div>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Savings with Sonnet</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">${monthlySavings}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Token Usage Comparison
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Claude 3.5 Sonnet</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
                <span className="text-xs text-gray-600 dark:text-gray-400">Avg Tokens</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{metrics?.sonnet?.avgTokens}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/10 rounded">
                <span className="text-xs text-gray-600 dark:text-gray-400">Cost per 1K tokens</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">$0.003</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Claude 3 Opus</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/10 rounded">
                <span className="text-xs text-gray-600 dark:text-gray-400">Avg Tokens</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{metrics?.opus?.avgTokens}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/10 rounded">
                <span className="text-xs text-gray-600 dark:text-gray-400">Cost per 1K tokens</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">$0.015</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEfficiencyPanel;