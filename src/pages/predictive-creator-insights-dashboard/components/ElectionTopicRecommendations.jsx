import React, { useState } from 'react';
import { Lightbulb, Zap, RefreshCw, Star, ArrowRight } from 'lucide-react';


const ElectionTopicRecommendations = ({ creatorData }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const MOCK_RECOMMENDATIONS = [
    {
      topic: 'AI & Future of Work',
      category: 'Technology',
      trendScore: 97,
      projectedVotes: 4200,
      projectedRevenue: 58800,
      reasoning: 'Trending 340% above baseline. Your audience in Zone 1-3 shows 89% engagement with tech topics.',
      timing: 'Post Tuesday 7-9 PM EST',
      competitionLevel: 'Low',
      suggestedTitle: 'Will AI Replace 50% of Jobs by 2030?'
    },
    {
      topic: 'Climate Policy',
      category: 'Politics',
      trendScore: 91,
      projectedVotes: 3800,
      projectedRevenue: 53200,
      reasoning: 'High engagement in your historical elections. 76% completion rate on similar topics.',
      timing: 'Post Thursday 6-8 PM EST',
      competitionLevel: 'Medium',
      suggestedTitle: 'Should Carbon Tax Be Mandatory for All Businesses?'
    },
    {
      topic: 'Crypto & Digital Finance',
      category: 'Business',
      trendScore: 88,
      projectedVotes: 2900,
      projectedRevenue: 40600,
      reasoning: 'Your Zone 1-2 audience has 94% interest in financial topics. Low competition window.',
      timing: 'Post Wednesday 12-2 PM EST',
      competitionLevel: 'Low',
      suggestedTitle: 'Bitcoin vs Gold: Best Store of Value for 2026?'
    },
    {
      topic: 'Sports Championship Predictions',
      category: 'Sports',
      trendScore: 84,
      projectedVotes: 5100,
      projectedRevenue: 35700,
      reasoning: 'Highest vote volume potential. Seasonal peak approaching. Gamification boosts engagement 2.3x.',
      timing: 'Post Friday 8-10 PM EST',
      competitionLevel: 'High',
      suggestedTitle: 'Who Will Win the 2026 Championship?'
    }
  ];

  const getRecommendations = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setRecommendations(MOCK_RECOMMENDATIONS);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCompetitionColor = (level) => {
    if (level === 'Low') return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (level === 'Medium') return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Election Topic Recommendations
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Perplexity AI</span>
        </h3>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors text-sm"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </div>
      {!recommendations && !loading && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Get AI-powered election topic recommendations based on your creator history and current trends</p>
        </div>
      )}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Perplexity analyzing trends and your creator patterns...</p>
        </div>
      )}
      {recommendations && (
        <div className="space-y-4">
          {recommendations?.map((rec, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:border-amber-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{rec?.topic}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{rec?.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-600">{rec?.trendScore}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCompetitionColor(rec?.competitionLevel)}`}>{rec?.competitionLevel} Competition</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Suggested: "{rec?.suggestedTitle}"
                </p>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rec?.reasoning}</p>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-500">Projected Votes</p>
                  <p className="font-bold text-blue-600">{rec?.projectedVotes?.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-500">Projected Revenue</p>
                  <p className="font-bold text-green-600">${rec?.projectedRevenue?.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-500">Best Timing</p>
                  <p className="font-bold text-indigo-600 text-xs">{rec?.timing}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElectionTopicRecommendations;
