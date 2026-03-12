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

export const regulatorySubmissionService = {
  async submitRegulatoryFiling(submissionData) {
    try {
      const { filingId, jurisdiction, regulatoryAuthority, recipients, emailSubject, emailContent, attachmentUrls } = submissionData;

      const { data: logEntry, error: logError } = await supabase
        ?.from('resend_submission_logs')
        ?.insert({
          submission_type: 'regulatory_filing',
          filing_id: filingId,
          jurisdiction,
          regulatory_authority: regulatoryAuthority,
          recipients,
          email_subject: emailSubject,
          email_content: emailContent,
          attachment_urls: attachmentUrls || [],
          delivery_status: 'pending',
          audit_trail: [{
            timestamp: new Date()?.toISOString(),
            event: 'Submission initiated',
            details: 'Regulatory filing submission process started'
          }]
        })
        ?.select()
        ?.single();

      if (logError) throw logError;

      const edgeFunctionUrl = `${import.meta.env?.VITE_SUPABASE_URL}/functions/v1/send-regulatory-submission`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env?.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          submissionId: logEntry?.id,
          filingId,
          jurisdiction,
          regulatoryAuthority,
          recipients,
          subject: emailSubject,
          htmlContent: emailContent,
          attachmentUrls
        })
      });

      const result = await response?.json();

      if (response?.ok && result?.success) {
        await supabase
          ?.from('resend_submission_logs')
          ?.update({
            delivery_status: 'sent',
            resend_message_id: result?.messageId,
            sent_at: new Date()?.toISOString(),
            audit_trail: [...(logEntry?.audit_trail || []), {
              timestamp: new Date()?.toISOString(),
              event: 'Email sent successfully',
              details: `Resend message ID: ${result?.messageId}`
            }]
          })
          ?.eq('id', logEntry?.id);

        analytics?.trackEvent('regulatory_submission_sent', {
          jurisdiction,
          submission_type: 'regulatory_filing'
        });

        return { data: toCamelCase({ ...logEntry, deliveryStatus: 'sent' }), error: null };
      } else {
        await supabase
          ?.from('resend_submission_logs')
          ?.update({
            delivery_status: 'failed',
            error_message: result?.error || 'Unknown error',
            audit_trail: [...(logEntry?.audit_trail || []), {
              timestamp: new Date()?.toISOString(),
              event: 'Email delivery failed',
              details: result?.error || 'Unknown error'
            }]
          })
          ?.eq('id', logEntry?.id);

        throw new Error(result?.error || 'Failed to send regulatory submission');
      }
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getSubmissionLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('resend_submission_logs')
        ?.select('*')
        ?.order('created_at', { ascending: false });

      if (filters?.jurisdiction && filters?.jurisdiction !== 'all') {
        query = query?.eq('jurisdiction', filters?.jurisdiction);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('delivery_status', filters?.status);
      }

      if (filters?.submissionType && filters?.submissionType !== 'all') {
        query = query?.eq('submission_type', filters?.submissionType);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async retryFailedSubmission(submissionId) {
    try {
      const { data: submission } = await supabase
        ?.from('resend_submission_logs')
        ?.select('*')
        ?.eq('id', submissionId)
        ?.single();

      if (!submission) throw new Error('Submission not found');

      const retryResult = await this.submitRegulatoryFiling({
        filingId: submission?.filing_id,
        jurisdiction: submission?.jurisdiction,
        regulatoryAuthority: submission?.regulatory_authority,
        recipients: submission?.recipients,
        emailSubject: submission?.email_subject,
        emailContent: submission?.email_content,
        attachmentUrls: submission?.attachment_urls
      });

      if (!retryResult?.error) {
        await supabase
          ?.from('resend_submission_logs')
          ?.update({
            retry_count: (submission?.retry_count || 0) + 1
          })
          ?.eq('id', submissionId);
      }

      return retryResult;
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getSubmissionStatistics(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeRange) {
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

      const { data, error } = await supabase
        ?.from('resend_submission_logs')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const statistics = {
        totalSubmissions: data?.length || 0,
        successfulSubmissions: data?.filter(s => s?.delivery_status === 'sent' || s?.delivery_status === 'delivered')?.length || 0,
        failedSubmissions: data?.filter(s => s?.delivery_status === 'failed')?.length || 0,
        pendingSubmissions: data?.filter(s => s?.delivery_status === 'pending')?.length || 0,
        successRate: ((data?.filter(s => s?.delivery_status === 'sent' || s?.delivery_status === 'delivered')?.length || 0) / (data?.length || 1) * 100)?.toFixed(2),
        submissionsByJurisdiction: this.groupByJurisdiction(data),
        submissionsByType: this.groupByType(data)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  groupByJurisdiction(submissions) {
    const grouped = {};
    submissions?.forEach(submission => {
      const jurisdiction = submission?.jurisdiction;
      grouped[jurisdiction] = (grouped?.[jurisdiction] || 0) + 1;
    });
    return grouped;
  },

  groupByType(submissions) {
    const grouped = {};
    submissions?.forEach(submission => {
      const type = submission?.submission_type;
      grouped[type] = (grouped?.[type] || 0) + 1;
    });
    return grouped;
  }
};