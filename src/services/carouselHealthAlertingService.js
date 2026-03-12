import { supabase } from '../lib/supabase';
import { smsAlertService } from './smsAlertService';

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

export const carouselHealthAlertingService = {
  // Incident Management
  async createIncident(incidentData) {
    try {
      const dbData = toSnakeCase(incidentData);
      const { data, error } = await supabase
        ?.from('carousel_incidents')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;

      // Trigger alerts based on severity
      if (data?.severity === 'critical' || data?.severity === 'high') {
        await this.triggerAlerts(data);
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating incident:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getActiveIncidents(carouselType = null) {
    try {
      let query = supabase
        ?.from('carousel_incidents')
        ?.select('*')
        ?.eq('status', 'active')
        ?.order('detected_at', { ascending: false });

      if (carouselType) {
        query = query?.eq('carousel_type', carouselType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching active incidents:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async resolveIncident(incidentId, resolutionNotes) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_incidents')
        ?.update({
          status: 'resolved',
          resolved_at: new Date()?.toISOString(),
          description: resolutionNotes
        })
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error resolving incident:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Alert Rules Management
  async getAlertRules(carouselType = null) {
    try {
      let query = supabase
        ?.from('carousel_alert_rules')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('created_at', { ascending: false });

      if (carouselType) {
        query = query?.or(`carousel_type.eq.${carouselType},carousel_type.eq.all`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching alert rules:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async createAlertRule(ruleData) {
    try {
      const dbData = toSnakeCase(ruleData);
      const { data, error } = await supabase
        ?.from('carousel_alert_rules')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating alert rule:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateAlertRule(ruleId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('carousel_alert_rules')
        ?.update(dbData)
        ?.eq('id', ruleId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating alert rule:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async deleteAlertRule(ruleId) {
    try {
      const { error } = await supabase
        ?.from('carousel_alert_rules')
        ?.delete()
        ?.eq('id', ruleId);

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting alert rule:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // On-Call Routing
  async getOnCallContacts() {
    try {
      const { data, error } = await supabase
        ?.from('carousel_on_call_routing')
        ?.select('*')
        ?.eq('is_active', true)
        ?.order('priority', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching on-call contacts:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async addOnCallContact(contactData) {
    try {
      const dbData = toSnakeCase(contactData);
      const { data, error } = await supabase
        ?.from('carousel_on_call_routing')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error adding on-call contact:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateOnCallContact(contactId, updates) {
    try {
      const dbData = toSnakeCase(updates);
      const { data, error } = await supabase
        ?.from('carousel_on_call_routing')
        ?.update(dbData)
        ?.eq('id', contactId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating on-call contact:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Alert Triggering
  async triggerAlerts(incident) {
    try {
      const { data: contacts } = await this.getOnCallContacts();
      if (!contacts || contacts?.length === 0) {
        console.warn('No on-call contacts configured');
        return { data: { sent: 0 }, error: null };
      }

      const message = `🚨 CAROUSEL ALERT\n\nType: ${incident?.carousel_type?.toUpperCase()}\nIncident: ${incident?.title}\nSeverity: ${incident?.severity?.toUpperCase()}\n\n${incident?.description}\n\nDetected: ${new Date(incident?.detected_at)?.toLocaleString()}`;

      let sentCount = 0;
      for (const contact of contacts) {
        const result = await smsAlertService?.sendSMSAlert({
          to: contact?.phoneNumber,
          message,
          alertId: incident?.id,
          severity: incident?.severity
        });

        if (result?.data) sentCount++;
      }

      return { data: { sent: sentCount }, error: null };
    } catch (error) {
      console.error('Error triggering alerts:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Monitoring & Detection
  async checkPerformanceDegradation(carouselType, currentMetrics) {
    try {
      const { data: rules } = await this.getAlertRules(carouselType);
      if (!rules) return { data: null, error: null };

      const performanceRules = rules?.filter(r => r?.ruleType === 'performance_degradation');
      
      for (const rule of performanceRules) {
        const metricValue = currentMetrics?.[rule?.ruleName] || 0;
        const threshold = rule?.thresholdValue;
        const operator = rule?.thresholdOperator;

        let triggered = false;
        switch (operator) {
          case '>':
            triggered = metricValue > threshold;
            break;
          case '<':
            triggered = metricValue < threshold;
            break;
          case '>=':
            triggered = metricValue >= threshold;
            break;
          case '<=':
            triggered = metricValue <= threshold;
            break;
          case '=':
            triggered = metricValue === threshold;
            break;
        }

        if (triggered) {
          await this.createIncident({
            carouselType,
            incidentType: 'performance_degradation',
            severity: rule?.severity,
            title: `Performance Degradation: ${rule?.ruleName}`,
            description: `${rule?.ruleName} ${operator} ${threshold} (current: ${metricValue})`,
            metrics: currentMetrics
          });
        }
      }

      return { data: { checked: true }, error: null };
    } catch (error) {
      console.error('Error checking performance degradation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async detectAnomalies(carouselType, metrics) {
    try {
      // Simple anomaly detection: check for sudden spikes or drops
      const anomalies = [];

      if (metrics?.errorRate > 5) {
        anomalies?.push({
          type: 'high_error_rate',
          severity: 'high',
          message: `Error rate at ${metrics?.errorRate}% (threshold: 5%)`
        });
      }

      if (metrics?.responseTime > 1000) {
        anomalies?.push({
          type: 'high_latency',
          severity: 'medium',
          message: `Response time at ${metrics?.responseTime}ms (threshold: 1000ms)`
        });
      }

      if (metrics?.throughput < 10) {
        anomalies?.push({
          type: 'low_throughput',
          severity: 'medium',
          message: `Throughput at ${metrics?.throughput} req/s (threshold: 10 req/s)`
        });
      }

      for (const anomaly of anomalies) {
        await this.createIncident({
          carouselType,
          incidentType: 'anomaly_detected',
          severity: anomaly?.severity,
          title: `Anomaly Detected: ${anomaly?.type}`,
          description: anomaly?.message,
          metrics
        });
      }

      return { data: { anomalies: anomalies?.length }, error: null };
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Escalation Workflows
  async escalateIncident(incidentId) {
    try {
      const { data: incident } = await supabase
        ?.from('carousel_incidents')
        ?.select('*')
        ?.eq('id', incidentId)
        ?.single();

      if (!incident) throw new Error('Incident not found');

      // Escalate severity
      const severityLevels = ['low', 'medium', 'high', 'critical'];
      const currentIndex = severityLevels?.indexOf(incident?.severity);
      const newSeverity = currentIndex < severityLevels?.length - 1 
        ? severityLevels?.[currentIndex + 1] 
        : 'critical';

      const { data, error } = await supabase
        ?.from('carousel_incidents')
        ?.update({ severity: newSeverity })
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;

      // Trigger alerts for escalated incident
      await this.triggerAlerts(data);

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error escalating incident:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};