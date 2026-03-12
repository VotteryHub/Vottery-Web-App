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
    try {
      // Get schedule details
      const { data: schedule, error: scheduleError } = await supabase
        ?.from('report_schedules')
        ?.select('*')
        ?.eq('id', scheduleId)
        ?.single();

      if (scheduleError) throw scheduleError;

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

      // Generate report data based on type
      let reportData = {};
      
      // This would call appropriate service methods based on report_type
      // For now, using placeholder data
      reportData = {
        generatedAt: new Date()?.toISOString(),
        reportType: schedule?.report_type,
        filters: schedule?.filters,
        summary: 'Report generated successfully'
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
      return { data: null, error: { message: error?.message } };
    }
  }
};