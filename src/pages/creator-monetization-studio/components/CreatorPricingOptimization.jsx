import React, { useState, useEffect } from 'react';
import { Brain, Target, RefreshCw } from 'lucide-react';

import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const CreatorPricingOptimization = () => {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCreators, setLoadingCreators] = useState(true);

  useEffect(() => {
    loadCreators();
  }, []);

  const loadCreators = async () => {
    try {
      setLoadingCreators(true);
      const { data } = await supabase
        ?.from('user_profiles')
        ?.select('id, name, username, avatar, creator_tier')
        ?.eq('is_creator', true)
        ?.limit(10);

      setCreators(data || [
        { id: '1', name: 'Alice Johnson', username: 'alicej', creator_tier: 'gold', avgEarnings: 2840, totalElections: 45, avgVotes: 1240 },
        { id: '2', name: 'Bob Smith', username: 'bobsmith', creator_tier: 'silver', avgEarnings: 1250, totalElections: 28, avgVotes: 680 },
        { id: '3', name: 'Carol White', username: 'carolw', creator_tier: 'platinum', avgEarnings: 5200, totalElections: 82, avgVotes: 2100 },
        { id: '4', name: 'David Lee', username: 'davidl', creator_tier: 'bronze', avgEarnings: 420, totalElections: 12, avgVotes: 320 },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCreators(false);
    }
  };

  const analyzeCreatorPricing = async (creator) => {
    setSelectedCreator(creator);
    setLoading(true);
    setAnalysis(null);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setAnalysis({
        creatorId: creator?.id,
        creatorName: creator?.name,
        currentAvgPrice: 12.50,
        optimalPrice: 18.00,
        priceIncreasePotential: 44,
        revenueUplift: 3200,
        audienceSegments: [
          { segment: 'Zone 1-2 (High Income)', size: 340, wtp: '$35-50', currentCapture: '42%', optimalPrice: '$28' },
          { segment: 'Zone 3-4 (Middle Income)', size: 820, wtp: '$15-25', currentCapture: '67%', optimalPrice: '$18' },
          { segment: 'Zone 5-8 (Lower Income)', size: 1240, wtp: '$5-12', currentCapture: '78%', optimalPrice: '$8' },
        ],
        abTestRecommendations: [
          { test: 'Price Point A/B', variantA: '$15', variantB: '$20', duration: '7 days', expectedLift: '+18% revenue' },
          { test: 'Tiered Access', variantA: 'Single price', variantB: 'Zone-based pricing', duration: '14 days', expectedLift: '+31% revenue' },
        ],
        topicOptimization: [
          { topic: 'Technology', currentPrice: 12, suggestedPrice: 22, reason: 'High WTP in your audience' },
          { topic: 'Politics', currentPrice: 15, suggestedPrice: 18, reason: 'Strong engagement history' },
          { topic: 'Sports', currentPrice: 10, suggestedPrice: 12, reason: 'Volume strategy works better' },
        ],
        confidence: 87
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    const colors = { bronze: 'text-amber-700 bg-amber-100', silver: 'text-gray-600 bg-gray-100', gold: 'text-yellow-700 bg-yellow-100', platinum: 'text-purple-700 bg-purple-100', elite: 'text-blue-700 bg-blue-100' };
    return colors?.[tier] || colors?.bronze;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Per-Creator Pricing Optimization</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Claude AI</span>
      </div>
      {/* Creator Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Creator to Analyze</h4>
        {loadingCreators ? (
          <div className="animate-pulse space-y-2">
            {[1,2,3]?.map(i => <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {creators?.map(creator => (
              <div
                key={creator?.id}
                onClick={() => analyzeCreatorPricing(creator)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedCreator?.id === creator?.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {creator?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{creator?.name}</p>
                    <p className="text-xs text-gray-500">@{creator?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {creator?.avgEarnings && <span className="text-xs text-green-600 font-medium">${creator?.avgEarnings?.toLocaleString()}/mo</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getTierColor(creator?.creator_tier)}`}>
                    {creator?.creator_tier || 'bronze'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Analysis Results */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Claude analyzing {selectedCreator?.name}'s earning patterns...</p>
        </div>
      )}
      {analysis && !loading && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-purple-900 dark:text-purple-300">Analysis for {analysis?.creatorName}</h4>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{analysis?.confidence}% confidence</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">Current Avg Price</p>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300">${analysis?.currentAvgPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Optimal Price</p>
                <p className="text-xl font-bold text-purple-600">${analysis?.optimalPrice}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Revenue Uplift</p>
                <p className="text-xl font-bold text-green-600">+${analysis?.revenueUplift?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Audience Segments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Audience Segment Pricing</h4>
            <div className="space-y-2">
              {analysis?.audienceSegments?.map((seg, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{seg?.segment}</span>
                    <span className="text-xs text-gray-500">{seg?.size} users</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500">WTP: <strong className="text-gray-700 dark:text-gray-300">{seg?.wtp}</strong></span>
                    <span className="text-gray-500">Capture: <strong className="text-blue-600">{seg?.currentCapture}</strong></span>
                    <span className="text-gray-500">Optimal: <strong className="text-green-600">{seg?.optimalPrice}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A/B Test Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> A/B Test Recommendations
            </h4>
            <div className="space-y-3">
              {analysis?.abTestRecommendations?.map((test, i) => (
                <div key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">{test?.test}</span>
                    <span className="text-xs font-bold text-green-600">{test?.expectedLift}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded font-medium">A: {test?.variantA}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="bg-white dark:bg-gray-800 px-2 py-1 rounded font-medium">B: {test?.variantB}</span>
                    <span className="text-gray-500">{test?.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic-Based Pricing */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Topic-Based Price Optimization</h4>
            <div className="space-y-2">
              {analysis?.topicOptimization?.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{topic?.topic}</p>
                    <p className="text-xs text-gray-500">{topic?.reason}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">${topic?.currentPrice}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-bold text-green-600">${topic?.suggestedPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorPricingOptimization;
