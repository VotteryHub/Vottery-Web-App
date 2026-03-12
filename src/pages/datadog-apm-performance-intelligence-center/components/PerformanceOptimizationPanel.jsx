import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOptimizationPanel = ({ bottlenecks, endpointMetrics }) => {
  const allRecommendations = bottlenecks?.flatMap(b => b?.recommendations || []) || [];
  const priorityRecommendations = allRecommendations?.filter(r => r?.priority === 'critical' || r?.priority === 'high');

  const optimizationCategories = [
    {
      category: 'Caching',
      icon: 'Zap',
      color: 'blue',
      recommendations: allRecommendations?.filter(r => r?.type === 'caching')
    },
    {
      category: 'Database',
      icon: 'Database',
      color: 'green',
      recommendations: allRecommendations?.filter(r => r?.type === 'database')
    },
    {
      category: 'Code Optimization',
      icon: 'Code',
      color: 'purple',
      recommendations: allRecommendations?.filter(r => r?.type === 'optimization')
    },
    {
      category: 'Reliability',
      icon: 'Shield',
      color: 'orange',
      recommendations: allRecommendations?.filter(r => r?.type === 'reliability')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Priority Recommendations */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} />
          High Priority Optimizations
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {priorityRecommendations?.length} critical and high priority optimizations identified
        </p>
        <div className="space-y-3">
          {priorityRecommendations?.slice(0, 5)?.map((rec, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 uppercase">
                  {rec?.priority}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 uppercase">{rec?.type}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{rec?.description}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                <Icon name="TrendingUp" size={12} className="inline mr-1" />
                {rec?.estimatedImprovement}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optimizationCategories?.map((cat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${cat?.color}-50 dark:bg-${cat?.color}-900/20 flex items-center justify-center`}>
                <Icon name={cat?.icon} size={20} className={`text-${cat?.color}-600 dark:text-${cat?.color}-400`} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cat?.category}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {cat?.recommendations?.length} recommendations
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {cat?.recommendations?.slice(0, 3)?.map((rec, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">{rec?.description}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {rec?.estimatedImprovement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Regression Detection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingDown" size={20} />
          Performance Regression Detection
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Continuous performance monitoring</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Automated baseline comparison</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Deployment impact analysis</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Integration with Deployment Pipelines */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Integration with Deployment Pipelines
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pre-deployment performance checks</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Automated rollback on degradation</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Performance SLA monitoring</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Continuous Application Performance Enhancement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="RefreshCw" size={20} />
          Continuous Performance Enhancement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-primary mb-1">200+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Endpoints Monitored</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Real-Time Monitoring</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">AI</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Powered Analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationPanel;