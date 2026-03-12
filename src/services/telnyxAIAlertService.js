import { telnyxSMSService } from './telnyxSMSService';
import { supabase } from '../lib/supabase';

// Telnyx AI Alert Service - Critical AI service failure notifications
// Replaces Twilio for all AI alert workflows

const ALERT_ESCALATION_LEVELS = [
  { level: 1, name: 'Warning', minScore: 0.3, maxScore: 0.6, retryAfterMin: 30 },
  { level: 2, name: 'Critical', minScore: 0.6, maxScore: 0.85, retryAfterMin: 15 },
  { level: 3, name: 'Emergency', minScore: 0.85, maxScore: 1.0, retryAfterMin: 5 },
];

const AI_SERVICE_NAMES = {
  openai: 'OpenAI GPT-4',
  anthropic: 'Anthropic Claude',
  perplexity: 'Perplexity Sonar',
  gemini: 'Google Gemini',
};

export const telnyxAIAlertService = {
  /**
   * Send SMS alert when an AI service fails
   * Wired to the automatic-ai-failover-engine
   */
  async sendAIFailoverAlert(failoverData) {
    try {
      const { service, reason, fromHandler, toHandler, severity = 0.7, adminPhones = [] } = failoverData;

      const serviceName = AI_SERVICE_NAMES?.[service] || service;
      const escalationLevel = this.getEscalationLevel(severity);

      const message = this.buildFailoverMessage({
        serviceName,
        reason,
        fromHandler,
        toHandler,
        escalationLevel,
        timestamp: new Date()?.toISOString()
      });

      // Get admin phone numbers from database if not provided
      const phones = adminPhones?.length > 0 ? adminPhones : await this.getAdminPhones();

      const results = [];
      for (const phone of phones) {
        const result = await telnyxSMSService?.sendSMS({
          to: phone,
          message,
          messageType: 'security',
          metadata: { alertType: 'ai_failover', service, severity, escalationLevel: escalationLevel?.level }
        });
        results?.push(result);
      }

      // Log alert to database
      await this.logAlert({
        alert_type: 'ai_failover',
        service,
        severity,
        message,
        escalation_level: escalationLevel?.level,
        recipients: phones?.length,
        sent_at: new Date()?.toISOString()
      });

      return { data: { sent: results?.length, escalationLevel: escalationLevel?.name }, error: null };
    } catch (error) {
      console.error('[TelnyxAIAlert] Failed to send failover alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Send SMS alert for AI service degradation
   */
  async sendAIDegradationAlert(degradationData) {
    try {
      const { service, latency, errorRate, threshold } = degradationData;
      const serviceName = AI_SERVICE_NAMES?.[service] || service;

      const message = `⚠️ VOTTERY AI ALERT\n${serviceName} Performance Degraded\nLatency: ${latency}ms (threshold: ${threshold}ms)\nError Rate: ${(errorRate * 100)?.toFixed(2)}%\nTime: ${new Date()?.toLocaleString()}\nMonitor: ${window?.location?.origin}/automatic-ai-failover-engine-control-center`;

      const phones = await this.getAdminPhones();
      for (const phone of phones) {
        await telnyxSMSService?.sendSMS({ to: phone, message, messageType: 'security' });
      }

      return { data: { sent: phones?.length }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  /**
   * Send escalation workflow SMS for cost-efficiency takeover approval
   */
  async sendCostEfficiencyApprovalRequest(approvalData) {
    try {
      const { fromService, toService, estimatedSavings, caseReportUrl } = approvalData;

      const message = `🤖 VOTTERY AI COST ALERT\nGemini Takeover Approval Required\nFrom: ${AI_SERVICE_NAMES?.[fromService] || fromService}\nTo: Google Gemini\nEst. Savings: $${estimatedSavings?.toFixed(2)}/month\nApprove at: ${window?.location?.origin}/gemini-fallback-orchestration-hub\nTime: ${new Date()?.toLocaleString()}`;

      const phones = await this.getAdminPhones();
      for (const phone of phones) {
        await telnyxSMSService?.sendSMS({ to: phone, message, messageType: 'operational' });
      }

      return { data: { sent: phones?.length }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  buildFailoverMessage({ serviceName, reason, fromHandler, toHandler, escalationLevel, timestamp }) {
    const emoji = escalationLevel?.level === 3 ? '🚨' : escalationLevel?.level === 2 ? '⚠️' : '📢';
    return `${emoji} VOTTERY AI ${escalationLevel?.name?.toUpperCase()} ALERT\n${serviceName} Failover Triggered\nReason: ${reason}\nFrom: ${fromHandler} → To: ${toHandler}\nTime: ${new Date(timestamp)?.toLocaleString()}\nDashboard: ${window?.location?.origin}/automatic-ai-failover-engine-control-center`;
  },

  getEscalationLevel(severity) {
    return ALERT_ESCALATION_LEVELS?.find(l => severity >= l?.minScore && severity < l?.maxScore) || ALERT_ESCALATION_LEVELS?.[1];
  },

  async getAdminPhones() {
    try {
      const { data } = await supabase
        ?.from('admin_alert_contacts')
        ?.select('phone_number')
        ?.eq('is_active', true)
        ?.eq('alert_type', 'ai_failover');

      if (data && data?.length > 0) {
        return data?.map(d => d?.phone_number);
      }

      // Fallback to env variable
      const envPhone = import.meta.env?.VITE_TELNYX_PHONE_NUMBER;
      return envPhone ? [envPhone] : [];
    } catch (err) {
      const envPhone = import.meta.env?.VITE_TELNYX_PHONE_NUMBER;
      return envPhone ? [envPhone] : [];
    }
  },

  async logAlert(alertData) {
    try {
      await supabase?.from('ai_alert_logs')?.insert(alertData);
    } catch (err) {
      console.error('[TelnyxAIAlert] Failed to log alert:', err);
    }
  },

  // Backward compatibility - replaces any Twilio references
  async sendTwilioAlert(data) {
    console.warn('[TelnyxAIAlert] Twilio has been replaced with Telnyx. Routing through Telnyx.');
    return this.sendAIFailoverAlert(data);
  }
};

export default telnyxAIAlertService;
