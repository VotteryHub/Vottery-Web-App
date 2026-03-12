import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../hooks/useChat';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

const OpenAICarouselContentIntelligenceCenter = () => {
  const { user } = useAuth();
  const [semanticAnalysis, setSemanticAnalysis] = useState(null);
  const [personalizedRanking, setPersonalizedRanking] = useState([]);
  const [abTestResults, setAbTestResults] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCarousel, setSelectedCarousel] = useState('horizontal');
  
  const { response, isLoading, error, sendMessage } = useChat('OPEN_AI', 'gpt-4o', false);

  useEffect(() => {
    if (error) toast?.error(error?.message);
  }, [error]);

  useEffect(() => {
    if (user) {
      loadUserBehaviorData();
      subscribeToRealtimeUpdates();
    }
  }, [user]);

  const loadUserBehaviorData = async () => {
    try {
      const { data: swipeData } = await supabase?.from('carousel_interactions')?.select('*')?.eq('user_id', user?.id)?.order('created_at', { ascending: false })?.limit(100);

      if (swipeData) {
        analyzeUserBehavior(swipeData);
      }
    } catch (error) {
      console.error('Error loading behavior data:', error);
    }
  };

  const analyzeUserBehavior = async (swipeData) => {
    setAnalyzing(true);
    try {
      const behaviorSummary = {
        totalSwipes: swipeData?.length || 0,
        avgVelocity: swipeData?.reduce((sum, s) => sum + (s?.swipe_velocity || 0), 0) / swipeData?.length || 0,
        avgDwellTime: swipeData?.reduce((sum, s) => sum + (s?.dwell_time || 0), 0) / swipeData?.length || 0,
        contentTypePreferences: analyzeContentTypePreferences(swipeData),
        engagementHistory: swipeData?.slice(0, 20)?.map(s => ({
          contentType: s?.content_type,
          engagement: s?.engagement_score,
          dwellTime: s?.dwell_time
        }))
      };

      sendMessage([
        {
          role: 'system',
          content: 'You are an advanced carousel content intelligence system using GPT-4o semantic analysis. Analyze user behavior patterns, swipe velocity correlation with content preferences, engagement history scoring, and dwell time weighting to provide personalized content ranking recommendations. Return JSON only.'
        },
        {
          role: 'user',
          content: `Analyze this user behavior data and provide: 1) Semantic analysis of content preferences, 2) Personalized content ranking scores (0-100) for Horizontal Snap, Vertical Stack, and Gradient Flow carousels, 3) A/B test winner predictions with confidence scores, 4) Real-time recommendation adjustments. Data: ${JSON.stringify(behaviorSummary)}`
        }
      ], {
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'carousel_intelligence',
            schema: {
              type: 'object',
              properties: {
                semanticAnalysis: {
                  type: 'object',
                  properties: {
                    primaryPreferences: { type: 'array', items: { type: 'string' } },
                    velocityCorrelation: { type: 'string' },
                    engagementPatterns: { type: 'string' },
                    dwellTimeInsights: { type: 'string' }
                  },
                  required: ['primaryPreferences', 'velocityCorrelation', 'engagementPatterns', 'dwellTimeInsights']
                },
                personalizedRanking: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      carouselType: { type: 'string' },
                      contentType: { type: 'string' },
                      relevanceScore: { type: 'number' },
                      conversionPotential: { type: 'number' }
                    },
                    required: ['carouselType', 'contentType', 'relevanceScore', 'conversionPotential']
                  }
                },
                abTestPredictions: {
                  type: 'object',
                  properties: {
                    predictedWinner: { type: 'string' },
                    confidence: { type: 'number' },
                    statisticalSignificance: { type: 'string' },
                    recommendations: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['predictedWinner', 'confidence', 'statisticalSignificance', 'recommendations']
                },
                realtimeRecommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      action: { type: 'string' },
                      reason: { type: 'string' },
                      priority: { type: 'string' }
                    },
                    required: ['action', 'reason', 'priority']
                  }
                }
              },
              required: ['semanticAnalysis', 'personalizedRanking', 'abTestPredictions', 'realtimeRecommendations'],
              additionalProperties: false
            }
          }
        }
      });
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      toast?.error('Failed to analyze user behavior');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (response && !isLoading) {
      try {
        const analysis = JSON.parse(response);
        setSemanticAnalysis(analysis?.semanticAnalysis);
        setPersonalizedRanking(analysis?.personalizedRanking || []);
        setAbTestResults(analysis?.abTestPredictions);
        setRealtimeUpdates(analysis?.realtimeRecommendations || []);
        toast?.success('Analysis complete!');
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    }
  }, [response, isLoading]);

  const analyzeContentTypePreferences = (swipeData) => {
    const preferences = {};
    swipeData?.forEach(s => {
      const type = s?.content_type || 'unknown';
      if (!preferences?.[type]) preferences[type] = { count: 0, totalEngagement: 0 };
      preferences[type].count++;
      preferences[type].totalEngagement += s?.engagement_score || 0;
    });
    return Object.entries(preferences)?.map(([type, data]) => ({
      type,
      avgEngagement: data?.totalEngagement / data?.count
    }))?.sort((a, b) => b?.avgEngagement - a?.avgEngagement);
  };

  const subscribeToRealtimeUpdates = () => {
    const channel = supabase?.channel('carousel_interactions_updates')?.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'carousel_interactions',
        filter: `user_id=eq.${user?.id}`
      }, (payload) => {
        setRealtimeUpdates(prev => [{
          action: `New ${payload?.new?.content_type} interaction`,
          reason: `Swipe velocity: ${payload?.new?.swipe_velocity}px/s, Dwell: ${payload?.new?.dwell_time}s`,
          priority: 'medium',
          timestamp: new Date()?.toISOString()
        }, ...prev?.slice(0, 9)]);
      })?.subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  };

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">OpenAI Carousel Content Intelligence Center</h1>
              <p className="text-muted-foreground">Advanced semantic analysis and personalized content ranking using GPT-4o for intelligent carousel optimization</p>
            </div>

            {/* Carousel Type Selector */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Layers" size={24} className="text-purple-500" />
                Select Carousel Type
              </h2>
              <div className="flex gap-4">
                {['horizontal', 'vertical', 'gradient']?.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedCarousel(type)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedCarousel === type
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' :'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* GPT-4o Semantic Analysis */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Icon name="Brain" size={24} className="text-purple-500" />
                  GPT-4o Semantic Analysis
                </h2>
                <button
                  onClick={() => loadUserBehaviorData()}
                  disabled={analyzing || isLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {analyzing || isLoading ? (
                    <><Icon name="Loader" size={18} className="animate-spin" /> Analyzing...</>
                  ) : (
                    <><Icon name="Zap" size={18} /> Analyze Behavior</>
                  )}
                </button>
              </div>
              {semanticAnalysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Primary Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                      {semanticAnalysis?.primaryPreferences?.map((pref, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100 rounded-full text-sm">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Velocity Correlation</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{semanticAnalysis?.velocityCorrelation}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Engagement Patterns</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{semanticAnalysis?.engagementPatterns}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Dwell Time Insights</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{semanticAnalysis?.dwellTimeInsights}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="Brain" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Click "Analyze Behavior" to generate semantic analysis</p>
                </div>
              )}
            </div>

            {/* Personalized Content Ranking */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={24} className="text-blue-500" />
                Personalized Content Ranking Engine
              </h2>
              {personalizedRanking?.length > 0 ? (
                <div className="space-y-3">
                  {personalizedRanking
                    ?.filter(item => item?.carouselType?.toLowerCase() === selectedCarousel)
                    ?.sort((a, b) => b?.relevanceScore - a?.relevanceScore)
                    ?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{i + 1}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item?.contentType}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Carousel: {item?.carouselType}</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item?.relevanceScore}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Relevance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{item?.conversionPotential}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Conversion</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No ranking data available. Run analysis first.</p>
                </div>
              )}
            </div>

            {/* A/B Test Winner Prediction */}
            <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Target" size={24} className="text-green-500" />
                A/B Test Winner Prediction
              </h2>
              {abTestResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{abTestResults?.predictedWinner}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Predicted Winner</div>
                    </div>
                    <div className="flex justify-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(abTestResults?.confidence * 100)?.toFixed(0)}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">{abTestResults?.statisticalSignificance}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Significance</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Optimization Recommendations</h3>
                    <div className="space-y-2">
                      {abTestResults?.recommendations?.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="Target" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No A/B test predictions available. Run analysis first.</p>
                </div>
              )}
            </div>

            {/* Real-Time Recommendation Updates */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <Icon name="Activity" size={24} className="text-orange-500" />
                Real-Time Recommendation Updates
              </h2>
              {realtimeUpdates?.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {realtimeUpdates?.map((update, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${
                      update?.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                      update?.priority === 'medium'? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{update?.action}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{update?.reason}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          update?.priority === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100' :
                          update?.priority === 'medium'? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100' : 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                        }`}>
                          {update?.priority}
                        </span>
                      </div>
                      {update?.timestamp && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {new Date(update.timestamp)?.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No real-time updates yet. Interact with carousels to see recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OpenAICarouselContentIntelligenceCenter;