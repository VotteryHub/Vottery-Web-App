import React from 'react';
import Icon from '../../../components/AppIcon';

const AdvancedAnalyticsPanel = ({ userId }) => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Advanced Analytics & Optimization
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive analytics for continuous optimization with A/B testing and predictive engagement modeling
        </p>
      </div>

      {/* Multi-Modal Content Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Grid" size={20} />
          Multi-Modal Content Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icon name="FileText" size={24} className="text-blue-600 dark:text-blue-400 mb-3" />
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Text Analysis</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Semantic embedding and NLP processing
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icon name="Image" size={24} className="text-green-600 dark:text-green-400 mb-3" />
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Visual Analysis</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Image content and quality assessment
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Icon name="Users" size={24} className="text-purple-600 dark:text-purple-400 mb-3" />
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Social Signals</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Engagement and virality metrics
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Domain Preference Transfer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Share2" size={20} />
          Cross-Domain Preference Transfer
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Vote" size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Elections → Posts</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Transfer voting preferences to social content</div>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Posts → Elections</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Apply social preferences to election recommendations</div>
              </div>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Predictive Engagement Modeling */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Predictive Engagement Modeling
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Predicted Engagement Rate</span>
              <span className="text-2xl font-bold text-primary">78%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '78%' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Swipe Likelihood</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">85%</div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Deep Engagement</div>
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">62%</div>
            </div>
          </div>
        </div>
      </div>

      {/* A/B Testing for Algorithm Improvements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          A/B Testing for Algorithm Improvements
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Test: Semantic Weight Increase</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Variant A: 30% | Variant B: 40%</div>
              </div>
              <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
                Running
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400">Variant A</div>
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">72%</div>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                <div className="text-xs text-gray-600 dark:text-gray-400">Variant B</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">81%</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Test: Freshness Decay Rate</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Winner: 18-hour decay (12% improvement)</div>
              </div>
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsPanel;