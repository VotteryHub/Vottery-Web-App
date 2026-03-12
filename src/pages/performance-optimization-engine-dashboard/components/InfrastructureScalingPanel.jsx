import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { performanceOptimizationService } from '../../../services/performanceOptimizationService';

const InfrastructureScalingPanel = ({ data }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data: recs } = await performanceOptimizationService?.getInfrastructureScalingRecommendations();
      setRecommendations(recs || []);
    } catch (error) {
      console.error('Error loading infrastructure recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Server" size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Infrastructure Scaling Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">Automated scaling triggers and resource allocation optimization with cost-efficiency recommendations</p>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data?.cpuUtilization || 0}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">CPU Usage</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.memoryUtilization || 0}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Memory Usage</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data?.requestsPerSecond || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Req/sec</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.activeConnections || 0}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Connections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations?.map((rec) => (
            <div key={rec?.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Icon name="Server" size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rec?.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 font-medium uppercase">{rec?.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec?.description}</p>
                  {rec?.costImpact && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-center gap-2">
                        <Icon name="DollarSign" size={16} className="text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Cost Impact: {rec?.costImpact}</span>
                      </div>
                    </div>
                  )}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfrastructureScalingPanel;