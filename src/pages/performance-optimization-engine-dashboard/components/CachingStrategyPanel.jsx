import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { performanceOptimizationService } from '../../../services/performanceOptimizationService';

const CachingStrategyPanel = ({ data }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data: recs } = await performanceOptimizationService?.getCachingStrategyRecommendations();
      setRecommendations(recs || []);
    } catch (error) {
      console.error('Error loading caching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Caching Strategy Analysis</h3>
            <p className="text-gray-700 dark:text-gray-300">Intelligent caching recommendations based on access patterns with performance impact projections</p>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{data?.hitRate || 0}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Hit Rate</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data?.memoryUtilization || 0}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Memory Usage</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.avgHitLatency || 0}ms</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Hit Latency</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data?.avgMissLatency || 0}ms</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Miss Latency</div>
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
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <Icon name="Zap" size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rec?.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-medium uppercase">{rec?.priority}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec?.description}</p>
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

export default CachingStrategyPanel;