import { supabase } from '../lib/supabase';
import { telnyxSMSService } from './telnyxSMSService';

const DEFAULT_THRESHOLDS = {
  syncFailurePercent: 5,
  accuracyDropPercent: 15,
  sentimentNegativityPercent: 70,
};

let pollingInterval = null;
let currentThresholds = { ...DEFAULT_THRESHOLDS };

export const mcqAlertAutomationService = {
  getThresholds() {
    return { ...currentThresholds };
  },

  setThresholds(newThresholds) {
    currentThresholds = { ...currentThresholds, ...newThresholds };
  },

  async checkSyncFailureRate() {
    try {
      const since = new Date(Date.now() - 5 * 60 * 1000)?.toISOString();
      const { data: deliveries } = await supabase?.from('mcq_injection_deliveries')?.select('status')?.gte('created_at', since);

      if (!deliveries?.length) return { rate: 0, triggered: false };
      const failed = deliveries?.filter(d => d?.status === 'failed')?.length;
      const rate = (failed / deliveries?.length) * 100;
      const triggered = rate > currentThresholds?.syncFailurePercent;
      return { rate, triggered, total: deliveries?.length, failed };
    } catch (e) {
      return { rate: 0, triggered: false, error: e?.message };
    }
  },

  async checkAccuracyDrop() {
    try {
      const now = new Date();
      const recent = new Date(now.getTime() - 60 * 60 * 1000)?.toISOString();
      const prev = new Date(now.getTime() - 2 * 60 * 60 * 1000)?.toISOString();

      const { data: recentResponses } = await supabase?.from('voter_mcq_responses')?.select('is_correct')?.gte('created_at', recent);

      const { data: prevResponses } = await supabase?.from('voter_mcq_responses')?.select('is_correct')?.gte('created_at', prev)?.lt('created_at', recent);

      if (!recentResponses?.length || !prevResponses?.length) return { drop: 0, triggered: false };

      const recentAccuracy = (recentResponses?.filter(r => r?.is_correct)?.length / recentResponses?.length) * 100;
      const prevAccuracy = (prevResponses?.filter(r => r?.is_correct)?.length / prevResponses?.length) * 100;
      const drop = prevAccuracy - recentAccuracy;
      const triggered = drop > currentThresholds?.accuracyDropPercent;
      return { drop, recentAccuracy, prevAccuracy, triggered };
    } catch (e) {
      return { drop: 0, triggered: false, error: e?.message };
    }
  },

  async checkSentimentNegativity() {
    try {
      const since = new Date(Date.now() - 60 * 60 * 1000)?.toISOString();
      const { data: responses } = await supabase?.from('voter_free_text_responses')?.select('sentiment_score')?.gte('created_at', since)?.not('sentiment_score', 'is', null);

      if (!responses?.length) return { negativityPercent: 0, triggered: false };
      const negative = responses?.filter(r => (r?.sentiment_score || 0) < 0)?.length;
      const negativityPercent = (negative / responses?.length) * 100;
      const triggered = negativityPercent > currentThresholds?.sentimentNegativityPercent;
      return { negativityPercent, triggered, total: responses?.length, negative };
    } catch (e) {
      return { negativityPercent: 0, triggered: false, error: e?.message };
    }
  },

  async getAdminPhones() {
    try {
      const { data } = await supabase
        ?.from('admin_alert_contacts')
        ?.select('phone_number')
        ?.eq('is_active', true)
        ?.in('alert_type', ['mcq_alerts', 'all']);

      if (data && data?.length > 0) {
        return data?.map(d => d?.phone_number);
      }
      const envPhone = import.meta.env?.VITE_TELNYX_PHONE_NUMBER;
      return envPhone ? [envPhone] : ['+12345661030'];
    } catch (err) {
      const envPhone = import.meta.env?.VITE_TELNYX_PHONE_NUMBER;
      return envPhone ? [envPhone] : ['+12345661030'];
    }
  },

  async sendSMSAlert(alertType, details) {
    try {
      const phones = await this.getAdminPhones();
      const messages = {
        syncFailure: `🚨 MCQ ALERT: Sync failure rate ${details?.rate?.toFixed(1)}% exceeds ${currentThresholds?.syncFailurePercent}% threshold. ${details?.failed}/${details?.total} deliveries failed.`,
        accuracyDrop: `🚨 MCQ ALERT: Accuracy dropped ${details?.drop?.toFixed(1)}% (from ${details?.prevAccuracy?.toFixed(1)}% to ${details?.recentAccuracy?.toFixed(1)}%). Threshold: ${currentThresholds?.accuracyDropPercent}%.`,
        sentimentSpike: `🚨 MCQ ALERT: Sentiment negativity ${details?.negativityPercent?.toFixed(1)}% exceeds ${currentThresholds?.sentimentNegativityPercent}% threshold. ${details?.negative}/${details?.total} responses negative.`,
      };
      const message = messages?.[alertType];
      for (const phone of phones) {
        await telnyxSMSService?.sendSMS({ to: phone, message, messageType: 'security' });
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e?.message };
    }
  },

  async sendEmailAlert(alertType, details) {
    try {
      const resendApiKey = import.meta.env?.VITE_RESEND_API_KEY;
      if (!resendApiKey) return { success: false, error: 'No Resend API key' };

      const subjects = {
        syncFailure: `MCQ Alert: Sync Failure Rate ${details?.rate?.toFixed(1)}%`,
        accuracyDrop: `MCQ Alert: Accuracy Drop ${details?.drop?.toFixed(1)}%`,
        sentimentSpike: `MCQ Alert: Sentiment Negativity ${details?.negativityPercent?.toFixed(1)}%`,
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'alerts@vottery.com',
          to: ['admin@vottery.com'],
          subject: subjects?.[alertType],
          html: `<h2>MCQ Alert Triggered</h2><pre>${JSON.stringify(details, null, 2)}</pre>`,
        }),
      });
      return { success: response?.ok };
    } catch (e) {
      return { success: false, error: e?.message };
    }
  },

  async runCheck() {
    const results = { timestamp: new Date()?.toISOString(), alerts: [] };

    const [syncResult, accuracyResult, sentimentResult] = await Promise.all([
      this.checkSyncFailureRate(),
      this.checkAccuracyDrop(),
      this.checkSentimentNegativity(),
    ]);

    if (syncResult?.triggered) {
      results?.alerts?.push({ type: 'syncFailure', details: syncResult });
      await Promise.all([this.sendSMSAlert('syncFailure', syncResult), this.sendEmailAlert('syncFailure', syncResult)]);
    }
    if (accuracyResult?.triggered) {
      results?.alerts?.push({ type: 'accuracyDrop', details: accuracyResult });
      await Promise.all([this.sendSMSAlert('accuracyDrop', accuracyResult), this.sendEmailAlert('accuracyDrop', accuracyResult)]);
    }
    if (sentimentResult?.triggered) {
      results?.alerts?.push({ type: 'sentimentSpike', details: sentimentResult });
      await Promise.all([this.sendSMSAlert('sentimentSpike', sentimentResult), this.sendEmailAlert('sentimentSpike', sentimentResult)]);
    }

    results.syncFailure = syncResult;
    results.accuracyDrop = accuracyResult;
    results.sentimentNegativity = sentimentResult;
    return results;
  },

  startPolling(intervalMs = 5 * 60 * 1000) {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(() => this.runCheck(), intervalMs);
    return () => clearInterval(pollingInterval);
  },

  stopPolling() {
    if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
  },
};

export default mcqAlertAutomationService;
