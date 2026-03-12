import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { aiPerformanceOrchestrationService } from '../../../services/aiPerformanceOrchestrationService';

const PredictiveScalingPanel = ({ metrics }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await aiPerformanceOrchestrationService?.getPredictiveScalingRecommendations();
      setRecommendations(data?.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Predictive Scaling Recommendations
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              AI-powered resource optimization based on current performance metrics and predicted load patterns
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations?.map((rec, index) => {
              const color = getPriorityColor(rec?.priority);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 flex items-center justify-center flex-shrink-0`}>
                      <Icon name="Server" size={24} className={`text-${color}-600 dark:text-${color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {rec?.resource}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 dark:bg-${color}-900/40 text-${color}-700 dark:text-${color}-400 font-medium uppercase`}>
                          {rec?.priority}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Icon name="Zap" size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Action:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {rec?.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="AlertCircle" size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Reason:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {rec?.reason}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="TrendingUp" size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Impact:</span>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            {rec?.estimatedImpact}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                          Apply Recommendation
                        </button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scaling Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">87%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Current Load</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">+23%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Predicted Growth</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Next 7 days</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$2.4K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Est. Monthly Cost</div>
                </div>
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">-15% vs current</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictiveScalingPanel;
