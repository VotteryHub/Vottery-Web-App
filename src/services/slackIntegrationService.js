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

export const slackIntegrationService = {
  // Send Slack notification
  async sendSlackNotification(webhookUrl, message) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      if (!response?.ok) {
        throw new Error(`Slack API error: ${response?.status}`);
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  // Format alert message for Slack
  formatAlertMessage(alertType, data) {
    const colors = {
      fraud: '#dc2626',
      revenue: '#16a34a',
      incident: '#ea580c',
      milestone: '#3b82f6',
      critical: '#dc2626'
    };

    const emojis = {
      fraud: '🚨',
      revenue: '💰',
      incident: '⚠️',
      milestone: '🎉',
      critical: '🔴'
    };

    const color = colors?.[alertType] || colors?.incident;
    const emoji = emojis?.[alertType] || emojis?.incident;

    return {
      text: `${emoji} ${data?.title || 'Platform Alert'}`,
      attachments: [
        {
          color: color,
          title: data?.title,
          text: data?.message,
          fields: data?.fields || [],
          footer: 'Vottery Platform',
          footer_icon: 'https://vottery.com/favicon.ico',
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    };
  },

  // Send fraud alert
  async sendFraudAlert(fraudData) {
    try {
      const webhookUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
      if (!webhookUrl || webhookUrl === 'your-slack-webhook-url-here') {
        console.warn('Slack webhook URL not configured');
        return { success: false, error: { message: 'Webhook not configured' } };
      }

      const message = this.formatAlertMessage('fraud', {
        title: '🚨 Fraud Alert Detected',
        message: fraudData?.description || 'Suspicious activity detected',
        fields: [
          {
            title: 'Severity',
            value: fraudData?.severity || 'High',
            short: true
          },
          {
            title: 'User ID',
            value: fraudData?.userId || 'Unknown',
            short: true
          },
          {
            title: 'Detection Type',
            value: fraudData?.detectionType || 'Automated',
            short: true
          },
          {
            title: 'Confidence Score',
            value: `${fraudData?.confidenceScore || 0}%`,
            short: true
          }
        ]
      });

      const result = await this.sendSlackNotification(webhookUrl, message);

      // Log notification
      await this.logSlackNotification({
        alertType: 'fraud',
        data: fraudData,
        success: result?.success
      });

      return result;
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  // Send revenue milestone alert
  async sendRevenueMilestone(milestoneData) {
    try {
      const webhookUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
      if (!webhookUrl || webhookUrl === 'your-slack-webhook-url-here') {
        console.warn('Slack webhook URL not configured');
        return { success: false, error: { message: 'Webhook not configured' } };
      }

      const message = this.formatAlertMessage('revenue', {
        title: '💰 Revenue Milestone Achieved',
        message: milestoneData?.message || 'New revenue milestone reached',
        fields: [
          {
            title: 'Milestone',
            value: milestoneData?.milestone || '$0',
            short: true
          },
          {
            title: 'Current Revenue',
            value: milestoneData?.currentRevenue || '$0',
            short: true
          },
          {
            title: 'Growth Rate',
            value: `${milestoneData?.growthRate || 0}%`,
            short: true
          },
          {
            title: 'Period',
            value: milestoneData?.period || 'This month',
            short: true
          }
        ]
      });

      const result = await this.sendSlackNotification(webhookUrl, message);

      await this.logSlackNotification({
        alertType: 'revenue',
        data: milestoneData,
        success: result?.success
      });

      return result;
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  // Send incident escalation
  async sendIncidentEscalation(incidentData) {
    try {
      const webhookUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
      if (!webhookUrl || webhookUrl === 'your-slack-webhook-url-here') {
        console.warn('Slack webhook URL not configured');
        return { success: false, error: { message: 'Webhook not configured' } };
      }

      const message = this.formatAlertMessage('incident', {
        title: '⚠️ Incident Escalation',
        message: incidentData?.description || 'Critical incident requires attention',
        fields: [
          {
            title: 'Incident ID',
            value: incidentData?.incidentId || 'Unknown',
            short: true
          },
          {
            title: 'Severity',
            value: incidentData?.severity || 'High',
            short: true
          },
          {
            title: 'Category',
            value: incidentData?.category || 'General',
            short: true
          },
          {
            title: 'Status',
            value: incidentData?.status || 'Open',
            short: true
          }
        ]
      });

      const result = await this.sendSlackNotification(webhookUrl, message);

      await this.logSlackNotification({
        alertType: 'incident',
        data: incidentData,
        success: result?.success
      });

      return result;
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  // Send custom admin notification
  async sendAdminNotification(notificationData) {
    try {
      const webhookUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
      if (!webhookUrl || webhookUrl === 'your-slack-webhook-url-here') {
        console.warn('Slack webhook URL not configured');
        return { success: false, error: { message: 'Webhook not configured' } };
      }

      const message = this.formatAlertMessage(notificationData?.type || 'incident', {
        title: notificationData?.title,
        message: notificationData?.message,
        fields: notificationData?.fields || []
      });

      const result = await this.sendSlackNotification(webhookUrl, message);

      await this.logSlackNotification({
        alertType: notificationData?.type || 'custom',
        data: notificationData,
        success: result?.success
      });

      return result;
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  // Log Slack notification
  async logSlackNotification(logData) {
    try {
      const { error } = await supabase
        ?.from('slack_notification_logs')
        ?.insert({
          alert_type: logData?.alertType,
          notification_data: logData?.data,
          delivery_status: logData?.success ? 'delivered' : 'failed',
          created_at: new Date()?.toISOString()
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to log Slack notification:', error);
      return { success: false };
    }
  },

  // Get Slack notification logs
  async getNotificationLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('slack_notification_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(filters?.limit || 50);

      if (filters?.alertType) {
        query = query?.eq('alert_type', filters?.alertType);
      }

      if (filters?.status) {
        query = query?.eq('delivery_status', filters?.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get notification statistics
  async getNotificationStats() {
    try {
      const { data, error } = await supabase
        ?.from('slack_notification_logs')
        ?.select('alert_type, delivery_status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        delivered: data?.filter(n => n?.delivery_status === 'delivered')?.length || 0,
        failed: data?.filter(n => n?.delivery_status === 'failed')?.length || 0,
        byType: {}
      };

      data?.forEach(notification => {
        const type = notification?.alert_type;
        if (!stats?.byType?.[type]) {
          stats.byType[type] = { total: 0, delivered: 0, failed: 0 };
        }
        stats.byType[type].total++;
        if (notification?.delivery_status === 'delivered') {
          stats.byType[type].delivered++;
        } else {
          stats.byType[type].failed++;
        }
      });

      stats.deliveryRate = stats?.total > 0 
        ? ((stats?.delivered / stats?.total) * 100)?.toFixed(2)
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Test Slack webhook
  async testWebhook(webhookUrl) {
    try {
      const testMessage = {
        text: '✅ Slack Integration Test',
        attachments: [
          {
            color: '#16a34a',
            title: 'Connection Successful',
            text: 'Your Slack webhook is configured correctly and ready to receive notifications.',
            footer: 'Vottery Platform',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      const result = await this.sendSlackNotification(webhookUrl, testMessage);
      return result;
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  }
};