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

export const friendsService = {
  async getFriendRequests(status = 'pending') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('friend_requests')
        ?.select(`
          *,
          sender:sender_id(id, name, username, avatar, verified),
          receiver:receiver_id(id, name, username, avatar, verified)
        `)
        ?.or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        ?.eq('status', status)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendFriendRequest(receiverId, message = '') {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('friend_requests')
        ?.insert({
          sender_id: user?.id,
          receiver_id: receiverId,
          message,
          status: 'pending'
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async acceptFriendRequest(requestId) {
    try {
      const { data, error } = await supabase
        ?.from('friend_requests')
        ?.update({ status: 'accepted', updated_at: new Date()?.toISOString() })
        ?.eq('id', requestId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async rejectFriendRequest(requestId) {
    try {
      const { data, error } = await supabase
        ?.from('friend_requests')
        ?.update({ status: 'rejected', updated_at: new Date()?.toISOString() })
        ?.eq('id', requestId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFriends() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('friendships')
        ?.select(`
          *,
          user_one:user_one_id(id, name, username, avatar, verified, stats),
          user_two:user_two_id(id, name, username, avatar, verified, stats)
        `)
        ?.or(`user_one_id.eq.${user?.id},user_two_id.eq.${user?.id}`)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async unfriend(friendshipId) {
    try {
      const { error } = await supabase
        ?.from('friendships')
        ?.delete()
        ?.eq('id', friendshipId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getFollowers() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('followers')
        ?.select(`
          *,
          follower:follower_id(id, name, username, avatar, verified)
        `)
        ?.eq('following_id', user?.id)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFollowing() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('followers')
        ?.select(`
          *,
          following:following_id(id, name, username, avatar, verified)
        `)
        ?.eq('follower_id', user?.id)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async followUser(userId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('followers')
        ?.insert({
          follower_id: user?.id,
          following_id: userId
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async unfollowUser(userId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('followers')
        ?.delete()
        ?.eq('follower_id', user?.id)
        ?.eq('following_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async getSuggestedFriends() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get users who are not already friends
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('id, name, username, avatar, verified, stats')
        ?.neq('id', user?.id)
        ?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default friendsService;