import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

export const reactionsService = {
  async getReactions(contentType, contentId) {
    try {
      const { data, error } = await supabase
        ?.from('emoji_reactions')
        ?.select('emoji')
        ?.eq('content_type', contentType)
        ?.eq('content_id', contentId);

      if (error) throw error;

      // Count reactions by emoji
      const reactionCounts = {};
      data?.forEach(reaction => {
        reactionCounts[reaction?.emoji] = (reactionCounts?.[reaction?.emoji] || 0) + 1;
      });

      const reactions = Object.entries(reactionCounts)?.map(([emoji, count]) => ({
        emoji,
        count
      }));

      return { data: reactions, error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async getUserReactions(contentType, contentId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: [], error: null };

      const { data, error } = await supabase
        ?.from('emoji_reactions')
        ?.select('emoji')
        ?.eq('content_type', contentType)
        ?.eq('content_id', contentId)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { data: data?.map(r => r?.emoji) || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async addReaction(contentType, contentId, emoji) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('emoji_reactions')
        ?.insert({
          user_id: user?.id,
          content_type: contentType,
          content_id: contentId,
          emoji: emoji
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async removeReaction(contentType, contentId, emoji) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('emoji_reactions')
        ?.delete()
        ?.eq('user_id', user?.id)
        ?.eq('content_type', contentType)
        ?.eq('content_id', contentId)
        ?.eq('emoji', emoji);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getSentimentAnalysis(contentType, contentId) {
    try {
      const { data: reactions } = await this.getReactions(contentType, contentId);
      
      const sentimentMap = {
        '❤️': 'positive',
        '👍': 'positive',
        '😂': 'positive',
        '😢': 'negative',
        '😮': 'neutral',
        '🔥': 'positive',
        '🎉': 'positive',
        '👏': 'positive'
      };

      const sentiment = { positive: 0, neutral: 0, negative: 0 };
      reactions?.forEach(reaction => {
        const type = sentimentMap?.[reaction?.emoji] || 'neutral';
        sentiment[type] += reaction?.count;
      });

      return { data: sentiment, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default reactionsService;