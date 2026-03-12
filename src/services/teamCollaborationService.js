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

export const teamCollaborationService = {
  // Mock data for shared performance dashboards
  async getSharedDashboardMetrics(campaignId = null) {
    try {
      // In production, this would query Supabase for real-time campaign metrics
      const mockMetrics = {
        campaignId: campaignId || 'all',
        realTimeMetrics: {
          activeUsers: 1247,
          impressions: 45823,
          clicks: 3421,
          conversions: 287,
          revenue: 12450.75,
          ctr: 7.47,
          conversionRate: 8.39,
          roi: 185.3
        },
        performanceByZone: [
          { zone: 'Zone 1', impressions: 8234, conversions: 67, revenue: 3200, roi: 210 },
          { zone: 'Zone 2', impressions: 7123, conversions: 52, revenue: 2800, roi: 195 },
          { zone: 'Zone 3', impressions: 6543, conversions: 45, revenue: 2400, roi: 180 },
          { zone: 'Zone 4', impressions: 5821, conversions: 38, revenue: 1950, roi: 175 },
          { zone: 'Zone 5', impressions: 5234, conversions: 32, revenue: 1600, roi: 165 },
          { zone: 'Zone 6', impressions: 4567, conversions: 25, revenue: 1200, roi: 155 },
          { zone: 'Zone 7', impressions: 4123, conversions: 18, revenue: 850, roi: 145 },
          { zone: 'Zone 8', impressions: 4178, conversions: 10, revenue: 450, roi: 125 }
        ],
        teamActivity: [
          { member: 'Sarah Chen', action: 'Adjusted budget allocation', timestamp: new Date(Date.now() - 300000)?.toISOString() },
          { member: 'Mike Johnson', action: 'Updated targeting parameters', timestamp: new Date(Date.now() - 600000)?.toISOString() },
          { member: 'Emily Rodriguez', action: 'Added new creative variant', timestamp: new Date(Date.now() - 900000)?.toISOString() }
        ],
        alerts: [
          { type: 'performance', severity: 'high', message: 'Zone 1 ROI exceeded target by 15%', timestamp: new Date(Date.now() - 1200000)?.toISOString() },
          { type: 'budget', severity: 'medium', message: 'Campaign budget 75% depleted', timestamp: new Date(Date.now() - 1800000)?.toISOString() }
        ]
      };

      return { data: mockMetrics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Mock data for threaded strategy discussions
  async getStrategyDiscussions(campaignId = null) {
    try {
      const mockDiscussions = [
        {
          id: 'thread-1',
          campaignId: campaignId || 'campaign-123',
          title: 'Zone 1 Performance Optimization Strategy',
          author: 'Sarah Chen',
          authorAvatar: null,
          createdAt: new Date(Date.now() - 7200000)?.toISOString(),
          lastActivity: new Date(Date.now() - 300000)?.toISOString(),
          messageCount: 12,
          participants: ['Sarah Chen', 'Mike Johnson', 'Emily Rodriguez'],
          status: 'active',
          priority: 'high',
          tags: ['optimization', 'zone-1', 'budget-allocation']
        },
        {
          id: 'thread-2',
          campaignId: campaignId || 'campaign-123',
          title: 'Creative Refresh Discussion',
          author: 'Mike Johnson',
          authorAvatar: null,
          createdAt: new Date(Date.now() - 14400000)?.toISOString(),
          lastActivity: new Date(Date.now() - 1800000)?.toISOString(),
          messageCount: 8,
          participants: ['Mike Johnson', 'Emily Rodriguez'],
          status: 'active',
          priority: 'medium',
          tags: ['creative', 'testing', 'engagement']
        },
        {
          id: 'thread-3',
          campaignId: campaignId || 'campaign-123',
          title: 'Q1 Campaign Planning',
          author: 'Emily Rodriguez',
          authorAvatar: null,
          createdAt: new Date(Date.now() - 86400000)?.toISOString(),
          lastActivity: new Date(Date.now() - 3600000)?.toISOString(),
          messageCount: 24,
          participants: ['Sarah Chen', 'Mike Johnson', 'Emily Rodriguez', 'David Kim'],
          status: 'resolved',
          priority: 'high',
          tags: ['planning', 'strategy', 'budget']
        }
      ];

      return { data: mockDiscussions, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getThreadMessages(threadId) {
    try {
      const mockMessages = [
        {
          id: 'msg-1',
          threadId: threadId,
          author: 'Sarah Chen',
          authorAvatar: null,
          content: 'Team, I\'ve noticed Zone 1 is performing exceptionally well with a 210% ROI. Should we reallocate budget from underperforming zones?',
          createdAt: new Date(Date.now() - 7200000)?.toISOString(),
          reactions: [{ emoji: '👍', count: 3 }, { emoji: '💡', count: 2 }],
          attachments: []
        },
        {
          id: 'msg-2',
          threadId: threadId,
          author: 'Mike Johnson',
          authorAvatar: null,
          content: 'Great observation! I agree. Zone 8 is underperforming at 125% ROI. Let\'s shift 15% of Zone 8 budget to Zone 1.',
          createdAt: new Date(Date.now() - 6900000)?.toISOString(),
          reactions: [{ emoji: '✅', count: 2 }],
          attachments: []
        },
        {
          id: 'msg-3',
          threadId: threadId,
          author: 'Emily Rodriguez',
          authorAvatar: null,
          content: 'Before we do that, let\'s analyze the demographic data. Zone 8 might need creative optimization rather than budget cuts.',
          createdAt: new Date(Date.now() - 6600000)?.toISOString(),
          reactions: [{ emoji: '🤔', count: 4 }],
          attachments: [
            { name: 'zone8_demographic_analysis.pdf', url: '#', type: 'pdf' }
          ]
        }
      ];

      return { data: mockMessages, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async postThreadMessage(threadId, content, attachments = []) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // In production, this would insert into Supabase
      const newMessage = {
        id: `msg-${Date.now()}`,
        threadId: threadId,
        author: user?.user_metadata?.full_name || 'Team Member',
        authorAvatar: user?.user_metadata?.avatar_url || null,
        content: content,
        createdAt: new Date()?.toISOString(),
        reactions: [],
        attachments: attachments
      };

      return { data: newMessage, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getTeamPresence() {
    try {
      const mockPresence = [
        { userId: 'user-1', name: 'Sarah Chen', status: 'online', lastActive: new Date()?.toISOString(), currentPage: 'Dashboard' },
        { userId: 'user-2', name: 'Mike Johnson', status: 'online', lastActive: new Date()?.toISOString(), currentPage: 'Campaign Settings' },
        { userId: 'user-3', name: 'Emily Rodriguez', status: 'away', lastActive: new Date(Date.now() - 300000)?.toISOString(), currentPage: null },
        { userId: 'user-4', name: 'David Kim', status: 'offline', lastActive: new Date(Date.now() - 3600000)?.toISOString(), currentPage: null }
      ];

      return { data: mockPresence, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCollaborativeGoals(campaignId = null) {
    try {
      const mockGoals = [
        {
          id: 'goal-1',
          campaignId: campaignId || 'campaign-123',
          title: 'Achieve 200% ROI across all zones',
          targetValue: 200,
          currentValue: 185.3,
          progress: 92.65,
          deadline: new Date(Date.now() + 604800000)?.toISOString(),
          owner: 'Sarah Chen',
          status: 'on-track',
          contributors: ['Sarah Chen', 'Mike Johnson', 'Emily Rodriguez']
        },
        {
          id: 'goal-2',
          campaignId: campaignId || 'campaign-123',
          title: 'Increase Zone 8 conversion rate to 5%',
          targetValue: 5,
          currentValue: 2.4,
          progress: 48,
          deadline: new Date(Date.now() + 1209600000)?.toISOString(),
          owner: 'Emily Rodriguez',
          status: 'at-risk',
          contributors: ['Emily Rodriguez', 'Mike Johnson']
        },
        {
          id: 'goal-3',
          campaignId: campaignId || 'campaign-123',
          title: 'Launch 3 new creative variants',
          targetValue: 3,
          currentValue: 2,
          progress: 66.67,
          deadline: new Date(Date.now() + 432000000)?.toISOString(),
          owner: 'Mike Johnson',
          status: 'on-track',
          contributors: ['Mike Johnson']
        }
      ];

      return { data: mockGoals, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAuditTrail(campaignId = null, limit = 50) {
    try {
      const mockAudit = [
        {
          id: 'audit-1',
          campaignId: campaignId || 'campaign-123',
          action: 'Budget Adjustment',
          description: 'Increased Zone 1 budget by $5,000',
          performedBy: 'Sarah Chen',
          timestamp: new Date(Date.now() - 300000)?.toISOString(),
          changes: { before: { budget: 20000 }, after: { budget: 25000 } }
        },
        {
          id: 'audit-2',
          campaignId: campaignId || 'campaign-123',
          action: 'Targeting Update',
          description: 'Modified demographic targeting for Zone 3',
          performedBy: 'Mike Johnson',
          timestamp: new Date(Date.now() - 600000)?.toISOString(),
          changes: { before: { ageRange: '25-45' }, after: { ageRange: '30-50' } }
        },
        {
          id: 'audit-3',
          campaignId: campaignId || 'campaign-123',
          action: 'Creative Upload',
          description: 'Added new banner creative variant',
          performedBy: 'Emily Rodriguez',
          timestamp: new Date(Date.now() - 900000)?.toISOString(),
          changes: { added: 'banner_variant_3.jpg' }
        }
      ];

      return { data: mockAudit?.slice(0, limit), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Real-time subscription for team activity
  subscribeToTeamActivity(campaignId, callback) {
    // In production, this would use Supabase real-time subscriptions
    // For now, return a mock subscription
    const mockChannel = {
      unsubscribe: () => console.log('Unsubscribed from team activity')
    };
    return mockChannel;
  }
};