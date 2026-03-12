import { supabase } from '../lib/supabase';
import { generateContent } from './geminiChatService';

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

export const smsProviderService = {
  // Get current provider state
  async getProviderState() {
    try {
      const { data, error } = await supabase
        ?.from('sms_provider_state')
        ?.select('*')
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting provider state:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update provider state (manual override)
  async updateProviderState(updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('sms_provider_state')
        ?.update({
          ...toSnakeCase(updates),
          last_checked_at: new Date()?.toISOString(),
          override_by: user?.id
        })
        ?.eq('id', 1)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating provider state:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Health check for Telnyx
  async checkTelnyxHealth() {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          provider: 'telnyx',
          action: 'health_check'
        }
      });

      if (error) throw error;

      const isHealthy = data?.success && data?.responseTime < 2000;

      // Log health check
      await supabase?.from('sms_delivery_analytics')?.insert({
        provider: 'telnyx',
        metric_type: 'health_check',
        metric_value: isHealthy ? 100 : 0,
        response_time_ms: data?.responseTime || 0,
        timestamp: new Date()?.toISOString()
      });

      return { data: { healthy: isHealthy, responseTime: data?.responseTime }, error: null };
    } catch (error) {
      console.error('Telnyx health check failed:', error);
      return { data: { healthy: false, error: error?.message }, error: { message: error?.message } };
    }
  },

  // Health check for Twilio
  async checkTwilioHealth() {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          provider: 'twilio',
          action: 'health_check'
        }
      });

      if (error) throw error;

      const isHealthy = data?.success && data?.responseTime < 2000;

      // Log health check
      await supabase?.from('sms_delivery_analytics')?.insert({
        provider: 'twilio',
        metric_type: 'health_check',
        metric_value: isHealthy ? 100 : 0,
        response_time_ms: data?.responseTime || 0,
        timestamp: new Date()?.toISOString()
      });

      return { data: { healthy: isHealthy, responseTime: data?.responseTime }, error: null };
    } catch (error) {
      console.error('Twilio health check failed:', error);
      return { data: { healthy: false, error: error?.message }, error: { message: error?.message } };
    }
  },

  // AI-powered automatic failover detection
  async monitorProviderHealth() {
    try {
      const [telnyxResult, twilioResult, stateResult] = await Promise.all([
        this.checkTelnyxHealth(),
        this.checkTwilioHealth(),
        this.getProviderState()
      ]);

      const telnyxHealthy = telnyxResult?.data?.healthy;
      const twilioHealthy = twilioResult?.data?.healthy;
      const currentProvider = stateResult?.data?.activeProvider;

      // Automatic failover logic
      if (currentProvider === 'telnyx' && !telnyxHealthy && twilioHealthy) {
        // Telnyx failed, switch to Twilio
        await this.updateProviderState({
          activeProvider: 'twilio',
          telnyxStatus: 'unhealthy',
          twilioStatus: 'healthy',
          failoverReason: 'Telnyx health check failed - automatic failover to Twilio',
          lastFailoverAt: new Date()?.toISOString()
        });

        return {
          data: {
            failoverOccurred: true,
            from: 'telnyx',
            to: 'twilio',
            reason: 'Telnyx health check failed'
          },
          error: null
        };
      }

      // Automatic switch back to Telnyx when restored
      if (currentProvider === 'twilio' && telnyxHealthy) {
        // Telnyx restored, switch back
        await this.updateProviderState({
          activeProvider: 'telnyx',
          telnyxStatus: 'healthy',
          twilioStatus: twilioHealthy ? 'healthy' : 'unhealthy',
          failoverReason: null,
          lastFailoverAt: null
        });

        return {
          data: {
            failoverOccurred: true,
            from: 'twilio',
            to: 'telnyx',
            reason: 'Telnyx service restored'
          },
          error: null
        };
      }

      return {
        data: {
          failoverOccurred: false,
          currentProvider,
          telnyxHealthy,
          twilioHealthy
        },
        error: null
      };
    } catch (error) {
      console.error('Error monitoring provider health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Send SMS with automatic provider selection and failover
  async sendSMS(smsData) {
    try {
      const { to, message, alertType, severity, userId } = smsData;

      // Get current provider state
      const { data: providerState } = await this.getProviderState();
      const activeProvider = providerState?.activeProvider || 'telnyx';

      // CRITICAL: When Twilio is active, exclude gamification/lottery/prizes messages
      if (activeProvider === 'twilio') {
        const excludedTypes = ['lottery', 'prize', 'winner', 'gamification', 'jackpot', 'reward'];
        const isExcluded = excludedTypes?.some(type => 
          alertType?.toLowerCase()?.includes(type) || 
          message?.toLowerCase()?.includes(type)
        );

        if (isExcluded) {
          console.log('Twilio active: Skipping gamification/lottery/prizes SMS');
          return {
            data: {
              skipped: true,
              reason: 'Twilio active - gamification messages excluded',
              provider: 'twilio'
            },
            error: null
          };
        }
      }

      // Send via active provider
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          provider: activeProvider,
          to,
          message,
          alertType,
          severity,
          userId
        }
      });

      if (error) {
        // If primary provider fails, try failover
        const fallbackProvider = activeProvider === 'telnyx' ? 'twilio' : 'telnyx';
        
        console.log(`${activeProvider} failed, attempting failover to ${fallbackProvider}`);

        const { data: fallbackData, error: fallbackError } = await supabase?.functions?.invoke('send-sms-alert', {
          body: {
            provider: fallbackProvider,
            to,
            message,
            alertType,
            severity,
            userId
          }
        });

        if (fallbackError) throw fallbackError;

        // Update provider state to reflect failover
        await this.updateProviderState({
          activeProvider: fallbackProvider,
          failoverReason: `${activeProvider} send failed - automatic failover`,
          lastFailoverAt: new Date()?.toISOString()
        });

        return {
          data: {
            ...fallbackData,
            failoverOccurred: true,
            originalProvider: activeProvider,
            actualProvider: fallbackProvider
          },
          error: null
        };
      }

      return { data: { ...data, provider: activeProvider }, error: null };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get SMS delivery analytics
  async getDeliveryAnalytics(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_delivery_analytics')
        ?.select('*')
        ?.order('timestamp', { ascending: false });

      if (filters?.provider) {
        query = query?.eq('provider', filters?.provider);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let startDate;
        
        switch (filters?.timeRange) {
          case '1h':
            startDate = new Date(now.setHours(now.getHours() - 1));
            break;
          case '24h':
            startDate = new Date(now.setHours(now.getHours() - 24));
            break;
          case '7d':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
          default:
            startDate = new Date(now.setHours(now.getHours() - 24));
        }

        query = query?.gte('timestamp', startDate?.toISOString());
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting delivery analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate delivery rates and performance metrics
  async calculatePerformanceMetrics(timeRange = '24h') {
    try {
      const { data: analytics } = await this.getDeliveryAnalytics({ timeRange });

      if (!analytics || analytics?.length === 0) {
        return {
          data: {
            telnyx: { deliveryRate: 0, avgResponseTime: 0, totalSent: 0, totalFailed: 0 },
            twilio: { deliveryRate: 0, avgResponseTime: 0, totalSent: 0, totalFailed: 0 },
            failoverCount: 0
          },
          error: null
        };
      }

      const telnyxMetrics = analytics?.filter(a => a?.provider === 'telnyx');
      const twilioMetrics = analytics?.filter(a => a?.provider === 'twilio');

      const calculateMetrics = (metrics) => {
        const delivered = metrics?.filter(m => m?.metricType === 'delivered')?.length;
        const failed = metrics?.filter(m => m?.metricType === 'failed')?.length;
        const total = delivered + failed;
        const deliveryRate = total > 0 ? ((delivered / total) * 100)?.toFixed(2) : 0;
        const avgResponseTime = metrics?.length > 0
          ? (metrics?.reduce((sum, m) => sum + (m?.responseTimeMs || 0), 0) / metrics?.length)?.toFixed(0)
          : 0;

        return {
          deliveryRate: parseFloat(deliveryRate),
          avgResponseTime: parseInt(avgResponseTime),
          totalSent: delivered,
          totalFailed: failed
        };
      };

      const failoverCount = analytics?.filter(a => a?.metricType === 'failover')?.length;

      return {
        data: {
          telnyx: calculateMetrics(telnyxMetrics),
          twilio: calculateMetrics(twilioMetrics),
          failoverCount
        },
        error: null
      };
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Optimize SMS content with Gemini
  async optimizeSMSContent(content, options = {}) {
    try {
      const { maxLength = 160, tone = 'professional', includePersonalization = true } = options;

      const systemPrompt = `You are an SMS content optimization expert. Optimize messages to be concise, clear, and under ${maxLength} character limits while maintaining ${tone} tone and meaning. ${includePersonalization ? 'Add personalization variables like {{name}}, {{date}} where appropriate.' : ''} Return ONLY the optimized message text.`;

      const response = await generateContent(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Optimize this SMS (max ${maxLength} chars):\n\n${content}` }
        ],
        { max_completion_tokens: 200 }
      );

      const optimizedContent = response?.choices?.[0]?.message?.content?.trim() || content;

      // Log optimization
      try {
        await supabase?.from('sms_optimization_history')?.insert({
          original_content: content,
          optimized_content: optimizedContent,
          original_length: content?.length,
          optimized_length: optimizedContent?.length,
          optimization_type: 'gemini',
          parameters: { maxLength, tone, includePersonalization }
        });
      } catch (logError) {
        console.warn('Failed to log optimization:', logError?.message);
      }

      return {
        data: {
          original: content,
          optimized: optimizedContent,
          originalLength: content?.length,
          optimizedLength: optimizedContent?.length,
          saved: content?.length - optimizedContent?.length
        },
        error: null
      };
    } catch (error) {
      console.error('Error optimizing SMS content:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};
