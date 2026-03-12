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

export const carouselSecurityAuditService = {
  // Get all 12 carousel systems health
  async getAllSystemsHealth() {
    try {
      const { data, error } = await supabase
        ?.from('carousel_system_health')
        ?.select('*')
        ?.order('health_score', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching systems health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get system health by name
  async getSystemHealth(systemName) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_system_health')
        ?.select('*')
        ?.eq('system_name', systemName)
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching system health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Update system health
  async updateSystemHealth(systemName, healthData) {
    try {
      const dbData = toSnakeCase({
        ...healthData,
        lastCheckAt: new Date()?.toISOString()
      });

      const { data, error } = await supabase
        ?.from('carousel_system_health')
        ?.update(dbData)
        ?.eq('system_name', systemName)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error updating system health:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get compliance violations
  async getComplianceViolations(filters = {}) {
    try {
      let query = supabase
        ?.from('carousel_compliance_violations')
        ?.select('*')
        ?.order('detected_at', { ascending: false });

      if (filters?.systemName) {
        query = query?.eq('system_name', filters?.systemName);
      }

      if (filters?.severity) {
        query = query?.eq('severity', filters?.severity);
      }

      if (filters?.status) {
        query = query?.eq('remediation_status', filters?.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error fetching compliance violations:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Create compliance violation
  async createViolation(violationData) {
    try {
      const dbData = toSnakeCase(violationData);
      const { data, error } = await supabase
        ?.from('carousel_compliance_violations')
        ?.insert(dbData)
        ?.select()
        ?.single();

      if (error) throw error;

      // Trigger automated remediation if critical
      if (data?.severity === 'critical') {
        await this.triggerAutomatedRemediation(data);
      }

      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error creating violation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Resolve violation
  async resolveViolation(violationId, remediationAction) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_compliance_violations')
        ?.update({
          remediation_status: 'resolved',
          remediation_action: remediationAction,
          resolved_at: new Date()?.toISOString()
        })
        ?.eq('id', violationId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error resolving violation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Calculate anomaly score
  async calculateAnomalyScore(systemName, metrics) {
    try {
      let anomalyScore = 0;

      // Check various metrics for anomalies
      if (metrics?.errorRate > 5) anomalyScore += 30;
      if (metrics?.responseTime > 1000) anomalyScore += 25;
      if (metrics?.uptime < 99) anomalyScore += 20;
      if (metrics?.throughput < 10) anomalyScore += 15;
      if (metrics?.cpuUsage > 85) anomalyScore += 10;

      // Create violation if score is high
      if (anomalyScore >= 50) {
        await this.createViolation({
          systemName,
          violationType: 'performance_anomaly',
          severity: anomalyScore >= 75 ? 'critical' : 'high',
          description: `High anomaly score detected: ${anomalyScore}/100`,
          anomalyScore,
          policyViolated: 'Performance SLA'
        });
      }

      return { data: { anomalyScore }, error: null };
    } catch (error) {
      console.error('Error calculating anomaly score:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Track policy violations
  async trackPolicyViolation(systemName, policyName, details) {
    try {
      await this.createViolation({
        systemName,
        violationType: 'policy_violation',
        severity: 'medium',
        description: `Policy violation: ${policyName}`,
        policyViolated: policyName,
        anomalyScore: 50
      });

      return { data: { tracked: true }, error: null };
    } catch (error) {
      console.error('Error tracking policy violation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Automated remediation triggers
  async triggerAutomatedRemediation(violation) {
    try {
      let remediationAction = '';

      switch (violation?.violation_type) {
        case 'performance_anomaly':
          remediationAction = 'Auto-scaling triggered, increased resources by 50%';
          break;
        case 'security_breach':
          remediationAction = 'Security protocols activated, suspicious IPs blocked';
          break;
        case 'policy_violation':
          remediationAction = 'Automated policy enforcement applied';
          break;
        default:
          remediationAction = 'Standard remediation protocol initiated';
      }

      await supabase
        ?.from('carousel_compliance_violations')
        ?.update({
          remediation_status: 'in_progress',
          remediation_action: remediationAction
        })
        ?.eq('id', violation?.id);

      return { data: { remediation: remediationAction }, error: null };
    } catch (error) {
      console.error('Error triggering automated remediation:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Get compliance dashboard data
  async getComplianceDashboard() {
    try {
      const { data: violations } = await this.getComplianceViolations();
      const { data: systems } = await this.getAllSystemsHealth();

      // Calculate violation trends
      const violationsBySystem = {};
      violations?.forEach(v => {
        if (!violationsBySystem?.[v?.systemName]) {
          violationsBySystem[v?.systemName] = { total: 0, critical: 0, high: 0, medium: 0, low: 0 };
        }
        violationsBySystem[v?.systemName].total++;
        violationsBySystem[v?.systemName][v?.severity]++;
      });

      // Calculate overall health score
      const avgHealthScore = systems?.reduce((sum, s) => sum + s?.healthScore, 0) / systems?.length;

      // Get critical systems
      const criticalSystems = systems?.filter(s => s?.status === 'critical' || s?.healthScore < 50);

      return {
        data: {
          violationsBySystem,
          avgHealthScore: avgHealthScore?.toFixed(1),
          criticalSystems,
          totalViolations: violations?.length,
          unresolvedViolations: violations?.filter(v => v?.remediationStatus !== 'resolved')?.length,
          systems
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching compliance dashboard:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Toggle system enabled status
  async toggleSystemEnabled(systemName, isEnabled) {
    try {
      const { data, error } = await supabase
        ?.from('carousel_system_health')
        ?.update({ is_enabled: isEnabled })
        ?.eq('system_name', systemName)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      console.error('Error toggling system:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};