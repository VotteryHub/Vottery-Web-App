import { supabase } from '../lib/supabase';
import axios from 'axios';

const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
const baseURL = 'https://api.anthropic.com/v1/messages';

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

export const claudeCreatorSuccessService = {
  async getCreatorHealthScores() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_health_monitoring')
        ?.select('*')
        ?.order('monitored_at', { ascending: false })
        ?.limit(50);

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error fetching creator health scores:', error);
      return { error: error?.message };
    }
  },

  async getAtRiskCreators() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('creator_health_monitoring')
        ?.select(`
          *,
          user_profiles!creator_health_monitoring_creator_id_fkey(
            full_name,
            avatar_url
          )
        `)
        ?.eq('risk_level', 'high')
        ?.order('health_score', { ascending: true })
        ?.limit(20);

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error fetching at-risk creators:', error);
      return { error: error?.message };
    }
  },

  async analyzeCreatorWithClaude(creatorId) {
    try {
      if (!apiKey) throw new Error('Anthropic API key is missing');

      // Fetch creator data
      const { data: creatorData, error: creatorError } = await supabase
        ?.from('user_profiles')
        ?.select(`
          *,
          elections!elections_created_by_fkey(count),
          wallet_transactions(count)
        `)
        ?.eq('id', creatorId)
        ?.single();

      if (creatorError) throw creatorError;

      // Get engagement metrics
      const { data: engagementData } = await supabase
        ?.from('elections')
        ?.select('votes_count, participants_count, created_at')
        ?.eq('created_by', creatorId)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      const systemPrompt = `You are an AI creator success analyst. Analyze creator performance data and provide:
1. Health score (0-100) based on engagement trends
2. Risk level assessment (low/medium/high)
3. Specific content optimization recommendations
4. Churn risk prediction with confidence score
5. Actionable intervention strategies`;

      const userPrompt = `Analyze this creator's performance:

Creator ID: ${creatorId}
Recent Elections: ${engagementData?.length || 0}
Average Votes: ${engagementData?.reduce((sum, e) => sum + (e?.votes_count || 0), 0) / (engagementData?.length || 1)}
Average Participants: ${engagementData?.reduce((sum, e) => sum + (e?.participants_count || 0), 0) / (engagementData?.length || 1)}

Provide analysis in JSON format with: healthScore, riskLevel, recommendations (array), churnRisk (0-1), interventionStrategies (array)`;

      const response = await axios?.post(
        baseURL,
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
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        }
      );

      const content = response?.data?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(content);
      } catch {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude analysis');
        }
      }

      // Store analysis
      const { error: insertError } = await supabase
        ?.from('creator_health_monitoring')
        ?.insert(toSnakeCase({
          creatorId,
          healthScore: analysis?.healthScore || 50,
          riskLevel: analysis?.riskLevel || 'medium',
          engagementTrend: 'stable',
          churnRisk: analysis?.churnRisk || 0.5,
          lastActiveAt: new Date()?.toISOString(),
          monitoredAt: new Date()?.toISOString(),
        }));

      if (insertError) console.error('Error storing analysis:', insertError);

      return { data: analysis };
    } catch (error) {
      console.error('Error analyzing creator with Claude:', error);
      return { error: error?.message };
    }
  },

  async getContentOptimizationRecommendations(creatorId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('content_optimization_recommendations')
        ?.select('*')
        ?.eq('creator_id', creatorId || user?.id)
        ?.order('created_at', { ascending: false })
        ?.limit(10);

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { error: error?.message };
    }
  },

  async generateContentRecommendations(creatorId) {
    try {
      if (!apiKey) throw new Error('Anthropic API key is missing');

      const { data: { user } } = await supabase?.auth?.getUser();
      const targetCreatorId = creatorId || user?.id;

      // Fetch creator's recent content
      const { data: recentElections } = await supabase
        ?.from('elections')
        ?.select('title, description, category, votes_count, participants_count, created_at')
        ?.eq('created_by', targetCreatorId)
        ?.order('created_at', { ascending: false })
        ?.limit(5);

      const systemPrompt = `You are a content optimization expert. Analyze creator content and provide specific, actionable recommendations for:
1. Content strategy improvements
2. Audience engagement tactics
3. Monetization opportunities
4. Optimal posting times
5. Trending topics to leverage`;

      const userPrompt = `Analyze this creator's recent content:

${recentElections?.map((e, i) => `${i + 1}. ${e?.title} (${e?.votes_count} votes, ${e?.participants_count} participants)`)?.join('\n')}

Provide 5 specific recommendations in JSON array format with: title, description, category, priority (high/medium/low), implementationSteps (array), expectedImpact`;

      const response = await axios?.post(
        baseURL,
        {
          model: 'claude-sonnet-4-5-20250929',
          messages: [{ role: 'user', content: userPrompt }],
          system: systemPrompt,
          max_tokens: 2048,
          temperature: 0.7,
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
      let recommendations;

      try {
        recommendations = JSON.parse(content);
      } catch {
        const jsonMatch = content?.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse recommendations');
        }
      }

      // Store recommendations
      const recommendationsToInsert = recommendations?.map(rec => toSnakeCase({
        creatorId: targetCreatorId,
        recommendationType: rec?.category || 'content_strategy',
        title: rec?.title,
        description: rec?.description,
        priority: rec?.priority || 'medium',
        implementationSteps: rec?.implementationSteps,
        expectedImpact: rec?.expectedImpact,
        status: 'pending',
        createdAt: new Date()?.toISOString(),
      }));

      const { error: insertError } = await supabase
        ?.from('content_optimization_recommendations')
        ?.insert(recommendationsToInsert);

      if (insertError) console.error('Error storing recommendations:', insertError);

      // Twilio SMS: send content optimization alert for high/urgent to creator
      const highPriority = recommendations?.filter(r => (r?.priority || '').toLowerCase() === 'high' || (r?.priority || '').toLowerCase() === 'urgent');
      if (highPriority?.length > 0 && targetCreatorId) {
        try {
          const { smsAlertService } = await import('./smsAlertService');
          await smsAlertService?.sendContentOptimizationAlert?.(targetCreatorId, highPriority);
        } catch (e) {
          console.warn('Creator SMS (content optimization) skipped:', e?.message);
        }
      }

      return { data: toCamelCase(recommendations) };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { error: error?.message };
    }
  },

  async getMilestoneAchievements(creatorId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('milestone_achievements')
        ?.select('*')
        ?.eq('creator_id', creatorId || user?.id)
        ?.order('achieved_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return { error: error?.message };
    }
  },

  async trackMilestone(milestoneData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('milestone_achievements')
        ?.insert(toSnakeCase({
          creatorId: user?.id,
          milestoneType: milestoneData?.milestoneType,
          title: milestoneData?.title,
          description: milestoneData?.description,
          targetValue: milestoneData?.targetValue,
          currentValue: milestoneData?.currentValue,
          achievedAt: milestoneData?.achieved ? new Date()?.toISOString() : null,
          celebrationSent: false,
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error tracking milestone:', error);
      return { error: error?.message };
    }
  },

  async getChurnPreventionInterventions(creatorId) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('churn_prevention_interventions')
        ?.select('*')
        ?.eq('creator_id', creatorId || user?.id)
        ?.order('created_at', { ascending: false });

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error fetching interventions:', error);
      return { error: error?.message };
    }
  },

  async createIntervention(interventionData) {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        ?.from('churn_prevention_interventions')
        ?.insert(toSnakeCase({
          creatorId: interventionData?.creatorId,
          interventionType: interventionData?.interventionType,
          strategy: interventionData?.strategy,
          description: interventionData?.description,
          priority: interventionData?.priority || 'medium',
          status: 'pending',
          createdAt: new Date()?.toISOString(),
        }))
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error creating intervention:', error);
      return { error: error?.message };
    }
  },

  async updateInterventionStatus(interventionId, status, outcome) {
    try {
      const { data, error } = await supabase
        ?.from('churn_prevention_interventions')
        ?.update({
          status,
          outcome,
          completed_at: status === 'completed' ? new Date()?.toISOString() : null,
        })
        ?.eq('id', interventionId)
        ?.select()
        ?.single();

      if (error) throw error;
      return { data: toCamelCase(data) };
    } catch (error) {
      console.error('Error updating intervention:', error);
      return { error: error?.message };
    }
  },

  async getSuccessMetrics() {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get total creators monitored
      const { count: totalCreators } = await supabase
        ?.from('creator_health_monitoring')
        ?.select('*', { count: 'exact', head: true });

      // Get at-risk creators
      const { count: atRiskCount } = await supabase
        ?.from('creator_health_monitoring')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('risk_level', 'high');

      // Get successful interventions
      const { count: successfulInterventions } = await supabase
        ?.from('churn_prevention_interventions')
        ?.select('*', { count: 'exact', head: true })
        ?.eq('status', 'completed')
        ?.eq('outcome', 'success');

      // Get average health score
      const { data: healthScores } = await supabase
        ?.from('creator_health_monitoring')
        ?.select('health_score');

      const avgHealthScore = healthScores?.reduce((sum, h) => sum + (h?.health_score || 0), 0) / (healthScores?.length || 1);

      return {
        data: {
          totalCreators: totalCreators || 0,
          atRiskCreators: atRiskCount || 0,
          successfulInterventions: successfulInterventions || 0,
          averageHealthScore: Math.round(avgHealthScore || 0),
          interventionSuccessRate: successfulInterventions / (totalCreators || 1) * 100,
        },
      };
    } catch (error) {
      console.error('Error fetching success metrics:', error);
      return { error: error?.message };
    }
  },
};