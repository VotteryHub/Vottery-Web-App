import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
const baseURL = 'https://api.anthropic.com/v1/messages';

/**
 * Maps Anthropic API error status codes to user-friendly error messages.
 */
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

const claudeDisputeService = {
  /**
   * Analyzes a dispute using Claude AI for intelligent moderation
   */
  async analyzeDispute(disputeData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are an expert dispute resolution AI specializing in payment disputes, policy violations, and compliance conflicts. Analyze disputes with nuanced reasoning, considering:
- Evidence quality and credibility
- Historical precedents and patterns
- Fairness and bias detection
- Regulatory compliance requirements
- Multi-factor decision matrices

Provide structured analysis with confidence scores, reasoning chains, and actionable recommendations.`;

    const userPrompt = `Analyze this dispute:

Type: ${disputeData?.type}
Description: ${disputeData?.description}
Evidence: ${JSON.stringify(disputeData?.evidence)}
Parties: ${JSON.stringify(disputeData?.parties)}
Amount: ${disputeData?.amount || 'N/A'}

Provide:
1. Confidence score (0-100)
2. Recommended resolution
3. Reasoning chain
4. Risk factors
5. Precedent matches`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 2048,
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

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude dispute analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Analyzes appeal with comprehensive review workflow
   */
  async analyzeAppeal(appealData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are an appeals review specialist. Evaluate appeals with:
- Original decision reasoning analysis
- New evidence assessment
- Fairness and bias detection
- Precedent comparison
- Overturning justification requirements

Provide detailed reasoning chains and fairness assessments.`;

    const userPrompt = `Review this appeal:

Original Decision: ${appealData?.originalDecision}
Appeal Reason: ${appealData?.appealReason}
New Evidence: ${JSON.stringify(appealData?.newEvidence)}
Original Reasoning: ${appealData?.originalReasoning}

Provide:
1. Appeal validity score
2. Recommendation (uphold/overturn/partial)
3. Reasoning chain
4. Fairness assessment
5. Required actions`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 2048,
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

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude appeal analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Generates automated documentation for dispute resolution
   */
  async generateDocumentation(disputeId, resolution) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a legal documentation specialist. Generate comprehensive dispute resolution documentation with:
- Executive summary
- Detailed findings
- Evidence evaluation
- Decision rationale
- Compliance statements
- Audit trail references`;

    const userPrompt = `Generate documentation for:

Dispute ID: ${disputeId}
Resolution: ${JSON.stringify(resolution)}

Create formal documentation suitable for legal and compliance review.`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 3072,
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

      return {
        documentation: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude documentation generation error:', err);
      }
      throw err;
    }
  },

  /**
   * Analyze failed transaction for dispute resolution
   */
  async analyzeFailedTransaction(transactionData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a payment dispute specialist analyzing failed transactions. Investigate:
- Transaction failure root cause
- Banking system errors
- Currency conversion issues
- Compliance violations
- Fraud indicators

Provide structured analysis with resolution steps and settlement recommendations.`;

    const userPrompt = `Analyze this failed transaction:

Transaction ID: ${transactionData?.transactionId}
Amount: ${transactionData?.amount} ${transactionData?.currency}
Failure Reason: ${transactionData?.failureReason}
Banking Method: ${transactionData?.bankingMethod}
Country: ${transactionData?.countryCode}
Timestamp: ${transactionData?.timestamp}
Retry Count: ${transactionData?.retryCount}

Provide:
1. Root cause analysis
2. Resolution steps
3. Settlement recommendation
4. Prevention measures
5. Estimated resolution time`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 2048,
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

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude failed transaction analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Detect currency discrepancies
   */
  async detectCurrencyDiscrepancy(discrepancyData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a currency conversion specialist detecting discrepancies. Analyze:
- Exchange rate accuracy
- Conversion calculation errors
- Fee structure inconsistencies
- Market rate deviations
- Potential manipulation

Provide detailed analysis with correction recommendations.`;

    const userPrompt = `Analyze this currency discrepancy:

Expected Amount: ${discrepancyData?.expectedAmount} ${discrepancyData?.expectedCurrency}
Actual Amount: ${discrepancyData?.actualAmount} ${discrepancyData?.actualCurrency}
Exchange Rate Used: ${discrepancyData?.exchangeRate}
Market Rate: ${discrepancyData?.marketRate}
Fees Applied: ${JSON.stringify(discrepancyData?.fees)}
Provider: ${discrepancyData?.provider}

Provide:
1. Discrepancy severity (low/medium/high)
2. Root cause identification
3. Correction calculation
4. Settlement amount
5. Prevention recommendations`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 2048,
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

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude currency discrepancy analysis error:', err);
      }
      throw err;
    }
  },

  /**
   * Investigate banking delays
   */
  async investigateBankingDelay(delayData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a banking operations specialist investigating payment delays. Analyze:
- Processing timeline deviations
- Banking system bottlenecks
- Compliance hold reasons
- Cross-border transfer issues
- Resolution pathways

Provide actionable investigation results and escalation recommendations.`;

    const userPrompt = `Investigate this banking delay:

Payout ID: ${delayData?.payoutId}
Initiated: ${delayData?.initiatedAt}
Expected Completion: ${delayData?.expectedCompletion}
Current Status: ${delayData?.currentStatus}
Banking Method: ${delayData?.bankingMethod}
Country: ${delayData?.countryCode}
Delay Duration: ${delayData?.delayDuration} hours
Last Update: ${delayData?.lastUpdate}

Provide:
1. Delay root cause
2. Investigation steps taken
3. Resolution timeline
4. Escalation requirements
5. Compensation recommendation`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 2048,
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

      return {
        analysis: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude banking delay investigation error:', err);
      }
      throw err;
    }
  },

  /**
   * Generate automated settlement workflow
   */
  async generateSettlementWorkflow(settlementData) {
    if (!apiKey) {
      throw new Error('Anthropic API key is missing. Please configure VITE_ANTHROPIC_API_KEY.');
    }

    const systemPrompt = `You are a settlement workflow specialist. Generate comprehensive settlement plans with:
- Step-by-step resolution process
- Stakeholder communication templates
- Compensation calculations
- Timeline milestones
- Compliance requirements

Provide structured, actionable settlement workflows.`;

    const userPrompt = `Generate settlement workflow for:

Dispute Type: ${settlementData?.disputeType}
Amount in Dispute: ${settlementData?.amount}
Parties: ${JSON.stringify(settlementData?.parties)}
Evidence: ${JSON.stringify(settlementData?.evidence)}
Resolution Goal: ${settlementData?.resolutionGoal}

Provide:
1. Settlement workflow steps
2. Communication templates
3. Compensation calculation
4. Timeline with milestones
5. Success criteria`;

    try {
      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [
            { role: 'user', content: userPrompt }
          ],
          system: systemPrompt,
          max_tokens: 3072,
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

      return {
        workflow: response?.data?.content?.[0]?.text,
        usage: response?.data?.usage,
        id: response?.data?.id,
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error?.response?.status, error?.response?.data);
      const err = new Error(errorInfo.message);
      err.statusCode = error?.response?.status;
      
      if (!errorInfo?.isInternal) {
        console.error('Claude settlement workflow generation error:', err);
      }
      throw err;
    }
  },

  /**
   * Active disputes: fraud alerts + open moderation flags (Supabase-backed).
   */
  async getActiveDisputes() {
    try {
      const [fraudRes, flagsRes] = await Promise.all([
        supabase
          ?.from('fraud_alerts')
          ?.select('id, alert_type, severity, user_id, description, metadata, status, created_at')
          ?.in('status', ['open', 'pending', 'investigating', 'new'])
          ?.order('created_at', { ascending: false })
          ?.limit(40),
        supabase
          ?.from('content_flags')
          ?.select('id, violation_type, severity, content_snippet, author_id, status, confidence_score, created_at')
          ?.in('status', ['pending_review', 'under_review', 'escalated'])
          ?.order('created_at', { ascending: false })
          ?.limit(40),
      ]);

      if (fraudRes?.error) throw fraudRes.error;
      if (flagsRes?.error) throw flagsRes.error;

      const fromFraud = (fraudRes?.data || []).map((row) => ({
        id: `FRA-${row?.id}`,
        type: row?.alert_type || 'platform_risk',
        description: row?.description || 'Fraud or risk alert pending review',
        status: 'pending_analysis',
        amount: row?.metadata?.amount != null ? Number(row.metadata.amount) : null,
        createdAt: row?.created_at,
        parties: {
          claimant: row?.user_id ? `User ${String(row.user_id).slice(0, 8)}` : 'Unknown user',
          respondent: 'Platform',
        },
        aiConfidence: row?.metadata?.ai_confidence != null ? Math.round(Number(row.metadata.ai_confidence) * 100) : null,
        severity: row?.severity || 'medium',
      }));

      const statusMap = {
        pending_review: 'pending_analysis',
        under_review: 'under_review',
        escalated: 'escalated',
      };

      const fromFlags = (flagsRes?.data || []).map((row) => ({
        id: `FLG-${row?.id}`,
        type: 'policy_violation',
        description: row?.content_snippet || `${row?.violation_type || 'Policy'} — content moderation queue`,
        status: statusMap[row?.status] || 'under_review',
        amount: null,
        createdAt: row?.created_at,
        parties: {
          claimant: row?.author_id ? `Creator ${String(row.author_id).slice(0, 8)}` : 'Unknown author',
          respondent: 'Moderation Team',
        },
        aiConfidence: row?.confidence_score != null ? Math.round(Number(row.confidence_score) * 100) : null,
        severity: row?.severity || 'medium',
      }));

      return [...fromFraud, ...fromFlags].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (e) {
      console.error('getActiveDisputes:', e);
      return [];
    }
  },

  /**
   * Appeal cases from content_appeals (pending).
   */
  async getAppealCases() {
    try {
      const { data, error } = await supabase
        ?.from('content_appeals')
        ?.select('id, flag_id, reason, status, created_at, outcome, outcome_notes')
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;

      return (data || []).map((row) => ({
        id: row?.id,
        originalDisputeId: row?.flag_id,
        status: row?.status === 'pending' ? 'pending_review' : row?.status,
        appealReason: row?.reason,
        submittedAt: row?.created_at,
        originalDecision: row?.outcome_notes || row?.outcome || 'Pending moderator review',
        fairnessScore: null,
      }));
    } catch (e) {
      console.error('getAppealCases:', e);
      return [];
    }
  },

  /**
   * Resolution templates from ai_auto_approval_policies (shared Web/Mobile).
   */
  async getResolutionTemplates() {
    try {
      const { data, error } = await supabase
        ?.from('ai_auto_approval_policies')
        ?.select('id, analysis_type, min_confidence, enabled')
        ?.order('analysis_type');

      if (error) throw error;

      return (data || []).map((row) => ({
        id: row?.id,
        name: `${String(row?.analysis_type || 'analysis').replace(/_/g, ' ')} — auto-approval threshold`,
        category: row?.analysis_type,
        autoApprovalThreshold: Math.round(Number(row?.min_confidence ?? 0) * 100),
        actions: row?.enabled
          ? ['evaluate_consensus', 'auto_route_if_above_threshold', 'audit_log']
          : ['manual_review_only', 'audit_log'],
      }));
    } catch (e) {
      console.error('getResolutionTemplates:', e);
      return [];
    }
  },

  /**
   * Failed payment transactions from payment_transactions.
   */
  async getFailedTransactions() {
    try {
      const { data, error } = await supabase
        ?.from('payment_transactions')
        ?.select('id, user_id, transaction_id, amount, currency, status, provider, metadata, created_at, updated_at')
        ?.eq('status', 'failed')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;

      return (data || []).map((row) => {
        const meta = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
        return {
          id: row?.id,
          transactionId: row?.transaction_id,
          amount: parseFloat(row?.amount) || 0,
          currency: row?.currency || 'USD',
          failureReason: meta?.failure_reason || meta?.failureReason || 'Payment failed',
          bankingMethod: meta?.banking_method || meta?.bankingMethod || row?.provider || 'unknown',
          countryCode: meta?.country_code || meta?.countryCode || '—',
          timestamp: row?.created_at,
          retryCount: Number(meta?.retry_count ?? meta?.retryCount ?? 0),
          status: row?.status,
          creatorId: row?.user_id,
          creatorName: meta?.creator_name || meta?.creatorName || '—',
        };
      });
    } catch (e) {
      console.error('getFailedTransactions:', e);
      return [];
    }
  },

  /**
   * Currency / revenue anomalies from revenue_anomalies.
   */
  async getCurrencyDiscrepancies() {
    try {
      const { data, error } = await supabase
        ?.from('revenue_anomalies')
        ?.select('id, anomaly_type, severity, amount, description, metadata, created_at')
        ?.or('anomaly_type.ilike.%currency%,anomaly_type.ilike.%fx%,anomaly_type.ilike.%exchange%')
        ?.order('created_at', { ascending: false })
        ?.limit(40);

      if (error) throw error;

      return (data || []).map((row) => {
        const meta = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
        return {
          id: row?.id,
          expectedAmount: meta?.expected_amount != null ? Number(meta.expected_amount) : null,
          expectedCurrency: meta?.expected_currency || 'USD',
          actualAmount: meta?.actual_amount != null ? Number(meta.actual_amount) : Number(row?.amount) || 0,
          actualCurrency: meta?.actual_currency || 'USD',
          exchangeRate: meta?.exchange_rate != null ? Number(meta.exchange_rate) : null,
          marketRate: meta?.market_rate != null ? Number(meta.market_rate) : null,
          fees: meta?.fees || {},
          provider: meta?.provider || 'internal',
          discrepancy: meta?.discrepancy_amount != null ? Number(meta.discrepancy_amount) : Number(row?.amount) || 0,
          status: meta?.status || 'pending_review',
          reportedAt: row?.created_at,
          creatorId: meta?.user_id,
        };
      });
    } catch (e) {
      console.error('getCurrencyDiscrepancies:', e);
      return [];
    }
  },

  /**
   * Stuck / delayed payments: long-running pending or processing transactions.
   */
  async getBankingDelays() {
    try {
      const threshold = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        ?.from('payment_transactions')
        ?.select('id, user_id, transaction_id, amount, currency, status, provider, metadata, created_at, updated_at')
        ?.in('status', ['pending', 'processing', 'initiated'])
        ?.lt('created_at', threshold)
        ?.order('created_at', { ascending: true })
        ?.limit(40);

      if (error) throw error;

      return (data || []).map((row) => {
        const meta = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
        const created = new Date(row?.created_at).getTime();
        const delayHours = Math.max(1, Math.round((Date.now() - created) / (60 * 60 * 1000)));
        return {
          id: row?.id,
          payoutId: row?.transaction_id,
          initiatedAt: row?.created_at,
          expectedCompletion: row?.updated_at,
          currentStatus: row?.status,
          bankingMethod: meta?.banking_method || meta?.bankingMethod || row?.provider || 'unknown',
          countryCode: meta?.country_code || meta?.countryCode || '—',
          delayDuration: delayHours,
          lastUpdate: row?.updated_at || row?.created_at,
          amount: parseFloat(row?.amount) || 0,
          currency: row?.currency || 'USD',
          creatorName: meta?.creator_name || meta?.creatorName || '—',
        };
      });
    } catch (e) {
      console.error('getBankingDelays:', e);
      return [];
    }
  },
};

export default claudeDisputeService;