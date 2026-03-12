import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { crossDomainIntelligenceService } from '../../../services/crossDomainIntelligenceService';

const PredictiveIntelligencePanel = ({ intelligence }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = async () => {
    if (!intelligence) return;
    setLoading(true);
    try {
      const result = await crossDomainIntelligenceService?.generateStrategicRecommendations(intelligence);
      setRecommendations(result);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Strategic Recommendations</h3>
          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Generating...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={16} />
                Generate Recommendations
              </>
            )}
          </button>
        </div>

        {recommendations ? (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {recommendations?.recommendations}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Target" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click Generate to get strategic recommendations from consolidated intelligence
            </p>
          </div>
        )}
      </div>

      {/* Actionable Intelligence */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Actionable Intelligence</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Optimization Opportunity',
              description: 'Reallocate fraud detection resources to Zone 3 based on threat convergence',
              priority: 'high',
              impact: 'High',
            },
            {
              title: 'Risk Mitigation',
              description: 'Implement enhanced verification for transactions over $500 in identified risk zones',
              priority: 'high',
              impact: 'Medium',
            },
            {
              title: 'Performance Enhancement',
              description: 'Optimize AI model weights based on 96% combined accuracy in recent incidents',
              priority: 'medium',
              impact: 'High',
            },
          ]?.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item?.title}</h4>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  item?.priority === 'high' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {item?.priority?.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item?.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Impact: {item?.impact}</span>
                <button className="text-primary hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveIntelligencePanel;