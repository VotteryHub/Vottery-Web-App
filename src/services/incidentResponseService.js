import { supabase } from '../lib/supabase';
import { perplexityThreatService } from './perplexityThreatService';
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

export const incidentResponseService = {
  async createIncident(incidentData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      let threatIntelligence = null;
      if (incidentData?.enableThreatAnalysis) {
        const threatResult = await perplexityThreatService?.analyzeThreatIntelligence(incidentData);
        if (threatResult?.data) {
          threatIntelligence = threatResult?.data;
        }
      }

      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.insert({
          ...toSnakeCase(incidentData),
          threat_intelligence: threatIntelligence,
          status: 'detected',
          detected_at: new Date()?.toISOString(),
          timeline_events: [{
            timestamp: new Date()?.toISOString(),
            event: 'Incident detected',
            details: incidentData?.description
          }]
        })
        ?.select()
        ?.single();

      if (error) throw error;

      if (incidentData?.threatLevel === 'critical' || incidentData?.threatLevel === 'high') {
        await this.triggerAutomatedResponse(data?.id, incidentData);
      }

      analytics?.trackEvent('incident_created', {
        incident_type: incidentData?.incidentType,
        threat_level: incidentData?.threatLevel
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async triggerAutomatedResponse(incidentId, incidentData) {
    try {
      const automatedActions = [];

      if (incidentData?.incidentType === 'fraud_detection') {
        automatedActions?.push({
          action: 'freeze_account',
          timestamp: new Date()?.toISOString(),
          status: 'executed'
        });
        automatedActions?.push({
          action: 'block_transactions',
          timestamp: new Date()?.toISOString(),
          status: 'executed'
        });
      }

      if (incidentData?.incidentType === 'coordinated_attack') {
        automatedActions?.push({
          action: 'rate_limit_enforcement',
          timestamp: new Date()?.toISOString(),
          status: 'executed'
        });
        automatedActions?.push({
          action: 'ip_blocking',
          timestamp: new Date()?.toISOString(),
          status: 'executed'
        });
      }

      const stakeholders = [
        { role: 'security_team', notified: true, timestamp: new Date()?.toISOString() },
        { role: 'compliance_officer', notified: true, timestamp: new Date()?.toISOString() }
      ];

      if (incidentData?.threatLevel === 'critical') {
        stakeholders?.push({ role: 'executive_team', notified: true, timestamp: new Date()?.toISOString() });
      }

      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.update({
          automated_actions_taken: automatedActions,
          stakeholders_notified: stakeholders,
          status: 'escalated',
          escalated_at: new Date()?.toISOString()
        })
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getIncidents(filters = {}) {
    try {
      let query = supabase
        ?.from('incident_response_workflows')
        ?.select(`
          *,
          assigned_user:assigned_to(id, name, username, email)
        `)
        ?.order('detected_at', { ascending: false });

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.threatLevel && filters?.threatLevel !== 'all') {
        query = query?.eq('threat_level', filters?.threatLevel);
      }

      if (filters?.incidentType && filters?.incidentType !== 'all') {
        query = query?.eq('incident_type', filters?.incidentType);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateIncidentStatus(incidentId, statusUpdate) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData = {
        status: statusUpdate?.status,
        updated_at: new Date()?.toISOString()
      };

      if (statusUpdate?.status === 'resolved') {
        updateData.resolved_at = new Date()?.toISOString();
        updateData.resolution_notes = statusUpdate?.notes;
      }

      if (statusUpdate?.assignedTo) {
        updateData.assigned_to = statusUpdate?.assignedTo;
      }

      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.update(updateData)
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;

      analytics?.trackEvent('incident_updated', {
        incident_id: incidentId,
        new_status: statusUpdate?.status
      });

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async addRemediationStep(incidentId, remediationStep) {
    try {
      const { data: incident } = await supabase
        ?.from('incident_response_workflows')
        ?.select('remediation_steps')
        ?.eq('id', incidentId)
        ?.single();

      const steps = incident?.remediation_steps || [];
      steps?.push({
        ...remediationStep,
        timestamp: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.update({ remediation_steps: steps })
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getIncidentStatistics(timeRange = '30d') {
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
        ?.from('incident_response_workflows')
        ?.select('*')
        ?.gte('detected_at', startDate?.toISOString());

      if (error) throw error;

      const statistics = {
        totalIncidents: data?.length || 0,
        activeIncidents: data?.filter(i => i?.status === 'detected' || i?.status === 'escalated' || i?.status === 'in_progress')?.length || 0,
        resolvedIncidents: data?.filter(i => i?.status === 'resolved')?.length || 0,
        criticalIncidents: data?.filter(i => i?.threat_level === 'critical')?.length || 0,
        averageResponseTime: this.calculateAverageResponseTime(data),
        incidentsByType: this.groupByType(data),
        resolutionRate: ((data?.filter(i => i?.status === 'resolved')?.length || 0) / (data?.length || 1) * 100)?.toFixed(2)
      };

      return { data: statistics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateAverageResponseTime(incidents) {
    const resolvedIncidents = incidents?.filter(i => i?.resolved_at && i?.detected_at);
    if (resolvedIncidents?.length === 0) return 0;

    const totalTime = resolvedIncidents?.reduce((sum, incident) => {
      const detected = new Date(incident?.detected_at);
      const resolved = new Date(incident?.resolved_at);
      return sum + (resolved - detected);
    }, 0);

    return Math.round(totalTime / resolvedIncidents?.length / (1000 * 60));
  },

  groupByType(incidents) {
    const grouped = {};
    incidents?.forEach(incident => {
      const type = incident?.incident_type;
      grouped[type] = (grouped?.[type] || 0) + 1;
    });
    return grouped;
  },

  subscribeToIncidents(callback) {
    const channel = supabase
      ?.channel('incident_changes')
      ?.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'incident_response_workflows'
      }, (payload) => {
        callback({ eventType: payload?.eventType, data: toCamelCase(payload?.new) });
      })
      ?.subscribe();

    return channel;
  },

  unsubscribeFromIncidents(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};