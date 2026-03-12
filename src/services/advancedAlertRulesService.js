import { supabase } from '../lib/supabase';
import { alertRulesEngineService } from './alertRulesEngineService';
import { orchestrationService } from './orchestrationService';

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

export const advancedAlertRulesService = {
  async createCrossSystemRule(ruleConfig) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('alert_rules')
        ?.insert({
          rule_name: ruleConfig?.ruleName,
          description: ruleConfig?.description,
          category: 'cross_system',
          severity: ruleConfig?.severity,
          threshold_config: ruleConfig?.thresholdConfig,
          condition_logic: ruleConfig?.conditionLogic,
          cross_system_triggers: ruleConfig?.crossSystemTriggers,
          is_enabled: ruleConfig?.isEnabled ?? true,
          auto_response_enabled: ruleConfig?.autoResponseEnabled ?? true,
          auto_response_actions: ruleConfig?.autoResponseActions || [],
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

  async evaluateCrossSystemTriggers(contextData) {
    try {
      const { data: rules, error: rulesError } = await supabase
        ?.from('alert_rules')
        ?.select('*')
        ?.eq('category', 'cross_system')
        ?.eq('is_enabled', true);

      if (rulesError) throw rulesError;

      const triggeredRules = [];

      for (const rule of rules) {
        const fraudData = await this.gatherFraudData(contextData);
        const financialData = await this.gatherFinancialData(contextData);
        const complianceData = await this.gatherComplianceData(contextData);

        const combinedContext = {
          ...contextData,
          fraud: fraudData,
          financial: financialData,
          compliance: complianceData
        };

        const evaluationResult = alertRulesEngineService?.evaluateBooleanLogic(
          rule?.condition_logic,
          combinedContext,
          rule?.threshold_config
        );

        if (evaluationResult?.triggered) {
          triggeredRules?.push({ rule, evaluationResult });
          await this.executeAutomatedResponse(rule, combinedContext, evaluationResult);
        }
      }

      return { data: { triggeredRules, totalEvaluated: rules?.length }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async gatherFraudData(contextData) {
    try {
      const { data: fraudAnalyses } = await supabase
        ?.from('gamified_fraud_analyses')
        ?.select('*')
        ?.eq('election_id', contextData?.electionId)
        ?.order('created_at', { ascending: false })
        ?.limit(1);

      const { data: incidents } = await supabase
        ?.from('incident_response_workflows')
        ?.select('*')
        ?.eq('incident_category', 'financial_fraud')
        ?.eq('status', 'active')
        ?.limit(10);

      return {
        latestFraudScore: fraudAnalyses?.[0]?.fraud_score || 0,
        riskLevel: fraudAnalyses?.[0]?.risk_level || 'low',
        activeIncidents: incidents?.length || 0,
        hasHighRiskPatterns: fraudAnalyses?.[0]?.fraud_score >= 70
      };
    } catch (error) {
      console.error('Error gathering fraud data:', error);
      return {};
    }
  },

  async gatherFinancialData(contextData) {
    try {
      const { data: financialTracking } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.eq('zone', contextData?.zone)
        ?.order('recorded_at', { ascending: false })
        ?.limit(10);

      const { data: zonePerformance } = await supabase
        ?.from('zone_performance_metrics')
        ?.select('*')
        ?.eq('zone', contextData?.zone)
        ?.order('created_at', { ascending: false })
        ?.limit(1);

      const totalRevenue = financialTracking?.reduce((sum, record) => sum + parseFloat(record?.amount || 0), 0);
      const avgROI = zonePerformance?.[0]?.average_roi || 0;

      return {
        totalRevenue,
        avgROI,
        revenueThresholdExceeded: totalRevenue > (contextData?.revenueThreshold || 100000),
        roiBelowTarget: avgROI < (contextData?.roiTarget || 2.0)
      };
    } catch (error) {
      console.error('Error gathering financial data:', error);
      return {};
    }
  },

  async gatherComplianceData(contextData) {
    try {
      const { data: violations } = await supabase
        ?.from('policy_violations')
        ?.select('*')
        ?.eq('status', 'active')
        ?.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)?.toISOString());

      const { data: filings } = await supabase
        ?.from('regulatory_filings')
        ?.select('*')
        ?.eq('status', 'pending')
        ?.lte('deadline', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)?.toISOString());

      return {
        activeViolations: violations?.length || 0,
        pendingFilings: filings?.length || 0,
        complianceDeadlineApproaching: filings?.length > 0,
        hasActiveViolations: violations?.length > 0
      };
    } catch (error) {
      console.error('Error gathering compliance data:', error);
      return {};
    }
  },

  async executeAutomatedResponse(rule, contextData, evaluationResult) {
    try {
      const actions = rule?.auto_response_actions || [];

      for (const action of actions) {
        switch (action?.type) {
          case 'create_compliance_submission':
            await this.createComplianceSubmission(action, contextData);
            break;
          case 'escalate_incident':
            await this.escalateIncident(action, contextData, evaluationResult);
            break;
          case 'notify_stakeholders':
            await this.notifyStakeholders(action, rule, contextData);
            break;
          case 'trigger_fraud_investigation':
            await this.triggerFraudInvestigation(action, contextData);
            break;
          case 'pause_election':
            await this.pauseElection(action, contextData);
            break;
          case 'execute_workflow':
            await orchestrationService?.executeWorkflow(action?.workflowId, {
              triggeredBy: 'cross_system_alert',
              ruleId: rule?.id,
              contextData,
              evaluationResult
            });
            break;
          default:
            console.warn(`Unknown action type: ${action?.type}`);
        }
      }

      await this.logAutomatedResponse(rule, contextData, actions);
      return { success: true };
    } catch (error) {
      console.error('Error executing automated response:', error);
      return { success: false, error: error?.message };
    }
  },

  async createComplianceSubmission(action, contextData) {
    try {
      const { error } = await supabase
        ?.from('regulatory_submissions')
        ?.insert({
          submission_type: action?.submissionType || 'incident_report',
          jurisdiction: action?.jurisdiction || 'US',
          status: 'pending',
          metadata: {
            triggeredBy: 'automated_alert',
            contextData,
            autoGenerated: true
          }
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error creating compliance submission:', error);
      return { success: false, error: error?.message };
    }
  },

  async escalateIncident(action, contextData, evaluationResult) {
    try {
      const { error } = await supabase
        ?.from('incident_response_workflows')
        ?.insert({
          incident_category: action?.incidentCategory || 'cross_system_alert',
          severity: action?.severity || 'high',
          status: 'active',
          description: `Automated escalation: ${evaluationResult?.reason}`,
          metadata: {
            triggeredBy: 'cross_system_alert',
            contextData,
            evaluationResult,
            autoEscalated: true
          }
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error escalating incident:', error);
      return { success: false, error: error?.message };
    }
  },

  async notifyStakeholders(action, rule, contextData) {
    try {
      const { error } = await supabase
        ?.from('stakeholder_communications')
        ?.insert({
          communication_type: action?.notificationType || 'alert',
          channel: action?.channel || 'email',
          subject: `Alert: ${rule?.rule_name}`,
          message: `Cross-system alert triggered: ${rule?.description}`,
          metadata: {
            ruleId: rule?.id,
            contextData,
            autoGenerated: true
          }
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error notifying stakeholders:', error);
      return { success: false, error: error?.message };
    }
  },

  async triggerFraudInvestigation(action, contextData) {
    try {
      const { error } = await supabase
        ?.from('incident_response_workflows')
        ?.insert({
          incident_category: 'fraud_investigation',
          severity: 'high',
          status: 'active',
          description: `Automated fraud investigation triggered`,
          metadata: {
            electionId: contextData?.electionId,
            zone: contextData?.zone,
            triggeredBy: 'cross_system_alert',
            autoGenerated: true
          }
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error triggering fraud investigation:', error);
      return { success: false, error: error?.message };
    }
  },

  async pauseElection(action, contextData) {
    try {
      const { error } = await supabase
        ?.from('elections')
        ?.update({ status: 'paused' })
        ?.eq('id', contextData?.electionId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error pausing election:', error);
      return { success: false, error: error?.message };
    }
  },

  async logAutomatedResponse(rule, contextData, actions) {
    try {
      const { error } = await supabase
        ?.from('system_alerts')
        ?.insert({
          alert_rule_id: rule?.id,
          category: 'cross_system',
          severity: rule?.severity,
          title: `Automated Response: ${rule?.rule_name}`,
          message: `Executed ${actions?.length} automated actions`,
          status: 'active',
          metadata: {
            contextData,
            actions,
            executedAt: new Date()?.toISOString()
          },
          detection_method: 'cross_system_alert_engine',
          confidence_score: 0.95
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error logging automated response:', error);
      return { success: false, error: error?.message };
    }
  },

  async getRulePerformanceMetrics(ruleId = null) {
    try {
      let query = supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.eq('detection_method', 'cross_system_alert_engine')
        ?.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString());

      if (ruleId) {
        query = query?.eq('alert_rule_id', ruleId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const metrics = {
        totalAlerts: data?.length || 0,
        avgResponseTime: this.calculateAvgResponseTime(data),
        successRate: this.calculateSuccessRate(data),
        falsePositiveRate: this.calculateFalsePositiveRate(data)
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  calculateAvgResponseTime(alerts) {
    if (!alerts || alerts?.length === 0) return 0;
    const responseTimes = alerts
      ?.filter(a => a?.metadata?.executedAt)
      ?.map(a => {
        const created = new Date(a?.created_at);
        const executed = new Date(a?.metadata?.executedAt);
        return (executed - created) / 1000;
      });
    return responseTimes?.length > 0
      ? responseTimes?.reduce((sum, time) => sum + time, 0) / responseTimes?.length
      : 0;
  },

  calculateSuccessRate(alerts) {
    if (!alerts || alerts?.length === 0) return 0;
    const successful = alerts?.filter(a => a?.status === 'resolved')?.length;
    return (successful / alerts?.length) * 100;
  },

  calculateFalsePositiveRate(alerts) {
    if (!alerts || alerts?.length === 0) return 0;
    const falsePositives = alerts?.filter(a => a?.metadata?.falsePositive === true)?.length;
    return (falsePositives / alerts?.length) * 100;
  },

  getRuleTemplates() {
    return [
      {
        id: 'fraud_financial_combo',
        name: 'Fraud + Financial Threshold Alert',
        description: 'Triggers when fraud score exceeds 70 AND revenue drops below threshold',
        category: 'cross_system',
        severity: 'critical',
        conditionLogic: {
          operator: 'AND',
          conditions: [
            { field: 'latestFraudScore', operator: 'greater_than', value: 70, dataSource: 'fraud' },
            { field: 'revenueThresholdExceeded', operator: 'equals', value: false, dataSource: 'financial' }
          ]
        },
        autoResponseActions: [
          { type: 'trigger_fraud_investigation', severity: 'critical' },
          { type: 'notify_stakeholders', channel: 'email', notificationType: 'alert' }
        ]
      },
      {
        id: 'compliance_deadline_violation',
        name: 'Compliance Deadline + Active Violations',
        description: 'Triggers when compliance deadline approaches AND active violations exist',
        category: 'cross_system',
        severity: 'high',
        conditionLogic: {
          operator: 'AND',
          conditions: [
            { field: 'complianceDeadlineApproaching', operator: 'equals', value: true, dataSource: 'compliance' },
            { field: 'hasActiveViolations', operator: 'equals', value: true, dataSource: 'compliance' }
          ]
        },
        autoResponseActions: [
          { type: 'create_compliance_submission', submissionType: 'incident_report', jurisdiction: 'US' },
          { type: 'escalate_incident', incidentCategory: 'compliance', severity: 'high' }
        ]
      },
      {
        id: 'fraud_roi_combo',
        name: 'High Fraud + Low ROI Alert',
        description: 'Triggers when fraud patterns detected AND ROI below target',
        category: 'cross_system',
        severity: 'high',
        conditionLogic: {
          operator: 'AND',
          conditions: [
            { field: 'hasHighRiskPatterns', operator: 'equals', value: true, dataSource: 'fraud' },
            { field: 'roiBelowTarget', operator: 'equals', value: true, dataSource: 'financial' }
          ]
        },
        autoResponseActions: [
          { type: 'pause_election' },
          { type: 'trigger_fraud_investigation', severity: 'high' },
          { type: 'notify_stakeholders', channel: 'email' }
        ]
      }
    ];
  }
};