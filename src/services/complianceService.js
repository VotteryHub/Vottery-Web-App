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

class ComplianceService {
  async getRegulatoryFilings(filters = {}) {
    try {
      let query = supabase
        ?.from('regulatory_filings')
        ?.select(`
          *,
          submitted_by_profile:submitted_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.jurisdiction && filters?.jurisdiction !== 'all') {
        query = query?.eq('jurisdiction', filters?.jurisdiction);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.filingType && filters?.filingType !== 'all') {
        query = query?.eq('filing_type', filters?.filingType);
      }

      if (filters?.timeRange) {
        const now = new Date();
        let startDate;
        
        switch (filters?.timeRange) {
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'quarter':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query?.gte('created_at', startDate?.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      analytics?.trackEvent('regulatory_filings_viewed', {
        total_filings: data?.length,
        jurisdiction: filters?.jurisdiction,
        status: filters?.status
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async createRegulatoryFiling(filingData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('regulatory_filings')
        ?.insert({
          ...toSnakeCase(filingData),
          submitted_by: user?.id,
          status: 'pending'
        })
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('regulatory_filing_created', {
        filing_type: filingData?.filingType,
        jurisdiction: filingData?.jurisdiction
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getPolicyViolations(filters = {}) {
    try {
      let query = supabase
        ?.from('policy_violations')
        ?.select(`
          *,
          violator_profile:violator_id(id, name, username, email),
          reviewed_by_profile:reviewed_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.severity && filters?.severity !== 'all') {
        query = query?.eq('severity', filters?.severity);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.violationType && filters?.violationType !== 'all') {
        query = query?.eq('violation_type', filters?.violationType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getJurisdictionCompliance(filters = {}) {
    try {
      let query = supabase
        ?.from('jurisdiction_compliance')
        ?.select('*')
        ?.order('last_updated', { ascending: false });

      if (filters?.jurisdiction && filters?.jurisdiction !== 'all') {
        query = query?.eq('jurisdiction', filters?.jurisdiction);
      }

      if (filters?.complianceStatus && filters?.complianceStatus !== 'all') {
        query = query?.eq('compliance_status', filters?.complianceStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getComplianceAuditTrail(filters = {}) {
    try {
      const { data, error } = await supabase
        ?.from('admin_activity_logs')
        ?.select(`
          *,
          admin:admin_id(id, name, username, email)
        `)
        ?.eq('compliance_relevant', true)
        ?.order('created_at', { ascending: false })
        ?.limit(filters?.limit || 100);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getComplianceStatistics(timeRange = '30d') {
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
        case '1y':
          startDate?.setFullYear(now?.getFullYear() - 1);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const [filingsResult, violationsResult, jurisdictionsResult, auditTrailResult] = await Promise.all([
        supabase?.from('regulatory_filings')?.select('*', { count: 'exact' })?.gte('created_at', startDate?.toISOString()),
        supabase?.from('policy_violations')?.select('*', { count: 'exact' })?.gte('created_at', startDate?.toISOString()),
        supabase?.from('jurisdiction_compliance')?.select('*'),
        supabase?.from('admin_activity_logs')?.select('*', { count: 'exact' })?.eq('compliance_relevant', true)?.gte('created_at', startDate?.toISOString())
      ]);

      const filings = filingsResult?.data || [];
      const violations = violationsResult?.data || [];
      const jurisdictions = jurisdictionsResult?.data || [];

      const statistics = {
        totalFilings: filingsResult?.count || 0,
        pendingFilings: filings?.filter(f => f?.status === 'pending')?.length || 0,
        approvedFilings: filings?.filter(f => f?.status === 'approved')?.length || 0,
        rejectedFilings: filings?.filter(f => f?.status === 'rejected')?.length || 0,
        totalViolations: violationsResult?.count || 0,
        activeViolations: violations?.filter(v => v?.status === 'open')?.length || 0,
        resolvedViolations: violations?.filter(v => v?.status === 'resolved')?.length || 0,
        totalJurisdictions: jurisdictions?.length || 0,
        compliantJurisdictions: jurisdictions?.filter(j => j?.compliance_status === 'compliant')?.length || 0,
        nonCompliantJurisdictions: jurisdictions?.filter(j => j?.compliance_status === 'non_compliant')?.length || 0,
        auditTrailEntries: auditTrailResult?.count || 0,
        complianceScore: this.calculateComplianceScore(jurisdictions)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  calculateComplianceScore(jurisdictions) {
    if (!jurisdictions || jurisdictions?.length === 0) return 100;
    
    const compliant = jurisdictions?.filter(j => j?.compliance_status === 'compliant')?.length;
    return ((compliant / jurisdictions?.length) * 100)?.toFixed(1);
  }

  async updateFilingStatus(filingId, status, notes) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('regulatory_filings')
        ?.update({
          status,
          review_notes: notes,
          reviewed_at: new Date()?.toISOString(),
          reviewed_by: user?.id
        })
        ?.eq('id', filingId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async updateViolationStatus(violationId, status, resolution) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('policy_violations')
        ?.update({
          status,
          resolution_notes: resolution,
          resolved_at: status === 'resolved' ? new Date()?.toISOString() : null,
          reviewed_by: user?.id
        })
        ?.eq('id', violationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getRegulatorySubmissionLogs(filingId) {
    try {
      const { data, error } = await supabase
        ?.from('resend_submission_logs')
        ?.select('*')
        ?.eq('filing_id', filingId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async submitRegulatoryFilingViaResend(filingId, recipients) {
    try {
      const { data: filing } = await this.getRegulatoryFilings({ filingId });
      if (!filing || filing?.length === 0) {
        throw new Error('Filing not found');
      }

      const filingData = filing?.[0];
      const submissionPromises = recipients?.map(async (recipient) => {
        const logEntry = {
          filing_id: filingId,
          recipient_email: recipient?.email,
          jurisdiction: recipient?.jurisdiction || filingData?.jurisdiction,
          submission_status: 'pending',
          audit_trail: [
            {
              event: 'submission_initiated',
              timestamp: new Date()?.toISOString(),
              initiatedBy: 'system'
            }
          ]
        };

        const { data, error } = await supabase
          ?.from('resend_submission_logs')
          ?.insert(logEntry)
          ?.select()
          ?.single();

        if (error) throw error;

        try {
          const response = await supabase?.functions?.invoke('send-regulatory-filing', {
            body: {
              filingData,
              recipientEmail: recipient?.email,
              jurisdiction: recipient?.jurisdiction,
              logId: data?.id
            }
          });

          if (response?.error) throw response?.error;

          await supabase
            ?.from('resend_submission_logs')
            ?.update({
              submission_status: 'sent',
              resend_message_id: response?.data?.messageId,
              audit_trail: [
                ...logEntry?.audit_trail,
                {
                  event: 'email_sent',
                  timestamp: new Date()?.toISOString(),
                  messageId: response?.data?.messageId
                }
              ]
            })
            ?.eq('id', data?.id);

          return { success: true, logId: data?.id };
        } catch (sendError) {
          await supabase
            ?.from('resend_submission_logs')
            ?.update({
              submission_status: 'failed',
              delivery_error: sendError?.message,
              retry_count: 1
            })
            ?.eq('id', data?.id);

          return { success: false, error: sendError?.message };
        }
      });

      const results = await Promise.all(submissionPromises);
      return { data: results, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  async getSubmissionStatistics(timeRange = '30d') {
    try {
      const now = new Date();
      let startDate;
      
      switch (timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const { data, error } = await supabase
        ?.from('resend_submission_logs')
        ?.select('submission_status, delivery_confirmed_at, created_at')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const stats = {
        totalSubmissions: data?.length || 0,
        successfulDeliveries: data?.filter(item => item?.submission_status === 'delivered')?.length || 0,
        pendingSubmissions: data?.filter(item => item?.submission_status === 'pending' || item?.submission_status === 'sent')?.length || 0,
        failedSubmissions: data?.filter(item => item?.submission_status === 'failed')?.length || 0,
        deliveryRate: data?.length > 0 ? ((data?.filter(item => item?.submission_status === 'delivered')?.length / data?.length) * 100)?.toFixed(2) : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }

  // NEW: GDPR Audit Trail
  async getGDPRAuditTrail(params) {
    try {
      const { data, error } = await supabase
        ?.from('compliance_audit_trail')
        ?.select('*')
        ?.eq('compliance_type', 'GDPR')
        ?.order('created_at', { ascending: false })
        ?.limit(100);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to get GDPR audit trail:', error);
      return { data: [], error };
    }
  }

  async generateGDPRAuditReport(params) {
    try {
      // Generate GDPR audit report logic
      return { data: { reportId: 'GDPR-' + Date?.now(), status: 'generated' }, error: null };
    } catch (error) {
      console.error('Failed to generate GDPR audit report:', error);
      return { data: null, error };
    }
  }

  // NEW: PCI-DSS Compliance
  async getPCIDSSComplianceStatus() {
    try {
      const { data, error } = await supabase
        ?.from('compliance_status')
        ?.select('*')
        ?.eq('standard', 'PCI-DSS')
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to get PCI-DSS status:', error);
      return { data: null, error };
    }
  }

  // NEW: Compliance Scheduling
  async getScheduledComplianceReports() {
    try {
      const { data, error } = await supabase
        ?.from('scheduled_compliance_reports')
        ?.select('*')
        ?.eq('status', 'active')
        ?.order('next_run', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to get scheduled reports:', error);
      return { data: [], error };
    }
  }

  async scheduleComplianceReport(reportConfig) {
    try {
      const { data, error } = await supabase
        ?.from('scheduled_compliance_reports')
        ?.insert([reportConfig])
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to schedule report:', error);
      return { data: null, error };
    }
  }

  // NEW: Submission Workflows
  async getSubmissionWorkflows(params) {
    try {
      const { data, error } = await supabase
        ?.from('compliance_submission_workflows')
        ?.select('*')
        ?.eq('status', params?.status || 'active')
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to get submission workflows:', error);
      return { data: [], error };
    }
  }

  async executeSubmissionWorkflow(workflowId) {
    try {
      // Execute workflow logic
      return { data: { workflowId, status: 'executed' }, error: null };
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      return { data: null, error };
    }
  }

  // NEW: Legal Team Metrics
  async getLegalTeamMetrics(timeRange) {
    try {
      const { data, error } = await supabase
        ?.from('legal_team_metrics')
        ?.select('*')
        ?.eq('time_range', timeRange)
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Failed to get legal team metrics:', error);
      return { data: null, error };
    }
  }
}

export const complianceService = new ComplianceService();
export default complianceService;