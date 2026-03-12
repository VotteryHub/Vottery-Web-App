import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Brain, Clock, TrendingUp, Globe, Target, Sparkles, Calendar, BarChart3, MapPin, DollarSign } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useChat } from '../../hooks/useChat';
import toast from 'react-hot-toast';

const ClaudeContentOptimizationEngine = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [contentType, setContentType] = useState('election');
  const [optimization, setOptimization] = useState(null);
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
        setOptimization(parsed);
        toast?.success('Optimization recommendations generated!');
      } catch (err) {
        console.error('Failed to parse AI response:', err);
        toast?.error('Failed to parse recommendations');
      }
    }
  }, [response, isLoading]);

  const generateOptimization = async () => {
    setLoading(true);
    
    const prompt = `Generate content optimization recommendations for a creator in ${selectedCountry} creating ${contentType} content.

Provide a comprehensive JSON response with the following structure:
{
  "optimalPostingTimes": [
    {
      "day": "Day of week",
      "timeSlots": ["HH:MM AM/PM"],
      "timezone": "Timezone",
      "expectedEngagement": "Percentage",
      "reasoning": "Why this time works"
    }
  ],
  "trendingTopics": [
    {
      "topic": "Topic name",
      "region": "Geographic region",
      "trendScore": "1-100",
      "relevance": "Why it's relevant",
      "suggestedAngle": "How to approach it"
    }
  ],
  "engagementPredictions": [
    {
      "contentFormat": "Format type",
      "predictedScore": "1-100",
      "audienceReach": "Estimated reach",
      "bestPractices": ["Practice 1", "Practice 2"]
    }
  ],
  "earningsOptimization": [
    {
      "strategy": "Strategy name",
      "country": "Country code",
      "estimatedRevenue": "Revenue estimate",
      "implementation": "How to implement",
      "timeframe": "Expected timeframe"
    }
  ]
}`;

    sendMessage(
      [
        { role: 'system', content: 'You are an expert content strategist and creator economy analyst. Provide data-driven, actionable recommendations in valid JSON format only.' },
        { role: 'user', content: prompt }
      ],
      {
        temperature: 0.7,
        max_tokens: 3000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'content_optimization',
            schema: {
              type: 'object',
              properties: {
                optimalPostingTimes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      day: { type: 'string' },
                      timeSlots: { type: 'array', items: { type: 'string' } },
                      timezone: { type: 'string' },
                      expectedEngagement: { type: 'string' },
                      reasoning: { type: 'string' }
                    },
                    required: ['day', 'timeSlots', 'timezone', 'expectedEngagement', 'reasoning']
                  }
                },
                trendingTopics: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      topic: { type: 'string' },
                      region: { type: 'string' },
                      trendScore: { type: 'string' },
                      relevance: { type: 'string' },
                      suggestedAngle: { type: 'string' }
                    },
                    required: ['topic', 'region', 'trendScore', 'relevance', 'suggestedAngle']
                  }
                },
                engagementPredictions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      contentFormat: { type: 'string' },
                      predictedScore: { type: 'string' },
                      audienceReach: { type: 'string' },
                      bestPractices: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['contentFormat', 'predictedScore', 'audienceReach', 'bestPractices']
                  }
                },
                earningsOptimization: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      strategy: { type: 'string' },
                      country: { type: 'string' },
                      estimatedRevenue: { type: 'string' },
                      implementation: { type: 'string' },
                      timeframe: { type: 'string' }
                    },
                    required: ['strategy', 'country', 'estimatedRevenue', 'implementation', 'timeframe']
                  }
                }
              },
              required: ['optimalPostingTimes', 'trendingTopics', 'engagementPredictions', 'earningsOptimization']
            },
            strict: true
          }
        }
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Claude Content Optimization Engine | Election Platform</title>
        <meta name="description" content="AI-powered content suggestions with optimal posting times, trending topics, and earnings optimization" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <HeaderNavigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                <Icon icon={Brain} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Claude Content Optimization Engine</h1>
                <p className="text-gray-600 mt-1">AI-powered content suggestions for maximum engagement and earnings</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Country</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e?.target?.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e?.target?.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="election">Elections & Voting</option>
                    <option value="video">Video Content</option>
                    <option value="article">Articles & Blogs</option>
                    <option value="community">Community Posts</option>
                    <option value="live">Live Streams</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={generateOptimization}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Icon icon={Sparkles} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Generating...' : 'Generate Optimization'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-12 border border-purple-200 text-center">
              <Icon icon={Brain} className="w-16 h-16 text-purple-600 animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">Claude is analyzing content trends...</p>
              <p className="text-sm text-gray-600 mt-2">Generating personalized recommendations for {selectedCountry}</p>
            </div>
          )}

          {/* Optimization Results */}
          {optimization && !isLoading && (
            <div className="space-y-6">
              {/* Optimal Posting Times */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Icon icon={Clock} className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Optimal Posting Times</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {optimization?.optimalPostingTimes?.map((time, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{time?.day}</h3>
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                          {time?.expectedEngagement} engagement
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {time?.timeSlots?.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Icon icon={Calendar} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">{slot}</span>
                            <span className="text-xs text-gray-600">({time?.timezone})</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-700">{time?.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Icon icon={TrendingUp} className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Trending Topics by Region</h2>
                </div>
                <div className="space-y-4">
                  {optimization?.trendingTopics?.map((topic, index) => (
                    <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{topic?.topic}</h3>
                            <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-medium">
                              Score: {topic?.trendScore}/100
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Icon icon={MapPin} className="w-4 h-4" />
                            <span>{topic?.region}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Relevance:</span> {topic?.relevance}</p>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-gray-700"><span className="font-semibold">Suggested Angle:</span> {topic?.suggestedAngle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Predictions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Icon icon={BarChart3} className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Predicted Engagement Scores</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimization?.engagementPredictions?.map((pred, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{pred?.contentFormat}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-700">{pred?.predictedScore}</div>
                          <div className="text-xs text-gray-600">Engagement Score</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3"><span className="font-semibold">Reach:</span> {pred?.audienceReach}</p>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs font-semibold text-gray-900 mb-2">Best Practices:</p>
                        <ul className="space-y-1">
                          {pred?.bestPractices?.map((practice, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <span className="text-green-600 mt-0.5">•</span>
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings Optimization */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Icon icon={DollarSign} className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Earnings Optimization Strategies</h2>
                </div>
                <div className="space-y-4">
                  {optimization?.earningsOptimization?.map((strategy, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{strategy?.strategy}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Icon icon={Globe} className="w-4 h-4" />
                              <span>{strategy?.country}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon icon={Clock} className="w-4 h-4" />
                              <span>{strategy?.timeframe}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-4 py-2 bg-purple-200 text-purple-800 rounded-lg text-sm font-bold">
                          {strategy?.estimatedRevenue}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-gray-700"><span className="font-semibold">Implementation:</span> {strategy?.implementation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!optimization && !isLoading && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 border border-gray-200 text-center">
              <Icon icon={Target} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Optimization Data Yet</h3>
              <p className="text-gray-600 mb-6">Select your target country and content type, then click "Generate Optimization" to get AI-powered recommendations</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClaudeContentOptimizationEngine;