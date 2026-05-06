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

export const postsService = {
  async getAll(filters = {}) {
    try {
      let query = supabase?.from('posts')?.select(`
        *,
        user_profiles!posts_user_id_fkey(name, username, avatar, verified),
        elections(title, category)
      `)?.order('created_at', { ascending: false });

      if (filters?.userId) query = query?.eq('user_id', filters?.userId);
      if (filters?.electionId) query = query?.eq('election_id', filters?.electionId);
      if (filters?.campaignId) query = query?.eq('ad_campaign_id', filters?.campaignId);

      // Cursor-based pagination
      if (filters?.cursor) {
        query = query?.lt('created_at', filters?.cursor);
      }
      const pageSize = filters?.pageSize || 20;
      query = query?.limit(pageSize);

      const { data, error } = await query;
      if (error) throw error;

      const camelData = toCamelCase(data);
      const nextCursor = camelData?.length === pageSize ? camelData?.[camelData?.length - 1]?.createdAt : null;

      return { data: camelData, nextCursor, hasMore: !!nextCursor, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async create(postData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase?.from('posts')?.insert({
        user_id: user?.id,
        content: postData?.content,
        image: postData?.image || null,
        image_alt: postData?.imageAlt || null,
        election_id: postData?.electionId || null,
        ad_campaign_id: postData?.adCampaignId || null,
        is_sponsored: postData?.isSponsored || false,
        status: postData?.status || 'published'
      })?.select()?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async delete(postId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase?.from('posts')?.delete()?.eq('id', postId)?.eq('user_id', user?.id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  subscribeToFeed(callback) {
    const channel = supabase?.channel('posts-feed')?.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => callback({
        eventType: payload?.eventType,
        new: toCamelCase(payload?.new),
        old: toCamelCase(payload?.old)
      })
    )?.subscribe();
    return () => supabase?.removeChannel(channel);
  }

};