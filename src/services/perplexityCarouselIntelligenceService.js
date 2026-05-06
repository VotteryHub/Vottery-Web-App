import { getChatCompletion } from './aiIntegrations/chatCompletion';
import { supabase } from '../lib/supabase';

class PerplexityCarouselIntelligenceService {
  constructor() {
    this.carouselTypes = ['Horizontal Snap', 'Vertical Stack', 'Gradient Flow'];
  }

  /**
   * Get carousel performance data for competitive analysis
   */
  async getCarouselPerformanceData(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const { data: metrics } = await supabase
        ?.from('content_distribution_metrics')
        ?.select('*')
        ?.gte('timestamp', startDate?.toISOString());

      const performanceByType = {};

      this.carouselTypes?.forEach(type => {
        const typeKey = type?.toLowerCase()?.replace(' ', '_');
        const typeMetrics = metrics?.filter(m => m?.carousel_type === typeKey) || [];

        performanceByType[type] = {
          totalViews: typeMetrics?.reduce((sum, m) => sum + (m?.views || 0), 0),
          totalClicks: typeMetrics?.reduce((sum, m) => sum + (m?.clicks || 0), 0),
          totalRevenue: typeMetrics?.reduce((sum, m) => sum + parseFloat(m?.revenue || 0), 0),
          avgEngagementRate: this.calculateAvgEngagement(typeMetrics),
          avgDwellTime: this.calculateAvgDwellTime(typeMetrics),
          conversionRate: this.calculateConversionRate(typeMetrics)
        };
      });

      return { data: performanceByType, error: null };
    } catch (error) {
      console.error('Error getting carousel performance data:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Competitive carousel benchmarking with Perplexity extended reasoning
   */
  async performCompetitiveBenchmarking(performanceData) {
    try {
      const response = await getChatCompletion(
        'PERPLEXITY',
        'perplexity/sonar-reasoning-pro',
        [
          {
            role: 'system',
            content: 'You are a carousel intelligence analyst with access to real-time market data. Use extended reasoning to analyze carousel performance, benchmark against industry standards, and identify competitive advantages and gaps. Provide data-driven insights with sources.'
          },
          {
            role: 'user',
            content: `Perform competitive benchmarking analysis for these carousel types (Horizontal Snap, Vertical Stack, Gradient Flow) with this performance data: ${JSON.stringify(performanceData)}. Research: 1) Industry benchmarks for carousel engagement rates, 2) Best practices from leading platforms, 3) Competitive positioning analysis, 4) Performance gaps and opportunities, 5) Emerging carousel trends in social media and content platforms. Provide detailed analysis with sources.`
          }
        ],
        {
          reasoning_effort: 'high',
          max_tokens: 3000,
          web_search_options: {
            search_context_size: 'high'
          },
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'competitive_benchmarking',
              schema: {
                type: 'object',
                properties: {
                  industryBenchmarks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        carouselType: { type: 'string' },
                        industryAvgEngagement: { type: 'string' },
                        topPerformerEngagement: { type: 'string' },
                        yourPerformance: { type: 'string' },
                        gap: { type: 'string' },
                        ranking: { type: 'string' }
                      },
                      required: ['carouselType', 'industryAvgEngagement', 'topPerformerEngagement', 'yourPerformance', 'gap', 'ranking']
                    }
                  },
                  bestPractices: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        practice: { type: 'string' },
                        platform: { type: 'string' },
                        impact: { type: 'string' },
                        applicability: { type: 'string' }
                      },
                      required: ['practice', 'platform', 'impact', 'applicability']
                    }
                  },
                  competitivePositioning: {
                    type: 'object',
                    properties: {
                      strengths: { type: 'array', items: { type: 'string' } },
                      weaknesses: { type: 'array', items: { type: 'string' } },
                      opportunities: { type: 'array', items: { type: 'string' } },
                      threats: { type: 'array', items: { type: 'string' } }
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats']
                  },
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        recommendation: { type: 'string' },
                        priority: { type: 'string' },
                        expectedImpact: { type: 'string' },
                        timeframe: { type: 'string' }
                      },
                      required: ['recommendation', 'priority', 'expectedImpact', 'timeframe']
                    }
                  }
                },
                required: ['industryBenchmarks', 'bestPractices', 'competitivePositioning', 'recommendations'],
                additionalProperties: false
              }
            }
          }
        }
      );

      const analysis = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: analysis, error: null };
    } catch (error) {
      console.error('Error performing competitive benchmarking:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Market trend analysis across carousel content types
   */
  async analyzeMarketTrends() {
    try {
      const response = await getChatCompletion(
        'PERPLEXITY',
        'perplexity/sonar-deep-research',
        [
          {
            role: 'system',
            content: 'You are a market research analyst specializing in social media content formats and carousel technologies. Conduct comprehensive research on current trends, emerging patterns, and future predictions for carousel content across platforms.'
          },
          {
            role: 'user',
            content: `Conduct deep market research on carousel content trends across social media platforms (Instagram, TikTok, LinkedIn, Facebook, Twitter/X). Analyze: 1) Current carousel usage trends and adoption rates, 2) Engagement patterns for Horizontal Snap, Vertical Stack, and Gradient Flow carousel types, 3) Emerging carousel formats and innovations, 4) User behavior shifts in carousel consumption, 5) Platform-specific carousel strategies, 6) Future predictions for carousel content (next 6-12 months). Provide comprehensive analysis with data sources.`
          }
        ],
        {
          max_tokens: 4000,
          web_search_options: {
            search_context_size: 'high'
          },
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'market_trend_analysis',
              schema: {
                type: 'object',
                properties: {
                  currentTrends: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        trend: { type: 'string' },
                        description: { type: 'string' },
                        platforms: { type: 'array', items: { type: 'string' } },
                        adoptionRate: { type: 'string' },
                        impact: { type: 'string' }
                      },
                      required: ['trend', 'description', 'platforms', 'adoptionRate', 'impact']
                    }
                  },
                  engagementPatterns: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        carouselType: { type: 'string' },
                        avgEngagement: { type: 'string' },
                        bestPerformingContent: { type: 'string' },
                        userPreferences: { type: 'string' },
                        platformLeaders: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['carouselType', 'avgEngagement', 'bestPerformingContent', 'userPreferences', 'platformLeaders']
                    }
                  },
                  emergingFormats: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        format: { type: 'string' },
                        description: { type: 'string' },
                        earlyAdopters: { type: 'array', items: { type: 'string' } },
                        potentialImpact: { type: 'string' }
                      },
                      required: ['format', 'description', 'earlyAdopters', 'potentialImpact']
                    }
                  },
                  userBehaviorShifts: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  platformStrategies: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        platform: { type: 'string' },
                        strategy: { type: 'string' },
                        effectiveness: { type: 'string' },
                        keyTakeaways: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['platform', 'strategy', 'effectiveness', 'keyTakeaways']
                    }
                  },
                  futurePredictions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        prediction: { type: 'string' },
                        timeframe: { type: 'string' },
                        confidence: { type: 'string' },
                        implications: { type: 'string' }
                      },
                      required: ['prediction', 'timeframe', 'confidence', 'implications']
                    }
                  }
                },
                required: ['currentTrends', 'engagementPatterns', 'emergingFormats', 'userBehaviorShifts', 'platformStrategies', 'futurePredictions'],
                additionalProperties: false
              }
            }
          }
        }
      );

      const trends = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: trends, error: null };
    } catch (error) {
      console.error('Error analyzing market trends:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Content type performance comparison
   */
  async compareContentTypePerformance(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);

      const contentTypes = [
        'liveElections', 'jolts', 'liveMoments', 'creatorSpotlights',
        'suggestedConnections', 'recommendedHubs', 'recommendedElections',
        'creatorServices', 'recentWinners', 'trendingTopics'
      ];

      const performanceData = {};

      for (const type of contentTypes) {
        const { data: metrics } = await supabase
          ?.from('content_distribution_metrics')
          ?.select('*')
          ?.eq('content_type', type)
          ?.gte('timestamp', startDate?.toISOString());

        performanceData[type] = {
          views: metrics?.reduce((sum, m) => sum + (m?.views || 0), 0),
          clicks: metrics?.reduce((sum, m) => sum + (m?.clicks || 0), 0),
          engagementRate: this.calculateAvgEngagement(metrics),
          revenue: metrics?.reduce((sum, m) => sum + parseFloat(m?.revenue || 0), 0)
        };
      }

      return { data: performanceData, error: null };
    } catch (error) {
      console.error('Error comparing content type performance:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Helper: Calculate average engagement
   */
  calculateAvgEngagement(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    const totalViews = metrics?.reduce((sum, m) => sum + (m?.views || 0), 0);
    const totalClicks = metrics?.reduce((sum, m) => sum + (m?.clicks || 0), 0);
    return totalViews > 0 ? ((totalClicks / totalViews) * 100)?.toFixed(2) : 0;
  }

  /**
   * Helper: Calculate average dwell time
   */
  calculateAvgDwellTime(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    const totalDwellTime = metrics?.reduce((sum, m) => sum + (m?.dwell_time || 0), 0);
    return (totalDwellTime / metrics?.length)?.toFixed(2);
  }

  /**
   * Helper: Calculate conversion rate
   */
  calculateConversionRate(metrics) {
    if (!metrics || metrics?.length === 0) return 0;
    const totalClicks = metrics?.reduce((sum, m) => sum + (m?.clicks || 0), 0);
    const totalConversions = metrics?.reduce((sum, m) => sum + (m?.conversions || 0), 0);
    return totalClicks > 0 ? ((totalConversions / totalClicks) * 100)?.toFixed(2) : 0;
  }

  /**
   * Helper: Get start date
   */
  getStartDate(timeRange) {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate?.setDate(now?.getDate() - 7);
        break;
      case '30d':
        startDate?.setDate(now?.getDate() - 30);
        break;
      case '60d':
        startDate?.setDate(now?.getDate() - 60);
        break;
      case '90d':
        startDate?.setDate(now?.getDate() - 90);
        break;
      default:
        startDate?.setDate(now?.getDate() - 30);
    }

    return startDate;
  }
}

export const perplexityCarouselIntelligenceService = new PerplexityCarouselIntelligenceService();
export default perplexityCarouselIntelligenceService;