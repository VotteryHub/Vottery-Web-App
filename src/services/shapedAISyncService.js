/**
 * @deprecated Shaped AI has been removed. This module delegates to geminiRecommendationService.
 * Use geminiRecommendationService directly in new code.
 */

import { geminiRecommendationService } from './geminiRecommendationService';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

export const shapedAISyncService = {
  startSyncWorker: () => geminiRecommendationService.startSyncWorker(),
  stopSyncWorker: () => geminiRecommendationService.stopSyncWorker(),
  syncVoteEvents: () => geminiRecommendationService.syncVoteEvents(),
  manualSync: () => geminiRecommendationService.manualSync(),
  getSyncStatus: () => geminiRecommendationService.getSyncStatus(),
  getDockerStatus: () => geminiRecommendationService.getDockerStatus(),
  async getCreatorRecommendations(userId, limit = 10) {
    const result = await geminiRecommendationService.getCreatorRecommendations(userId, limit);
    return { data: result.data, error: result.error };
  },
  async getMarketplaceRecommendations(userId, creatorId) {
    const result = await geminiRecommendationService.getMarketplaceRecommendations(userId, creatorId);
    return { data: result.data, error: result.error };
  },
  async forecastEngagement(creatorId, audienceSegment) {
    const result = await geminiRecommendationService.forecastEngagement(creatorId, audienceSegment);
    return { data: result.data, error: result.error };
  },
  syncCreatorEngagementData: async () => ({ success: true, data: null, error: null })
};
