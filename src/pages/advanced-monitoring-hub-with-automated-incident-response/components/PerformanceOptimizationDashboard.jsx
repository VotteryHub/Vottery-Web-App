import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceOptimizationDashboard = ({ recommendations, metrics }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return 'Zap';
      case 'resource': return 'Cpu';
      case 'database': return 'Database';
      case 'network': return 'Wifi';
      default: return 'Settings';
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metrics?.avgResponseTime}ms</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon name="Clock" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Throughput</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metrics?.throughput}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">req/min</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{(metrics?.errorRate * 100)?.toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{metrics?.activeConnections}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Icon name="Users" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Optimization Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ML-Powered Optimization Recommendations
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Machine learning-powered insights for continuous performance improvement
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recommendations?.map((rec) => (
            <div key={rec?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Icon name={getCategoryIcon(rec?.category)} size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec?.priority)}`}>
                          {rec?.priority?.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {rec?.category?.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {rec?.screen}
                      </h4>
                    </div>
                  </div>
                  <div className="ml-12 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue Detected:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rec?.issue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendation:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rec?.recommendation}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" size={16} className="text-green-500" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {rec?.estimatedImpact}
                        </span>
                      </div>
                      {rec?.automatable && (
                        <div className="flex items-center gap-2">
                          <Icon name="Zap" size={16} className="text-blue-500" />
                          <span className="text-sm text-blue-600 dark:text-blue-400">Auto-implementable</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {rec?.automatable ? (
                    <Button size="sm" className="flex items-center gap-2">
                      <Icon name="Zap" size={16} />
                      Auto-Apply
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Icon name="FileText" size={16} />
                      View Guide
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Icon name="X" size={16} />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Capacity Planning */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Capacity Planning & Resource Allocation
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">67%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Optimal range: 60-80%</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">82%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Consider scaling up</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database Connections</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthy capacity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOptimizationDashboard;