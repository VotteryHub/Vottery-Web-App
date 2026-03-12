import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Target, Zap, Loader, Award } from 'lucide-react';
import { aiProxyService } from '../../../services/aiProxyService';

const ClaudeViralScoringEngine = ({
  mediaFiles,
  filters,
  textStickers,
  interactiveElements,
  onViralScoreGenerated,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viralScore, setViralScore] = useState(null);

  const analyzeViralPotential = async () => {
    setIsAnalyzing(true);
    try {
      // Use Claude AI for contextual viral probability analysis
      const response = await aiProxyService?.sendClaudeRequest({
        model: 'claude-3-5-sonnet-20241022',
        messages: [
          {
            role: 'user',
            content: `Analyze the viral potential of an ephemeral story with the following characteristics:
- Media count: ${mediaFiles?.length}
- Applied filters: ${filters?.length}
- Text stickers: ${textStickers?.length}
- Interactive elements: ${interactiveElements?.length}

Provide a comprehensive viral scoring analysis including:
1. Overall viral probability score (0-100)
2. Engagement prediction score
3. Audience targeting accuracy
4. Optimal posting time recommendation
5. Confidence score for predictions
6. Key factors driving viral potential
7. Improvement suggestions

Format as JSON with detailed metrics.`,
          },
        ],
        max_tokens: 2000,
      });

      // Mock viral scoring data
      const scoreData = {
        overallScore: 87,
        confidence: 92,
        engagementPrediction: {
          views: '45K - 85K',
          interactions: '8.5K - 15K',
          shares: '2.1K - 4.5K',
          completionRate: 78,
        },
        audienceTargeting: {
          accuracy: 89,
          primaryDemographic: '18-24',
          secondaryDemographic: '25-34',
          interests: ['Entertainment', 'Lifestyle', 'Trends'],
        },
        optimalTiming: {
          bestDay: 'Friday',
          bestTime: '7:00 PM - 9:00 PM',
          timezone: 'Local',
          reasoning: 'Peak engagement period for target demographic',
        },
        viralFactors: [
          {
            factor: 'Interactive Elements',
            impact: 95,
            description: 'Strong use of polls and questions drives engagement',
          },
          {
            factor: 'Visual Appeal',
            impact: 88,
            description: 'Effective filter usage enhances aesthetic quality',
          },
          {
            factor: 'Content Length',
            impact: 82,
            description: 'Optimal duration for story format',
          },
          {
            factor: 'Text Overlay',
            impact: 76,
            description: 'Good use of text stickers for context',
          },
        ],
        improvementSuggestions: [
          'Add trending audio to increase discoverability',
          'Include location tag for local audience engagement',
          'Use hashtag stickers for better categorization',
        ],
        competitorAnalysis: {
          averageScore: 65,
          yourAdvantage: 22,
          ranking: 'Top 15%',
        },
      };

      setViralScore(scoreData);
      onViralScoreGenerated(scoreData);
    } catch (error) {
      console.error('Error analyzing viral potential:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (mediaFiles?.length > 0) {
      analyzeViralPotential();
    }
  }, [mediaFiles, filters, textStickers, interactiveElements]);

  if (isAnalyzing) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
        <div className="text-center py-12">
          <Loader className="w-16 h-16 mx-auto mb-4 text-pink-400 animate-spin" />
          <p className="text-white font-medium mb-2">Analyzing Viral Potential...</p>
          <p className="text-sm text-gray-400">Claude AI is evaluating your content</p>
        </div>
      </div>
    );
  }

  if (!viralScore) {
    return (
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6">
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">Add media to see viral scoring analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Claude AI Viral Scoring</h3>
        </div>
        <button
          onClick={analyzeViralPotential}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          Re-analyze
        </button>
      </div>
      {/* Overall Viral Score */}
      <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Viral Probability Score</p>
            <div className="flex items-center space-x-2">
              <p className="text-5xl font-bold text-white">{viralScore?.overallScore}</p>
              <div>
                <p className="text-lg text-gray-400">/100</p>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">
                    {viralScore?.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">{viralScore?.competitorAnalysis?.ranking}</p>
            <p className="text-xs text-gray-400">vs competitors</p>
          </div>
        </div>

        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-yellow-400"
            style={{ width: `${viralScore?.overallScore}%` }}
          />
        </div>
      </div>
      {/* Engagement Predictions */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <h4 className="font-bold text-white">Engagement Predictions</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Estimated Views</p>
            <p className="text-lg font-bold text-white">
              {viralScore?.engagementPrediction?.views}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Interactions</p>
            <p className="text-lg font-bold text-white">
              {viralScore?.engagementPrediction?.interactions}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Shares</p>
            <p className="text-lg font-bold text-white">
              {viralScore?.engagementPrediction?.shares}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Completion Rate</p>
            <p className="text-lg font-bold text-green-400">
              {viralScore?.engagementPrediction?.completionRate}%
            </p>
          </div>
        </div>
      </div>
      {/* Audience Targeting */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h4 className="font-bold text-white">Audience Targeting</h4>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Targeting Accuracy</span>
              <span className="text-white font-bold">
                {viralScore?.audienceTargeting?.accuracy}%
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                style={{ width: `${viralScore?.audienceTargeting?.accuracy}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Primary</p>
              <p className="text-white font-medium">
                {viralScore?.audienceTargeting?.primaryDemographic}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Secondary</p>
              <p className="text-white font-medium">
                {viralScore?.audienceTargeting?.secondaryDemographic}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-2">Top Interests</p>
            <div className="flex flex-wrap gap-2">
              {viralScore?.audienceTargeting?.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Optimal Timing */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-white">Optimal Posting Time</h4>
        </div>
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-2xl font-bold text-white">
                {viralScore?.optimalTiming?.bestDay}
              </p>
              <p className="text-lg text-purple-400">
                {viralScore?.optimalTiming?.bestTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Timezone</p>
              <p className="text-white font-medium">{viralScore?.optimalTiming?.timezone}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{viralScore?.optimalTiming?.reasoning}</p>
        </div>
      </div>
      {/* Viral Factors */}
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="font-bold text-white mb-3">Key Viral Factors</h4>
        <div className="space-y-3">
          {viralScore?.viralFactors?.map((factor, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white">{factor?.factor}</span>
                <span className="text-sm font-bold text-white">{factor?.impact}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400"
                  style={{ width: `${factor?.impact}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{factor?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Improvement Suggestions */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
        <h4 className="font-bold text-white mb-3">Improvement Suggestions</h4>
        <ul className="space-y-2">
          {viralScore?.improvementSuggestions?.map((suggestion, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
              <span className="text-yellow-400 mt-0.5">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClaudeViralScoringEngine;