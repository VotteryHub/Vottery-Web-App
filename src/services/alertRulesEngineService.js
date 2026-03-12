import { supabase } from '../lib/supabase';
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

export const alertRulesEngineService = {
  async createCustomRule(ruleConfig) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('alert_rules')
        ?.insert({
          rule_name: ruleConfig?.ruleName,
          description: ruleConfig?.description,
          category: ruleConfig?.category,
          severity: ruleConfig?.severity,
          threshold_config: ruleConfig?.thresholdConfig,
          condition_logic: ruleConfig?.conditionLogic,
          is_enabled: ruleConfig?.isEnabled ?? true,
          auto_response_enabled: ruleConfig?.autoResponseEnabled ?? false,
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

  async evaluateRuleConditions(ruleId, contextData) {
    try {
      const { data: rule, error: ruleError } = await supabase
        ?.from('alert_rules')
        ?.select('*')
        ?.eq('id', ruleId)
        ?.single();

      if (ruleError) throw ruleError;
      if (!rule?.is_enabled) return { data: { triggered: false, reason: 'Rule disabled' }, error: null };

      const conditionLogic = rule?.condition_logic;
      const thresholdConfig = rule?.threshold_config;

      const evaluationResult = this.evaluateBooleanLogic(conditionLogic, contextData, thresholdConfig);

      if (evaluationResult?.triggered) {
        await this.createAlert(rule, contextData, evaluationResult);

        if (rule?.auto_response_enabled && rule?.auto_response_actions?.length > 0) {
          await this.executeAutoResponse(rule, contextData);
        }
      }

      return { data: evaluationResult, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  evaluateBooleanLogic(logic, contextData, thresholdConfig) {
    try {
      if (!logic || !logic?.operator) {
        return { triggered: false, reason: 'Invalid logic structure' };
      }

      const { operator, conditions, nestedGroups } = logic;

      let conditionResults = [];

      if (conditions && conditions?.length > 0) {
        conditionResults = conditions?.map(condition => {
          return this.evaluateCondition(condition, contextData, thresholdConfig);
        });
      }

      let nestedResults = [];
      if (nestedGroups && nestedGroups?.length > 0) {
        nestedResults = nestedGroups?.map(group => {
          return this.evaluateBooleanLogic(group, contextData, thresholdConfig);
        });
      }

      const allResults = [...conditionResults, ...nestedResults];

      let triggered = false;
      if (operator === 'AND') {
        triggered = allResults?.every(r => r?.triggered);
      } else if (operator === 'OR') {
        triggered = allResults?.some(r => r?.triggered);
      } else if (operator === 'NOT') {
        triggered = !allResults?.[0]?.triggered;
      }

      return {
        triggered,
        operator,
        conditionResults: allResults,
        reason: triggered ? 'All conditions met' : 'Conditions not met'
      };
    } catch (error) {
      return { triggered: false, reason: `Evaluation error: ${error?.message}` };
    }
  },

  evaluateCondition(condition, contextData, thresholdConfig) {
    try {
      const { field, operator, value, dataSource } = condition;

      let actualValue = contextData?.[field];

      if (dataSource) {
        actualValue = contextData?.[dataSource]?.[field];
      }

      let triggered = false;

      switch (operator) {
        case 'equals':
          triggered = actualValue === value;
          break;
        case 'not_equals':
          triggered = actualValue !== value;
          break;
        case 'greater_than':
          triggered = actualValue > value;
          break;
        case 'less_than':
          triggered = actualValue < value;
          break;
        case 'greater_than_or_equal':
          triggered = actualValue >= value;
          break;
        case 'less_than_or_equal':
          triggered = actualValue <= value;
          break;
        case 'contains':
          triggered = String(actualValue)?.includes(String(value));
          break;
        case 'not_contains':
          triggered = !String(actualValue)?.includes(String(value));
          break;
        case 'in_range':
          triggered = actualValue >= value?.min && actualValue <= value?.max;
          break;
        case 'threshold_exceeded':
          const threshold = thresholdConfig?.[field];
          triggered = actualValue > threshold;
          break;
        default:
          triggered = false;
      }

      return {
        triggered,
        field,
        operator,
        expectedValue: value,
        actualValue,
        reason: triggered ? `${field} ${operator} ${value}` : `Condition not met`
      };
    } catch (error) {
      return { triggered: false, reason: `Condition error: ${error?.message}` };
    }
  },

  async createAlert(rule, contextData, evaluationResult) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.insert({
          alert_rule_id: rule?.id,
          category: rule?.category,
          severity: rule?.severity,
          title: rule?.rule_name,
          message: `Alert triggered: ${rule?.description}`,
          status: 'active',
          metadata: {
            contextData,
            evaluationResult,
            triggeredAt: new Date()?.toISOString()
          },
          detection_method: 'custom_rule_engine',
          confidence_score: 0.95
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeAutoResponse(rule, contextData) {
    try {
      const actions = rule?.auto_response_actions;

      for (const action of actions) {
        if (action?.type === 'create_workflow') {
          await orchestrationService?.executeWorkflow(action?.workflowId, {
            triggeredBy: 'alert_rule',
            ruleId: rule?.id,
            contextData
          });
        } else if (action?.type === 'send_notification') {
          await this.sendNotification(action, rule, contextData);
        } else if (action?.type === 'update_status') {
          await this.updateSystemStatus(action, contextData);
        } else if (action?.type === 'trigger_incident_response') {
          await this.triggerIncidentResponse(action, rule, contextData);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async sendNotification(action, rule, contextData) {
    try {
      const { data, error } = await supabase
        ?.from('notification_rules')
        ?.insert({
          alert_rule_id: rule?.id,
          channel: action?.channel || 'in_app',
          recipient_config: action?.recipients,
          template_config: {
            subject: `Alert: ${rule?.rule_name}`,
            body: rule?.description,
            contextData
          },
          is_enabled: true
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateSystemStatus(action, contextData) {
    try {
      console.log('Updating system status:', action, contextData);
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async triggerIncidentResponse(action, rule, contextData) {
    try {
      console.log('Triggering incident response:', action, rule, contextData);
      return { error: null };
    } catch (error) {
      return { error: { message: error?.message } };
    }
  },

  async testRule(ruleConfig, testData) {
    try {
      const evaluationResult = this.evaluateBooleanLogic(
        ruleConfig?.conditionLogic,
        testData,
        ruleConfig?.thresholdConfig
      );

      return { data: evaluationResult, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRulePerformance(ruleId) {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.eq('alert_rule_id', ruleId)
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const performance = {
        totalTriggers: data?.length || 0,
        activeTriggers: data?.filter(a => a?.status === 'active')?.length || 0,
        resolvedTriggers: data?.filter(a => a?.status === 'resolved')?.length || 0,
        averageConfidence: data?.reduce((sum, a) => sum + (a?.confidence_score || 0), 0) / (data?.length || 1),
        lastTriggered: data?.[0]?.created_at || null
      };

      return { data: performance, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  getRuleTemplates() {
    return [
      {
        id: 'fraud_threshold',
        name: 'Fraud Threshold Alert',
        category: 'fraud_detection',
        severity: 'high',
        description: 'Trigger when fraud score exceeds threshold',
        conditionLogic: {
          operator: 'AND',
          conditions: [
            { field: 'fraudScore', operator: 'greater_than', value: 75, dataSource: 'fraudDetection' },
            { field: 'confidence', operator: 'greater_than_or_equal', value: 0.8, dataSource: 'fraudDetection' }
          ]
        },
        thresholdConfig: { fraudScore: 75 }
      },
      {
        id: 'multi_system_anomaly',
        name: 'Multi-System Anomaly',
        category: 'security_event',
        severity: 'critical',
        description: 'Detect anomalies across multiple systems',
        conditionLogic: {
          operator: 'OR',
          nestedGroups: [
            {
              operator: 'AND',
              conditions: [
                { field: 'transactionVolume', operator: 'greater_than', value: 1000, dataSource: 'financial' },
                { field: 'velocity', operator: 'greater_than', value: 50, dataSource: 'financial' }
              ]
            },
            {
              operator: 'AND',
              conditions: [
                { field: 'failedLogins', operator: 'greater_than', value: 5, dataSource: 'auth' },
                { field: 'suspiciousIPs', operator: 'greater_than', value: 3, dataSource: 'auth' }
              ]
            }
          ]
        },
        thresholdConfig: { transactionVolume: 1000, velocity: 50, failedLogins: 5 }
      },
      {
        id: 'compliance_violation',
        name: 'Compliance Violation',
        category: 'policy_violation',
        severity: 'high',
        description: 'Detect compliance policy violations',
        conditionLogic: {
          operator: 'OR',
          conditions: [
            { field: 'policyViolations', operator: 'greater_than', value: 0, dataSource: 'compliance' },
            { field: 'regulatoryFlags', operator: 'greater_than', value: 0, dataSource: 'compliance' }
          ]
        },
        thresholdConfig: { policyViolations: 0, regulatoryFlags: 0 }
      }
    ];
  }
};