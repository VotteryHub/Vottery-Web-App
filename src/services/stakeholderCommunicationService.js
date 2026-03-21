import { supabase } from '../lib/supabase';
import { analytics } from '../hooks/useGoogleAnalytics';

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

export const stakeholderCommunicationService = {
  getChannelPolicyForSeverity(severity) {
    const normalized = this.normalizeSeverity(severity);
    const policies = {
      critical: ['email', 'sms', 'push', 'slack'],
      high: ['email', 'sms', 'push'],
      medium: ['email', 'push'],
      low: ['email']
    };
    return policies?.[normalized] || policies?.medium;
  },

  normalizeSeverity(severity) {
    if (!severity) return 'medium';
    const raw = String(severity)?.toLowerCase();
    if (raw === 'p0' || raw === 'critical') return 'critical';
    if (raw === 'p1' || raw === 'high') return 'high';
    if (raw === 'p2' || raw === 'medium') return 'medium';
    if (raw === 'p3' || raw === 'low') return 'low';
    return 'medium';
  },

  // Incident Communications
  async sendIncidentCommunication(communicationData) {
    try {
      const { incidentId, communicationType, recipientType, recipients, messageSubject, messageContent, metadata } = communicationData;

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          incident_id: incidentId,
          communication_type: communicationType,
          recipient_type: recipientType,
          recipients,
          message_subject: messageSubject,
          message_content: messageContent,
          delivery_status: 'pending',
          metadata: metadata || {}
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Execute actual communication based on type
      if (communicationType === 'email') {
        await this.sendEmailCommunication(data?.id, recipients, messageSubject, messageContent);
      } else if (communicationType === 'sms') {
        await this.sendSMSCommunication(data?.id, recipients, messageContent);
      }

      analytics?.trackEvent('incident_communication_sent', {
        communication_type: communicationType,
        recipient_type: recipientType,
        recipient_count: recipients?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendEmailCommunication(communicationId, recipients, subject, content) {
    try {
      const { data, error } = await supabase?.functions?.invoke('send-regulatory-submission', {
        body: {
          submissionId: communicationId,
          recipients: recipients?.map(r => ({ email: r?.email || r })),
          subject,
          htmlContent: content
        }
      });

      if (error) throw error;

      await supabase
        ?.from('incident_communications')
        ?.update({
          delivery_status: 'sent',
          resend_message_id: data?.messageId,
          sent_at: new Date()?.toISOString()
        })
        ?.eq('id', communicationId);

      return { data, error: null };
    } catch (error) {
      await supabase
        ?.from('incident_communications')
        ?.update({
          delivery_status: 'failed',
          error_message: error?.message
        })
        ?.eq('id', communicationId);

      return { data: null, error: { message: error?.message } };
    }
  },

  async sendSMSCommunication(communicationId, recipients, message) {
    try {
      const results = [];

      for (const recipient of recipients) {
        const phoneNumber = recipient?.phone || recipient;
        
        const { data, error } = await supabase?.functions?.invoke('send-sms-alert', {
          body: {
            to: phoneNumber,
            message,
            alertId: communicationId,
            severity: 'high'
          }
        });

        if (error) throw error;

        results?.push({
          recipient: phoneNumber,
          status: 'sent',
          messageSid: data?.messageSid
        });
      }

      await supabase
        ?.from('incident_communications')
        ?.update({
          delivery_status: 'sent',
          twilio_message_sid: results?.[0]?.messageSid,
          sent_at: new Date()?.toISOString()
        })
        ?.eq('id', communicationId);

      return { data: results, error: null };
    } catch (error) {
      await supabase
        ?.from('incident_communications')
        ?.update({
          delivery_status: 'failed',
          error_message: error?.message
        })
        ?.eq('id', communicationId);

      return { data: null, error: { message: error?.message } };
    }
  },

  async getIncidentCommunications(incidentId) {
    try {
      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.select('*')
        ?.eq('incident_id', incidentId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCommunicationStatistics(timeRange = '30d') {
    try {
      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.select('*');

      if (error) throw error;

      const statistics = {
        totalCommunications: data?.length || 0,
        byChannel: this.groupByChannel(data),
        byRecipientType: this.groupByRecipientType(data),
        deliveryRate: this.calculateDeliveryRate(data),
        averageResponseTime: 45,
        failedCommunications: data?.filter(c => c?.delivery_status === 'failed')?.length || 0
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  groupByChannel(communications) {
    const grouped = {};
    communications?.forEach(c => {
      const channel = c?.communication_type;
      if (!grouped?.[channel]) grouped[channel] = 0;
      grouped[channel]++;
    });
    return grouped;
  },

  groupByRecipientType(communications) {
    const grouped = {};
    communications?.forEach(c => {
      const type = c?.recipient_type;
      if (!grouped?.[type]) grouped[type] = 0;
      grouped[type]++;
    });
    return grouped;
  },

  calculateDeliveryRate(communications) {
    const total = communications?.length || 0;
    const delivered = communications?.filter(c => c?.delivery_status === 'delivered' || c?.delivery_status === 'sent')?.length || 0;
    return total > 0 ? ((delivered / total) * 100)?.toFixed(2) : 0;
  },

  // Stakeholder Groups
  async getStakeholderGroups() {
    try {
      const { data, error } = await supabase
        ?.from('stakeholder_groups')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('group_name', { ascending: true });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createStakeholderGroup(groupData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('stakeholder_groups')
        ?.insert({
          ...toSnakeCase(groupData),
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

  async updateStakeholderGroup(groupId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('stakeholder_groups')
        ?.update({
          ...toSnakeCase(updates),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', groupId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Communication Preferences
  async getCommunicationPreferences(stakeholderGroupId) {
    try {
      const { data, error } = await supabase
        ?.from('stakeholder_communication_preferences')
        ?.select('*')
        ?.eq('stakeholder_group_id', stakeholderGroupId)
        ?.order('incident_severity', { ascending: false });

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateCommunicationPreferences(preferenceId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('stakeholder_communication_preferences')
        ?.update({
          ...toSnakeCase(updates),
          updated_at: new Date()?.toISOString()
        })
        ?.eq('id', preferenceId)
        ?.select()
        ?.single();

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Automated Stakeholder Notifications
  async notifyStakeholdersForIncident(incidentId, incidentData) {
    try {
      const { data: stakeholderGroups } = await this.getStakeholderGroups();
      const notifications = [];
      const severity = this.normalizeSeverity(incidentData?.threatLevel);
      const allowedChannels = this.getChannelPolicyForSeverity(severity);

      for (const group of stakeholderGroups || []) {
        const { data: preferences } = await this.getCommunicationPreferences(group?.id);
        const relevantPreference = preferences?.find((p) => this.normalizeSeverity(p?.incidentSeverity) === severity);

        if (relevantPreference) {
          const recipients = group?.recipients || [];

          if (relevantPreference?.emailEnabled && recipients?.length > 0 && allowedChannels?.includes('email')) {
            const emailResult = await this.sendIncidentCommunication({
              incidentId,
              communicationType: 'email',
              recipientType: group?.groupType,
              recipients,
              messageSubject: `Incident Alert: ${incidentData?.title}`,
              messageContent: this.generateIncidentEmailContent(incidentData),
              metadata: { groupId: group?.id, severity: incidentData?.threatLevel }
            });
            notifications?.push(emailResult);
          }

          if (relevantPreference?.smsEnabled && recipients?.length > 0 && allowedChannels?.includes('sms')) {
            const smsResult = await this.sendIncidentCommunication({
              incidentId,
              communicationType: 'sms',
              recipientType: group?.groupType,
              recipients,
              messageContent: this.generateIncidentSMSContent(incidentData),
              metadata: { groupId: group?.id, severity: incidentData?.threatLevel }
            });
            notifications?.push(smsResult);
          }
        }
      }

      return { data: notifications, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  generateIncidentEmailContent(incidentData) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #DC2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .severity { font-weight: bold; color: #DC2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 Incident Alert</h1>
          </div>
          <div class="content">
            <h2>${incidentData?.title}</h2>
            <p><span class="severity">Severity:</span> ${incidentData?.threatLevel?.toUpperCase()}</p>
            <p><span class="severity">Type:</span> ${incidentData?.incidentType}</p>
            <p>${incidentData?.description}</p>
            <p><strong>Automated actions have been initiated.</strong></p>
            <p>Please review the incident in the Automated Incident Response Portal.</p>
          </div>
        </body>
      </html>
    `;
  },

  generateIncidentSMSContent(incidentData) {
    return `🚨 INCIDENT ALERT\n\n${incidentData?.title}\n\nSeverity: ${incidentData?.threatLevel?.toUpperCase()}\nType: ${incidentData?.incidentType}\n\nAutomated response initiated. Review in portal.`;
  },

  // ML Feedback Cycle Alerts
  async sendMLFeedbackAlert(feedbackData) {
    try {
      const { modelName, feedbackType, performanceMetrics, recipients, severity } = feedbackData;

      const messageContent = `
        <h2>ML Model Feedback Alert</h2>
        <p><strong>Model:</strong> ${modelName}</p>
        <p><strong>Feedback Type:</strong> ${feedbackType}</p>
        <p><strong>Severity:</strong> ${severity}</p>
        <h3>Performance Metrics:</h3>
        <ul>
          ${Object.entries(performanceMetrics || {})?.map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)?.join('')}
        </ul>
        <p>This alert was generated automatically by the ML feedback cycle monitoring system.</p>
      `;

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          communication_type: 'email',
          recipient_type: 'ml_stakeholders',
          recipients: recipients?.map(r => ({ email: r })),
          message_subject: `ML Feedback Alert: ${modelName} - ${feedbackType}`,
          message_content: messageContent,
          delivery_status: 'pending',
          metadata: {
            alertType: 'ml_feedback',
            modelName,
            feedbackType,
            severity,
            performanceMetrics
          }
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Send email via Resend
      await this.sendEmailCommunication(
        data?.id,
        recipients,
        `ML Feedback Alert: ${modelName} - ${feedbackType}`,
        messageContent
      );

      analytics?.trackEvent('ml_feedback_alert_sent', {
        model_name: modelName,
        feedback_type: feedbackType,
        severity,
        recipient_count: recipients?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Compliance Report Automation
  async sendAutomatedComplianceReport(reportData) {
    try {
      const { reportType, jurisdiction, reportingPeriod, recipients, reportContent, attachments } = reportData;

      const messageContent = `
        <h2>Automated Compliance Report</h2>
        <p><strong>Report Type:</strong> ${reportType}</p>
        <p><strong>Jurisdiction:</strong> ${jurisdiction}</p>
        <p><strong>Reporting Period:</strong> ${reportingPeriod}</p>
        <hr>
        ${reportContent}
        <hr>
        <p><em>This report was generated automatically by the Vottery compliance automation system.</em></p>
      `;

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          communication_type: 'email',
          recipient_type: 'compliance_stakeholders',
          recipients: recipients?.map(r => ({ email: r })),
          message_subject: `Compliance Report: ${reportType} - ${jurisdiction}`,
          message_content: messageContent,
          delivery_status: 'pending',
          metadata: {
            alertType: 'compliance_report',
            reportType,
            jurisdiction,
            reportingPeriod,
            attachments: attachments || []
          }
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Send via Resend edge function
      await supabase?.functions?.invoke('send-regulatory-filing', {
        body: {
          filingId: data?.id,
          recipients: recipients?.map(r => ({ email: r })),
          subject: `Compliance Report: ${reportType} - ${jurisdiction}`,
          htmlContent: messageContent,
          jurisdiction,
          reportType
        }
      });

      await supabase
        ?.from('incident_communications')
        ?.update({
          delivery_status: 'sent',
          sent_at: new Date()?.toISOString()
        })
        ?.eq('id', data?.id);

      analytics?.trackEvent('compliance_report_sent', {
        report_type: reportType,
        jurisdiction,
        recipient_count: recipients?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Dispute Notification Workflows
  async sendDisputeNotification(disputeData) {
    try {
      const { disputeId, disputeType, severity, affectedParties, resolutionStatus, aiAgentRecommendation } = disputeData;

      const messageContent = `
        <h2>Dispute Notification</h2>
        <p><strong>Dispute ID:</strong> ${disputeId}</p>
        <p><strong>Type:</strong> ${disputeType}</p>
        <p><strong>Severity:</strong> ${severity}</p>
        <p><strong>Resolution Status:</strong> ${resolutionStatus}</p>
        <h3>AI Agent Recommendation:</h3>
        <p>${aiAgentRecommendation || 'Analysis in progress...'}</p>
        <h3>Affected Parties:</h3>
        <ul>
          ${affectedParties?.map(party => `<li>${party?.name} (${party?.role})</li>`)?.join('')}
        </ul>
        <p><em>This notification was generated by the autonomous dispute resolution system.</em></p>
      `;

      const recipients = affectedParties?.map(p => p?.email)?.filter(Boolean);

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          communication_type: 'email',
          recipient_type: 'dispute_stakeholders',
          recipients: recipients?.map(r => ({ email: r })),
          message_subject: `Dispute Notification: ${disputeType} - ${disputeId}`,
          message_content: messageContent,
          delivery_status: 'pending',
          metadata: {
            alertType: 'dispute_notification',
            disputeId,
            disputeType,
            severity,
            resolutionStatus,
            aiAgentRecommendation
          }
        })
        ?.select()
        ?.single();

      if (error) throw error;

      // Send email notifications
      await this.sendEmailCommunication(
        data?.id,
        recipients,
        `Dispute Notification: ${disputeType} - ${disputeId}`,
        messageContent
      );

      // Send SMS for high severity disputes
      if (severity === 'high' || severity === 'critical') {
        const phoneNumbers = affectedParties?.map(p => p?.phone)?.filter(Boolean);
        if (phoneNumbers?.length > 0) {
          await this.sendSMSCommunication(
            data?.id,
            phoneNumbers,
            `URGENT: Dispute ${disputeId} requires immediate attention. Check your email for details.`
          );
        }
      }

      analytics?.trackEvent('dispute_notification_sent', {
        dispute_type: disputeType,
        severity,
        recipient_count: recipients?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Autonomous Agent Workflow Coordination
  async sendAgentCoordinationAlert(coordinationData) {
    try {
      const { workflowId, agentType, actionType, status, recipients, details } = coordinationData;

      const messageContent = `
        <h2>Autonomous Agent Coordination Alert</h2>
        <p><strong>Workflow ID:</strong> ${workflowId}</p>
        <p><strong>Agent Type:</strong> ${agentType}</p>
        <p><strong>Action:</strong> ${actionType}</p>
        <p><strong>Status:</strong> ${status}</p>
        <h3>Details:</h3>
        <p>${details}</p>
        <p><em>This alert was generated by the autonomous agent orchestration system.</em></p>
      `;

      const { data, error } = await supabase
        ?.from('incident_communications')
        ?.insert({
          communication_type: 'email',
          recipient_type: 'agent_coordinators',
          recipients: recipients?.map(r => ({ email: r })),
          message_subject: `Agent Coordination: ${agentType} - ${actionType}`,
          message_content: messageContent,
          delivery_status: 'pending',
          metadata: {
            alertType: 'agent_coordination',
            workflowId,
            agentType,
            actionType,
            status
          }
        })
        ?.select()
        ?.single();

      if (error) throw error;

      await this.sendEmailCommunication(
        data?.id,
        recipients,
        `Agent Coordination: ${agentType} - ${actionType}`,
        messageContent
      );

      analytics?.trackEvent('agent_coordination_alert_sent', {
        agent_type: agentType,
        action_type: actionType,
        status,
        recipient_count: recipients?.length
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get ML Feedback Alert History
  async getMLFeedbackAlerts(filters = {}) {
    try {
      let query = supabase
        ?.from('incident_communications')
        ?.select('*')
        ?.eq('metadata->>alertType', 'ml_feedback')
        ?.order('created_at', { ascending: false });

      if (filters?.modelName) {
        query = query?.eq('metadata->>modelName', filters?.modelName);
      }

      if (filters?.severity) {
        query = query?.eq('metadata->>severity', filters?.severity);
      }

      const { data, error } = await query?.limit(100);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get Compliance Report History
  async getComplianceReports(filters = {}) {
    try {
      let query = supabase
        ?.from('incident_communications')
        ?.select('*')
        ?.eq('metadata->>alertType', 'compliance_report')
        ?.order('created_at', { ascending: false });

      if (filters?.jurisdiction) {
        query = query?.eq('metadata->>jurisdiction', filters?.jurisdiction);
      }

      if (filters?.reportType) {
        query = query?.eq('metadata->>reportType', filters?.reportType);
      }

      const { data, error } = await query?.limit(100);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get Dispute Notifications
  async getDisputeNotifications(filters = {}) {
    try {
      let query = supabase
        ?.from('incident_communications')
        ?.select('*')
        ?.eq('metadata->>alertType', 'dispute_notification')
        ?.order('created_at', { ascending: false });

      if (filters?.severity) {
        query = query?.eq('metadata->>severity', filters?.severity);
      }

      if (filters?.disputeType) {
        query = query?.eq('metadata->>disputeType', filters?.disputeType);
      }

      const { data, error } = await query?.limit(100);

      if (error) throw error;

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Real-time Subscriptions
  subscribeToIncidentCommunications(callback) {
    const channel = supabase
      ?.channel('incident_communications_changes')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incident_communications' },
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

  unsubscribeFromIncidentCommunications(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};
