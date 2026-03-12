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

export const smsRateLimitingService = {
  // Get user rate limits
  async getUserRateLimits(userId) {
    try {
      const { data, error } = await supabase
        ?.from('sms_user_rate_limits')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting user rate limits:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update user rate limits
  async updateUserRateLimits(userId, limits) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('sms_user_rate_limits')
        ?.upsert({
          user_id: userId,
          ...toSnakeCase(limits),
          updated_at: new Date()?.toISOString()
        }, { onConflict: 'user_id' })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating user rate limits:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get provider rate limits
  async getProviderRateLimits(provider) {
    try {
      const { data, error } = await supabase
        ?.from('sms_provider_rate_limits')
        ?.select('*')
        ?.eq('provider', provider)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting provider rate limits:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Check if user can send SMS (rate limit check)
  async canUserSendSMS(userId) {
    try {
      const { data: limits } = await this.getUserRateLimits(userId);

      if (!limits) {
        // No limits set, allow sending
        return { data: { allowed: true, remaining: 999 }, error: null };
      }

      const now = new Date();
      const windowStart = new Date(now.getTime() - (limits?.windowMinutes || 60) * 60 * 1000);

      // Count messages sent in current window
      const { count, error } = await supabase
        ?.from('sms_delivery_log')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('user_id', userId)
        ?.gte('created_at', windowStart?.toISOString());

      if (error) throw error;

      const remaining = (limits?.maxPerWindow || 100) - (count || 0);
      const allowed = remaining > 0;

      return { data: { allowed, remaining, limit: limits?.maxPerWindow }, error: null };
    } catch (error) {
      console.error('Error checking user rate limit:', error);
      return { data: { allowed: false, remaining: 0 }, error: { message: error?.message } };
    }
  },

  // Check provider rate limit
  async canProviderSendSMS(provider) {
    try {
      const { data: limits } = await this.getProviderRateLimits(provider);

      if (!limits) {
        return { data: { allowed: true, remaining: 999 }, error: null };
      }

      const now = new Date();
      const windowStart = new Date(now.getTime() - (limits?.windowMinutes || 60) * 60 * 1000);

      // Count messages sent by provider in current window
      const { count, error } = await supabase
        ?.from('sms_delivery_log')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('provider', provider)
        ?.gte('created_at', windowStart?.toISOString());

      if (error) throw error;

      const remaining = (limits?.maxPerWindow || 1000) - (count || 0);
      const allowed = remaining > 0;

      return { data: { allowed, remaining, limit: limits?.maxPerWindow }, error: null };
    } catch (error) {
      console.error('Error checking provider rate limit:', error);
      return { data: { allowed: false, remaining: 0 }, error: { message: error?.message } };
    }
  },

  // Add message to queue
  async addToQueue(messageData) {
    try {
      const { userId, phoneNumber, message, priority = 'medium', alertType, provider } = messageData;

      const { data, error } = await supabase
        ?.from('sms_queue')
        ?.insert({
          user_id: userId,
          phone_number: phoneNumber,
          message,
          priority,
          alert_type: alertType,
          provider,
          status: 'pending',
          created_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error adding to queue:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get queue status
  async getQueueStatus(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_queue')
        ?.select('*')
        ?.order('priority', { ascending: false })
        ?.order('created_at', { ascending: true });

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.priority) {
        query = query?.eq('priority', filters?.priority);
      }

      if (filters?.provider) {
        query = query?.eq('provider', filters?.provider);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting queue status:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Process queue (send pending messages)
  async processQueue(batchSize = 10) {
    try {
      // Get pending messages by priority
      const { data: pendingMessages } = await this.getQueueStatus({
        status: 'pending',
        limit: batchSize
      });

      if (!pendingMessages || pendingMessages?.length === 0) {
        return { data: { processed: 0, failed: 0 }, error: null };
      }

      const results = [];

      for (const msg of pendingMessages) {
        // Check rate limits
        const [userCheck, providerCheck] = await Promise.all([
          this.canUserSendSMS(msg?.userId),
          this.canProviderSendSMS(msg?.provider)
        ]);

        if (!userCheck?.data?.allowed || !providerCheck?.data?.allowed) {
          // Rate limit exceeded, keep in queue
          await supabase
            ?.from('sms_queue')
            ?.update({ 
              status: 'rate_limited',
              updated_at: new Date()?.toISOString()
            })
            ?.eq('id', msg?.id);
          
          results?.push({ id: msg?.id, status: 'rate_limited' });
          continue;
        }

        // Send SMS
        const { data: sendResult, error: sendError } = await supabase?.functions?.invoke('send-sms-alert', {
          body: {
            provider: msg?.provider,
            to: msg?.phoneNumber,
            message: msg?.message,
            alertType: msg?.alertType,
            userId: msg?.userId
          }
        });

        if (sendError) {
          // Failed, update queue
          await supabase
            ?.from('sms_queue')
            ?.update({ 
              status: 'failed',
              error_message: sendError?.message,
              updated_at: new Date()?.toISOString()
            })
            ?.eq('id', msg?.id);
          
          results?.push({ id: msg?.id, status: 'failed', error: sendError?.message });
        } else {
          // Success, remove from queue
          await supabase
            ?.from('sms_queue')
            ?.update({ 
              status: 'sent',
              sent_at: new Date()?.toISOString(),
              updated_at: new Date()?.toISOString()
            })
            ?.eq('id', msg?.id);
          
          results?.push({ id: msg?.id, status: 'sent' });
        }
      }

      const processed = results?.filter(r => r?.status === 'sent')?.length;
      const failed = results?.filter(r => r?.status === 'failed')?.length;

      return { data: { processed, failed, results }, error: null };
    } catch (error) {
      console.error('Error processing queue:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get rate limiting statistics
  async getRateLimitingStats() {
    try {
      const [queueResult, userLimitsResult, providerLimitsResult] = await Promise.all([
        this.getQueueStatus({}),
        supabase?.from('sms_user_rate_limits')?.select('*'),
        supabase?.from('sms_provider_rate_limits')?.select('*')
      ]);

      const queue = queueResult?.data || [];
      const userLimits = userLimitsResult?.data || [];
      const providerLimits = providerLimitsResult?.data || [];

      return {
        data: {
          queue: {
            total: queue?.length,
            pending: queue?.filter(q => q?.status === 'pending')?.length,
            rateLimited: queue?.filter(q => q?.status === 'rate_limited')?.length,
            failed: queue?.filter(q => q?.status === 'failed')?.length,
            sent: queue?.filter(q => q?.status === 'sent')?.length
          },
          userLimits: {
            total: userLimits?.length,
            active: userLimits?.filter(l => l?.is_active)?.length
          },
          providerLimits: toCamelCase(providerLimits)
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting rate limiting stats:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};
