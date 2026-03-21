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

export const scheduledReportsService = {
  // Report Schedules
  async getReportSchedules(filters = {}) {
    try {
      let query = supabase
        ?.from('report_schedules')
        ?.select(`
          *,
          creator:created_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.reportType && filters?.reportType !== 'all') {
        query = query?.eq('report_type', filters?.reportType);
      }

      if (filters?.frequency && filters?.frequency !== 'all') {
        query = query?.eq('frequency', filters?.frequency);
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

  async createReportSchedule(scheduleData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('report_schedules')
        ?.insert({
          ...toSnakeCase(scheduleData),
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

  async updateReportSchedule(scheduleId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('report_schedules')
        ?.update(toSnakeCase(updates))
        ?.eq('id', scheduleId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteReportSchedule(scheduleId) {
    try {
      const { error } = await supabase
        ?.from('report_schedules')
        ?.delete()
        ?.eq('id', scheduleId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  // Scheduled Reports (Execution History)
  async getScheduledReports(filters = {}) {
    try {
      let query = supabase
        ?.from('scheduled_reports')
        ?.select(`
          *,
          schedule:schedule_id(schedule_name, frequency, report_type)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.scheduleId) {
        query = query?.eq('schedule_id', filters?.scheduleId);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.reportType && filters?.reportType !== 'all') {
        query = query?.eq('report_type', filters?.reportType);
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

  // Email Templates
  async getEmailTemplates(reportType = null) {
    try {
      let query = supabase
        ?.from('email_templates')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('template_name');

      if (reportType) {
        query = query?.eq('report_type', reportType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Send Report via Email
  async sendReportEmail(reportId, reportType, recipients, data, customSubject = null, customHtml = null) {
    try {
      // Call Supabase Edge Function
      const { data: result, error } = await supabase?.functions?.invoke('send-scheduled-report', {
        body: {
          reportId,
          reportType,
          recipients,
          data,
          subject: customSubject,
          htmlContent: customHtml
        }
      });

      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Generate and Send Report On-Demand
  async generateAndSendReport(scheduleId) {
    let reportId = null;
    try {
      // Get schedule details
      const { data: schedule, error: scheduleError } = await supabase
        ?.from('report_schedules')
        ?.select('*')
        ?.eq('id', scheduleId)
        ?.single();

      if (scheduleError) throw scheduleError;
      if (!Array.isArray(schedule?.recipients) || schedule?.recipients?.length === 0) {
        throw new Error('Report schedule has no recipients configured.');
      }

      // Create report record
      const { data: report, error: reportError } = await supabase
        ?.from('scheduled_reports')
        ?.insert({
          schedule_id: scheduleId,
          report_type: schedule?.report_type,
          status: 'generating',
          recipients: schedule?.recipients
        })
        ?.select()
        ?.single();

      if (reportError) throw reportError;
      reportId = report?.id;

      // Generate report data based on type
      const reportPayload = await this.generateReportPayload(
        schedule?.report_type,
        schedule?.filters || {}
      );

      const reportData = {
        generatedAt: new Date()?.toISOString(),
        reportType: schedule?.report_type,
        filters: schedule?.filters,
        summary: reportPayload?.summary || 'Report generated successfully',
        metrics: reportPayload?.metrics || {},
        sections: reportPayload?.sections || {}
      };

      // Update report with data
      await supabase
        ?.from('scheduled_reports')
        ?.update({
          status: 'completed',
          data: reportData,
          generated_at: new Date()?.toISOString()
        })
        ?.eq('id', report?.id);

      // Send email
      const emailResult = await this.sendReportEmail(
        report?.id,
        schedule?.report_type,
        schedule?.recipients,
        reportData
      );

      // Update email delivery status
      await supabase
        ?.from('scheduled_reports')
        ?.update({
          email_delivery_status: emailResult?.error ? 'failed' : 'sent',
          email_sent_at: new Date()?.toISOString(),
          email_error: emailResult?.error?.message || null
        })
        ?.eq('id', report?.id);

      return { data: { report: toCamelCase(report), emailResult }, error: null };
    } catch (error) {
      if (reportId) {
        await supabase
          ?.from('scheduled_reports')
          ?.update({
            status: 'failed',
            error_message: error?.message || 'Unknown report generation failure',
            failed_at: new Date()?.toISOString()
          })
          ?.eq('id', reportId);
      }
      return { data: null, error: { message: error?.message } };
    }
  },

  async generateReportPayload(reportType, filters = {}) {
    switch ((reportType || '').toLowerCase()) {
      case 'executive_summary':
      case 'executive':
        return this._buildExecutivePayload(filters);
      case 'compliance_documentation':
      case 'compliance':
        return this._buildCompliancePayload(filters);
      case 'revenue':
      case 'financial':
        return this._buildRevenuePayload(filters);
      case 'fraud':
      case 'risk':
        return this._buildFraudPayload(filters);
      default:
        return this._buildGenericPayload(filters);
    }
  },

  async _buildExecutivePayload(filters) {
    const [usersRes, incidentsRes, financialRes] = await Promise.all([
      supabase?.from('user_profiles')?.select('id, created_at'),
      supabase?.from('security_incidents')?.select('id, status, created_at'),
      supabase?.from('financial_tracking')?.select('metric_type, amount, recorded_at')?.limit(200)
    ]);
    const users = usersRes?.data || [];
    const incidents = incidentsRes?.data || [];
    const financial = financialRes?.data || [];
    const revenue = financial
      ?.filter((r) => r?.metric_type === 'revenue')
      ?.reduce((sum, r) => sum + parseFloat(r?.amount || 0), 0);
    return {
      summary: `Executive snapshot generated for ${users.length} users, ${incidents.length} incidents, and ${financial.length} financial records.`,
      metrics: {
        totalUsers: users.length,
        openIncidents: incidents?.filter((i) => i?.status !== 'resolved')?.length || 0,
        totalRevenue: revenue
      },
      sections: {
        users: users.slice(0, 20),
        incidents: incidents.slice(0, 20)
      }
    };
  },

  async _buildCompliancePayload(filters) {
    const [reportsRes, incidentsRes] = await Promise.all([
      supabase?.from('executive_reports')?.select('id, report_type, created_at')?.eq('report_type', 'compliance_documentation')?.limit(50),
      supabase?.from('security_incidents')?.select('id, status')?.limit(200)
    ]);
    const reports = reportsRes?.data || [];
    const incidents = incidentsRes?.data || [];
    const pendingActions = incidents?.filter((i) => i?.status !== 'resolved')?.length || 0;
    const completedActions = incidents?.filter((i) => i?.status === 'resolved')?.length || 0;
    const complianceScore = (pendingActions + completedActions) > 0
      ? Math.round((completedActions / (pendingActions + completedActions)) * 100)
      : 100;
    return {
      summary: `Compliance report built with ${reports.length} compliance documents and score ${complianceScore}.`,
      metrics: { pendingActions, completedActions, complianceScore },
      sections: { recentReports: reports.slice(0, 20) }
    };
  },

  async _buildRevenuePayload(filters) {
    const { data } = await supabase
      ?.from('financial_tracking')
      ?.select('metric_type, amount, zone, recorded_at')
      ?.limit(500);
    const rows = data || [];
    const revenueRows = rows?.filter((r) => r?.metric_type === 'revenue');
    const totalRevenue = revenueRows?.reduce((sum, r) => sum + parseFloat(r?.amount || 0), 0);
    const byZone = revenueRows?.reduce((acc, r) => {
      const zone = r?.zone || 'unknown';
      acc[zone] = (acc[zone] || 0) + parseFloat(r?.amount || 0);
      return acc;
    }, {});
    return {
      summary: `Revenue report generated from ${revenueRows.length} revenue records.`,
      metrics: { totalRevenue, zones: Object.keys(byZone || {}).length },
      sections: { revenueByZone: byZone }
    };
  },

  async _buildFraudPayload(filters) {
    const { data } = await supabase
      ?.from('fraud_detection_alerts')
      ?.select('id, status, severity, fraud_indicators, created_at')
      ?.limit(300);
    const rows = data || [];
    const open = rows?.filter((r) => r?.status !== 'resolved')?.length || 0;
    const highSeverity = rows?.filter((r) => String(r?.severity || '').toLowerCase() === 'high')?.length || 0;
    return {
      summary: `Fraud report generated with ${rows.length} alerts (${open} open).`,
      metrics: { totalAlerts: rows.length, openAlerts: open, highSeverityAlerts: highSeverity },
      sections: { recentAlerts: rows.slice(0, 25) }
    };
  },

  async _buildGenericPayload(filters) {
    return {
      summary: 'Generic scheduled report generated.',
      metrics: {},
      sections: { filters }
    };
  }
};