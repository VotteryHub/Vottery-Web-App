import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';
import { optimizeSmsMessage } from './notificationCostOptimizerService';

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

export const smsAlertTemplateService = {
  // ============ TEMPLATE MANAGEMENT ============
  
  async getAllTemplates() {
    try {
      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.order('category', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting templates:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async getTemplatesByCategory(category) {
    try {
      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.eq('category', category)
        ?.eq('is_active', true);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting templates by category:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async createTemplate(templateData) {
    try {
      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.insert(toSnakeCase({
          ...templateData,
          createdAt: new Date()?.toISOString()
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateTemplate(templateId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.update(toSnakeCase({
          ...updates,
          updatedAt: new Date()?.toISOString()
        }))
        ?.eq('id', templateId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteTemplate(templateId) {
    try {
      const { error } = await supabase
        ?.from('sms_alert_templates')
        ?.delete()
        ?.eq('id', templateId);

      if (error) throw error;
      return { data: { deleted: true }, error: null };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ TEMPLATE RENDERING ============
  
  async renderTemplate(templateId, variables) {
    try {
      const { data: template, error } = await supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.eq('id', templateId)
        ?.single();

      if (error) throw error;

      let renderedContent = template?.content;

      // Replace variables
      Object.keys(variables)?.forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        renderedContent = renderedContent?.replace(regex, variables?.[key]);
      });

      return { data: { content: renderedContent, template: toCamelCase(template) }, error: null };
    } catch (error) {
      console.error('Error rendering template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ OPENAI SMS OPTIMIZATION ============
  
  async optimizeSMSContent(content, options = {}) {
    try {
      const { maxLength = 160, tone = 'professional', includeEmoji = true } = options;
      const localOptimized = optimizeSmsMessage(content || '');
      let optimizedContent = localOptimized.message;
      // Keep AI as optional refinement with Gemini-first routing.
      const response = await getChatCompletion(
        'GEMINI',
        'gemini-1.5-pro',
        [
          {
            role: 'user',
            content: `Rewrite this SMS under ${Math.min(maxLength, 160)} GSM-7 chars, preserve placeholders: "${optimizedContent}"`,
          },
        ],
        { max_completion_tokens: 120 }
      );
      optimizedContent = optimizeSmsMessage(
        response?.choices?.[0]?.message?.content?.trim() || optimizedContent
      ).message;

      return { 
        data: { 
          original: content,
          optimized: optimizedContent,
          characterCount: optimizedContent?.length,
          savings: content?.length - optimizedContent?.length
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error optimizing SMS content:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async generatePersonalizedContent(templateId, userProfile) {
    try {
      const { data: template } = await supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.eq('id', templateId)
        ?.single();

      if (!template) throw new Error('Template not found');

      const response = await getChatCompletion(
        'GEMINI',
        'gemini-1.5-pro',
        [
          {
            role: 'system',
            content: 'You are an SMS personalization expert. Create personalized SMS messages based on user profiles while maintaining the core message intent.'
          },
          {
            role: 'user',
            content: `Personalize this SMS template:

Template: "${template?.content}"
Category: ${template?.category}

User Profile:
- Name: ${userProfile?.name}
- Preferences: ${userProfile?.preferences?.join(', ')}
- Engagement Level: ${userProfile?.engagementLevel}
- Previous Interactions: ${userProfile?.previousInteractions}

Create a personalized version that:
1. Addresses the user appropriately
2. References their interests/preferences
3. Maintains professional tone
4. Stays under 160 characters
5. Preserves any {{variable}} placeholders

Return ONLY the personalized message.`
          }
        ],
        { max_completion_tokens: 200 }
      );

      const personalizedContent = optimizeSmsMessage(
        response?.choices?.[0]?.message?.content?.trim() || template?.content || ''
      ).message;

      return { data: { content: personalizedContent }, error: null };
    } catch (error) {
      console.error('Error generating personalized content:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // ============ RATE LIMITING & QUEUE ============
  
  async checkRateLimit(userId, provider = 'telnyx') {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now?.getTime() - 60 * 60 * 1000);

      // Get user's SMS count in last hour
      const { data: recentMessages, error } = await supabase
        ?.from('sms_delivery_logs')
        ?.select('id')
        ?.eq('metadata->>userId', userId)
        ?.eq('provider', provider)
        ?.gte('sent_at', oneHourAgo?.toISOString());

      if (error) throw error;

      // Get rate limit configuration
      const { data: config } = await supabase
        ?.from('sms_rate_limits')
        ?.select('*')
        ?.eq('provider', provider)
        ?.single();

      const limit = config?.per_user_hourly_limit || 10;
      const remaining = Math.max(0, limit - (recentMessages?.length || 0));

      return { 
        data: { 
          allowed: remaining > 0,
          limit,
          used: recentMessages?.length || 0,
          remaining,
          resetAt: new Date(now?.getTime() + 60 * 60 * 1000)?.toISOString()
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { data: { allowed: true }, error: null };
    }
  },

  async queueSMS(messageData) {
    try {
      const { data, error } = await supabase
        ?.from('sms_queue')
        ?.insert(toSnakeCase({
          ...messageData,
          status: 'pending',
          priority: messageData?.priority || 'medium',
          queuedAt: new Date()?.toISOString()
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error queuing SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async processQueue(batchSize = 10) {
    try {
      // Get pending messages ordered by priority
      const { data: queuedMessages, error } = await supabase
        ?.from('sms_queue')
        ?.select('*')
        ?.eq('status', 'pending')
        ?.order('priority', { ascending: false })
        ?.order('queued_at', { ascending: true })
        ?.limit(batchSize);

      if (error) throw error;

      const results = [];

      for (const message of queuedMessages || []) {
        const blockedByCompliance = await this.isBlockedFromSmsDelivery(
          message?.phone_number
        );
        if (blockedByCompliance?.blocked) {
          await supabase
            ?.from('sms_queue')
            ?.update({
              status: 'failed',
              processed_at: new Date()?.toISOString(),
              error_message: blockedByCompliance?.reason || 'SMS blocked by compliance policy',
            })
            ?.eq('id', message?.id);
          continue;
        }

        // Check rate limit
        const { data: rateLimitCheck } = await this.checkRateLimit(
          message?.metadata?.userId,
          message?.provider
        );

        if (!rateLimitCheck?.allowed) {
          console.log('Rate limit exceeded for user:', message?.metadata?.userId);
          continue;
        }

        // Send SMS via telnyxSMSService
        const { telnyxSMSService } = await import('./telnyxSMSService');
        const result = await telnyxSMSService?.sendSMS({
          to: message?.phone_number,
          message: message?.message,
          messageType: message?.message_type,
          metadata: message?.metadata
        });

        // Update queue status
        await supabase
          ?.from('sms_queue')
          ?.update({
            status: result?.error ? 'failed' : 'sent',
            processed_at: new Date()?.toISOString(),
            error_message: result?.error?.message
          })
          ?.eq('id', message?.id);

        results?.push({ messageId: message?.id, ...result });
      }

      return { data: { processed: results?.length, results }, error: null };
    } catch (error) {
      console.error('Error processing queue:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async isBlockedFromSmsDelivery(phoneNumber) {
    const phone = String(phoneNumber || '').trim();
    if (!phone) return { blocked: true, reason: 'Missing phone number' };
    if (!/^\+?[1-9]\d{7,14}$/.test(phone)) {
      return { blocked: true, reason: 'Invalid phone format' };
    }
    try {
      const { data: consent } = await supabase
        ?.from('sms_consent')
        ?.select('consent_status')
        ?.eq('phone_number', phone)
        ?.maybeSingle();
      if (consent?.consent_status === 'opted_out') {
        return { blocked: true, reason: 'Recipient opted out' };
      }
    } catch {
      // Continue with other checks.
    }
    try {
      const { data: hlr } = await supabase
        ?.from('phone_hlr_status')
        ?.select('is_active')
        ?.eq('phone_number', phone)
        ?.maybeSingle();
      if (hlr && hlr?.is_active === false) {
        return { blocked: true, reason: 'Phone failed HLR active check' };
      }
    } catch {
      // If HLR table is unavailable, do not block by default.
    }
    return { blocked: false, reason: null };
  },

  // ============ COMPLIANCE MANAGEMENT ============
  
  async checkConsent(phoneNumber) {
    try {
      const { data, error } = await supabase
        ?.from('sms_consent')
        ?.select('*')
        ?.eq('phone_number', phoneNumber)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;

      return { 
        data: { 
          hasConsent: data?.consent_status === 'opted_in',
          status: data?.consent_status || 'unknown',
          consentDate: data?.consent_date
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error checking consent:', error);
      return { data: { hasConsent: false }, error: null };
    }
  },

  async recordConsent(phoneNumber, consentData) {
    try {
      const { data, error } = await supabase
        ?.from('sms_consent')
        ?.upsert(toSnakeCase({
          phoneNumber,
          consentStatus: 'opted_in',
          consentDate: new Date()?.toISOString(),
          ...consentData
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error recording consent:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async recordOptOut(phoneNumber, reason = null) {
    try {
      const { data, error } = await supabase
        ?.from('sms_consent')
        ?.upsert(toSnakeCase({
          phoneNumber,
          consentStatus: 'opted_out',
          optOutDate: new Date()?.toISOString(),
          optOutReason: reason
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error recording opt-out:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getComplianceReport(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '90d':
          startDate?.setDate(now?.getDate() - 90);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const [consentData, deliveryData] = await Promise.all([
        supabase?.from('sms_consent')?.select('*'),
        supabase?.from('sms_delivery_logs')?.select('*')?.gte('sent_at', startDate?.toISOString())
      ]);

      const consents = consentData?.data || [];
      const deliveries = deliveryData?.data || [];

      const report = {
        totalContacts: consents?.length,
        optedIn: consents?.filter(c => c?.consent_status === 'opted_in')?.length,
        optedOut: consents?.filter(c => c?.consent_status === 'opted_out')?.length,
        pending: consents?.filter(c => c?.consent_status === 'pending')?.length,
        messagesSent: deliveries?.length,
        messagesWithConsent: deliveries?.filter(d => {
          const consent = consents?.find(c => c?.phone_number === d?.phone_number);
          return consent?.consent_status === 'opted_in';
        })?.length,
        complianceRate: deliveries?.length > 0
          ? ((deliveries?.filter(d => {
              const consent = consents?.find(c => c?.phone_number === d?.phone_number);
              return consent?.consent_status === 'opted_in';
            })?.length / deliveries?.length) * 100)?.toFixed(2)
          : 100
      };

      return { data: report, error: null };
    } catch (error) {
      console.error('Error getting compliance report:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};