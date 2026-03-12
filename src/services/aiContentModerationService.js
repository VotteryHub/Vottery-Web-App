import { supabase } from '../lib/supabase';

const CONFIDENCE_THRESHOLD = 0.6;

/**
 * AI Content Moderation Service
 * Filters carousel/feed content based on Claude moderation results (content_moderation_results).
 * Excludes items with confidence_score >= threshold (default 0.6).
 */
export const aiContentModerationService = {
  /**
   * Filter items by moderation status. Excludes content with high violation confidence.
   * @param {Array} items - Content items with id
   * @param {string} contentType - 'post' | 'comment' | 'jolt' | 'election' | 'moment'
   * @returns {Promise<Array>} Filtered items
   */
  async filterByModeration(items, contentType = 'post') {
    if (!items?.length) return items;
    try {
      const ids = items?.map(i => i?.id)?.filter(Boolean);
      if (!ids?.length) return items;

      const { data: modResults } = await supabase
        ?.from('content_moderation_results')
        ?.select('content_id, confidence_score, auto_removed')
        ?.eq('content_type', contentType)
        ?.in('content_id', ids);

      const flaggedIds = new Set(
        (modResults || [])
          ?.filter(r => (r?.confidence_score ?? 0) >= CONFIDENCE_THRESHOLD || r?.auto_removed)
          ?.map(r => r?.content_id)
      );

      return items?.filter(i => !flaggedIds?.has(i?.id)) ?? items;
    } catch (e) {
      console.warn('AI content moderation filter error:', e);
      return items;
    }
  },

  /**
   * Get moderation status for a single content item
   */
  async getModerationStatus(contentId, contentType = 'post') {
    try {
      const { data } = await supabase
        ?.from('content_moderation_results')
        ?.select('confidence_score, primary_category, auto_removed')
        ?.eq('content_id', contentId)
        ?.eq('content_type', contentType)
        ?.maybeSingle();
      return data;
    } catch (_) {
      return null;
    }
  },

  /**
   * Manually trigger moderation for content (calls content-moderation-trigger Edge function)
   */
  async moderateContent(contentId, contentType, contentText) {
    try {
      const { data } = await supabase?.functions?.invoke('content-moderation-trigger', {
        body: { type: 'manual', table: contentType === 'post' ? 'posts' : 'comments', record: { id: contentId, content: contentText, body: contentText, text: contentText } }
      });
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  }
};

export default aiContentModerationService;
