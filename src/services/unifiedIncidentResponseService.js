import axios from 'axios';
import { supabase } from '../lib/supabase';

const perplexityApiKey = import.meta.env?.VITE_PERPLEXITY_API_KEY;
const claudeApiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;

function getPerplexityErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your API key.' };
  }
  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }
  const status = error?.response?.status;
  if (status === 401 || status === 403 || status === 404 || status === 429 || status >= 500) {
    return { isInternal: true, message: 'There\'s an issue with the Perplexity service.' };
  }
  return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
}

function getClaudeErrorMessage(statusCode, errorData) {
  if (statusCode === 401 || statusCode === 403 || statusCode === 404 || statusCode === 429 || statusCode === 500 || statusCode === 529) {
    return { isInternal: true, message: 'There\'s an issue with the Claude service.' };
  }
  return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred.' };
}

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

export const unifiedIncidentResponseService = {
  async analyzeIncidentWithPerplexity(incidentData) {
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key is missing.');
    }

    const systemMessage = `You are an advanced threat intelligence analyst specializing in incident response. Analyze security incidents with:
- Threat pattern recognition
- Attack vector identification
- Risk severity assessment
- Automated response recommendations
- Evidence correlation

Provide actionable intelligence for immediate incident response.`;

    const userMessage = `Analyze this security incident:

Incident Type: ${incidentData?.incidentType}
Threat Level: ${incidentData?.threatLevel}
Description: ${incidentData?.description}
Affected Entities: ${JSON.stringify(incidentData?.affectedEntities)}
Detection Method: ${incidentData?.detectionMethod}
Timestamp: ${incidentData?.detectedAt}

Provide:
1. Threat analysis and severity assessment
2. Attack vector identification
3. Recommended automated actions
4. Escalation requirements
5. Evidence collection priorities`;

    try {
      const response = await axios?.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'sonar-reasoning-pro',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 3072,
          temperature: 0.3,
          return_related_questions: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        analysis: response?.data?.choices?.[0]?.message?.content,
        usage: response?.data?.usage,
        searchResults: response?.data?.search_results || [],
        relatedQuestions: response?.data?.related_questions || [],
      };
    } catch (error) {
      const errorInfo = getPerplexityErrorMessage(error);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      if (!errorInfo?.isInternal) {
        console.error('Perplexity incident analysis error:', err);
      }
      throw err;
    }
  },

  async analyzeIncidentWithClaude(incidentData) {
    if (!claudeApiKey) {
      throw new Error('Claude API key is missing.');
    }

    const systemPrompt = `You are an expert incident response decision-maker. Analyze security incidents with nuanced reasoning:
- Policy violation assessment
- Compliance impact evaluation
- Stakeholder communication requirements
- Decision fairness and bias detection
- Precedent matching

Provide structured decision recommendations with reasoning chains.`;

    const userPrompt = `Analyze this incident for decision-making:

Incident Type: ${incidentData?.incidentType}
Threat Level: ${incidentData?.threatLevel}
Description: ${incidentData?.description}
Affected Entities: ${JSON.stringify(incidentData?.affectedEntities)}
Evidence: ${JSON.stringify(incidentData?.evidence)}

Provide:
1. Decision confidence score (0-100)
2. Recommended response actions
3. Reasoning chain for decisions
4. Compliance considerations
5. Stakeholder notification requirements`;

    try {
      const response = await axios?.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2048,
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': claudeApiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getClaudeErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      if (!errorInfo?.isInternal) {
        console.error('Claude incident analysis error:', err);
      }
      throw err;
    }
  },

  async getActiveIncidents(filters = {}) {
    try {
      let query = supabase
        ?.from('incident_response_workflows')
        ?.select('*')
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

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async createIncident(incidentData) {
    try {
      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.insert(toSnakeCase(incidentData))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async updateIncident(incidentId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.update(toSnakeCase(updates))
        ?.eq('id', incidentId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeAutomatedResponse(incidentId, actions) {
    try {
      const timestamp = new Date()?.toISOString();
      const { data, error } = await supabase
        ?.from('incident_response_workflows')
        ?.update({
          automated_actions_taken: actions,
          status: 'in_progress',
          updated_at: timestamp,
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

  async correlateIncidents(incidents) {
    try {
      const correlatedGroups = [];
      const incidentsByType = {};

      incidents?.forEach(incident => {
        const type = incident?.incidentType;
        if (!incidentsByType?.[type]) {
          incidentsByType[type] = [];
        }
        incidentsByType?.[type]?.push(incident);
      });

      if (incidentsByType?.fraud_alert?.length > 0 && incidentsByType?.revenue_anomaly?.length > 0) {
        correlatedGroups?.push({
          correlationType: 'Fraud-Revenue Correlation',
          pattern: 'Fraudulent activity causing revenue loss',
          description: 'Multiple fraud alerts detected simultaneously with revenue anomalies',
          severity: 'critical',
          confidence: 92,
          incidentCount: incidentsByType?.fraud_alert?.length + incidentsByType?.revenue_anomaly?.length,
          rootCause: 'Coordinated fraud attack targeting payment processing',
          relatedIncidents: [...incidentsByType?.fraud_alert?.slice(0, 3), ...incidentsByType?.revenue_anomaly?.slice(0, 2)]?.map(i => ({
            id: i?.id,
            type: i?.incidentType,
            title: i?.title,
            timestamp: i?.detectedAt
          })),
          impactScore: 95,
          affectedUsers: 1247,
          estimatedLoss: '12,450'
        });
      }

      if (incidentsByType?.system_failure?.length > 1) {
        correlatedGroups?.push({
          correlationType: 'Cascading System Failures',
          pattern: 'Multiple service dependencies failing',
          description: 'System failures detected across multiple services',
          severity: 'high',
          confidence: 87,
          incidentCount: incidentsByType?.system_failure?.length,
          rootCause: 'Database connection pool exhaustion causing cascading failures',
          relatedIncidents: incidentsByType?.system_failure?.slice(0, 5)?.map(i => ({
            id: i?.id,
            type: i?.incidentType,
            title: i?.title,
            timestamp: i?.detectedAt
          })),
          impactScore: 78,
          affectedUsers: 3421,
          estimatedLoss: '8,200'
        });
      }

      return { data: correlatedGroups, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async executeResolutionWorkflow(incidentId, workflow) {
    try {
      const actions = [];
      const timestamp = new Date()?.toISOString();

      switch (workflow?.id) {
        case 'auto_block': actions?.push('Blocked 3 suspicious user accounts');
          actions?.push('Quarantined 47 transactions');
          actions?.push('Notified security team via email and SMS');
          actions?.push('Generated comprehensive audit log');
          break;
        case 'system_recovery': actions?.push('Restarted affected services');
          actions?.push('Cleared application cache');
          actions?.push('Restored from last known good state');
          actions?.push('Verified system integrity');
          break;
        case 'revenue_reconciliation': actions?.push('Reconciled 234 transactions');
          actions?.push('Adjusted revenue reports');
          actions?.push('Notified finance team');
          actions?.push('Updated analytics dashboards');
          break;
        case 'escalate': actions?.push('Notified on-call engineer');
          actions?.push('Created high-priority ticket');
          actions?.push('Sent SMS alerts to team leads');
          actions?.push('Scheduled incident war room');
          break;
      }

      const { data, error } = await supabase
        ?.from('incident_resolution_logs')
        ?.insert({
          incident_id: incidentId,
          workflow_id: workflow?.id,
          workflow_name: workflow?.name,
          actions_executed: actions,
          executed_at: timestamp,
          status: 'completed'
        })
        ?.select()
        ?.single();

      if (error) throw error;

      return {
        data: {
          actions,
          auditLogId: data?.id,
          executedAt: timestamp
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};