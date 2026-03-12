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

export const creatorCommunityService = {
  // Communities
  async getAllCommunities(category = null) {
    try {
      let query = supabase
        ?.from('creator_communities')
        ?.select('*, creator:creator_id(username, full_name)')
        ?.order('member_count', { ascending: false });

      if (category) {
        query = query?.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createCommunity(communityData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...communityData,
        creatorId: user?.id
      });

      const { data, error } = await supabase
        ?.from('creator_communities')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Discussions
  async getDiscussions(communityId = null, filters = {}) {
    try {
      let query = supabase
        ?.from('community_discussions')
        ?.select('*, creator:creator_id(username, full_name, avatar), community:community_id(name)')
        ?.order('created_at', { ascending: false });

      if (communityId) {
        query = query?.eq('community_id', communityId);
      }

      if (filters?.trending) {
        query = query?.eq('is_trending', true);
      }

      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createDiscussion(discussionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...discussionData,
        creatorId: user?.id
      });

      const { data, error } = await supabase
        ?.from('community_discussions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async voteDiscussion(discussionId, voteType) {
    try {
      const field = voteType === 'up' ? 'upvotes' : 'downvotes';
      
      const { data, error } = await supabase
        ?.rpc('increment', {
          table_name: 'community_discussions',
          row_id: discussionId,
          column_name: field
        });

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getReplies(discussionId) {
    try {
      const { data, error } = await supabase
        ?.from('discussion_replies')
        ?.select('*, creator:creator_id(username, full_name, avatar)')
        ?.eq('discussion_id', discussionId)
        ?.order('created_at', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createReply(replyData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...replyData,
        creatorId: user?.id
      });

      const { data, error } = await supabase
        ?.from('discussion_replies')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;

      // Increment reply count
      await supabase
        ?.from('community_discussions')
        ?.update({ reply_count: supabase?.raw('reply_count + 1') })
        ?.eq('id', replyData?.discussionId);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Partnerships
  async getPartnerships(creatorId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_partnerships')
        ?.select(`
          *,
          creator_one:creator_one_id(username, full_name, avatar),
          creator_two:creator_two_id(username, full_name, avatar)
        `)
        ?.or(`creator_one_id.eq.${userId},creator_two_id.eq.${userId}`)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createPartnership(partnershipData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const dbData = toSnakeCase({
        ...partnershipData,
        creatorOneId: user?.id
      });

      const { data, error } = await supabase
        ?.from('creator_partnerships')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updatePartnershipStatus(partnershipId, status) {
    try {
      const { data, error } = await supabase
        ?.from('creator_partnerships')
        ?.update({ status, updated_at: new Date()?.toISOString() })
        ?.eq('id', partnershipId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Mentorship
  async getMentorshipSessions(role = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        ?.from('mentorship_sessions')
        ?.select(`
          *,
          mentor:mentor_id(username, full_name, avatar),
          mentee:mentee_id(username, full_name, avatar)
        `)
        ?.order('scheduled_at', { ascending: false });

      if (role === 'mentor') {
        query = query?.eq('mentor_id', user?.id);
      } else if (role === 'mentee') {
        query = query?.eq('mentee_id', user?.id);
      } else {
        query = query?.or(`mentor_id.eq.${user?.id},mentee_id.eq.${user?.id}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createMentorshipSession(sessionData) {
    try {
      const dbData = toSnakeCase(sessionData);

      const { data, error } = await supabase
        ?.from('mentorship_sessions')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateMentorshipSession(sessionId, updates) {
    try {
      const dbData = toSnakeCase(updates);

      const { data, error } = await supabase
        ?.from('mentorship_sessions')
        ?.update(dbData)
        ?.eq('id', sessionId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Update reputation if session completed
      if (updates?.status === 'completed') {
        const session = await supabase
          ?.from('mentorship_sessions')
          ?.select('mentor_id')
          ?.eq('id', sessionId)
          ?.single();

        if (session?.data?.mentor_id) {
          await supabase
            ?.from('creator_reputation_scores')
            ?.update({ 
              mentorship_sessions_completed: supabase?.raw('mentorship_sessions_completed + 1')
            })
            ?.eq('creator_id', session?.data?.mentor_id);
        }
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Reputation
  async getCreatorReputation(creatorId = null) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = creatorId || user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_reputation_scores')
        ?.select('*')
        ?.eq('creator_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      
      // Create if doesn't exist
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          ?.from('creator_reputation_scores')
          ?.insert({ creator_id: userId })
          ?.select()
          ?.single();
        
        if (insertError) throw insertError;
        return { data: toCamelCase(newData), error: null };
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTopCreators(limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('creator_reputation_scores')
        ?.select('*, creator:creator_id(username, full_name, avatar)')
        ?.order('overall_reputation', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Real-time subscriptions
  subscribeToDiscussions(communityId, callback) {
    const channel = supabase
      ?.channel(`discussions:${communityId}`)
      ?.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_discussions',
          filter: `community_id=eq.${communityId}`
        },
        callback
      )
      ?.subscribe();

    return channel;
  }
};