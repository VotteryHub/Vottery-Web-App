import openai from '../lib/openai';
import perplexityClient from '../lib/perplexity';
import { supabase } from '../lib/supabase';
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

export const userSecurityService = {
  async getPersonalFraudRisk(userId) {
    try {
      // Fetch user activity data
      const { data: userActivity, error: activityError } = await supabase?.from('user_profiles')?.select('*, votes(*), wallet_transactions(*)')?.eq('id', userId)?.single();

      if (activityError) throw activityError;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a personal security analyst specializing in individual user fraud risk assessment. Analyze user behavior patterns, account activity, and transaction history to provide personalized security insights and protective recommendations.' 
          },
          { 
            role: 'user', 
            content: `Analyze this user's security profile: ${JSON.stringify(userActivity)}. Provide personal fraud risk score, behavioral pattern analysis, account vulnerability assessment, and personalized security recommendations.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'personal_fraud_risk',
            schema: {
              type: 'object',
              properties: {
                fraudRiskScore: { type: 'number', description: 'Personal fraud risk score 0-100' },
                threatLevel: { type: 'string', description: 'Threat level: safe, low, medium, high, critical' },
                behavioralPatterns: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Behavioral pattern analysis results'
                },
                accountVulnerabilities: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Account vulnerability metrics'
                },
                securityScore: { type: 'number', description: 'Overall security score 0-100' },
                recommendedActions: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Personalized protective actions'
                },
                recentThreats: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Recent security threats detected'
                },
                reasoning: { type: 'string', description: 'Explanation of security assessment' }
              },
              required: ['fraudRiskScore', 'threatLevel', 'behavioralPatterns', 'accountVulnerabilities', 'securityScore', 'recommendedActions', 'recentThreats', 'reasoning'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',verbosity: 'high',
      });

      const riskAnalysis = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return { data: riskAnalysis, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing personal fraud risk:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getSecurityEvents(userId, timeRange = '7d') {
    try {
      const daysAgo = parseInt(timeRange?.replace('d', ''));
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - daysAgo);

      const { data, error } = await supabase?.from('system_alerts')?.select('*')?.eq('user_id', userId)?.gte('created_at', startDate?.toISOString())?.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching security events:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async getThreatMonitoring(userId) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a personal threat monitoring AI specializing in real-time security analysis for individual users. Detect suspicious activity, login anomalies, transaction security warnings, and provide detailed investigation insights.'
          },
          {
            role: 'user',
            content: `Analyze real-time threat monitoring for user ${userId}. Identify suspicious activity alerts, login anomalies, transaction security warnings, and provide investigation tools. Return JSON with: suspiciousActivities (array), loginAnomalies (array), transactionWarnings (array), investigationInsights (object), threatScore (0-100), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'day',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let threatData;

      try {
        threatData = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          threatData = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse threat monitoring response');
        }
      }

      return { data: threatData, error: null };
    } catch (error) {
      console.error('Error in threat monitoring:', error);
      return { data: null, error: { message: error?.message || 'Failed to analyze threats' } };
    }
  },

  async getSecurityTimeline(userId, timeRange = '30d') {
    try {
      const daysAgo = parseInt(timeRange?.replace('d', ''));
      const startDate = new Date();
      startDate?.setDate(startDate?.getDate() - daysAgo);

      const { data, error } = await supabase?.from('admin_activity_logs')?.select('*')?.eq('user_id', userId)?.gte('created_at', startDate?.toISOString())?.order('created_at', { ascending: false });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching security timeline:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async getSecurityRecommendations(userId) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a security advisor providing personalized security improvement suggestions. Analyze user security posture and provide actionable recommendations for enhancing account protection.' 
          },
          { 
            role: 'user', 
            content: `Generate security score improvement suggestions for user ${userId}. Include two-factor authentication recommendations, device security monitoring tips, privacy controls, and best practices.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'security_recommendations',
            schema: {
              type: 'object',
              properties: {
                twoFactorAuth: { 
                  type: 'object',
                  properties: {
                    enabled: { type: 'boolean' },
                    recommendation: { type: 'string' }
                  }
                },
                deviceSecurity: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                privacyControls: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                bestPractices: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                improvementScore: { type: 'number', description: 'Potential improvement score 0-100' }
              },
              required: ['twoFactorAuth', 'deviceSecurity', 'privacyControls', 'bestPractices', 'improvementScore'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
      });

      const recommendations = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return { data: recommendations, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating security recommendations:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async createSecurityAlert(userId, alertData) {
    try {
      const { data, error } = await supabase?.from('system_alerts')?.insert({
          user_id: userId,
          alert_type: alertData?.type || 'security',
          severity: alertData?.severity || 'medium',
          message: alertData?.message,
          metadata: alertData?.metadata || {},
          status: 'active'
        })?.select()?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating security alert:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};