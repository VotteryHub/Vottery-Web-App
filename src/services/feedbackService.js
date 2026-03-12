import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const feedbackService = {
  async createFeatureRequest(requestData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('feature_requests')
        ?.insert({
          ...toSnakeCase(requestData),
          user_id: user?.id,
          status: 'submitted',
          vote_count: 0
        })
        ?.select(`
          *,
          user:user_id(id, username, email)
        `)
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('feature_request_created', {
        category: requestData?.category,
        title: requestData?.title
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFeatureRequests(filters = {}) {
    try {
      let query = supabase
        ?.from('feature_requests')
        ?.select(`
          *,
          user:user_id(id, username, email),
          votes:feature_votes(id, vote_type, user_id),
          comments:feature_comments(count)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.sortBy === 'trending') {
        query = query?.order('vote_count', { ascending: false });
      } else if (filters?.sortBy === 'recent') {
        query = query?.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTrendingFeatureRequests(limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('feature_requests')
        ?.select(`
          *,
          user:user_id(id, username, email),
          votes:feature_votes(count),
          comments:feature_comments(count)
        `)
        ?.in('status', ['submitted', 'under_review', 'planned'])
        ?.order('vote_count', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async voteOnFeature(featureRequestId, voteType) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already voted
      const { data: existingVote } = await supabase
        ?.from('feature_votes')
        ?.select('*')
        ?.eq('feature_request_id', featureRequestId)
        ?.eq('user_id', user?.id)
        ?.single();

      if (existingVote) {
        // Update existing vote
        if (existingVote?.vote_type === voteType) {
          // Remove vote if clicking same button
          const { error } = await supabase
            ?.from('feature_votes')
            ?.delete()
            ?.eq('id', existingVote?.id);

          if (error) throw error;

          analytics?.trackEvent('feature_vote_removed', {
            feature_request_id: featureRequestId
          });

          return { data: { action: 'removed' }, error: null };
        } else {
          // Change vote type
          const { data, error } = await supabase
            ?.from('feature_votes')
            ?.update({ vote_type: voteType })
            ?.eq('id', existingVote?.id)
            ?.select()
            ?.single();

          if (error) throw error;

          analytics?.trackEvent('feature_vote_changed', {
            feature_request_id: featureRequestId,
            vote_type: voteType
          });

          return { data: toCamelCase({ ...data, action: 'changed' }), error: null };
        }
      } else {
        // Create new vote
        const { data, error } = await supabase
          ?.from('feature_votes')
          ?.insert({
            feature_request_id: featureRequestId,
            user_id: user?.id,
            vote_type: voteType
          })
          ?.select()
          ?.single();

        if (error) throw error;

        analytics?.trackEvent('feature_vote_created', {
          feature_request_id: featureRequestId,
          vote_type: voteType
        });

        return { data: toCamelCase({ ...data, action: 'created' }), error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getUserVote(featureRequestId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) return { data: null, error: null };

      const { data, error } = await supabase
        ?.from('feature_votes')
        ?.select('*')
        ?.eq('feature_request_id', featureRequestId)
        ?.eq('user_id', user?.id)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async addComment(featureRequestId, comment) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('feature_comments')
        ?.insert({
          feature_request_id: featureRequestId,
          user_id: user?.id,
          comment
        })
        ?.select(`
          *,
          user:user_id(id, username, email)
        `)
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('feature_comment_added', {
        feature_request_id: featureRequestId
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getComments(featureRequestId) {
    try {
      const { data, error } = await supabase
        ?.from('feature_comments')
        ?.select(`
          *,
          user:user_id(id, username, email)
        `)
        ?.eq('feature_request_id', featureRequestId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getNotifications() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('feature_implementation_notifications')
        ?.select(`
          *,
          feature_request:feature_request_id(id, title, status)
        `)
        ?.eq('user_id', user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        ?.from('feature_implementation_notifications')
        ?.update({ read: true })
        ?.eq('id', notificationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async trackEngagement(featureRequestId, engagementType, metadata = {}) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('feature_engagement_tracking')
        ?.insert({
          feature_request_id: featureRequestId,
          user_id: user?.id,
          engagement_type: engagementType,
          ...toSnakeCase(metadata)
        })
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('feature_engagement_tracked', {
        feature_request_id: featureRequestId,
        engagement_type: engagementType
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getImplementedFeatures(limit = 20) {
    try {
      const { data, error } = await supabase
        ?.from('feature_requests')
        ?.select(`
          *,
          user:user_id(id, username, email),
          engagement:feature_engagement_tracking(count)
        `)
        ?.eq('status', 'implemented')
        ?.order('implementation_date', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFeatureEngagementStats(featureRequestId) {
    try {
      const { data, error } = await supabase
        ?.from('feature_engagement_tracking')
        ?.select('*')
        ?.eq('feature_request_id', featureRequestId);

      if (error) throw error;

      const stats = {
        totalEngagements: data?.length || 0,
        uniqueUsers: new Set(data?.map(e => e?.user_id))?.size || 0,
        firstUseCount: data?.filter(e => e?.engagement_type === 'first_use')?.length || 0,
        dailyUseCount: data?.filter(e => e?.engagement_type === 'daily_use')?.length || 0,
        feedbackCount: data?.filter(e => e?.engagement_type === 'feedback_submitted')?.length || 0,
        averageRating: data?.filter(e => e?.rating)
          ?.reduce((sum, e) => sum + e?.rating, 0) / (data?.filter(e => e?.rating)?.length || 1) || 0
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Community Engagement Dashboard: leaderboard by feedback contributions, votes, feature requests
   */
  async getCommunityLeaderboard(options = {}) {
    try {
      const { timeRange = '30d' } = options;
      const now = new Date();
      let start = new Date();
      if (timeRange === '7d') start.setDate(now.getDate() - 7);
      else if (timeRange === '30d') start.setDate(now.getDate() - 30);
      else if (timeRange === '90d') start.setDate(now.getDate() - 90);
      else start = new Date(0);

      const startIso = start?.toISOString();

      const [requestsRes, votesRes, commentsRes] = await Promise.all([
        supabase?.from('feature_requests')?.select('user_id')?.gte('created_at', startIso),
        supabase?.from('feature_votes')?.select('user_id')?.gte('created_at', startIso),
        supabase?.from('feature_comments')?.select('user_id')?.gte('created_at', startIso)
      ]);

      const requests = requestsRes?.data || [];
      const votes = votesRes?.data || [];
      const comments = commentsRes?.data || [];

      const scores = {};
      const add = (userId, key, amount = 1) => {
        if (!userId) return;
        if (!scores[userId]) scores[userId] = { userId, featureRequests: 0, votes: 0, comments: 0, score: 0 };
        scores[userId][key] = (scores[userId][key] || 0) + amount;
      };
      requests?.forEach(r => add(r?.user_id, 'featureRequests'));
      votes?.forEach(v => add(v?.user_id, 'votes'));
      comments?.forEach(c => add(c?.user_id, 'comments'));

      Object.values(scores).forEach(row => {
        row.score = (row.featureRequests * 3) + (row.votes * 1) + (row.comments * 2);
      });

      const leaderboard = Object.values(scores)
        ?.sort((a, b) => (b?.score || 0) - (a?.score || 0))
        ?.slice(0, 50);

      const userIds = leaderboard?.map(l => l?.userId)?.filter(Boolean) || [];
      if (userIds?.length === 0) {
        return { data: [], error: null };
      }

      const { data: profiles } = await supabase
        ?.from('user_profiles')
        ?.select('id, username, avatar_url')
        ?.in('id', userIds);

      const profileMap = (profiles || [])?.reduce((acc, p) => { acc[p?.id] = p; return acc; }, {});

      const withProfile = leaderboard?.map((row, index) => ({
        rank: index + 1,
        userId: row?.userId,
        username: profileMap[row?.userId]?.username || 'Anonymous',
        avatarUrl: profileMap[row?.userId]?.avatar_url,
        featureRequests: row?.featureRequests || 0,
        votes: row?.votes || 0,
        comments: row?.comments || 0,
        score: row?.score || 0
      }));

      return { data: withProfile, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Contribution stats for a single user (Community Engagement Dashboard)
   */
  async getUserContributionStats(userId, options = {}) {
    try {
      if (!userId) return { data: null, error: null };

      const { timeRange = '30d' } = options;
      const now = new Date();
      let start = new Date();
      if (timeRange === '7d') start.setDate(now.getDate() - 7);
      else if (timeRange === '30d') start.setDate(now.getDate() - 30);
      else if (timeRange === '90d') start.setDate(now.getDate() - 90);
      else start = new Date(0);
      const startIso = start?.toISOString();

      const [requestsRes, votesRes, commentsRes] = await Promise.all([
        supabase?.from('feature_requests')?.select('id')?.eq('user_id', userId)?.gte('created_at', startIso),
        supabase?.from('feature_votes')?.select('id')?.eq('user_id', userId)?.gte('created_at', startIso),
        supabase?.from('feature_comments')?.select('id')?.eq('user_id', userId)?.gte('created_at', startIso)
      ]);

      const data = {
        featureRequestsSubmitted: requestsRes?.data?.length || 0,
        votesCast: votesRes?.data?.length || 0,
        commentsAdded: commentsRes?.data?.length || 0,
        contributionScore: (requestsRes?.data?.length || 0) * 3 + (votesRes?.data?.length || 0) * 1 + (commentsRes?.data?.length || 0) * 2,
        timeRange
      };

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default feedbackService;