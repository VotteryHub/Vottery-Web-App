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

export const topicPreferenceService = {
  async getAllTopicCategories() {
    try {
      const { data, error } = await supabase
        ?.from('topic_categories')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('display_order', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getUserTopicPreferences(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_topic_preferences')
        ?.select(`
          *,
          topic_categories(*)
        `)
        ?.eq('user_id', userId)
        ?.order('preference_score', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async recordSwipe(swipeData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...swipeData,
        userId: user?.id,
        createdAt: new Date()?.toISOString()
      });

      // Insert swipe history
      const { data: swipeRecord, error: swipeError } = await supabase
        ?.from('swipe_history')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (swipeError) throw swipeError;

      // Update or create user topic preference
      await this.updateTopicPreference(user?.id, swipeData?.topicCategoryId, swipeData?.swipeDirection);

      return { data: toCamelCase(swipeRecord), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateTopicPreference(userId, topicCategoryId, swipeDirection) {
    try {
      // Get existing preference
      const { data: existing } = await supabase
        ?.from('user_topic_preferences')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.eq('topic_category_id', topicCategoryId)
        ?.single();

      const isPositive = swipeDirection === 'right' || swipeDirection === 'up';
      const scoreChange = isPositive ? 0.1 : -0.1;

      if (existing) {
        // Update existing preference
        const newScore = Math.max(-1, Math.min(1, existing?.preference_score + scoreChange));
        const newSwipeCount = existing?.swipe_count + 1;
        const newPositiveSwipes = existing?.positive_swipes + (isPositive ? 1 : 0);
        const newNegativeSwipes = existing?.negative_swipes + (isPositive ? 0 : 1);

        const { error } = await supabase
          ?.from('user_topic_preferences')
          ?.update({
            preference_score: newScore,
            swipe_count: newSwipeCount,
            positive_swipes: newPositiveSwipes,
            negative_swipes: newNegativeSwipes,
            last_interaction_at: new Date()?.toISOString(),
            updated_at: new Date()?.toISOString()
          })
          ?.eq('id', existing?.id);

        if (error) throw error;
      } else {
        // Create new preference
        const { error } = await supabase
          ?.from('user_topic_preferences')
          ?.insert({
            user_id: userId,
            topic_category_id: topicCategoryId,
            preference_score: scoreChange,
            swipe_count: 1,
            positive_swipes: isPositive ? 1 : 0,
            negative_swipes: isPositive ? 0 : 1,
            last_interaction_at: new Date()?.toISOString()
          });

        if (error) throw error;
      }

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getSwipeHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('swipe_history')
        ?.select(`
          *,
          topic_categories(*)
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getPreferenceCompletionStatus(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_topic_preferences')
        ?.select('id')
        ?.eq('user_id', userId);

      if (error) throw error;

      const totalTopics = 6; // Based on mock data
      const completedTopics = data?.length || 0;
      const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

      return {
        data: {
          totalTopics,
          completedTopics,
          completionPercentage,
          isComplete: completedTopics >= totalTopics
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToTopicCategories(callback) {
    const channel = supabase
      ?.channel('topic-categories-changes')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'topic_categories' },
        (payload) => {
          callback(toCamelCase(payload));
        }
      )
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  }
};