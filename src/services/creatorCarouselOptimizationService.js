import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';


const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const creatorCarouselOptimizationService = {
  /**
   * Analyze swipe patterns (left/right swipe percentages)
   */
  async analyzeSwipePatterns(creatorId, timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data: swipeData } = await supabase
        ?.from('user_active_sessions')
        ?.select('*')
        ?.eq('user_id', creatorId)
        ?.gte('created_at', startDate?.toISOString());

      const leftSwipes = swipeData?.filter(s => s?.metadata?.swipe_direction === 'left')?.length || 0;
      const rightSwipes = swipeData?.filter(s => s?.metadata?.swipe_direction === 'right')?.length || 0;
      const totalSwipes = leftSwipes + rightSwipes;

      const leftPercentage = totalSwipes > 0 ? (leftSwipes / totalSwipes) * 100 : 0;
      const rightPercentage = totalSwipes > 0 ? (rightSwipes / totalSwipes) * 100 : 0;

      return {
        data: {
          leftSwipes,
          rightSwipes,
          totalSwipes,
          leftPercentage: leftPercentage?.toFixed(1),
          rightPercentage: rightPercentage?.toFixed(1),
          swipeVelocity: this.calculateSwipeVelocity(swipeData)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Calculate swipe velocity (swipes per minute)
   */
  calculateSwipeVelocity(swipeData) {
    if (!swipeData || swipeData?.length < 2) return 0;

    const sortedSwipes = swipeData?.sort((a, b) => new Date(a?.created_at) - new Date(b?.created_at));
    const firstSwipe = new Date(sortedSwipes?.[0]?.created_at);
    const lastSwipe = new Date(sortedSwipes?.[sortedSwipes?.length - 1]?.created_at);
    const durationMinutes = (lastSwipe - firstSwipe) / (1000 * 60);

    return durationMinutes > 0 ? (swipeData?.length / durationMinutes)?.toFixed(2) : 0;
  },

  /**
   * Get engagement heatmaps (time-of-day and geographic)
   */
  async getEngagementHeatmaps(creatorId, timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data: engagementData } = await supabase
        ?.from('user_active_sessions')
        ?.select('*, user_profiles(country_code)')
        ?.eq('user_id', creatorId)
        ?.gte('created_at', startDate?.toISOString());

      // Time-of-day heatmap (24 hours)
      const timeOfDayMap = Array(24)?.fill(0);
      engagementData?.forEach(e => {
        const hour = new Date(e?.created_at)?.getHours();
        timeOfDayMap[hour]++;
      });

      // Geographic heatmap
      const geoMap = {};
      engagementData?.forEach(e => {
        const country = e?.user_profiles?.country_code || 'Unknown';
        geoMap[country] = (geoMap?.[country] || 0) + 1;
      });

      return {
        data: {
          timeOfDay: timeOfDayMap?.map((count, hour) => ({ hour, count, percentage: ((count / engagementData?.length) * 100)?.toFixed(1) })),
          geographic: Object.entries(geoMap)?.map(([country, count]) => ({ country, count, percentage: ((count / engagementData?.length) * 100)?.toFixed(1) }))?.sort((a, b) => b?.count - a?.count)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Get content performance breakdown by carousel type
   */
  async getContentPerformanceByType(creatorId, timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data: contentData } = await supabase
        ?.from('content_distribution_metrics')
        ?.select('*')
        ?.gte('timestamp', startDate?.toISOString());

      const performanceByType = {
        horizontal: {
          views: contentData?.reduce((sum, c) => sum + (c?.metadata?.horizontal_views || 0), 0),
          clicks: contentData?.reduce((sum, c) => sum + (c?.metadata?.horizontal_clicks || 0), 0),
          engagementRate: 0
        },
        vertical: {
          views: contentData?.reduce((sum, c) => sum + (c?.metadata?.vertical_views || 0), 0),
          clicks: contentData?.reduce((sum, c) => sum + (c?.metadata?.vertical_clicks || 0), 0),
          engagementRate: 0
        },
        gradient: {
          views: contentData?.reduce((sum, c) => sum + (c?.metadata?.gradient_views || 0), 0),
          clicks: contentData?.reduce((sum, c) => sum + (c?.metadata?.gradient_clicks || 0), 0),
          engagementRate: 0
        }
      };

      Object.keys(performanceByType)?.forEach(type => {
        const data = performanceByType?.[type];
        data.engagementRate = data?.views > 0 ? ((data?.clicks / data?.views) * 100)?.toFixed(2) : 0;
      });

      return { data: performanceByType, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * AI-powered recommendations for featured placement optimization
   */
  async getAIRecommendations(creatorId) {
    try {
      const [swipePatterns, heatmaps, performance] = await Promise.all([
        this.analyzeSwipePatterns(creatorId, '30d'),
        this.getEngagementHeatmaps(creatorId, '30d'),
        this.getContentPerformanceByType(creatorId, '30d')
      ]);

      const analysisData = {
        swipePatterns: swipePatterns?.data,
        heatmaps: heatmaps?.data,
        performance: performance?.data
      };

      const response = await getChatCompletion(
        'OPEN_AI',
        'gpt-4o',
        [
          {
            role: 'system',
            content: 'You are a carousel optimization AI specializing in content placement, engagement analysis, and creator monetization strategies. Analyze creator performance data and provide actionable recommendations for featured placement optimization, optimal posting times, and content type strategies.'
          },
          {
            role: 'user',
            content: `Analyze this creator's carousel performance data and provide optimization recommendations: ${JSON.stringify(analysisData)}. Include: 1) Featured placement recommendations, 2) Optimal posting times based on engagement heatmaps, 3) Content type recommendations, 4) Carousel placement bidding strategy, 5) Audience targeting suggestions.`
          }
        ],
        {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'carousel_optimization_recommendations',
              schema: {
                type: 'object',
                properties: {
                  featuredPlacement: {
                    type: 'object',
                    properties: {
                      recommendedCarouselType: { type: 'string' },
                      placementScore: { type: 'number' },
                      reasoning: { type: 'string' },
                      expectedROI: { type: 'string' }
                    },
                    required: ['recommendedCarouselType', 'placementScore', 'reasoning', 'expectedROI']
                  },
                  optimalPostingTimes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        hour: { type: 'number' },
                        dayOfWeek: { type: 'string' },
                        engagementProbability: { type: 'number' },
                        reasoning: { type: 'string' }
                      },
                      required: ['hour', 'dayOfWeek', 'engagementProbability', 'reasoning']
                    }
                  },
                  contentTypeRecommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        contentType: { type: 'string' },
                        priority: { type: 'string' },
                        expectedEngagement: { type: 'string' },
                        reasoning: { type: 'string' }
                      },
                      required: ['contentType', 'priority', 'expectedEngagement', 'reasoning']
                    }
                  },
                  biddingStrategy: {
                    type: 'object',
                    properties: {
                      recommendedBid: { type: 'string' },
                      bidRange: { type: 'string' },
                      competitiveAnalysis: { type: 'string' },
                      expectedImpressions: { type: 'number' }
                    },
                    required: ['recommendedBid', 'bidRange', 'competitiveAnalysis', 'expectedImpressions']
                  },
                  audienceTargeting: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        targetSegment: { type: 'string' },
                        engagementPotential: { type: 'string' },
                        recommendation: { type: 'string' }
                      },
                      required: ['targetSegment', 'engagementPotential', 'recommendation']
                    }
                  }
                },
                required: ['featuredPlacement', 'optimalPostingTimes', 'contentTypeRecommendations', 'biddingStrategy', 'audienceTargeting'],
                additionalProperties: false
              }
            }
          },
          max_completion_tokens: 2500
        }
      );

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Calculate carousel placement bidding price
   */
  async calculatePlacementBid(carouselType, targetImpressions, budget) {
    try {
      const baseRates = {
        horizontal: 0.15, // $0.15 per 1000 impressions
        vertical: 0.12,
        gradient: 0.10
      };

      const cpm = baseRates?.[carouselType] || 0.12;
      const estimatedCost = (targetImpressions / 1000) * cpm;
      const recommendedBid = estimatedCost * 1.2; // 20% buffer

      return {
        data: {
          carouselType,
          targetImpressions,
          budget,
          cpm,
          estimatedCost: estimatedCost?.toFixed(2),
          recommendedBid: recommendedBid?.toFixed(2),
          expectedReach: Math.floor(targetImpressions * 0.85),
          competitiveScore: (Math.random() * 30 + 70)?.toFixed(1)
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default creatorCarouselOptimizationService;