import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
const baseURL = 'https://api.anthropic.com/v1/messages';

function getErrorMessage(statusCode, errorData) {
  if (statusCode === 401) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your Anthropic API key.' };
  } else if (statusCode === 403) {
    return { isInternal: true, message: 'Permission denied. Your API key does not have access to the specified resource.' };
  } else if (statusCode === 404) {
    return { isInternal: true, message: 'Resource not found. The requested endpoint or model may not exist.' };
  } else if (statusCode === 429) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (statusCode === 500) {
    return { isInternal: true, message: 'Anthropic service error. An unexpected error occurred on their servers. Please try again later.' };
  } else if (statusCode === 529) {
    return { isInternal: true, message: 'Anthropic service is temporarily overloaded. Please try again in a few moments.' };
  } else {
    return { isInternal: false, message: errorData?.error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

export const autonomousClaudeAgentService = {
  async executeDisputeResolutionWorkflow(disputeData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are an autonomous dispute resolution agent with multi-step workflow execution capabilities. Execute comprehensive dispute resolution including:
1. Evidence collection and analysis
2. Stakeholder identification and coordination
3. Policy interpretation and precedent matching
4. Decision recommendation with confidence scoring
5. Documentation generation for audit trails
6. Escalation triggers for human oversight

Operate autonomously through each step, documenting reasoning and decision points.`;

    const userPrompt = `Execute autonomous dispute resolution workflow:

Dispute ID: ${disputeData?.id}
Type: ${disputeData?.type}
Description: ${disputeData?.description}
Parties: ${JSON.stringify(disputeData?.parties)}
Amount: ${disputeData?.amount || 'N/A'}
Evidence: ${JSON.stringify(disputeData?.evidence)}

Execute multi-step workflow and return JSON with:
- workflowSteps (array with step, action, status, reasoning, timestamp)
- evidenceAnalysis (object with findings, credibility, gaps)
- stakeholderCoordination (array with stakeholder, role, notificationSent, response)
- policyInterpretation (object with applicablePolicies, precedents, interpretation)
- decisionRecommendation (object with decision, confidence, reasoning, alternatives)
- documentationGenerated (array with documentType, content, timestamp)
- escalationTriggers (array with condition, triggered, reason)
- auditTrail (array with timestamp, action, actor, details)`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 4096,
          temperature: 0.3,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let workflowResult;

      try {
        workflowResult = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          workflowResult = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse workflow result');
        }
      }

      await this.storeWorkflowExecution(disputeData?.id, workflowResult);

      return {
        data: {
          ...workflowResult,
          executionId: response?.data?.id,
          executedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Autonomous dispute resolution error:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async executeFraudInvestigationWorkflow(fraudData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are an autonomous fraud investigation agent. Execute comprehensive fraud investigation workflows including:
1. Evidence gathering from multiple data sources
2. Pattern analysis and anomaly detection
3. Cross-reference with historical fraud cases
4. Stakeholder interviews and coordination
5. Risk assessment and impact analysis
6. Investigation report generation
7. Recommendation for action (escalate, dismiss, monitor)

Operate autonomously with decision documentation at each step.`;

    const userPrompt = `Execute autonomous fraud investigation:

Case ID: ${fraudData?.caseId}
Fraud Type: ${fraudData?.fraudType}
Suspicious Activity: ${JSON.stringify(fraudData?.suspiciousActivity)}
Affected Accounts: ${JSON.stringify(fraudData?.affectedAccounts)}
Transaction Data: ${JSON.stringify(fraudData?.transactions)}
User Behavior: ${JSON.stringify(fraudData?.userBehavior)}

Execute investigation workflow and return JSON with:
- investigationSteps (array with step, findings, confidence, timestamp)
- evidenceGathered (array with source, type, relevance, credibility)
- patternAnalysis (object with patterns, anomalies, correlations)
- historicalMatches (array with caseId, similarity, outcome)
- stakeholderInterviews (array with stakeholder, questions, responses, credibility)
- riskAssessment (object with riskLevel, impactScore, likelihood, reasoning)
- investigationReport (object with summary, findings, evidence, conclusion)
- recommendedAction (object with action, priority, reasoning, alternatives)
- auditTrail (array with timestamp, action, findings, confidence)`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 4096,
          temperature: 0.2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let investigationResult;

      try {
        investigationResult = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          investigationResult = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse investigation result');
        }
      }

      await this.storeInvestigationExecution(fraudData?.caseId, investigationResult);

      return {
        data: {
          ...investigationResult,
          executionId: response?.data?.id,
          executedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      if (!errorInfo?.isInternal) {
        console.error('Autonomous fraud investigation error:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async storeWorkflowExecution(disputeId, workflowResult) {
    try {
      const { data, error } = await supabase
        ?.from('autonomous_workflow_executions')
        ?.insert({
          dispute_id: disputeId,
          workflow_type: 'dispute_resolution',
          workflow_result: workflowResult,
          decision_confidence: workflowResult?.decisionRecommendation?.confidence || 0,
          executed_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error storing workflow execution:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async storeInvestigationExecution(caseId, investigationResult) {
    try {
      const { data, error } = await supabase
        ?.from('autonomous_workflow_executions')
        ?.insert({
          case_id: caseId,
          workflow_type: 'fraud_investigation',
          workflow_result: investigationResult,
          risk_level: investigationResult?.riskAssessment?.riskLevel || 'unknown',
          executed_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error storing investigation execution:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};