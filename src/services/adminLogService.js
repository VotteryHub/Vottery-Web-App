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

export const adminLogService = {
  async getActivityLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('admin_activity_logs')
        ?.select(`
          *,
          admin:admin_id(id, name, username, email, avatar, role)
        `)
        ?.order('created_at', { ascending: false });

      // Action type filter
      if (filters?.actionType && filters?.actionType !== 'all') {
        query = query?.eq('action_type', filters?.actionType);
      }

      // Severity filter
      if (filters?.severity && filters?.severity !== 'all') {
        query = query?.eq('severity', filters?.severity);
      }

      // Compliance filter
      if (filters?.complianceRelevant !== undefined) {
        query = query?.eq('compliance_relevant', filters?.complianceRelevant);
      }

      // Admin filter
      if (filters?.adminId) {
        query = query?.eq('admin_id', filters?.adminId);
      }

      // Entity type filter
      if (filters?.entityType && filters?.entityType !== 'all') {
        query = query?.eq('affected_entity_type', filters?.entityType);
      }

      // Date range filter
      if (filters?.startDate) {
        query = query?.gte('created_at', filters?.startDate);
      }

      if (filters?.endDate) {
        query = query?.lte('created_at', filters?.endDate);
      }

      // Time range filter
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
          case '3months':
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

      // Search filter
      if (filters?.search) {
        query = query?.or(`action_description.ilike.%${filters?.search}%,metadata->>affected_user.ilike.%${filters?.search}%`);
      }

      // Limit
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

  async getActivityLogById(logId) {
    try {
      const { data, error } = await supabase
        ?.from('admin_activity_logs')
        ?.select(`
          *,
          admin:admin_id(id, name, username, email, avatar, role)
        `)
        ?.eq('id', logId)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createActivityLog(logData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('admin_activity_logs')
        ?.insert({
          ...toSnakeCase(logData),
          admin_id: user?.id
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getActivityStatistics() {
    try {
      const { data, error } = await supabase
        ?.from('admin_activity_logs')
        ?.select('action_type, severity, compliance_relevant, created_at');

      if (error) throw error;

      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekAgo = new Date(now.setDate(now.getDate() - 7));

      const stats = {
        total: data?.length || 0,
        today: data?.filter(log => new Date(log?.created_at) >= today)?.length || 0,
        thisWeek: data?.filter(log => new Date(log?.created_at) >= weekAgo)?.length || 0,
        complianceRelevant: data?.filter(log => log?.compliance_relevant)?.length || 0,
        byActionType: {
          user_management: data?.filter(log => log?.action_type === 'user_management')?.length || 0,
          election_approval: data?.filter(log => log?.action_type === 'election_approval')?.length || 0,
          election_rejection: data?.filter(log => log?.action_type === 'election_rejection')?.length || 0,
          content_moderation: data?.filter(log => log?.action_type === 'content_moderation')?.length || 0,
          system_configuration: data?.filter(log => log?.action_type === 'system_configuration')?.length || 0,
          security_event: data?.filter(log => log?.action_type === 'security_event')?.length || 0,
          data_export: data?.filter(log => log?.action_type === 'data_export')?.length || 0,
          policy_update: data?.filter(log => log?.action_type === 'policy_update')?.length || 0
        },
        bySeverity: {
          critical: data?.filter(log => log?.severity === 'critical')?.length || 0,
          high: data?.filter(log => log?.severity === 'high')?.length || 0,
          medium: data?.filter(log => log?.severity === 'medium')?.length || 0,
          low: data?.filter(log => log?.severity === 'low')?.length || 0,
          info: data?.filter(log => log?.severity === 'info')?.length || 0
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async exportActivityLogs(filters = {}, format = 'json') {
    try {
      const { data, error } = await this.getActivityLogs({ ...filters, limit: null });
      if (error) throw error;

      const exportData = data?.map(log => ({
        timestamp: log?.createdAt,
        admin: log?.admin?.name || log?.admin?.email || 'Unknown',
        actionType: log?.actionType,
        description: log?.actionDescription,
        entityType: log?.affectedEntityType,
        entityId: log?.affectedEntityId,
        severity: log?.severity,
        complianceRelevant: log?.complianceRelevant,
        ipAddress: log?.ipAddress,
        beforeState: log?.beforeState,
        afterState: log?.afterState,
        metadata: log?.metadata
      }));

      if (format === 'csv') {
        const headers = ['Timestamp', 'Admin', 'Action Type', 'Description', 'Entity Type', 'Entity ID', 'Severity', 'Compliance Relevant', 'IP Address'];
        const csvRows = [
          headers?.join(','),
          ...exportData?.map(row => [
            row?.timestamp,
            row?.admin,
            row?.actionType,
            `"${row?.description?.replace(/"/g, '""')}"`,
            row?.entityType || '',
            row?.entityId || '',
            row?.severity,
            row?.complianceRelevant,
            row?.ipAddress || ''
          ]?.join(','))
        ];
        return { data: csvRows?.join('\n'), error: null, format: 'csv' };
      }

      return { data: exportData, error: null, format: 'json' };
    } catch (error) {
      return { data: null, error: { message: error?.message }, format };
    }
  },

  async getAdminList() {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('id, name, username, email, role')
        ?.in('role', ['admin', 'moderator'])
        ?.order('name');

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRelatedActivities(entityType, entityId) {
    try {
      const { data, error } = await supabase
        ?.from('admin_activity_logs')
        ?.select(`
          *,
          admin:admin_id(id, name, username, email)
        `)
        ?.eq('affected_entity_type', entityType)
        ?.eq('affected_entity_id', entityId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  // Real-time Subscriptions
  subscribeToActivityLogs(callback) {
    const channel = supabase
      ?.channel('admin_activity_logs_changes')
      ?.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_activity_logs' },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            data: toCamelCase(payload?.new)
          });
        }
      )
      ?.subscribe();

    return channel;
  },

  unsubscribeFromActivityLogs(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};