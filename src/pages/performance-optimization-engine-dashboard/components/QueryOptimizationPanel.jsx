import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { performanceOptimizationService } from '../../../services/performanceOptimizationService';

const QueryOptimizationPanel = ({ data }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data: recs } = await performanceOptimizationService?.getQueryOptimizationRecommendations();
      setRecommendations(recs || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Query Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Database" size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Query Optimization Analysis
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Real-time database performance analysis with slow query identification and automated optimization recommendations
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.totalQueries || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Queries</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data?.slowQueries || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Slow Queries</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.avgResponseTime || 0}ms</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slowest Queries */}
      {data?.slowestQueries?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400" />
            Slowest Queries Detected
          </h3>
          <div className="space-y-3">
            {data?.slowestQueries?.map((query, index) => (
              <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{query?.endpoint}</span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">{query?.responseTime}ms</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Detected: {new Date(query?.timestamp)?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Recommendations */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="Lightbulb" size={20} />
            Optimization Recommendations
          </h3>
          {recommendations?.map((rec) => {
            const color = getPriorityColor(rec?.priority);
            return (
              <div key={rec?.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 flex items-center justify-center flex-shrink-0`}>
                    <Icon name="Database" size={24} className={`text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rec?.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 dark:bg-${color}-900/40 text-${color}-700 dark:text-${color}-400 font-medium uppercase`}>
                        {rec?.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec?.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="TrendingUp" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Impact:</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{rec?.estimatedImprovement}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {rec?.recommendations?.map((r, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <Icon name="CheckCircle2" size={16} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                        Implement Optimization
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Effort: {rec?.implementation?.effort} • {rec?.implementation?.timeframe}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueryOptimizationPanel;