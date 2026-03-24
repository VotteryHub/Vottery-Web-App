import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';

function getErrorMessage(error) {
  return { isInternal: false, message: error?.message || 'An unexpected error occurred. Please try again.' };
}

export const userSecurityService = {
  async getTwoFactorSettings(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_security_settings')
        ?.select('two_factor_enabled, two_factor_method, two_factor_phone')
        ?.eq('user_id', userId)
        ?.maybeSingle();
      if (error) throw error;
      return { data: data || { two_factor_enabled: false, two_factor_method: 'totp' }, error: null };
    } catch (error) {
      return { data: { two_factor_enabled: false, two_factor_method: 'totp' }, error: { message: error?.message } };
    }
  },

  async updateTwoFactorSettings(userId, { enabled, method, phone = null }) {
    try {
      const payload = {
        user_id: userId,
        two_factor_enabled: enabled,
        two_factor_method: method,
        two_factor_phone: phone,
        updated_at: new Date()?.toISOString(),
      };
      const { data, error } = await supabase
        ?.from('user_security_settings')
        ?.upsert(payload, { onConflict: 'user_id' })
        ?.select()
        ?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getActiveSessions(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_active_sessions')
        ?.select('*')
        ?.eq('user_id', userId)
        ?.order('last_activity_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: { message: error?.message } };
    }
  },

  async revokeSession(userId, sessionId) {
    try {
      const { error } = await supabase
        ?.from('user_active_sessions')
        ?.delete()
        ?.eq('id', sessionId)
        ?.eq('user_id', userId);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  },

  async getPersonalFraudRisk(userId) {
    try {
      // Fetch user activity data
      const { data: userActivity, error: activityError } = await supabase?.from('user_profiles')?.select('*, votes(*), wallet_transactions(*)')?.eq('id', userId)?.single();

      if (activityError) throw activityError;

      const response = await getChatCompletion(
        'GEMINI',
        'gemini-1.5-pro',
        [
          {
            role: 'system',
            content:
              'Return strict JSON only with keys: fraudRiskScore, threatLevel, behavioralPatterns, accountVulnerabilities, securityScore, recommendedActions, recentThreats, reasoning.',
          },
          {
            role: 'user',
            content: `Analyze this user security profile and return the JSON object only: ${JSON.stringify(
              userActivity
            )}`,
          },
        ],
        { useCase: 'security_forensics', highStakes: true }
      );

      const riskAnalysis = JSON.parse(response?.choices?.[0]?.message?.content || '{}');
      
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
      const response = await getChatCompletion(
        'GEMINI',
        'gemini-1.5-pro',
        [
          {
            role: 'system',
            content:
              'Return strict JSON only with keys: suspiciousActivities, loginAnomalies, transactionWarnings, investigationInsights, threatScore, confidence, reasoning.',
          },
          {
            role: 'user',
            content: `Analyze real-time threat monitoring for user ${userId}.`,
          },
        ],
        { useCase: 'forensic_security', highStakes: true }
      );

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
      const response = await getChatCompletion(
        'GEMINI',
        'gemini-1.5-pro',
        [
          {
            role: 'system',
            content:
              'Return strict JSON only with keys: twoFactorAuth, deviceSecurity, privacyControls, bestPractices, improvementScore.',
          },
          {
            role: 'user',
            content: `Generate security improvement recommendations for user ${userId}.`,
          },
        ],
        { useCase: 'security_forensics', highStakes: false }
      );

      const recommendations = JSON.parse(response?.choices?.[0]?.message?.content || '{}');
      
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