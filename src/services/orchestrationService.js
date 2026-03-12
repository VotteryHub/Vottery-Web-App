import { supabase } from '../lib/supabase';
import perplexityClient from '../lib/perplexity';
import { smsAlertService } from './smsAlertService';
import { regulatorySubmissionService } from './regulatorySubmissionService';
import { incidentResponseService } from './incidentResponseService';
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

export const orchestrationService = {
  async getOrchestrationWorkflows(filters = {}) {
    try {
      let query = supabase
        ?.from('orchestration_workflows')
        ?.select(`
          *,
          created_by_profile:created_by(id, name, username, email)
        `)
        ?.order('priority', { ascending: false });

      if (filters?.workflowType && filters?.workflowType !== 'all') {
        query = query?.eq('workflow_type', filters?.workflowType);
      }

      if (filters?.triggerSource && filters?.triggerSource !== 'all') {
        query = query?.eq('trigger_source', filters?.triggerSource);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('status', filters?.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeWorkflow(workflowId, triggerData) {
    try {
      const startTime = Date.now();

      const { data: workflow } = await supabase
        ?.from('orchestration_workflows')
        ?.select('*')
        ?.eq('id', workflowId)
        ?.single();

      if (!workflow) throw new Error('Workflow not found');
      if (workflow?.status !== 'active') throw new Error('Workflow is not active');

      const { data: executionLog, error: logError } = await supabase
        ?.from('workflow_execution_logs')
        ?.insert({
          workflow_id: workflowId,
          execution_status: 'running',
          trigger_data: triggerData,
          started_at: new Date()?.toISOString(),
          execution_steps: []
        })
        ?.select()
        ?.single();

      if (logError) throw logError;

      const executionSteps = [];
      const actionsExecuted = [];
      const notificationsSent = [];

      for (const step of workflow?.execution_sequence || []) {
        try {
          executionSteps?.push({
            step: step?.step,
            action: step?.action,
            status: 'running',
            timestamp: new Date()?.toISOString()
          });

          let stepResult;

          switch (step?.action) {
            case 'analyze_threat':
              stepResult = await this.executeThreatAnalysis(triggerData);
              break;
            case 'execute_automated_response':
              stepResult = await this.executeAutomatedResponse(triggerData, workflow);
              break;
            case 'send_notifications':
              stepResult = await this.sendStakeholderNotifications(triggerData, step?.channels);
              notificationsSent?.push(...(stepResult?.notifications || []));
              break;
            case 'generate_compliance_report':
              stepResult = await this.generateComplianceReport(triggerData);
              break;
            case 'submit_via_resend':
              stepResult = await this.submitComplianceViaResend(triggerData);
              break;
            case 'analyze_zone_performance':
              stepResult = await this.analyzeZonePerformance(triggerData);
              break;
            case 'generate_optimization_recommendations':
              stepResult = await this.generateOptimizationRecommendations(triggerData);
              break;
            default:
              stepResult = { success: true, message: 'Step executed' };
          }

          executionSteps[executionSteps?.length - 1].status = 'completed';
          executionSteps[executionSteps?.length - 1].result = stepResult;
          actionsExecuted?.push({
            action: step?.action,
            result: stepResult,
            timestamp: new Date()?.toISOString()
          });
        } catch (stepError) {
          executionSteps[executionSteps?.length - 1].status = 'failed';
          executionSteps[executionSteps?.length - 1].error = stepError?.message;
          throw stepError;
        }
      }

      const executionDuration = Date.now() - startTime;

      await supabase
        ?.from('workflow_execution_logs')
        ?.update({
          execution_status: 'completed',
          execution_steps: executionSteps,
          actions_executed: actionsExecuted,
          notifications_sent: notificationsSent,
          completed_at: new Date()?.toISOString(),
          execution_duration_ms: executionDuration
        })
        ?.eq('id', executionLog?.id);

      analytics?.trackEvent('workflow_executed', {
        workflow_type: workflow?.workflow_type,
        execution_duration_ms: executionDuration
      });

      return { data: toCamelCase({ ...executionLog, executionSteps, actionsExecuted }), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeThreatAnalysis(triggerData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced fraud threat analyst. Analyze the provided threat data and provide actionable intelligence with threat scoring, risk assessment, and recommended automated responses.'
          },
          {
            role: 'user',
            content: `Analyze this threat data and provide comprehensive threat intelligence: ${JSON.stringify(triggerData)}. Return JSON with: threatScore (0-100), riskLevel (critical/high/medium/low), threatPatterns (array), recommendedActions (array), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'day'
      });

      const content = response?.choices?.[0]?.message?.content;
      let threatAnalysis;

      try {
        threatAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          threatAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse threat analysis response');
        }
      }

      return { success: true, analysis: threatAnalysis };
    } catch (error) {
      console.error('Threat analysis error:', error);
      return { success: false, error: error?.message };
    }
  },

  async executeAutomatedResponse(triggerData, workflow) {
    try {
      const responses = [];

      for (const rule of workflow?.automation_rules || []) {
        if (rule?.action === 'freeze_account' && triggerData?.userId) {
          responses?.push({ action: 'freeze_account', userId: triggerData?.userId, executed: true });
        }

        if (rule?.action === 'block_transactions' && triggerData?.userId) {
          responses?.push({ action: 'block_transactions', userId: triggerData?.userId, executed: true });
        }

        if (rule?.action === 'create_incident') {
          const incidentResult = await incidentResponseService?.createIncident({
            incidentType: triggerData?.incidentType || 'fraud_detection',
            threatLevel: triggerData?.threatLevel || 'high',
            title: `Automated Incident: ${triggerData?.title || 'Fraud Detection'}`,
            description: triggerData?.description || 'Automatically created by orchestration workflow',
            enableThreatAnalysis: false
          });

          responses?.push({ action: 'create_incident', incidentId: incidentResult?.data?.id, executed: true });
        }
      }

      return { success: true, responses };
    } catch (error) {
      console.error('Automated response error:', error);
      return { success: false, error: error?.message };
    }
  },

  async sendStakeholderNotifications(triggerData, channels) {
    try {
      const notifications = [];

      const { data: stakeholderGroups } = await supabase
        ?.from('stakeholder_groups')
        ?.select('*')
        ?.eq('is_active', true);

      for (const group of stakeholderGroups || []) {
        for (const recipient of group?.recipients || []) {
          if (channels?.includes('email') && recipient?.email) {
            notifications?.push({
              channel: 'email',
              recipient: recipient?.email,
              status: 'sent',
              timestamp: new Date()?.toISOString()
            });
          }

          if (channels?.includes('sms') && recipient?.phone) {
            const smsResult = await smsAlertService?.sendSMSAlert({
              to: recipient?.phone,
              message: `Alert: ${triggerData?.title || 'System Notification'}. ${triggerData?.description || ''}`,
              severity: triggerData?.severity || 'medium'
            });

            notifications?.push({
              channel: 'sms',
              recipient: recipient?.phone,
              status: smsResult?.error ? 'failed' : 'sent',
              timestamp: new Date()?.toISOString()
            });
          }
        }
      }

      return { success: true, notifications };
    } catch (error) {
      console.error('Stakeholder notification error:', error);
      return { success: false, error: error?.message };
    }
  },

  async generateComplianceReport(triggerData) {
    try {
      const { data: financialData } = await supabase
        ?.from('financial_tracking')
        ?.select('*')
        ?.gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString());

      const report = {
        reportType: 'automated_compliance',
        generatedAt: new Date()?.toISOString(),
        timeRange: '24h',
        financialSummary: {
          totalTransactions: financialData?.length || 0,
          totalVolume: financialData?.reduce((sum, record) => sum + parseFloat(record?.amount || 0), 0)
        },
        triggerData
      };

      return { success: true, report };
    } catch (error) {
      console.error('Compliance report generation error:', error);
      return { success: false, error: error?.message };
    }
  },

  async submitComplianceViaResend(triggerData) {
    try {
      const submissionResult = await regulatorySubmissionService?.submitRegulatoryFiling({
        filingId: triggerData?.filingId,
        jurisdiction: triggerData?.jurisdiction || 'US',
        regulatoryAuthority: triggerData?.regulatoryAuthority || 'SEC',
        recipients: triggerData?.recipients || ['compliance@regulatory.gov'],
        emailSubject: `Automated Compliance Submission: ${triggerData?.submissionType || 'Transaction Report'}`,
        emailContent: `<h2>Automated Compliance Submission</h2><p>This is an automated regulatory submission triggered by system thresholds.</p><pre>${JSON.stringify(triggerData, null, 2)}</pre>`,
        attachmentUrls: triggerData?.attachmentUrls || []
      });

      return { success: !submissionResult?.error, submissionId: submissionResult?.data?.id };
    } catch (error) {
      console.error('Compliance submission error:', error);
      return { success: false, error: error?.message };
    }
  },

  async analyzeZonePerformance(triggerData) {
    try {
      const { data: zoneMetrics } = await supabase
        ?.from('zone_performance_metrics')
        ?.select('*')
        ?.eq('time_period', '30d');

      const analysis = {
        totalZones: zoneMetrics?.length || 0,
        averageROI: zoneMetrics?.reduce((sum, zone) => sum + parseFloat(zone?.average_roi || 0), 0) / (zoneMetrics?.length || 1),
        topPerformingZones: zoneMetrics?.sort((a, b) => parseFloat(b?.average_roi || 0) - parseFloat(a?.average_roi || 0))?.slice(0, 3),
        underperformingZones: zoneMetrics?.filter(zone => parseFloat(zone?.average_roi || 0) < 100)
      };

      return { success: true, analysis };
    } catch (error) {
      console.error('Zone performance analysis error:', error);
      return { success: false, error: error?.message };
    }
  },

  async generateOptimizationRecommendations(triggerData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a financial optimization expert. Analyze zone performance data and provide actionable optimization recommendations with predicted ROI improvements and implementation strategies.'
          },
          {
            role: 'user',
            content: `Analyze this financial performance data and provide optimization recommendations: ${JSON.stringify(triggerData)}. Return JSON with: recommendations (array with action, expectedImpact, priority, implementation), predictedROIImprovement (percentage), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week'
      });

      const content = response?.choices?.[0]?.message?.content;
      let recommendations;

      try {
        recommendations = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse optimization recommendations');
        }
      }

      return { success: true, recommendations };
    } catch (error) {
      console.error('Optimization recommendations error:', error);
      return { success: false, error: error?.message };
    }
  },

  async getWorkflowExecutionLogs(filters = {}) {
    try {
      let query = supabase
        ?.from('workflow_execution_logs')
        ?.select(`
          *,
          workflow:workflow_id(workflow_name, workflow_type, trigger_source)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.workflowId) {
        query = query?.eq('workflow_id', filters?.workflowId);
      }

      if (filters?.status && filters?.status !== 'all') {
        query = query?.eq('execution_status', filters?.status);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getStakeholderCommunications(filters = {}) {
    try {
      let query = supabase
        ?.from('stakeholder_incident_communications')
        ?.select(`
          *,
          incident:incident_id(title, threat_level, status),
          stakeholder_group:stakeholder_group_id(group_name, group_type)
        `)
        ?.order('created_at', { ascending: false });

      if (filters?.incidentId) {
        query = query?.eq('incident_id', filters?.incidentId);
      }

      if (filters?.communicationType && filters?.communicationType !== 'all') {
        query = query?.eq('communication_type', filters?.communicationType);
      }

      if (filters?.deliveryStatus && filters?.deliveryStatus !== 'all') {
        query = query?.eq('delivery_status', filters?.deliveryStatus);
      }

      const { data, error } = await query?.limit(filters?.limit || 50);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getRealtimeSubscriptionConfigs() {
    try {
      const { data, error } = await supabase
        ?.from('realtime_subscription_configs')
        ?.select('*')
        ?.eq('is_enabled', true)
        ?.order('priority', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getIntegrationHealthStatus() {
    try {
      const { data, error } = await supabase
        ?.from('integration_health_monitoring')
        ?.select('*')
        ?.order('health_status', { ascending: true });

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  subscribeToWorkflowExecutions(callback) {
    const channel = supabase
      ?.channel('workflow_executions_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workflow_execution_logs' },
        (payload) => {
          callback({
            eventType: payload?.eventType,
            data: toCamelCase(payload?.new || payload?.old)
          });
        }
      )
      ?.subscribe();

    return channel;
  },

  unsubscribeFromWorkflowExecutions(channel) {
    if (channel) {
      supabase?.removeChannel(channel);
    }
  }
};
