import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { performanceOptimizationService } from '../../../services/performanceOptimizationService';

const OptimizationRecommendationsPanel = () => {
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAllRecommendations();
  }, []);

  const loadAllRecommendations = async () => {
    setLoading(true);
    try {
      const [queryRecs, cacheRecs, infraRecs] = await Promise.all([
        performanceOptimizationService?.getQueryOptimizationRecommendations(),
        performanceOptimizationService?.getCachingStrategyRecommendations(),
        performanceOptimizationService?.getInfrastructureScalingRecommendations()
      ]);

      const combined = [
        ...(queryRecs?.data || []),
        ...(cacheRecs?.data || []),
        ...(infraRecs?.data || [])
      ];

      setAllRecommendations(combined);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? allRecommendations 
    : allRecommendations?.filter(r => r?.category === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={24} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">All Optimization Recommendations</h3>
            <p className="text-gray-700 dark:text-gray-300">Comprehensive automated recommendations across query optimization, caching, and infrastructure</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'Query Optimization', 'Caching Strategy', 'Infrastructure Scaling']?.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations?.map((rec) => {
            const color = getPriorityColor(rec?.priority);
            return (
              <div key={rec?.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 flex items-center justify-center flex-shrink-0`}>
                    <Icon name="Lightbulb" size={24} className={`text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rec?.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 dark:bg-${color}-900/40 text-${color}-700 dark:text-${color}-400 font-medium uppercase`}>
                        {rec?.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {rec?.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec?.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Impact</div>
                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">{rec?.estimatedImprovement}</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Implementation</div>
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {rec?.implementation?.effort} • {rec?.implementation?.timeframe}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Action Items:</h5>
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
                        Implement Now
                      </button>
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                        Schedule Later
                      </button>
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

export default OptimizationRecommendationsPanel;