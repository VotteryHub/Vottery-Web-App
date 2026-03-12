import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';

class CarouselFeedOrchestrationService {
  constructor() {
    this.contentWeights = {
      horizontal: {
        liveElections: 0.25,
        jolts: 0.35,
        liveMoments: 0.40
      },
      vertical: {
        suggestedConnections: 0.30,
        recommendedGroups: 0.35,
        recommendedElections: 0.35
      },
      gradient: {
        recentWinners: 0.30,
        trendingTopics: 0.35,
        topEarners: 0.35
      }
    };
    this.rhythmPattern = 3; // 3 posts → carousel → 3 posts
    this.freshnessDecayRate = 0.1; // 10% decay per hour
  }

  /**
   * Route carousel content to home feed with intelligent positioning
   */
  async routeCarouselToFeed(userId, feedItems = []) {
    try {
      const carouselContent = await this.fetchCarouselContent(userId);
      const weightedCarousels = this.applyContentWeighting(carouselContent);
      const sequencedFeed = this.applyRhythmOfThree(feedItems, weightedCarousels);
      
      return { data: sequencedFeed, error: null };
    } catch (error) {
      console.error('Error routing carousel to feed:', error);
      return { data: null, error: { message: error?.message } };
    }
  }

  /**
   * Fetch carousel content from all three carousel types
   */
  async fetchCarouselContent(userId) {
    try {
      // Fetch Horizontal Snap content (Live Elections, Jolts, Moments)
      const { data: liveElections } = await supabase?.from('elections')?.select('*')?.eq('status', 'active')?.order('created_at', { ascending: false })?.limit(10);

      const { data: jolts } = await supabase?.from('posts')?.select('*')?.eq('post_type', 'jolt')?.order('created_at', { ascending: false })?.limit(10);

      const { data: liveMoments } = await supabase?.from('posts')?.select('*')?.eq('post_type', 'moment')?.order('created_at', { ascending: false })?.limit(10);

      // Fetch Vertical Stack content (Connections, Groups, Elections)
      const { data: suggestedConnections } = await supabase?.from('user_profiles')?.select('*')?.neq('id', userId)?.limit(10);

      const { data: recommendedGroups } = await supabase?.from('groups')?.select('*')?.eq('is_active', true)?.limit(10);

      const { data: recommendedElections } = await supabase?.from('elections')?.select('*')?.eq('status', 'upcoming')?.limit(10);

      // Fetch Gradient Flow content (Winners, Topics, Earners)
      const { data: recentWinners } = await supabase?.from('prize_redemptions')?.select('*, user:user_id(name, username, avatar)')?.eq('status', 'completed')?.order('created_at', { ascending: false })?.limit(10);

      const { data: trendingTopics } = await supabase?.from('topic_categories')?.select('*')?.order('engagement_score', { ascending: false })?.limit(10);

      const { data: topEarners } = await supabase?.from('user_profiles')?.select('*')?.order('total_earnings', { ascending: false })?.limit(10);

      return {
        horizontal: {
          liveElections: liveElections || [],
          jolts: jolts || [],
          liveMoments: liveMoments || []
        },
        vertical: {
          suggestedConnections: suggestedConnections || [],
          recommendedGroups: recommendedGroups || [],
          recommendedElections: recommendedElections || []
        },
        gradient: {
          recentWinners: recentWinners || [],
          trendingTopics: trendingTopics || [],
          topEarners: topEarners || []
        }
      };
    } catch (error) {
      console.error('Error fetching carousel content:', error);
      return null;
    }
  }

  /**
   * Apply real-time content weighting algorithm
   */
  applyContentWeighting(carouselContent) {
    const weightedCarousels = [];

    // Process Horizontal Snap carousel
    const horizontalItems = [];
    Object.keys(carouselContent?.horizontal)?.forEach(contentType => {
      const items = carouselContent?.horizontal?.[contentType];
      const weight = this.contentWeights?.horizontal?.[contentType];
      items?.forEach(item => {
        const freshnessScore = this.calculateFreshnessScore(item?.created_at);
        const engagementScore = this.calculateEngagementScore(item);
        const finalWeight = weight * freshnessScore * engagementScore;
        horizontalItems?.push({ ...item, contentType, weight: finalWeight, carouselType: 'horizontal' });
      });
    });
    horizontalItems?.sort((a, b) => b?.weight - a?.weight);
    if (horizontalItems?.length > 0) {
      weightedCarousels?.push({
        type: 'horizontal',
        items: horizontalItems?.slice(0, 8),
        totalWeight: horizontalItems?.reduce((sum, item) => sum + item?.weight, 0)
      });
    }

    // Process Vertical Stack carousel
    const verticalItems = [];
    Object.keys(carouselContent?.vertical)?.forEach(contentType => {
      const items = carouselContent?.vertical?.[contentType];
      const weight = this.contentWeights?.vertical?.[contentType];
      items?.forEach(item => {
        const freshnessScore = this.calculateFreshnessScore(item?.created_at);
        const engagementScore = this.calculateEngagementScore(item);
        const finalWeight = weight * freshnessScore * engagementScore;
        verticalItems?.push({ ...item, contentType, weight: finalWeight, carouselType: 'vertical' });
      });
    });
    verticalItems?.sort((a, b) => b?.weight - a?.weight);
    if (verticalItems?.length > 0) {
      weightedCarousels?.push({
        type: 'vertical',
        items: verticalItems?.slice(0, 8),
        totalWeight: verticalItems?.reduce((sum, item) => sum + item?.weight, 0)
      });
    }

    // Process Gradient Flow carousel
    const gradientItems = [];
    Object.keys(carouselContent?.gradient)?.forEach(contentType => {
      const items = carouselContent?.gradient?.[contentType];
      const weight = this.contentWeights?.gradient?.[contentType];
      items?.forEach(item => {
        const freshnessScore = this.calculateFreshnessScore(item?.created_at);
        const engagementScore = this.calculateEngagementScore(item);
        const finalWeight = weight * freshnessScore * engagementScore;
        gradientItems?.push({ ...item, contentType, weight: finalWeight, carouselType: 'gradient' });
      });
    });
    gradientItems?.sort((a, b) => b?.weight - a?.weight);
    if (gradientItems?.length > 0) {
      weightedCarousels?.push({
        type: 'gradient',
        items: gradientItems?.slice(0, 8),
        totalWeight: gradientItems?.reduce((sum, item) => sum + item?.weight, 0)
      });
    }

    // Sort carousels by total weight
    weightedCarousels?.sort((a, b) => b?.totalWeight - a?.totalWeight);
    return weightedCarousels;
  }

  /**
   * Calculate content freshness score with time-decay algorithm
   */
  calculateFreshnessScore(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
    const freshnessScore = Math.exp(-this.freshnessDecayRate * hoursSinceCreation);
    return Math.max(0.1, freshnessScore); // Minimum 10% freshness
  }

  /**
   * Calculate engagement score based on user interactions
   */
  calculateEngagementScore(item) {
    const likes = item?.likes || 0;
    const comments = item?.comments || 0;
    const shares = item?.shares || 0;
    const views = item?.views || 1;
    
    const engagementRate = (likes + comments * 2 + shares * 3) / views;
    return Math.min(2.0, 1 + engagementRate); // Cap at 2x multiplier
  }

  /**
   * Apply Rhythm of 3 pattern: 3 posts → carousel → 3 posts
   */
  applyRhythmOfThree(feedItems, weightedCarousels) {
    const sequencedFeed = [];
    let postCounter = 0;
    let carouselIndex = 0;

    for (let i = 0; i < feedItems?.length; i++) {
      sequencedFeed?.push(feedItems?.[i]);
      postCounter++;

      // Insert carousel after every 3 posts
      if (postCounter === this.rhythmPattern && carouselIndex < weightedCarousels?.length) {
        sequencedFeed?.push({
          type: 'carousel',
          carouselType: weightedCarousels?.[carouselIndex]?.type,
          items: weightedCarousels?.[carouselIndex]?.items,
          id: `carousel-${carouselIndex}`
        });
        carouselIndex++;
        postCounter = 0;
      }
    }

    return sequencedFeed;
  }

  /**
   * Dynamic carousel type selection based on user engagement patterns
   */
  async selectCarouselType(userId, engagementHistory) {
    try {
      const response = await getChatCompletion(
        'OPEN_AI',
        'gpt-4o',
        [
          {
            role: 'system',
            content: 'You are a carousel optimization AI. Analyze user engagement patterns and recommend the best carousel type (horizontal, vertical, or gradient) for maximum engagement.'
          },
          {
            role: 'user',
            content: `Analyze engagement history and recommend carousel type: ${JSON.stringify(engagementHistory)}. Return JSON with: recommendedType (string), confidence (0-1), reasoning (string), expectedEngagement (number).`
          }
        ],
        {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'carousel_type_selection',
              schema: {
                type: 'object',
                properties: {
                  recommendedType: { type: 'string' },
                  confidence: { type: 'number' },
                  reasoning: { type: 'string' },
                  expectedEngagement: { type: 'number' }
                },
                required: ['recommendedType', 'confidence', 'reasoning', 'expectedEngagement'],
                additionalProperties: false
              }
            }
          },
          max_completion_tokens: 1000
        }
      );

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error selecting carousel type:', error);
      return { recommendedType: 'horizontal', confidence: 0.5, reasoning: 'Default selection', expectedEngagement: 0.5 };
    }
  }

  /**
   * Automated carousel positioning optimization
   */
  async optimizeCarouselPositioning(feedData, performanceMetrics) {
    try {
      const response = await getChatCompletion(
        'OPEN_AI',
        'gpt-4o',
        [
          {
            role: 'system',
            content: 'You are a feed optimization AI. Analyze feed performance metrics and recommend optimal carousel positioning for maximum engagement and conversion.'
          },
          {
            role: 'user',
            content: `Optimize carousel positioning: Feed Data: ${JSON.stringify(feedData)}. Performance Metrics: ${JSON.stringify(performanceMetrics)}. Return JSON with: optimalPositions (array of numbers), expectedImprovement (percentage), reasoning (string), recommendations (array).`
          }
        ],
        {
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'carousel_positioning',
              schema: {
                type: 'object',
                properties: {
                  optimalPositions: {
                    type: 'array',
                    items: { type: 'number' }
                  },
                  expectedImprovement: { type: 'number' },
                  reasoning: { type: 'string' },
                  recommendations: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['optimalPositions', 'expectedImprovement', 'reasoning', 'recommendations'],
                additionalProperties: false
              }
            }
          },
          max_completion_tokens: 1500
        }
      );

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error optimizing carousel positioning:', error);
      return null;
    }
  }

  /**
   * Update content weights based on performance
   */
  updateContentWeights(carouselType, contentType, performanceDelta) {
    if (this.contentWeights?.[carouselType] && this.contentWeights?.[carouselType]?.[contentType]) {
      const currentWeight = this.contentWeights?.[carouselType]?.[contentType];
      const newWeight = Math.max(0.1, Math.min(0.5, currentWeight + performanceDelta));
      this.contentWeights[carouselType][contentType] = newWeight;
      
      // Normalize weights to sum to 1.0
      const totalWeight = Object.values(this.contentWeights?.[carouselType])?.reduce((sum, w) => sum + w, 0);
      Object.keys(this.contentWeights?.[carouselType])?.forEach(key => {
        this.contentWeights[carouselType][key] /= totalWeight;
      });
    }
  }
}

export const carouselFeedOrchestrationService = new CarouselFeedOrchestrationService();
export default carouselFeedOrchestrationService;