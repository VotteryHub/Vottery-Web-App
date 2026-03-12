import openai from '../lib/openai';
import { alertService } from './alertService';
import { perplexityThreatService } from './perplexityThreatService';

import { 
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';

function getErrorMessage(error) {
  if (error instanceof AuthenticationError) {
    return { isInternal: true, message: 'Invalid API key or authentication failed. Please check your OpenAI API key.' };
  } else if (error instanceof PermissionDeniedError) {
    return { isInternal: true, message: 'Quota exceeded or authorization failed. You may have exceeded your usage limits or do not have access to this resource.' };
  } else if (error instanceof RateLimitError) {
    return { isInternal: true, message: 'Rate limit exceeded. You are sending requests too quickly. Please wait a moment and try again.' };
  } else if (error instanceof InternalServerError) {
    return { isInternal: true, message: 'OpenAI service is currently unavailable. Please try again later.' };
  } else if (error instanceof APIConnectionError) {
    return { isInternal: true, message: 'Unable to connect to OpenAI service. Please check your API key and internet connection.' };
  } else {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred. Please try again.' };
  }
}

export const aiFraudDetectionService = {
  async analyzeFraudRisk(votingPattern) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a fraud detection expert specializing in voting pattern analysis. Analyze voting behavior for suspicious patterns, anomalies, and potential manipulation attempts. Provide detailed risk scores and specific indicators.' 
          },
          { 
            role: 'user', 
            content: `Analyze this voting pattern for fraud risk: ${JSON.stringify(votingPattern)}. Identify suspicious indicators, calculate fraud probability, and recommend actions.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'fraud_risk_analysis',
            schema: {
              type: 'object',
              properties: {
                fraudScore: { type: 'number', description: 'Fraud probability score 0-100' },
                riskLevel: { type: 'string', description: 'Risk level: low, medium, high, critical' },
                suspiciousIndicators: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Specific suspicious patterns detected'
                },
                anomalyTypes: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Types of anomalies: velocity, pattern, geographic, temporal'
                },
                confidence: { type: 'number', description: 'Detection confidence 0-1' },
                recommendedAction: { type: 'string', description: 'Recommended action: monitor, flag, block, investigate' },
                reasoning: { type: 'string', description: 'Explanation of the fraud assessment' }
              },
              required: ['fraudScore', 'riskLevel', 'suspiciousIndicators', 'anomalyTypes', 'confidence', 'recommendedAction', 'reasoning'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const fraudAnalysis = JSON.parse(response?.choices?.[0]?.message?.content);
      
      // Auto-create alert if high risk detected
      if (fraudAnalysis?.fraudScore >= 70) {
        await this.createFraudAlert(fraudAnalysis, votingPattern);
      }

      // Enhanced threat intelligence with Perplexity AI
      let perplexityThreatData = null;
      if (fraudAnalysis?.fraudScore >= 60) {
        const threatResult = await perplexityThreatService?.analyzeThreatIntelligence({
          fraudAnalysis,
          votingPattern,
          timestamp: new Date()?.toISOString()
        });
        perplexityThreatData = threatResult?.data;
      }

      return { 
        data: {
          ...fraudAnalysis,
          perplexityThreatIntelligence: perplexityThreatData
        }, 
        error: null 
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing fraud risk:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async detectAnomalies(votingData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are an anomaly detection specialist. Identify unusual patterns in voting data that deviate from normal behavior, including velocity spikes, geographic anomalies, and temporal irregularities.' 
          },
          { 
            role: 'user', 
            content: `Detect anomalies in this voting dataset: ${JSON.stringify(votingData)}. Identify deviations from expected patterns and classify anomaly severity.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'anomaly_detection',
            schema: {
              type: 'object',
              properties: {
                anomaliesDetected: { type: 'number', description: 'Total number of anomalies found' },
                anomalies: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', description: 'Anomaly type' },
                      severity: { type: 'string', description: 'Severity: low, medium, high' },
                      description: { type: 'string', description: 'Detailed description' },
                      affectedVotes: { type: 'number', description: 'Number of votes affected' }
                    },
                    required: ['type', 'severity', 'description', 'affectedVotes']
                  },
                  description: 'List of detected anomalies'
                },
                overallRisk: { type: 'string', description: 'Overall risk assessment' },
                requiresInvestigation: { type: 'boolean', description: 'Whether manual investigation is needed' }
              },
              required: ['anomaliesDetected', 'anomalies', 'overallRisk', 'requiresInvestigation'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
        verbosity: 'medium',
      });

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error detecting anomalies:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async createFraudAlert(fraudAnalysis, votingPattern) {
    try {
      const alertData = {
        category: 'fraud_detection',
        severity: fraudAnalysis?.riskLevel === 'critical' ? 'critical' : 
                 fraudAnalysis?.riskLevel === 'high' ? 'high' : 'medium',
        title: `AI Fraud Detection: ${fraudAnalysis?.riskLevel?.toUpperCase()} Risk`,
        message: `Fraud score: ${fraudAnalysis?.fraudScore}/100. ${fraudAnalysis?.reasoning}`,
        metadata: {
          fraudScore: fraudAnalysis?.fraudScore,
          suspiciousIndicators: fraudAnalysis?.suspiciousIndicators,
          anomalyTypes: fraudAnalysis?.anomalyTypes,
          recommendedAction: fraudAnalysis?.recommendedAction,
          votingPattern: votingPattern
        },
        status: 'active'
      };

      const result = await alertService?.createSystemAlert(alertData);
      return result;
    } catch (error) {
      console.error('Error creating fraud alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async batchAnalyzeVotes(votesArray) {
    try {
      const results = [];
      
      for (const vote of votesArray) {
        const analysis = await this.analyzeFraudRisk(vote);
        if (analysis?.data) {
          results?.push({
            voteId: vote?.id,
            ...analysis?.data
          });
        }
      }

      return { data: results, error: null };
    } catch (error) {
      console.error('Error in batch analysis:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  // Mock data for demo purposes
  async getMockFraudAnalysis() {
    return {
      data: {
        fraudScore: 78,
        riskLevel: 'high',
        suspiciousIndicators: [
          'Unusual voting velocity (150 votes in 2 minutes)',
          'Geographic clustering from single IP range',
          'Identical voting patterns across multiple accounts',
          'Temporal anomaly: votes cast outside normal hours'
        ],
        anomalyTypes: ['velocity', 'geographic', 'pattern', 'temporal'],
        confidence: 0.91,
        recommendedAction: 'investigate',
        reasoning: 'Multiple high-confidence fraud indicators detected. The voting velocity exceeds normal patterns by 400%, and geographic analysis shows 85% of votes originating from a narrow IP range. Pattern matching reveals coordinated behavior across 12 accounts.'
      },
      error: null
    };
  },

  async getMockAnomalyDetection() {
    return {
      data: {
        anomaliesDetected: 5,
        anomalies: [
          {
            type: 'Velocity Spike',
            severity: 'high',
            description: 'Vote submission rate increased by 380% in 5-minute window',
            affectedVotes: 245
          },
          {
            type: 'Geographic Clustering',
            severity: 'high',
            description: '78% of votes from single geographic region (expected: 15%)',
            affectedVotes: 189
          },
          {
            type: 'Pattern Matching',
            severity: 'medium',
            description: 'Identical voting sequences detected across 8 accounts',
            affectedVotes: 64
          },
          {
            type: 'Temporal Anomaly',
            severity: 'medium',
            description: 'Unusual activity during off-peak hours (2-4 AM)',
            affectedVotes: 112
          },
          {
            type: 'Account Age',
            severity: 'low',
            description: '42% of votes from accounts created within 24 hours',
            affectedVotes: 98
          }
        ],
        overallRisk: 'High - Multiple coordinated anomalies suggest organized manipulation attempt',
        requiresInvestigation: true
      },
      error: null
    };
  }
};