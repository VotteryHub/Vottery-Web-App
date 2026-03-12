import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, MapPin, Target, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';
import { useChat } from '../../../hooks/useChat';
import toast from 'react-hot-toast';

const AIOptimizationRecommendations = ({ earningsData, performanceData }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const { response, isLoading, error, sendMessage } = useChat('ANTHROPIC', 'claude-sonnet-4-5-20250929', false);

  useEffect(() => {
    if (error) {
      toast?.error(error?.message);
    }
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      try {
        const parsed = JSON.parse(response);
        setRecommendations(parsed);
      } catch (err) {
        console.error('Failed to parse AI response:', err);
      }
    }
  }, [response, isLoading]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    const prompt = `Analyze the following creator earnings data and provide optimization recommendations:

Earnings Data:
- Total Earnings: $${earningsData?.totalEarnings || 0}
- Pending Payouts: $${earningsData?.pendingPayouts || 0}
- Elections Revenue: $${earningsData?.successfulElectionsRevenue || 0}
- Country Breakdown: ${JSON.stringify(earningsData?.countryEarnings || [])}

Performance Data:
- Engagement Rate: ${performanceData?.engagementRate || 0}%
- Conversion Rate: ${performanceData?.conversionRate || 0}%
- Average Revenue Per Election: $${performanceData?.avgRevenuePerElection || 0}

Provide a JSON response with the following structure:
{
  "revenueGrowthOpportunities": [
    {
      "title": "Opportunity title",
      "description": "Detailed description",
      "potentialIncrease": "Percentage or dollar amount",
      "priority": "high|medium|low"
    }
  ],
  "audienceInsights": [
    {
      "insight": "Key insight about audience",
      "actionable": "What to do about it",
      "impact": "Expected impact"
    }
  ],
  "earningsPotentialByContentType": [
    {
      "contentType": "Type of content",
      "currentPerformance": "Current metrics",
      "potential": "Growth potential",
      "recommendation": "Specific recommendation"
    }
  ],
  "geographicOpportunities": [
    {
      "region": "Geographic region",
      "opportunity": "Specific opportunity",
      "estimatedRevenue": "Potential revenue",
      "strategy": "Recommended strategy"
    }
  ]
}`;

    sendMessage(
      [
        { role: 'system', content: 'You are an expert creator economy analyst. Provide actionable, data-driven recommendations in valid JSON format only.' },
        { role: 'user', content: prompt }
      ],
      {
        temperature: 0.7,
        max_tokens: 2048,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'optimization_recommendations',
            schema: {
              type: 'object',
              properties: {
                revenueGrowthOpportunities: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      potentialIncrease: { type: 'string' },
                      priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                    },
                    required: ['title', 'description', 'potentialIncrease', 'priority']
                  }
                },
                audienceInsights: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      insight: { type: 'string' },
                      actionable: { type: 'string' },
                      impact: { type: 'string' }
                    },
                    required: ['insight', 'actionable', 'impact']
                  }
                },
                earningsPotentialByContentType: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      contentType: { type: 'string' },
                      currentPerformance: { type: 'string' },
                      potential: { type: 'string' },
                      recommendation: { type: 'string' }
                    },
                    required: ['contentType', 'currentPerformance', 'potential', 'recommendation']
                  }
                },
                geographicOpportunities: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      region: { type: 'string' },
                      opportunity: { type: 'string' },
                      estimatedRevenue: { type: 'string' },
                      strategy: { type: 'string' }
                    },
                    required: ['region', 'opportunity', 'estimatedRevenue', 'strategy']
                  }
                }
              },
              required: ['revenueGrowthOpportunities', 'audienceInsights', 'earningsPotentialByContentType', 'geographicOpportunities']
            },
            strict: true
          }
        }
      }
    );
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
            <Icon icon={Brain} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Optimization Recommendations</h2>
            <p className="text-sm text-gray-600">Revenue growth opportunities, audience insights, and earnings potential analysis</p>
          </div>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
        >
          <Icon icon={Sparkles} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Analyzing...' : 'Generate Recommendations'}
        </button>
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
          <div className="flex flex-col items-center justify-center">
            <Icon icon={Brain} className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
            <p className="text-lg font-medium text-gray-900">AI is analyzing your performance data...</p>
            <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}
      {/* Recommendations Display */}
      {recommendations && !isLoading && (
        <div className="space-y-6">
          {/* Revenue Growth Opportunities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={TrendingUp} className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Revenue Growth Opportunities</h3>
            </div>
            <div className="space-y-4">
              {recommendations?.revenueGrowthOpportunities?.map((opp, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{opp?.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors?.[opp?.priority]}`}>
                      {opp?.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{opp?.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon icon={Target} className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-700">Potential Increase: {opp?.potentialIncrease}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Insights */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={Users} className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Audience Insights</h3>
            </div>
            <div className="space-y-4">
              {recommendations?.audienceInsights?.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Icon icon={AlertCircle} className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{insight?.insight}</p>
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <p className="text-sm text-gray-700"><span className="font-semibold">Action:</span> {insight?.actionable}</p>
                      </div>
                      <p className="text-sm text-blue-700"><span className="font-semibold">Expected Impact:</span> {insight?.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Potential by Content Type */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={Target} className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Earnings Potential by Content Type</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations?.earningsPotentialByContentType?.map((content, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3">{content?.contentType}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700"><span className="font-medium">Current:</span> {content?.currentPerformance}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700"><span className="font-medium">Potential:</span> {content?.potential}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 mt-2">
                      <p className="text-gray-700"><span className="font-semibold">Recommendation:</span> {content?.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Opportunities */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Icon icon={MapPin} className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Geographic Opportunities</h3>
            </div>
            <div className="space-y-4">
              {recommendations?.geographicOpportunities?.map((geo, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">{geo?.region}</h4>
                    <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                      {geo?.estimatedRevenue}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{geo?.opportunity}</p>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm text-gray-700"><span className="font-semibold">Strategy:</span> {geo?.strategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Empty State */}
      {!recommendations && !isLoading && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 border border-gray-200 text-center">
          <Icon icon={Brain} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-6">Click "Generate Recommendations" to get AI-powered insights for optimizing your creator earnings</p>
        </div>
      )}
    </div>
  );
};

export default AIOptimizationRecommendations;