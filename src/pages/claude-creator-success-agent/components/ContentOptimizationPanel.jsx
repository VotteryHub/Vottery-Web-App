import React, { useState, useEffect } from 'react';
import { TrendingUp, Lightbulb, Target, Zap } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { claudeCreatorSuccessService } from '../../../services/claudeCreatorSuccessService';

const ContentOptimizationPanel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setError(null);
      const result = await claudeCreatorSuccessService?.getContentOptimizationRecommendations();
      if (result?.error) {
        setRecommendations([]);
        setError(result?.error);
        return;
      }
      if (result?.data) {
        setRecommendations(result?.data);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      setGenerating(true);
      const result = await claudeCreatorSuccessService?.generateContentRecommendations();
      if (result?.error) {
        setError(result?.error);
        return;
      }
      await loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors?.[priority] || colors?.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      content_strategy: Lightbulb,
      audience_engagement: Target,
      monetization: TrendingUp,
      posting_schedule: Zap,
    };
    return icons?.[category] || Lightbulb;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading optimization recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icon name={TrendingUp} size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Proactive Content Optimization</h2>
            </div>
            <p className="text-gray-700">
              Claude-generated recommendations for content strategy, engagement, and monetization
            </p>
          </div>
          <Button
            onClick={handleGenerateRecommendations}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700"
          >
            {generating ? 'Generating...' : 'Generate New Recommendations'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          {/not authenticated/i?.test(error)
            ? 'Sign in required to use content optimization.'
            : `Content optimization unavailable: ${error}`}
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations?.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Icon name={Lightbulb} size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-4">Generate AI-powered content optimization recommendations</p>
            <Button onClick={handleGenerateRecommendations} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Recommendations'}
            </Button>
          </div>
        ) : (
          recommendations?.map((rec) => {
            const CategoryIcon = getCategoryIcon(rec?.recommendationType);
            return (
              <div
                key={rec?.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={CategoryIcon} size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{rec?.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          getPriorityColor(rec?.priority)
                        }`}
                      >
                        {rec?.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec?.description}</p>
                  </div>
                </div>

                {rec?.implementationSteps && rec?.implementationSteps?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Implementation Steps:</h4>
                    <ol className="space-y-1">
                      {rec?.implementationSteps?.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="font-medium text-green-600">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {rec?.expectedImpact && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">Expected Impact:</p>
                    <p className="text-sm text-green-900">{rec?.expectedImpact}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Status: {rec?.status || 'Pending'}</span>
                  <span>
                    {rec?.createdAt ? new Date(rec?.createdAt)?.toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContentOptimizationPanel;