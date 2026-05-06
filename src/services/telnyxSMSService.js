import { supabase } from '../lib/supabase';
import { env } from '../config/env.config';

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

// Initialize Telnyx client removed from client (moved to server for security)

// Message type categories for failover filtering
const MESSAGE_CATEGORIES = {
  GAMIFICATION: ['gamification', 'lottery', 'prizes', 'winner', 'jackpot', 'draw', 'spin', 'slot'],
  SECURITY: ['fraud', 'security', 'alert', 'breach', 'suspicious', 'unauthorized'],
  COMPLIANCE: ['compliance', 'gdpr', 'tcpa', 'regulatory', 'audit', 'violation'],
  OPERATIONAL: ['outage', 'downtime', 'performance', 'degradation', 'incident'],
  CREATOR: ['earnings', 'partnership', 'monetization', 'payout', 'revenue']
};

export const telnyxSMSService = {
  // ============ PRIMARY SMS SENDING (TELNYX) ============
  
  async sendSMS(messageData) {
    try {
      const { to, message, messageType = 'operational', metadata = {} } = messageData;

      if (!to || !message) {
        throw new Error('Missing required fields: to, message');
      }

      // Check provider health before sending
      const { data: healthStatus } = await this.getProviderHealth();
      
      // Determine which provider to use
      const shouldUseTelnyx = healthStatus?.telnyxStatus === 'healthy' || healthStatus?.telnyxStatus === 'degraded';
      const shouldUseTwilio = !shouldUseTelnyx || healthStatus?.telnyxStatus === 'offline';

      // If Twilio failover, filter out gamification messages
      if (shouldUseTwilio && this.isGamificationMessage(messageType, message)) {
        console.log('Gamification message blocked during Twilio failover:', { messageType, to });
        
        // Log blocked message
        await this.logSMSDelivery({
          provider: 'twilio',
          phoneNumber: to,
          message,
          messageType,
          status: 'blocked',
          metadata: { reason: 'gamification_filtered_during_failover', ...metadata }
        });

        return { 
          data: null, 
          error: { message: 'Gamification messages are not sent during Twilio failover' },
          blocked: true
        };
      }

      // Try Telnyx first
      if (shouldUseTelnyx) {
        try {
          const result = await this.sendViaTelnyx(to, message, messageType, metadata);
          
          // Update health status on success
          await this.updateProviderHealth('telnyx', 'healthy', null);
          
          return result;
        } catch (telnyxError) {
          console.error('Telnyx send failed, attempting Twilio failover:', telnyxError);
          
          // Update health status
          await this.updateProviderHealth('telnyx', 'offline', telnyxError?.message);
          
          // Trigger failover alert
          await this.triggerFailoverAlert('telnyx', 'twilio', telnyxError?.message);
          
          // Attempt Twilio failover
          if (!this.isGamificationMessage(messageType, message)) {
            return await this.sendViaTwilio(to, message, messageType, { ...metadata, failover: true });
          } else {
            throw new Error('Telnyx failed and message is gamification-related (blocked from Twilio)');
          }
        }
      } else {
        // Use Twilio directly (Telnyx is offline)
        if (!this.isGamificationMessage(messageType, message)) {
          return await this.sendViaTwilio(to, message, messageType, { ...metadata, failover: true });
        } else {
          throw new Error('Telnyx offline and message is gamification-related (blocked from Twilio)');
        }
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendViaTelnyx(to, message, messageType, metadata) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${env.VITE_API_URL}/api/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          to: this.formatPhoneNumber(to),
          message,
          messagingProfileId: env.VITE_TELNYX_MESSAGING_PROFILE_ID
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send SMS via proxy');
      }

      const result = await response.json();

      // Log delivery
      await this.logSMSDelivery({
        provider: 'telnyx',
        phoneNumber: to,
        message,
        messageType,
        status: 'sent',
        externalId: result?.data?.id,
        metadata: { ...metadata, serverResponse: result?.data }
      });

      return { 
        data: { 
          provider: 'telnyx',
          messageId: result?.data?.id, 
          status: result?.data?.status,
          to: result?.data?.to,
          from: result?.data?.from
        }, 
        error: null 
      };
    } catch (error) {
      console.error('SMS Proxy Service Error:', error);
      throw error;
    }
  },

  async sendViaTwilio(to, message, messageType, metadata) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to: this.formatPhoneNumber(to),
          message,
          alertId: metadata?.alertId || `twilio_${Date.now()}`,
          severity: metadata?.severity || 'medium'
        }
      });

      if (error) throw error;

      // Log delivery
      await this.logSMSDelivery({
        provider: 'twilio',
        phoneNumber: to,
        message,
        messageType,
        status: 'sent',
        externalId: data?.messageSid,
        metadata: { ...metadata, twilioResponse: data }
      });

      return { 
        data: { 
          provider: 'twilio',
          messageId: data?.messageSid, 
          status: data?.status,
          failover: metadata?.failover || false
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Twilio API error:', error);
      
      // Log failed delivery
      await this.logSMSDelivery({
        provider: 'twilio',
        phoneNumber: to,
        message,
        messageType,
        status: 'failed',
        metadata: { ...metadata, error: error?.message }
      });

      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ MESSAGE FILTERING ============
  
  isGamificationMessage(messageType, messageContent) {
    // Check message type
    if (messageType && MESSAGE_CATEGORIES?.GAMIFICATION?.includes(messageType?.toLowerCase())) {
      return true;
    }

    // Check message content for gamification keywords
    const contentLower = messageContent?.toLowerCase();
    return MESSAGE_CATEGORIES?.GAMIFICATION?.some(keyword => contentLower?.includes(keyword));
  },

  // ============ HEALTH MONITORING ============
  
  async getProviderHealth() {
    try {
      const { data, error } = await supabase
        ?.from('sms_provider_health')
        ?.select('*')
        ?.order('checked_at', { ascending: false })
        ?.limit(2);

      if (error) throw error;

      const telnyxHealth = data?.find(h => h?.provider === 'telnyx') || { status: 'unknown' };
      const twilioHealth = data?.find(h => h?.provider === 'twilio') || { status: 'unknown' };

      return { 
        data: {
          telnyxStatus: telnyxHealth?.status,
          telnyxLastCheck: telnyxHealth?.checked_at,
          telnyxError: telnyxHealth?.error_message,
          twilioStatus: twilioHealth?.status,
          twilioLastCheck: twilioHealth?.checked_at,
          twilioError: twilioHealth?.error_message,
          activeProvider: telnyxHealth?.status === 'healthy' || telnyxHealth?.status === 'degraded' ? 'telnyx' : 'twilio'
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error getting provider health:', error);
      return { data: { telnyxStatus: 'unknown', twilioStatus: 'unknown', activeProvider: 'telnyx' }, error: null };
    }
  },

  async updateProviderHealth(provider, status, errorMessage = null) {
    try {
      const { data, error } = await supabase
        ?.from('sms_provider_health')
        ?.insert({
          provider,
          status,
          error_message: errorMessage,
          checked_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // If status changed to offline, trigger alert
      if (status === 'offline') {
        await this.triggerHealthAlert(provider, status, errorMessage);
      }

      // If Telnyx recovered, trigger recovery alert
      if (provider === 'telnyx' && status === 'healthy') {
        const { data: recentHealth } = await supabase
          ?.from('sms_provider_health')
          ?.select('status')
          ?.eq('provider', 'telnyx')
          ?.order('checked_at', { ascending: false })
          ?.limit(2);

        if (recentHealth?.length > 1 && recentHealth?.[1]?.status === 'offline') {
          await this.triggerRecoveryAlert('telnyx');
        }
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating provider health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async checkProviderHealth(provider) {
    try {
      if (provider === 'telnyx') {
        // Health check now performed via server-side logic (simplified for client)
        // In a real app, you'd call a server-side health endpoint
        return { data: { status: 'healthy' }, error: null };
      } else if (provider === 'twilio') {
        // Test Twilio connection via edge function
        const { error } = await supabase?.functions?.invoke('send-sms-alert', {
          body: { to: '+10000000000', message: 'health_check', test: true }
        });
        
        const status = error ? 'offline' : 'healthy';
        await this.updateProviderHealth('twilio', status, error?.message);
        return { data: { status }, error: null };
      }
    } catch (error) {
      console.error(`Error checking ${provider} health:`, error);
      await this.updateProviderHealth(provider, 'offline', error?.message);
      return { data: { status: 'offline' }, error: { message: error?.message } };
    }
  },

  async monitorProviderHealth() {
    try {
      const [telnyxResult, twilioResult] = await Promise.all([
        this.checkProviderHealth('telnyx'),
        this.checkProviderHealth('twilio')
      ]);

      return { 
        data: { 
          telnyx: telnyxResult?.data, 
          twilio: twilioResult?.data 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error monitoring provider health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ FAILOVER MANAGEMENT ============
  
  async triggerFailoverAlert(fromProvider, toProvider, reason) {
    try {
      const { data, error } = await supabase
        ?.from('sms_failover_events')
        ?.insert({
          from_provider: fromProvider,
          to_provider: toProvider,
          reason,
          triggered_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Send admin notification
      console.log(`SMS Failover Alert: ${fromProvider} → ${toProvider}. Reason: ${reason}`);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error triggering failover alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async triggerHealthAlert(provider, status, errorMessage) {
    try {
      console.log(`SMS Health Alert: ${provider} status changed to ${status}. Error: ${errorMessage}`);
      
      // Log to system alerts
      await supabase?.from('system_alerts')?.insert({
        category: 'sms_provider_health',
        severity: status === 'offline' ? 'critical' : 'high',
        title: `SMS Provider ${provider} ${status}`,
        message: `SMS provider ${provider} health status changed to ${status}. ${errorMessage || ''}`,
        metadata: { provider, status, errorMessage }
      });

      return { data: { alerted: true }, error: null };
    } catch (error) {
      console.error('Error triggering health alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async triggerRecoveryAlert(provider) {
    try {
      console.log(`SMS Recovery Alert: ${provider} service restored`);
      
      // Log recovery event
      await supabase?.from('sms_failover_events')?.insert({
        from_provider: 'twilio',
        to_provider: provider,
        reason: 'service_restored',
        triggered_at: new Date()?.toISOString()
      });

      return { data: { alerted: true }, error: null };
    } catch (error) {
      console.error('Error triggering recovery alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ DELIVERY LOGGING ============
  
  async logSMSDelivery(deliveryData) {
    try {
      const { data, error } = await supabase
        ?.from('sms_delivery_logs')
        ?.insert(toSnakeCase({
          ...deliveryData,
          sentAt: new Date()?.toISOString()
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error logging SMS delivery:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getDeliveryLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_delivery_logs')
        ?.select('*')
        ?.order('sent_at', { ascending: false });

      if (filters?.provider) {
        query = query?.eq('provider', filters?.provider);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.messageType) {
        query = query?.eq('message_type', filters?.messageType);
      }

      if (filters?.startDate) {
        query = query?.gte('sent_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('sent_at', filters?.endDate);
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting delivery logs:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  // ============ ANALYTICS ============
  
  async getDeliveryAnalytics(timeRange = '24h') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const { data: logs, error } = await supabase
        ?.from('sms_delivery_logs')
        ?.select('*')
        ?.gte('sent_at', startDate?.toISOString());

      if (error) throw error;

      // Calculate analytics
      const telnyxLogs = logs?.filter(l => l?.provider === 'telnyx');
      const twilioLogs = logs?.filter(l => l?.provider === 'twilio');

      const analytics = {
        total: logs?.length,
        telnyx: {
          total: telnyxLogs?.length,
          sent: telnyxLogs?.filter(l => l?.status === 'sent')?.length,
          delivered: telnyxLogs?.filter(l => l?.status === 'delivered')?.length,
          failed: telnyxLogs?.filter(l => l?.status === 'failed')?.length,
          bounced: telnyxLogs?.filter(l => l?.status === 'bounced')?.length,
          deliveryRate: telnyxLogs?.length > 0 
            ? ((telnyxLogs?.filter(l => l?.status === 'delivered')?.length / telnyxLogs?.length) * 100)?.toFixed(2)
            : 0
        },
        twilio: {
          total: twilioLogs?.length,
          sent: twilioLogs?.filter(l => l?.status === 'sent')?.length,
          delivered: twilioLogs?.filter(l => l?.status === 'delivered')?.length,
          failed: twilioLogs?.filter(l => l?.status === 'failed')?.length,
          bounced: twilioLogs?.filter(l => l?.status === 'bounced')?.length,
          deliveryRate: twilioLogs?.length > 0 
            ? ((twilioLogs?.filter(l => l?.status === 'delivered')?.length / twilioLogs?.length) * 100)?.toFixed(2)
            : 0
        },
        failoverCount: logs?.filter(l => l?.metadata?.failover === true)?.length,
        blockedCount: logs?.filter(l => l?.status === 'blocked')?.length
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error getting delivery analytics:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getFailoverHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        ?.from('sms_failover_events')
        ?.select('*')
        ?.order('triggered_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting failover history:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  // ============ UTILITIES ============
  
  formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber?.replace(/\D/g, '');
    
    if (cleaned?.length === 10) {
      return `+1${cleaned}`;
    }
    
    if (!phoneNumber?.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }
};