import React from 'react';
import Icon from '../../../components/AppIcon';

const AIPoweredInsightsPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Critical Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          AI-Powered Critical Insights
        </h3>
        <div className="space-y-3">
          {data?.insights?.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <Icon name="Sparkles" size={18} className="text-primary mt-1" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-yellow-500" />
          Strategic Recommendations
        </h3>
        <div className="space-y-3">
          {data?.recommendations?.map((rec, idx) => (
            <div key={idx} className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="ArrowRight" size={18} className="text-yellow-600 dark:text-yellow-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-red-500" />
          Risk Assessment
        </h3>
        <div className="space-y-3">
          {data?.risks?.map((risk, idx) => (
            <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={18} className="text-red-600 dark:text-red-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{risk}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="CheckSquare" size={20} className="text-green-500" />
          Priority Action Items
        </h3>
        <div className="space-y-3">
          {data?.actionItems?.map((item, idx) => (
            <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Check" size={18} className="text-green-600 dark:text-green-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-blue-500" />
          Growth Opportunities
        </h3>
        <div className="space-y-3">
          {data?.opportunities?.map((opp, idx) => (
            <div key={idx} className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Target" size={18} className="text-blue-600 dark:text-blue-400 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{opp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPoweredInsightsPanel;