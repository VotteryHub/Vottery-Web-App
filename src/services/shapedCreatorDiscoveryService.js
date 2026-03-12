/**
 * @deprecated Shaped AI has been removed. This module delegates to geminiRecommendationService.
 * Use geminiRecommendationService directly in new code.
 */

import { geminiRecommendationService } from './geminiRecommendationService';
import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

export const shapedCreatorDiscoveryService = {
  async getCreatorRecommendations(userId, limit = 10) {
    return geminiRecommendationService.getCreatorRecommendations(userId, limit);
  },
  async getMarketplaceRecommendations(creatorId, audienceSegment) {
    const { data: user } = await supabase?.from('user_profiles')?.select('id')?.single();
    return geminiRecommendationService.getMarketplaceRecommendations(user?.id, creatorId);
  },
  async forecastEngagement(creatorId, contentType = 'election') {
    const result = await geminiRecommendationService.forecastEngagement(creatorId, {});
    return { data: result.data?.data ?? result.data, error: result.error };
  },
  async matchCreatorToAudience(creatorId, targetAudienceProfile) {
    const { data: profile } = await supabase?.from('user_profiles')?.select('*')?.eq('id', creatorId)?.single();
    const matchScore = 65;
    return {
      data: toCamelCase({
        creatorId,
        matchScore,
        matchLevel: matchScore > 80 ? 'excellent' : matchScore > 60 ? 'good' : 'fair',
        strengths: ['Strong engagement history'],
        opportunities: ['Expand to new categories'],
        recommendedActions: ['Test with small campaign']
      }),
      error: null
    };
  },
  async getUserPreferences(userId) {
    const { data } = await supabase?.from('user_preferences')?.select('*')?.eq('user_id', userId)?.single();
    return data || {};
  },
  async enrichCreatorRecommendations(recommendations) {
    return recommendations?.map((r) => ({ ...r, creator: r, engagementForecast: { data: {} } })) ?? [];
  },
  analyzeEngagementPatterns(elections) {
    if (!elections?.length) return { averageReach: 1000, averageEngagement: 100, peakEngagementTime: '18:00' };
    const totalViews = elections.reduce((s, e) => s + (e?.view_count || 0), 0);
    const totalVotes = elections.reduce((s, e) => s + (e?.total_votes || 0), 0);
    return {
      averageReach: Math.floor(totalViews / elections.length),
      averageEngagement: Math.floor(totalVotes / elections.length),
      peakEngagementTime: '18:00'
    };
  },
  async getCreatorProfile(creatorId) {
    const { data: profile } = await supabase?.from('user_profiles')?.select('*')?.eq('id', creatorId)?.single();
    const { data: elections } = await supabase?.from('elections')?.select('*')?.eq('created_by', creatorId);
    return { profile: toCamelCase(profile), totalElections: elections?.length ?? 0, categories: [] };
  },
  calculateAudienceMatchScore: () => 70,
  identifyMatchStrengths: () => ['Strong engagement history', 'Consistent content quality'],
  identifyGrowthOpportunities: () => ['Expand to new categories', 'Increase posting frequency'],
  generateMatchRecommendations: (score) => (score > 80 ? ['Proceed with collaboration'] : ['Test with small campaign']),
  calculateConfidence: (dataPoints) => Math.min(0.5 + dataPoints * 0.01, 0.95),
  estimateViralTime: (views) => (views > 10000 ? '6 hours' : views > 1000 ? '24 hours' : '48 hours'),
  getOptimalPostTime: () => '18:00 UTC'
};
