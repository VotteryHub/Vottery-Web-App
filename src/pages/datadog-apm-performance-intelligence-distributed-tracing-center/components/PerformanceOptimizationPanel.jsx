import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOptimizationPanel = ({ bottlenecks, endpointMetrics }) => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Performance Optimization Tools
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comprehensive reporting for strategic infrastructure planning with automated optimization recommendations
        </p>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} />
          Top Optimization Opportunities
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Database Query Optimization</span>
              <span className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full font-semibold">
                HIGH IMPACT
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Add indexes on frequently queried columns to reduce query execution time by 40-60%
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Icon name="TrendingUp" size={12} />
              Estimated improvement: 50% faster queries
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Implement Redis Caching</span>
              <span className="text-xs px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded-full font-semibold">
                MEDIUM IMPACT
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Cache frequently accessed data to reduce database load and improve response times
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Icon name="TrendingUp" size={12} />
              Estimated improvement: 30-40% response time reduction
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">API Response Compression</span>
              <span className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
                LOW IMPACT
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Enable gzip compression for API responses to reduce bandwidth usage
            </p>
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <Icon name="TrendingUp" size={12} />
              Estimated improvement: 20% bandwidth reduction
            </div>
          </div>
        </div>
      </div>

      {/* Performance Regression Detection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" size={20} />
          Custom Alerting Rules
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Response time &gt; 2000ms</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Alert when P95 exceeds threshold</div>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Error rate &gt; 5%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Alert on high error rates</div>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Database connections &gt; 200</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Alert on connection pool exhaustion</div>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Automated Incident Response */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Automated Incident Response Workflows
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Auto-restart failing services</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Scale up on high load</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-400">Notify on-call engineer</span>
            <Icon name="Check" size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationPanel;