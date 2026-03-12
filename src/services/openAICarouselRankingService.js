import { generateContent } from './geminiChatService';
import { supabase } from '../lib/supabase';

class OpenAICarouselRankingService {
  constructor() {
    this.userBehaviorCache = new Map();
    this.rankingCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Analyze user behavior patterns for carousel personalization
   */
  async analyzeUserBehavior(userId) {
    try {
      const cached = this.userBehaviorCache?.get(userId);
      if (cached && Date.now() - cached?.timestamp < this.cacheExpiry) {
        return cached?.data;
      }

      // Fetch user interaction data from Supabase
      const { data: interactions, error } = await supabase?.from('user_active_sessions')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(100);

      if (error) throw error;

      const behaviorData = {
        userId,
        totalInteractions: interactions?.length || 0,
        recentActivity: interactions?.slice(0, 20) || [],
        timestamp: Date.now()
      };

      this.userBehaviorCache?.set(userId, { data: behaviorData, timestamp: Date.now() });
      return behaviorData;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return null;
    }
  }

  /**
   * Semantic analysis of carousel content with Gemini
   */
  async semanticContentAnalysis(carouselItems, userBehavior) {
    try {
      const response = await generateContent(
        [
          {
            role: 'system',
            content: 'You are a carousel content ranking AI specializing in semantic analysis, user behavior prediction, and conversion optimization. Analyze content relevance, user preferences, and engagement patterns to provide personalized content ordering. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: `Analyze these carousel items and user behavior to provide personalized ranking: Items: ${JSON.stringify(carouselItems?.slice(0, 10))}. User Behavior: ${JSON.stringify(userBehavior)}. Return JSON with: rankedItems (array with id, relevanceScore, reasoning), contentTypePreferences (object), predictedEngagement (object), conversionProbability (0-1), recommendations (array).`
          }
        ],
        {
          model: 'gemini-1.5-flash',
          max_completion_tokens: 2000,
          response_format: { type: 'json_object' }
        }
      );
      const raw = response?.choices?.[0]?.message?.content;
      if (!raw) return null;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return {
        rankedItems: parsed?.rankedItems ?? [],
        contentTypePreferences: parsed?.contentTypePreferences ?? {},
        predictedEngagement: parsed?.predictedEngagement ?? {},
        conversionProbability: parsed?.conversionProbability ?? 0,
        recommendations: parsed?.recommendations ?? []
      };
    } catch (error) {
      console.error('Error in semantic content analysis:', error);
      return null;
    }
  }

  /**
   * Swipe velocity analysis for engagement prediction
   */
  analyzeSwipeVelocity(swipeHistory) {
    if (!swipeHistory || swipeHistory?.length < 2) {
      return { avgVelocity: 0, pattern: 'insufficient_data' };
    }

    const velocities = [];
    for (let i = 1; i < swipeHistory?.length; i++) {
      const timeDiff = swipeHistory?.[i]?.timestamp - swipeHistory?.[i - 1]?.timestamp;
      if (timeDiff > 0) {
        velocities?.push(1000 / timeDiff); // swipes per second
      }
    }

    const avgVelocity = velocities?.reduce((a, b) => a + b, 0) / velocities?.length;
    const pattern = avgVelocity > 2 ? 'fast_browser' : avgVelocity > 0.5 ? 'engaged' : 'slow_browser';

    return { avgVelocity, pattern, velocities };
  }

  /**
   * Engagement history scoring
   */
  calculateEngagementScore(userHistory) {
    if (!userHistory || userHistory?.length === 0) {
      return { score: 0, factors: {} };
    }

    const factors = {
      dwellTime: 0,
      clickThrough: 0,
      swipeCompletion: 0,
      contentDiversity: 0
    };

    // Calculate dwell time score (0-25 points)
    const avgDwellTime = userHistory?.reduce((sum, item) => sum + (item?.dwellTime || 0), 0) / userHistory?.length;
    factors.dwellTime = Math.min(25, (avgDwellTime / 10) * 25);

    // Calculate click-through score (0-25 points)
    const clickThroughRate = userHistory?.filter(item => item?.clicked)?.length / userHistory?.length;
    factors.clickThrough = clickThroughRate * 25;

    // Calculate swipe completion score (0-25 points)
    const completionRate = userHistory?.filter(item => item?.completed)?.length / userHistory?.length;
    factors.swipeCompletion = completionRate * 25;

    // Calculate content diversity score (0-25 points)
    const uniqueTypes = new Set(userHistory.map(item => item.contentType))?.size;
    factors.contentDiversity = Math.min(25, (uniqueTypes / 4) * 25);

    const totalScore = Object.values(factors)?.reduce((a, b) => a + b, 0);

    return { score: totalScore, factors };
  }

  /**
   * Personalized carousel content ordering
   */
  async personalizeCarouselOrder(carouselType, items, userId) {
    try {
      const cacheKey = `${carouselType}_${userId}`;
      const cached = this.rankingCache?.get(cacheKey);
      if (cached && Date.now() - cached?.timestamp < this.cacheExpiry) {
        return cached?.data;
      }

      const userBehavior = await this.analyzeUserBehavior(userId);
      if (!userBehavior) {
        return items; // Return original order if analysis fails
      }

      const semanticAnalysis = await this.semanticContentAnalysis(items, userBehavior);
      if (!semanticAnalysis) {
        return items;
      }

      // Reorder items based on relevance scores
      const rankedItems = items?.map(item => {
        const ranking = semanticAnalysis?.rankedItems?.find(r => r?.id === item?.id);
        return {
          ...item,
          relevanceScore: ranking?.relevanceScore || 0,
          reasoning: ranking?.reasoning || ''
        };
      })?.sort((a, b) => b?.relevanceScore - a?.relevanceScore);

      const result = {
        items: rankedItems,
        analysis: semanticAnalysis,
        timestamp: Date.now()
      };

      this.rankingCache?.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      console.error('Error personalizing carousel order:', error);
      return items;
    }
  }

  /**
   * A/B test winner prediction (Gemini)
   */
  async predictABTestWinner(variantA, variantB, historicalData) {
    try {
      const response = await generateContent(
        [
          {
            role: 'system',
            content: 'You are an A/B testing analyst. Return only valid JSON with: predictedWinner (A or B), confidence (0-1), reasoning (string), expectedLift (number), recommendedAction (string).'
          },
          {
            role: 'user',
            content: `Predict A/B test winner: Variant A: ${JSON.stringify(variantA)}. Variant B: ${JSON.stringify(variantB)}. Historical: ${JSON.stringify(historicalData)}.`
          }
        ],
        { model: 'gemini-1.5-flash', max_completion_tokens: 1000, response_format: { type: 'json_object' } }
      );
      const raw = response?.choices?.[0]?.message?.content;
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error predicting A/B test winner:', error);
      return null;
    }
  }

  /**
   * Real-time recommendation updates
   */
  async updateRecommendations(userId, interactionData) {
    try {
      // Store interaction in cache for immediate use
      const userBehavior = this.userBehaviorCache?.get(userId);
      if (userBehavior) {
        userBehavior?.data?.recentActivity?.unshift(interactionData);
        userBehavior.data.recentActivity = userBehavior?.data?.recentActivity?.slice(0, 20);
        userBehavior.timestamp = Date.now();
      }

      // Invalidate ranking cache to force re-ranking on next request
      for (const key of this.rankingCache?.keys()) {
        if (key?.includes(userId)) {
          this.rankingCache?.delete(key);
        }
      }

      return { success: true, message: 'Recommendations updated' };
    } catch (error) {
      console.error('Error updating recommendations:', error);
      return { success: false, error: error?.message };
    }
  }

  /**
   * Conversion rate optimization analysis (Gemini)
   */
  async optimizeConversionRate(carouselData, conversionGoals) {
    try {
      const response = await generateContent(
        [
          {
            role: 'system',
            content: 'You are a conversion rate optimization specialist. Return only valid JSON with: currentConversionRate (number), optimizationOpportunities (array of strings), contentReordering (array of { contentId, newPosition, reasoning }), expectedImprovement (number), actionableSteps (array of strings).'
          },
          {
            role: 'user',
            content: `Optimize carousel conversion: Data: ${JSON.stringify(carouselData)}. Goals: ${JSON.stringify(conversionGoals)}.`
          }
        ],
        { model: 'gemini-1.5-flash', max_completion_tokens: 2000, response_format: { type: 'json_object' } }
      );
      const raw = response?.choices?.[0]?.message?.content;
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Error optimizing conversion rate:', error);
      return null;
    }
  }

  /**
   * Clear all caches
   */
  clearCaches() {
    this.userBehaviorCache?.clear();
    this.rankingCache?.clear();
  }
}

export default new OpenAICarouselRankingService();
