import { supabase } from '../lib/supabase';
import { smsAlertService } from './smsAlertService';

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

// ============ PERFORMANCE TRACKING HELPER ============
const trackQuery = async (queryName, queryFn) => {
  const markStart = `${queryName}_start`;
  const markEnd = `${queryName}_end`;
  const measureName = `query_${queryName}`;

  performance.mark(markStart);
  try {
    const result = await queryFn();
    performance.mark(markEnd);
    try {
      performance.measure(measureName, markStart, markEnd);
      const entries = performance.getEntriesByName(measureName);
      const duration = entries?.[entries?.length - 1]?.duration || 0;
      if (duration > 100) {
        console.warn(`[SlowQuery] ${queryName} took ${duration?.toFixed(2)}ms (threshold: 100ms)`);
      }
      performance.clearMarks(markStart);
      performance.clearMarks(markEnd);
      performance.clearMeasures(measureName);
    } catch (_) {}
    return result;
  } catch (error) {
    performance.clearMarks(markStart);
    throw error;
  }
};

export const notificationService = {
  async getNotifications(filters = {}) {
    return trackQuery('notificationService.getNotifications', async () => {
      try {
        const { data: { user } } = await supabase?.auth?.getUser();
        if (!user) throw new Error('Not authenticated');

        let query = supabase
          ?.from('activity_feed')
          ?.select(`
            id, user_id, activity_type, title, description, is_read, created_at,
            actor:user_profiles!actor_id(id, name, username, avatar)
          `)
          ?.eq('user_id', user?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(50);

        if (filters?.category && filters?.category !== 'all') {
          const categoryMap = {
            votes: ['vote'],
            messages: ['message_received'],
            achievements: ['achievement_unlocked'],
            elections: ['election_created', 'election_completed'],
            campaigns: ['post_liked', 'post_commented', 'post_shared'],
            payments: ['settlement_processing', 'payout_delayed', 'payment_method_failed', 'payout_completed']
          };
          
          const types = categoryMap?.[filters?.category] || [];
          if (types?.length > 0) {
            query = query?.in('activity_type', types);
          }
        }

        // Server-side filtering for read status instead of client-side
        if (filters?.readStatus === 'unread') {
          query = query?.eq('is_read', false);
        } else if (filters?.readStatus === 'read') {
          query = query?.eq('is_read', true);
        }

        if (filters?.sortBy === 'oldest') {
          query = query?.order('created_at', { ascending: true });
        }

        if (filters?.search) {
          query = query?.or(`title.ilike.%${filters?.search}%,description.ilike.%${filters?.search}%`);
        }

        if (filters?.limit) {
          query = query?.limit(Math.min(filters?.limit, 100));
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getUserNotifications(userId, limit = 50) {
    return trackQuery('notificationService.getUserNotifications', async () => {
      try {
        const { data, error } = await supabase
          ?.from('activity_feed')
          ?.select('id, user_id, activity_type, title, description, is_read, created_at')
          ?.eq('user_id', userId)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getAllNotifications(limit = 50) {
    return trackQuery('notificationService.getAllNotifications', async () => {
      try {
        const { data: { user } } = await supabase?.auth?.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          ?.from('activity_feed')
          ?.select('id, user_id, activity_type, title, description, is_read, created_at')
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getNotificationById(notificationId) {
    return trackQuery('notificationService.getNotificationById', async () => {
      try {
        const { data, error } = await supabase
          ?.from('activity_feed')
          ?.select('id, user_id, activity_type, title, description, is_read, created_at')
          ?.eq('id', notificationId)
          ?.single();

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getUnreadNotifications(userId, limit = 50) {
    return trackQuery('notificationService.getUnreadNotifications', async () => {
      try {
        const { data, error } = await supabase
          ?.from('activity_feed')
          ?.select('id, user_id, activity_type, title, description, is_read, created_at')
          ?.eq('user_id', userId)
          ?.eq('is_read', false)
          ?.order('created_at', { ascending: false })
          ?.limit(limit);

        if (error) throw error;
        return { data: toCamelCase(data), error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  async getUnreadCountByCategory() {
    return trackQuery('notificationService.getUnreadCountByCategory', async () => {
      try {
        const { data: { user } } = await supabase?.auth?.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          ?.from('activity_feed')
          ?.select('activity_type')
          ?.eq('user_id', user?.id)
          ?.eq('is_read', false);

        if (error) throw error;

        const counts = {
          votes: 0,
          messages: 0,
          achievements: 0,
          elections: 0,
          campaigns: 0,
          payments: 0,
          total: data?.length || 0
        };

        const paymentTypes = ['settlement_processing', 'payout_delayed', 'payment_method_failed', 'payout_completed'];
        data?.forEach((item) => {
          const type = item?.activity_type;
          if (type === 'vote') counts.votes++;
          else if (type === 'message_received') counts.messages++;
          else if (type === 'achievement_unlocked') counts.achievements++;
          else if (['election_created', 'election_completed']?.includes(type)) counts.elections++;
          else if (['post_liked', 'post_commented', 'post_shared']?.includes(type)) counts.campaigns++;
          else if (paymentTypes?.includes(type)) counts.payments++;
        });

        return { data: counts, error: null };
      } catch (error) {
        return { data: null, error: { message: error?.message } };
      }
    });
  },

  /** Get payment-related notifications (settlement, payout delay, payment failure) for a user. */
  async getPaymentNotifications(userId, limit = 20) {
    try {
      const types = ['settlement_processing', 'payout_delayed', 'payment_method_failed', 'payout_completed'];
      const { data, error } = await supabase
        ?.from('activity_feed')
        ?.select('id, user_id, activity_type, title, description, is_read, created_at')
        ?.eq('user_id', userId)
        ?.in('activity_type', types)
        ?.order('created_at', { ascending: false })
        ?.limit(limit);
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /** Create a payment notification (call from payout/Stripe webhook or settlement logic). */
  async createPaymentNotification({ userId, activityType, title, description, actorId = null }) {
    try {
      const { data, error } = await supabase
        ?.from('activity_feed')
        ?.insert({
          user_id: userId,
          activity_type: activityType,
          title: title || 'Payment update',
          description: description || '',
          is_read: false,
          actor_id: actorId,
        })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markAsRead(notificationIds) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

      const { error } = await supabase
        ?.from('activity_feed')
        ?.update({ is_read: true })
        ?.in('id', ids)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async markAllAsRead() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        ?.from('activity_feed')
        ?.update({ is_read: true })
        ?.eq('user_id', user?.id)
        ?.eq('is_read', false);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async archiveNotifications(notificationIds) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

      const { error } = await supabase
        ?.from('activity_feed')
        ?.delete()
        ?.in('id', ids)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async deleteNotifications(notificationIds) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

      const { error } = await supabase
        ?.from('activity_feed')
        ?.delete()
        ?.in('id', ids)
        ?.eq('user_id', user?.id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  subscribeToNotifications(callback) {
    const channel = supabase
      ?.channel('notifications-changes')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activity_feed' },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            new: toCamelCase(payload?.new),
            old: toCamelCase(payload?.old)
          });
        }
      )
      ?.subscribe();

    return () => supabase?.removeChannel(channel);
  },

  // ============ REAL-TIME TOAST NOTIFICATIONS ============
  
  async showToastNotification(notification) {
    try {
      // Trigger browser notification if permission granted
      if ('Notification' in window && Notification?.permission === 'granted') {
        new Notification(notification?.title, {
          body: notification?.description,
          icon: '/favicon.ico',
          tag: notification?.id
        });
      }
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async requestNotificationPermission() {
    try {
      if ('Notification' in window) {
        const permission = await Notification?.requestPermission();
        return { data: permission, error: null };
      }
      return { data: 'not-supported', error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ AI-POWERED NOTIFICATION GROUPING ============
  
  async categorizeNotificationsWithAI(notifications) {
    try {
      const openai = (await import('../lib/openai'))?.default;
      
      const notificationTexts = notifications?.map(n => `${n?.title}: ${n?.description}`)?.join('\n');
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a notification categorization assistant. Analyze notifications and group them by urgency (critical, high, medium, low) and context (votes, messages, achievements, elections, social). Return JSON only.'
          },
          {
            role: 'user',
            content: `Categorize these notifications:\n${notificationTexts}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'notification_categorization',
            schema: {
              type: 'object',
              properties: {
                categories: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      urgency: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                      context: { type: 'string' },
                      notificationIndices: { type: 'array', items: { type: 'number' } }
                    },
                    required: ['urgency', 'context', 'notificationIndices']
                  }
                }
              },
              required: ['categories'],
              additionalProperties: false
            }
          }
        },
        reasoning_effort: 'minimal',
        verbosity: 'low'
      });

      const categorization = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: categorization, error: null };
    } catch (error) {
      console.log('AI categorization unavailable, using fallback');
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ SMS ALERT INTEGRATION ============
  
  async sendVoteReminderSMS(userId, electionId, phoneNumber) {
    try {
      const { data: election } = await supabase
        ?.from('elections')
        ?.select('title, end_date')
        ?.eq('id', electionId)
        ?.single();

      if (!election) throw new Error('Election not found');

      const endDate = new Date(election?.end_date);
      const hoursRemaining = Math.floor((endDate - new Date()) / (1000 * 60 * 60));

      const message = `🗳️ Vote Reminder: "${election?.title}" ends in ${hoursRemaining} hours! Cast your vote now on Vottery.`;

      const { data, error } = await smsAlertService?.sendSMSAlert({
        to: phoneNumber,
        message,
        alertId: electionId,
        severity: 'medium'
      });

      if (error) throw error;

      // Log SMS sent
      await supabase?.from('sms_logs')?.insert({
        user_id: userId,
        phone_number: phoneNumber,
        message_type: 'vote_reminder',
        reference_id: electionId,
        status: 'sent'
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendWinnerAnnouncementSMS(userId, electionId, phoneNumber, prizeAmount) {
    try {
      const { data: election } = await supabase
        ?.from('elections')
        ?.select('title')
        ?.eq('id', electionId)
        ?.single();

      if (!election) throw new Error('Election not found');

      const message = `🏆 CONGRATULATIONS! You won ${prizeAmount} in "${election?.title}"! Check your Vottery wallet to claim your prize. 🎉`;

      const { data, error } = await smsAlertService?.sendSMSAlert({
        to: phoneNumber,
        message,
        alertId: electionId,
        severity: 'high'
      });

      if (error) throw error;

      // Log SMS sent
      await supabase?.from('sms_logs')?.insert({
        user_id: userId,
        phone_number: phoneNumber,
        message_type: 'winner_announcement',
        reference_id: electionId,
        status: 'sent'
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error sending winner announcement SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendUrgentAlertSMS(userId, phoneNumber, alertTitle, alertMessage) {
    try {
      const message = `⚠️ URGENT ALERT: ${alertTitle}\n\n${alertMessage?.substring(0, 100)}...\n\nCheck Vottery for details.`;

      const { data, error } = await smsAlertService?.sendSMSAlert({
        to: phoneNumber,
        message,
        alertId: `urgent_${Date.now()}`,
        severity: 'critical'
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error sending urgent alert SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getUserSMSPreferences(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('phone_number, sms_notifications_enabled, sms_preferences')
        ?.eq('id', userId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateSMSPreferences(userId, preferences) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(toSnakeCase(preferences))
        ?.eq('id', userId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
