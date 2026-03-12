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

export const executiveReportingService = {
  async getExecutiveReports(filters = {}) {
    try {
      let query = supabase
        ?.from('executive_reports')
        ?.select(`
          *,
          generator:generated_by(id, name, username, email)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.reportType && filters?.reportType !== 'all') {
        query = query?.eq('report_type', filters?.reportType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createExecutiveReport(reportData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('executive_reports')
        ?.insert({
          ...toSnakeCase(reportData),
          generated_by: user?.id
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateExecutiveReport(reportId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('executive_reports')
        ?.update(toSnakeCase(updates))
        ?.eq('id', reportId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async sendReportViaResend(reportId, stakeholderGroupId) {
    try {
      const { data: report } = await supabase
        ?.from('executive_reports')
        ?.select('*')
        ?.eq('id', reportId)
        ?.single();

      if (!report) throw new Error('Report not found');

      const { data: stakeholderGroup } = await supabase
        ?.from('stakeholder_groups')
        ?.select('*')
        ?.eq('id', stakeholderGroupId)
        ?.single();

      if (!stakeholderGroup) throw new Error('Stakeholder group not found');

      const response = await supabase?.functions?.invoke('send-executive-report', {
        body: {
          reportId: report?.id,
          reportType: report?.report_type,
          title: report?.title,
          reportData: report?.report_data,
          recipients: stakeholderGroup?.recipients,
          stakeholderGroupId: stakeholderGroup?.id
        }
      });

      if (response?.error) throw response?.error;

      await supabase
        ?.from('executive_reports')
        ?.update({ status: 'sent', sent_at: new Date()?.toISOString() })
        ?.eq('id', reportId);

      return { data: response?.data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

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
        ?.update(toSnakeCase(updates))
        ?.eq('id', groupId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getReportDeliveryLogs(reportId) {
    try {
      const { data, error } = await supabase
        ?.from('report_delivery_logs')
        ?.select('*')
        ?.eq('report_id', reportId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getDeliveryStatistics(timeRange = '30d') {
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
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const { data, error } = await supabase
        ?.from('report_delivery_logs')
        ?.select('*')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const stats = {
        totalDeliveries: data?.length || 0,
        successfulDeliveries: data?.filter(d => d?.delivery_status === 'delivered')?.length || 0,
        failedDeliveries: data?.filter(d => d?.delivery_status === 'failed')?.length || 0,
        pendingDeliveries: data?.filter(d => d?.delivery_status === 'pending')?.length || 0,
        deliveryRate: 0
      };

      stats.deliveryRate = stats?.totalDeliveries > 0
        ? ((stats?.successfulDeliveries / stats?.totalDeliveries) * 100)?.toFixed(2)
        : 0;

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};