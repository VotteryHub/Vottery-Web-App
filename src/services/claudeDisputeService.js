import axios from 'axios';

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
   * Mock data for active disputes
   */
  async getActiveDisputes() {
    return [
      {
        id: 'DSP-2024-001',
        type: 'payment_dispute',
        description: 'Unauthorized transaction claim for $450 election participation fee',
        status: 'pending_analysis',
        amount: 450,
        createdAt: '2024-01-20T10:30:00Z',
        parties: { claimant: 'User #4521', respondent: 'Platform' },
        aiConfidence: null,
        severity: 'high',
      },
      {
        id: 'DSP-2024-002',
        type: 'policy_violation',
        description: 'Content moderation appeal - alleged false positive on election content',
        status: 'under_review',
        amount: null,
        createdAt: '2024-01-20T09:15:00Z',
        parties: { claimant: 'Creator #8832', respondent: 'Moderation Team' },
        aiConfidence: 78,
        severity: 'medium',
      },
      {
        id: 'DSP-2024-003',
        type: 'compliance_conflict',
        description: 'Cross-jurisdiction data handling dispute - GDPR vs local regulations',
        status: 'escalated',
        amount: null,
        createdAt: '2024-01-19T16:45:00Z',
        parties: { claimant: 'EU User #2341', respondent: 'Compliance Team' },
        aiConfidence: 65,
        severity: 'critical',
      },
    ];
  },

  /**
   * Mock data for appeal cases
   */
  async getAppealCases() {
    return [
      {
        id: 'APL-2024-001',
        originalDisputeId: 'DSP-2023-445',
        status: 'pending_review',
        appealReason: 'New evidence submitted showing transaction authorization',
        submittedAt: '2024-01-21T08:00:00Z',
        originalDecision: 'Denied - insufficient evidence',
        fairnessScore: null,
      },
      {
        id: 'APL-2024-002',
        originalDisputeId: 'DSP-2023-512',
        status: 'under_analysis',
        appealReason: 'Bias detected in original moderation decision',
        submittedAt: '2024-01-20T14:30:00Z',
        originalDecision: 'Content removed - policy violation',
        fairnessScore: 82,
      },
    ];
  },

  /**
   * Mock data for resolution templates
   */
  async getResolutionTemplates() {
    return [
      {
        id: 'TPL-001',
        name: 'Payment Dispute - Full Refund',
        category: 'payment_dispute',
        autoApprovalThreshold: 90,
        actions: ['issue_refund', 'notify_parties', 'update_records'],
      },
      {
        id: 'TPL-002',
        name: 'Policy Violation - Content Restoration',
        category: 'policy_violation',
        autoApprovalThreshold: 85,
        actions: ['restore_content', 'notify_creator', 'update_moderation_log'],
      },
      {
        id: 'TPL-003',
        name: 'Compliance - Escalate to Legal',
        category: 'compliance_conflict',
        autoApprovalThreshold: 0,
        actions: ['escalate_legal', 'notify_compliance', 'freeze_account'],
      },
    ];
  },

  /**
   * Mock data for failed transactions
   */
  async getFailedTransactions() {
    return [
      {
        id: 'TXN-FAIL-001',
        transactionId: 'payout_1234567890',
        amount: 1250.00,
        currency: 'USD',
        failureReason: 'Insufficient funds in destination account',
        bankingMethod: 'ACH',
        countryCode: 'US',
        timestamp: '2024-02-14T10:30:00Z',
        retryCount: 2,
        status: 'failed',
        creatorId: 'creator_123',
        creatorName: 'John Doe'
      },
      {
        id: 'TXN-FAIL-002',
        transactionId: 'payout_0987654321',
        amount: 850.00,
        currency: 'EUR',
        failureReason: 'Invalid IBAN format',
        bankingMethod: 'SEPA',
        countryCode: 'DE',
        timestamp: '2024-02-14T08:15:00Z',
        retryCount: 1,
        status: 'failed',
        creatorId: 'creator_456',
        creatorName: 'Maria Schmidt'
      },
      {
        id: 'TXN-FAIL-003',
        transactionId: 'payout_5555555555',
        amount: 2100.00,
        currency: 'GBP',
        failureReason: 'Bank account closed',
        bankingMethod: 'SWIFT',
        countryCode: 'GB',
        timestamp: '2024-02-13T16:45:00Z',
        retryCount: 3,
        status: 'failed',
        creatorId: 'creator_789',
        creatorName: 'James Wilson'
      }
    ];
  },

  /**
   * Mock data for currency discrepancies
   */
  async getCurrencyDiscrepancies() {
    return [
      {
        id: 'DISC-001',
        expectedAmount: 1000.00,
        expectedCurrency: 'USD',
        actualAmount: 82500.00,
        actualCurrency: 'INR',
        exchangeRate: 82.50,
        marketRate: 83.25,
        fees: { conversionFee: 2.5, processingFee: 5.0 },
        provider: 'openexchangerates',
        discrepancy: 750.00,
        status: 'under_investigation',
        reportedAt: '2024-02-14T09:00:00Z'
      },
      {
        id: 'DISC-002',
        expectedAmount: 500.00,
        expectedCurrency: 'USD',
        actualAmount: 425.00,
        actualCurrency: 'EUR',
        exchangeRate: 0.85,
        marketRate: 0.92,
        fees: { conversionFee: 1.5, processingFee: 3.0 },
        provider: 'stripe',
        discrepancy: 35.00,
        status: 'pending_review',
        reportedAt: '2024-02-13T14:30:00Z'
      }
    ];
  },

  /**
   * Mock data for banking delays
   */
  async getBankingDelays() {
    return [
      {
        id: 'DELAY-001',
        payoutId: 'payout_delay_123',
        initiatedAt: '2024-02-10T10:00:00Z',
        expectedCompletion: '2024-02-13T10:00:00Z',
        currentStatus: 'processing',
        bankingMethod: 'SWIFT',
        countryCode: 'IN',
        delayDuration: 48,
        lastUpdate: '2024-02-14T10:00:00Z',
        amount: 3500.00,
        currency: 'USD',
        creatorName: 'Raj Patel'
      },
      {
        id: 'DELAY-002',
        payoutId: 'payout_delay_456',
        initiatedAt: '2024-02-11T08:00:00Z',
        expectedCompletion: '2024-02-12T08:00:00Z',
        currentStatus: 'on_hold',
        bankingMethod: 'ACH',
        countryCode: 'US',
        delayDuration: 72,
        lastUpdate: '2024-02-14T08:00:00Z',
        amount: 1800.00,
        currency: 'USD',
        creatorName: 'Sarah Johnson'
      }
    ];
  },
};

export default claudeDisputeService;