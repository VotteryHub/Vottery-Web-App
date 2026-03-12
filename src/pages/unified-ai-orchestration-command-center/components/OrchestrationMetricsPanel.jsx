import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { aiOrchestrationService } from '../../../services/aiOrchestrationService';

const OrchestrationMetricsPanel = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await aiOrchestrationService?.getOrchestrationMetrics();
      if (error) throw error;
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Activity" size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Executions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{metrics?.totalExecutions || 0}</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{metrics?.successRate || 0}%</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" size={20} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Execution Time</span>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{metrics?.averageExecutionTime || 0}s</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency Gain</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">87%</div>
        </div>
      </div>

      {/* Execution Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="PieChart" size={20} />
          Execution Status Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(metrics?.byStatus || {})?.map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{status?.replace('_', ' ')}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    status === 'completed' ? 'bg-green-600' : status === 'in_progress' ? 'bg-blue-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${(count / metrics?.totalExecutions) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          AI Orchestration Performance
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Decision Accuracy</span>
              <span className="text-sm font-bold text-primary">94%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Consensus Rate</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">82%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Approval Rate</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">76%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationMetricsPanel;