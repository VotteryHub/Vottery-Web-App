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

export const smsAlertTemplatesService = {
  // Get all alert templates
  async getAllTemplates(filters = {}) {
    try {
      let query = supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.category) {
        query = query?.eq('category', filters?.category);
      }

      if (filters?.provider) {
        query = query?.in('provider', [filters?.provider, 'both']);
      }

      if (filters?.isActive !== undefined) {
        query = query?.eq('is_active', filters?.isActive);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting templates:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get template by ID
  async getTemplateById(templateId) {
    try {
      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.select('*')
        ?.eq('id', templateId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create new template
  async createTemplate(templateData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.insert({
          ...toSnakeCase(templateData),
          created_by: user?.id,
          created_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update template
  async updateTemplate(templateId, updates) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current template for versioning
      const { data: currentTemplate } = await this.getTemplateById(templateId);

      if (currentTemplate) {
        // Create version history
        await supabase?.from('sms_template_versions')?.insert({
          template_id: templateId,
          template_content: currentTemplate?.messageBody,
          variables: currentTemplate?.variables,
          changed_by: user?.id,
          change_reason: updates?.changeReason || 'Template updated'
        });
      }

      const { data, error } = await supabase
        ?.from('sms_alert_templates')
        ?.update({
          ...toSnakeCase(updates),
          updated_at: new Date()?.toISOString()
        })
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

  // Delete template
  async deleteTemplate(templateId) {
    try {
      const { error } = await supabase
        ?.from('sms_alert_templates')
        ?.delete()
        ?.eq('template_id', templateId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Render template with variables
  renderTemplate(messageBody, variables) {
    let rendered = messageBody;

    Object.keys(variables)?.forEach(key => {
      const placeholder = `{{${key}}}`;
      rendered = rendered?.replace(new RegExp(placeholder, 'g'), variables?.[key] || '');
    });

    return rendered;
  },

  // Get template version history
  async getTemplateVersions(templateId) {
    try {
      const { data, error } = await supabase
        ?.from('sms_template_versions')
        ?.select('*')
        ?.eq('template_id', templateId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error getting template versions:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get template categories
  getTemplateCategories() {
    return [
      {
        id: 'fraud_alert',
        label: 'Fraud Alerts',
        icon: 'ShieldAlert',
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        description: 'Critical fraud detection and security alerts'
      },
      {
        id: 'system_outage',
        label: 'System Outages',
        icon: 'AlertTriangle',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        description: 'System downtime and service interruption notifications'
      },
      {
        id: 'performance_degradation',
        label: 'Performance Degradation',
        icon: 'TrendingDown',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        description: 'Performance issues and slowdown alerts'
      },
      {
        id: 'anomaly_detection',
        label: 'Anomaly Detection',
        icon: 'Activity',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        description: 'Unusual patterns and behavior detection'
      },
      {
        id: 'compliance',
        label: 'Compliance Notifications',
        icon: 'FileCheck',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        description: 'Regulatory compliance and policy notifications'
      },
      {
        id: 'security',
        label: 'Security Alerts',
        icon: 'Lock',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        description: 'Security incidents and authentication alerts'
      }
    ];
  },

  // Get default templates for carousel health alerting
  getDefaultTemplates() {
    return [
      {
        templateName: 'Critical Fraud Alert - SMS',
        provider: 'both',
        messageBody: '🚨 CRITICAL FRAUD ALERT\n\nFraud Score: {{fraudScore}}/100\nEntity: {{entityType}}\nTime: {{timestamp}}\n\nImmediate action required.',
        variables: ['fraudScore', 'entityType', 'timestamp'],
        maxLength: 160,
        category: 'fraud'
      },
      {
        templateName: 'System Outage Notification',
        provider: 'both',
        messageBody: '⚠️ SYSTEM OUTAGE\n\nService: {{serviceName}}\nStatus: {{status}}\nETA: {{estimatedResolution}}\n\nWe are working to resolve this.',
        variables: ['serviceName', 'status', 'estimatedResolution'],
        maxLength: 160,
        category: 'operational'
      },
      {
        templateName: 'Performance Degradation Alert',
        provider: 'both',
        messageBody: '📉 PERFORMANCE ALERT\n\nSystem: {{systemName}}\nDegradation: {{percentage}}%\nImpact: {{impactLevel}}\n\nMonitoring in progress.',
        variables: ['systemName', 'percentage', 'impactLevel'],
        maxLength: 160,
        category: 'operational'
      },
      {
        templateName: 'Anomaly Detected',
        provider: 'both',
        messageBody: '🔍 ANOMALY DETECTED\n\nType: {{anomalyType}}\nSeverity: {{severity}}\nLocation: {{location}}\n\nInvestigation initiated.',
        variables: ['anomalyType', 'severity', 'location'],
        maxLength: 160,
        category: 'operational'
      },
      {
        templateName: 'Compliance Notification',
        provider: 'both',
        messageBody: '📋 COMPLIANCE ALERT\n\nType: {{complianceType}}\nAction: {{actionRequired}}\nDeadline: {{deadline}}\n\nReview required.',
        variables: ['complianceType', 'actionRequired', 'deadline'],
        maxLength: 160,
        category: 'compliance'
      },
      {
        templateName: 'Security Incident Alert',
        provider: 'both',
        messageBody: '🔒 SECURITY ALERT\n\nIncident: {{incidentType}}\nSeverity: {{severity}}\nTime: {{timestamp}}\n\nImmediate review needed.',
        variables: ['incidentType', 'severity', 'timestamp'],
        maxLength: 160,
        category: 'security'
      }
    ];
  },

  // Send SMS using template
  async sendTemplatedSMS(templateId, to, variables, provider = null) {
    try {
      // Get template
      const { data: template, error: templateError } = await this.getTemplateById(templateId);
      if (templateError) throw templateError;

      // Render template with variables
      const message = this.renderTemplate(template?.messageBody, variables);

      // Send SMS
      const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
        body: {
          to,
          message,
          provider: provider || template?.provider,
          messageType: template?.category
        }
      });

      if (error) throw error;

      // Log delivery
      await supabase?.from('sms_template_usage')?.insert({
        template_id: templateId,
        recipient: to,
        message_content: message,
        provider: provider || template?.provider,
        sent_at: new Date()?.toISOString()
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error sending templated SMS:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get template usage statistics
  async getTemplateUsageStats(templateId) {
    try {
      const { data, error } = await supabase
        ?.from('sms_alerts_sent')
        ?.select('*')
        ?.eq('template_id', templateId);

      if (error) throw error;

      const stats = {
        totalSent: data?.length || 0,
        lastUsed: data?.[0]?.sent_at || null,
        successRate: 100 // Calculate based on delivery status if available
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting template usage stats:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};

export default smsAlertTemplatesService;
