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

export const alertService = {
  // Alert Rules Management
  async getAlertRules(filters = {}) {
    try {
      let query = supabase
        ?.from('alert_rules')
        ?.select(`
          *,
          created_by_profile:created_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.severity && filters?.severity !== 'all') {
        query = query?.eq('severity', filters?.severity);
      }

      if (filters?.isEnabled !== undefined) {
        query = query?.eq('is_enabled', filters?.isEnabled);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createAlertRule(ruleData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('alert_rules')
        ?.insert({
          ...toSnakeCase(ruleData),
          created_by: user?.id
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateAlertRule(ruleId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('alert_rules')
        ?.update(toSnakeCase(updates))
        ?.eq('id', ruleId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteAlertRule(ruleId) {
    try {
      const { error } = await supabase
        ?.from('alert_rules')
        ?.delete()
        ?.eq('id', ruleId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  // System Alerts Management
  async getSystemAlerts(filters = {}) {
    try {
      let query = supabase
        ?.from('system_alerts')
        ?.select(`
          *,
          alert_rule:alert_rule_id(rule_name, category),
          acknowledged_by_profile:acknowledged_by(name, username),
          resolved_by_profile:resolved_by(name, username)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.severity && filters?.severity !== 'all') {
        query = query?.eq('severity', filters?.severity);
      }

      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let startDate;
        
        switch (filters?.timeRange) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query?.gte('created_at', startDate?.toISOString());
        }
      }

      if (filters?.limit) {
        query = query?.limit(filters?.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async acknowledgeAlert(alertId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({
          status: 'acknowledged',
          acknowledged_by: user?.id,
          acknowledged_at: new Date()?.toISOString()
        })
        ?.eq('id', alertId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async resolveAlert(alertId, resolutionNotes) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({
          status: 'resolved',
          resolved_by: user?.id,
          resolved_at: new Date()?.toISOString(),
          resolution_notes: resolutionNotes
        })
        ?.eq('id', alertId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async dismissAlert(alertId) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({ status: 'dismissed' })
        ?.eq('id', alertId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async markAsFalsePositive(alertId) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.update({ false_positive: true, status: 'dismissed' })
        ?.eq('id', alertId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createSystemAlert(alertData) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.insert(toSnakeCase(alertData))
        ?.select()
        ?.single();

      if (error) throw error;

      const alert = toCamelCase(data);

      // Trigger SMS for critical and high severity alerts
      if (alert?.severity === 'critical' || alert?.severity === 'high') {
        await this.sendSMSForAlert(alert);
      }

      return { data: alert, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendSMSForAlert(alert) {
    try {
      // Get admin phone numbers from notification rules
      const { data: notificationRules } = await supabase
        ?.from('notification_rules')
        ?.select('phone_number')
        ?.eq('channel', 'sms')
        ?.eq('is_enabled', true);

      if (!notificationRules || notificationRules?.length === 0) {
        console.log('No SMS notification rules configured');
        return;
      }

      const adminPhoneNumbers = notificationRules
        ?.map(rule => rule?.phone_number)
        ?.filter(phone => phone);

      if (adminPhoneNumbers?.length === 0) {
        console.log('No admin phone numbers configured');
        return;
      }

      // Send SMS based on alert category
      if (alert?.category === 'fraud_detection') {
        await smsAlertService?.sendCriticalFraudAlert(alert, adminPhoneNumbers);
      } else {
        await smsAlertService?.sendComplianceAlert(alert, adminPhoneNumbers);
      }
    } catch (error) {
      console.error('Error sending SMS for alert:', error);
    }
  },

  // Alert Statistics
  async getAlertStatistics() {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.select('status, severity, category, created_at');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.filter(a => a?.status === 'active')?.length || 0,
        acknowledged: data?.filter(a => a?.status === 'acknowledged')?.length || 0,
        resolved: data?.filter(a => a?.status === 'resolved')?.length || 0,
        bySeverity: {
          critical: data?.filter(a => a?.severity === 'critical')?.length || 0,
          high: data?.filter(a => a?.severity === 'high')?.length || 0,
          medium: data?.filter(a => a?.severity === 'medium')?.length || 0,
          low: data?.filter(a => a?.severity === 'low')?.length || 0
        },
        byCategory: {
          fraud_detection: data?.filter(a => a?.category === 'fraud_detection')?.length || 0,
          policy_violation: data?.filter(a => a?.category === 'policy_violation')?.length || 0,
          performance_anomaly: data?.filter(a => a?.category === 'performance_anomaly')?.length || 0,
          security_event: data?.filter(a => a?.category === 'security_event')?.length || 0,
          system_health: data?.filter(a => a?.category === 'system_health')?.length || 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Notification Rules
  async getNotificationRules(alertRuleId) {
    try {
      const { data, error } = await supabase
        ?.from('notification_rules')
        ?.select('*')
        ?.eq('alert_rule_id', alertRuleId);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createNotificationRule(ruleData) {
    try {
      const { data, error } = await supabase
        ?.from('notification_rules')
        ?.insert(toSnakeCase(ruleData))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Real-time Subscriptions
  subscribeToAlerts(callback) {
    const channel = supabase
      ?.channel('system_alerts_changes')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_alerts' },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            data: toCamelCase(payload?.new || payload?.old)
          });
        }
      )
      ?.subscribe();

    return channel;
  },

  unsubscribeFromAlerts(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  },

  // Alert Effectiveness
  async getAlertEffectiveness() {
    try {
      const { data, error } = await supabase
        ?.from('alert_effectiveness')
        ?.select(`
          *,
          alert_rule:alert_rule_id(rule_name, category, severity)
        `)
        ?.order('effectiveness_score', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};