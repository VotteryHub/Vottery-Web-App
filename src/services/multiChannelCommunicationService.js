import { supabase } from '../lib/supabase';
import {
  buildChannelPlan,
  isSmsAllowedUseCase,
  optimizeSmsMessage,
} from './notificationCostOptimizerService';
import { integrationSettingsService } from './integrationSettingsService';
import { countryRestrictionsService } from './countryRestrictionsService';

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

async function ensureIntegrationAccessOrThrow(integrationName, projectedCost = 0) {
  const check = await integrationSettingsService.canUseIntegration(
    integrationName,
    projectedCost
  );
  if (!check?.allowed) {
    throw new Error(check?.reason || `Integration ${integrationName} is unavailable`);
  }
}

export const multiChannelCommunicationService = {
  async sendMultiChannelNotification(notificationData) {
    try {
      const {
        incidentId,
        recipients,
        subject,
        message,
        channels,
        severity,
        escalationLevel,
        useCase,
      } = notificationData;
      const rawRecipients = Array.isArray(recipients) ? recipients : [];
      const recipientsInAllowedCountries = [];
      for (const r of rawRecipients) {
        const allowed = await countryRestrictionsService.isCountryEnabled(r?.countryCode);
        if (allowed) recipientsInAllowedCountries.push(r);
      }
      const sampleRecipient = recipientsInAllowedCountries?.[0] || {};
      const plannedChannels =
        channels?.length
          ? channels.map((channel) => ({ channel, immediate: true }))
          : buildChannelPlan({
              severity,
              useCase,
              hasPushToken: Boolean(sampleRecipient?.pushToken),
              hasWhatsApp: Boolean(sampleRecipient?.whatsapp),
              hasPhone: Boolean(sampleRecipient?.phone),
            });
      const smsAllowed = isSmsAllowedUseCase(useCase);

      const results = {
        push: null,
        whatsapp: null,
        email: null,
        sms: null,
      };

      if (plannedChannels.some((c) => c.channel === 'email')) {
        await ensureIntegrationAccessOrThrow('Resend', 0.001);
        const emailResult = await this.sendEmailNotification({
          incidentId,
          recipients: recipientsInAllowedCountries?.filter(r => r?.email),
          subject,
          htmlContent: this.formatEmailContent(message, incidentId, severity),
          severity,
        });
        results.email = emailResult;
        await integrationSettingsService.recordUsage('Resend', 0.001);
      }

      if (plannedChannels.some((c) => c.channel === 'push')) {
        await ensureIntegrationAccessOrThrow('Push Notifications', 0);
        const pushResult = await this.sendPushNotification({
          incidentId,
          recipients: recipientsInAllowedCountries?.filter(r => r?.pushToken),
          title: subject,
          message,
          severity,
        });
        results.push = pushResult;
      }

      if (plannedChannels.some((c) => c.channel === 'whatsapp')) {
        await ensureIntegrationAccessOrThrow('WhatsApp (Twilio)', 0.004);
        const whatsappResult = await this.sendWhatsAppNotification({
          incidentId,
          recipients: recipientsInAllowedCountries?.filter(r => r?.whatsapp),
          message,
          severity,
          escalationLevel,
        });
        results.whatsapp = whatsappResult;
        await integrationSettingsService.recordUsage('WhatsApp (Twilio)', 0.004);
      }

      if (smsAllowed && plannedChannels.some((c) => c.channel === 'sms')) {
        await ensureIntegrationAccessOrThrow('Twilio', 0.008);
        const optimized = optimizeSmsMessage(message);
        const smsResult = await this.sendSMSNotification({
          incidentId,
          recipients: recipientsInAllowedCountries?.filter(r => r?.phone),
          message: optimized.message,
          severity,
          escalationLevel,
        });
        results.sms = smsResult;
        await integrationSettingsService.recordUsage('Twilio', 0.008);
      }

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          incident_id: incidentId,
          communication_type: 'multi_channel',
          recipient_type: 'stakeholder',
          recipients: recipientsInAllowedCountries?.map(r => ({
            email: r?.email,
            phone: r?.phone,
            name: r?.name,
          })),
          message_subject: subject,
          message_content: message,
          delivery_status: 'sent',
          channels_used: plannedChannels.map((c) => c.channel),
          metadata: {
            results,
            severity,
            escalationLevel,
            plannedChannels,
            useCase,
            smsAllowed,
          },
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: { ...toCamelCase(data), channelResults: results }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendEmailNotification(emailData) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-multi-channel-notification', {
        body: emailData,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendSMSNotification(smsData) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-stakeholder-sms', {
        body: smsData,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendWhatsAppNotification(whatsappData) {
    try {
      const recipients = Array.isArray(whatsappData?.recipients)
        ? whatsappData.recipients
        : [];
      const results = [];
      for (const recipient of recipients) {
        const to = recipient?.whatsapp || recipient?.phone || '';
        if (!to) continue;
        const { data, error } = await supabase?.functions?.invoke(
          'send-whatsapp-notification',
          {
            body: {
              to,
              message: whatsappData?.message,
              channel: 'whatsapp',
            },
          }
        );
        results.push({ to, data, error: error?.message || null });
      }
      return { data: { sent: results.filter((r) => !r.error).length, results }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendPushNotification(pushData) {
    try {
      const recipients = Array.isArray(pushData?.recipients)
        ? pushData.recipients
        : [];
      const results = [];
      for (const recipient of recipients) {
        const userId = recipient?.userId || recipient?.id || null;
        if (!userId) continue;
        const { data, error } = await supabase?.functions?.invoke('smart-push-timing', {
          body: {
            userId,
            notificationPayload: {
              title: pushData?.title || 'Vottery Alert',
              body: pushData?.message || '',
              data: {
                incidentId: pushData?.incidentId,
                severity: pushData?.severity,
              },
            },
          },
        });
        results.push({ userId, data, error: error?.message || null });
      }
      return { data: { scheduled: results.filter((r) => !r.error).length, results }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  formatEmailContent(message, incidentId, severity) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background-color: ${severity === 'critical' ? '#dc2626' : severity === 'high' ? '#ea580c' : '#3b82f6'}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
            .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Incident Notification</h1>
            <span class="badge" style="background-color: rgba(255,255,255,0.2);">${severity?.toUpperCase()}</span>
          </div>
          <div class="content">
            <p><strong>Incident ID:</strong> ${incidentId}</p>
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>This is an automated notification from Vottery Platform</p>
          </div>
        </body>
      </html>
    `;
  },

  async getStakeholdersByEscalationLevel(escalationLevel) {
    try {
      const { data, error } = await supabase
        ?.from('stakeholder_communication_preferences')
        ?.select('*, stakeholder_groups(*)')
        ?.eq('escalation_level', escalationLevel)
        ?.eq('is_active', true);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async routeByStakeholderType(incidentData) {
    try {
      const { incidentType, severity, affectedEntities } = incidentData;

      let stakeholderType = 'general';
      if (incidentType === 'fraud_detection') stakeholderType = 'security_team';
      else if (incidentType === 'compliance_violation') stakeholderType = 'compliance_team';
      else if (incidentType === 'payment_dispute') stakeholderType = 'finance_team';

      const { data, error } = await supabase
        ?.from('stakeholder_groups')
        ?.select('*, stakeholder_communication_preferences(*)')
        ?.eq('group_type', stakeholderType)
        ?.eq('is_active', true);

      if (error) throw error;

      const recipients = data?.flatMap(group => 
        group?.stakeholder_communication_preferences?.map(pref => ({
          email: pref?.email_address,
          phone: pref?.phone_number,
          name: pref?.stakeholder_name,
          preferredChannel: pref?.preferred_channel,
        }))
      );

      return { data: recipients, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCommunicationAnalytics(timeRange = '7d') {
    try {
      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const analytics = {
        totalCommunications: data?.length || 0,
        byChannel: this.groupByChannel(data),
        deliveryRate: this.calculateDeliveryRate(data),
        averageResponseTime: 32,
        escalationMetrics: this.calculateEscalationMetrics(data),
      };

      return { data: analytics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  groupByChannel(communications) {
    const grouped = { email: 0, sms: 0, multi_channel: 0 };
    communications?.forEach(c => {
      const type = c?.communication_type;
      if (grouped?.[type] !== undefined) grouped[type]++;
    });
    return grouped;
  },

  calculateDeliveryRate(communications) {
    const total = communications?.length || 0;
    const delivered = communications?.filter(c => c?.delivery_status === 'sent' || c?.delivery_status === 'delivered')?.length || 0;
    return total > 0 ? ((delivered / total) * 100)?.toFixed(2) : 0;
  },

  calculateEscalationMetrics(communications) {
    const escalated = communications?.filter(c => c?.metadata?.escalationLevel)?.length || 0;
    return {
      totalEscalated: escalated,
      escalationRate: communications?.length > 0 ? ((escalated / communications?.length) * 100)?.toFixed(2) : 0,
    };
  },
};