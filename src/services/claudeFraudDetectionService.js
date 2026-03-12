import claude from '../lib/claude';
import { supabase } from '../lib/supabase';

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const claudeFraudDetectionService = {
  async analyzeGamifiedParticipationPatterns(electionId, timeWindow = '24h') {
    try {
      // Gather gamified participation data
      const participationData = await this.gatherParticipationData(electionId, timeWindow);

      // Analyze with Claude AI
      let fraudAnalysis = await this.performClaudeFraudAnalysis(participationData);

      // Flag suspicious clusters if detected
      if (fraudAnalysis?.fraudScore >= 70) {
        await this.flagSuspiciousClusters(fraudAnalysis, electionId);
      }

      // Store analysis results
      await this.storeFraudAnalysis(fraudAnalysis, electionId);

      return { data: fraudAnalysis, error: null };
    } catch (error) {
      console.error('Error analyzing gamified participation patterns:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async gatherParticipationData(electionId, timeWindow) {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeWindow) {
        case '1h':
          startDate?.setHours(now?.getHours() - 1);
          break;
        case '6h':
          startDate?.setHours(now?.getHours() - 6);
          break;
        case '24h':
          startDate?.setHours(now?.getHours() - 24);
          break;
        default:
          startDate?.setHours(now?.getHours() - 24);
      }

      const { data: votes, error } = await supabase
        ?.from('votes')
        ?.select(`
          *,
          user_profiles:user_id(
            id,
            name,
            username,
            country,
            age,
            gender,
            zone_identifier,
            created_at
          ),
          elections:election_id(
            id,
            title,
            is_gamified,
            prize_pool,
            total_votes
          )
        `)
        ?.eq('election_id', electionId)
        ?.gte('created_at', startDate?.toISOString())
        ?.order('created_at', { ascending: true });

      if (error) throw error;

      // Analyze voting patterns
      const patterns = this.extractVotingPatterns(votes);

      return {
        electionId,
        timeWindow,
        totalVotes: votes?.length,
        votes: toCamelCase(votes),
        patterns,
        analyzedAt: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error gathering participation data:', error);
      throw error;
    }
  },

  extractVotingPatterns(votes) {
    const patterns = {
      temporalClusters: [],
      geographicClusters: [],
      accountAgeClusters: [],
      velocityAnomalies: [],
      ipClusters: []
    };

    // Temporal clustering analysis
    const timeGroups = {};
    votes?.forEach(vote => {
      const timeKey = new Date(vote?.created_at)?.toISOString()?.substring(0, 16); // Group by minute
      if (!timeGroups?.[timeKey]) timeGroups[timeKey] = [];
      timeGroups?.[timeKey]?.push(vote);
    });

    Object.entries(timeGroups)?.forEach(([time, groupVotes]) => {
      if (groupVotes?.length > 10) {
        patterns?.temporalClusters?.push({
          timestamp: time,
          voteCount: groupVotes?.length,
          suspicionLevel: groupVotes?.length > 50 ? 'high' : 'medium'
        });
      }
    });

    // Geographic clustering
    const countryGroups = {};
    votes?.forEach(vote => {
      const country = vote?.user_profiles?.country || 'unknown';
      if (!countryGroups?.[country]) countryGroups[country] = [];
      countryGroups?.[country]?.push(vote);
    });

    Object.entries(countryGroups)?.forEach(([country, groupVotes]) => {
      const percentage = (groupVotes?.length / votes?.length) * 100;
      if (percentage > 40) {
        patterns?.geographicClusters?.push({
          country,
          voteCount: groupVotes?.length,
          percentage: percentage?.toFixed(2),
          suspicionLevel: percentage > 60 ? 'high' : 'medium'
        });
      }
    });

    // Account age analysis
    const newAccounts = votes?.filter(vote => {
      const accountAge = Date.now() - new Date(vote?.user_profiles?.created_at)?.getTime();
      return accountAge < 7 * 24 * 60 * 60 * 1000; // Less than 7 days old
    });

    if (newAccounts?.length > votes?.length * 0.3) {
      patterns?.accountAgeClusters?.push({
        newAccountCount: newAccounts?.length,
        percentage: ((newAccounts?.length / votes?.length) * 100)?.toFixed(2),
        suspicionLevel: newAccounts?.length > votes?.length * 0.5 ? 'high' : 'medium'
      });
    }

    // Velocity anomalies (rapid successive votes from same user)
    const userVoteTimes = {};
    votes?.forEach(vote => {
      const userId = vote?.user_id;
      if (!userVoteTimes?.[userId]) userVoteTimes[userId] = [];
      userVoteTimes?.[userId]?.push(new Date(vote?.created_at)?.getTime());
    });

    Object.entries(userVoteTimes)?.forEach(([userId, times]) => {
      if (times?.length > 1) {
        times?.sort((a, b) => a - b);
        for (let i = 1; i < times?.length; i++) {
          const timeDiff = times?.[i] - times?.[i - 1];
          if (timeDiff < 5000) { // Less than 5 seconds
            patterns?.velocityAnomalies?.push({
              userId,
              timeDiff,
              suspicionLevel: 'high'
            });
          }
        }
      }
    });

    return patterns;
  },

  async performClaudeFraudAnalysis(participationData) {
    try {
      const systemPrompt = `You are an advanced fraud detection specialist analyzing gamified participation patterns. Identify:
- Organized fraud attempts (coordinated voting clusters)
- Manipulation patterns (bot activity, fake accounts)
- Suspicious voting clusters (temporal, geographic, behavioral anomalies)
- Prize manipulation attempts

Provide detailed fraud risk assessment with confidence scores and actionable recommendations.`;

      const userPrompt = `Analyze gamified participation patterns for fraud detection:

${JSON.stringify(participationData, null, 2)}

Provide comprehensive fraud analysis in JSON format:
{
  "fraudScore": 0-100,
  "riskLevel": "critical|high|medium|low",
  "suspiciousClusters": [{"type": "", "description": "", "severity": "", "affectedVotes": 0}],
  "manipulationIndicators": [{"indicator": "", "confidence": 0-1, "evidence": ""}],
  "organizedFraudAttempts": [{"pattern": "", "likelihood": 0-100, "description": ""}],
  "botActivityScore": 0-100,
  "accountFarmingIndicators": [{"indicator": "", "severity": ""}],
  "sybilAttackProbability": 0-100,
  "recommendations": [{"action": "", "priority": "", "rationale": ""}],
  "confidence": 0-1,
  "reasoning": "detailed explanation"
}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 3072,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      });

      const analysisText = response?.content?.[0]?.text;
      let fraudAnalysis;

      try {
        fraudAnalysis = JSON.parse(analysisText);
      } catch (parseError) {
        const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          fraudAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude fraud analysis response');
        }
      }

      return {
        ...fraudAnalysis,
        electionId: participationData?.electionId,
        analyzedAt: new Date()?.toISOString(),
        dataSource: 'claude_ai_fraud_detection'
      };
    } catch (error) {
      console.error('Error performing Claude fraud analysis:', error);
      throw error;
    }
  },

  async flagSuspiciousClusters(fraudAnalysis, electionId) {
    try {
      const alerts = [];

      // Create alerts for suspicious clusters
      fraudAnalysis?.suspiciousClusters?.forEach(cluster => {
        alerts?.push({
          category: 'fraud_detection',
          severity: cluster?.severity === 'high' ? 'critical' : 'high',
          title: `Suspicious ${cluster?.type} Cluster Detected`,
          message: cluster?.description,
          metadata: {
            electionId,
            clusterType: cluster?.type,
            affectedVotes: cluster?.affectedVotes,
            fraudScore: fraudAnalysis?.fraudScore,
            source: 'claude_ai_fraud_detection'
          },
          auto_response_enabled: true
        });
      });

      // Create alert for organized fraud attempts
      if (fraudAnalysis?.organizedFraudAttempts?.length > 0) {
        alerts?.push({
          category: 'fraud_detection',
          severity: 'critical',
          title: 'Organized Fraud Attempt Detected',
          message: `${fraudAnalysis?.organizedFraudAttempts?.length} organized fraud patterns identified with ${fraudAnalysis?.fraudScore}% fraud score.`,
          metadata: {
            electionId,
            fraudAttempts: fraudAnalysis?.organizedFraudAttempts,
            fraudScore: fraudAnalysis?.fraudScore,
            source: 'claude_ai_fraud_detection'
          },
          auto_response_enabled: true
        });
      }

      if (alerts?.length > 0) {
        const { error } = await supabase
          ?.from('system_alerts')
          ?.insert(alerts);

        if (error) throw error;
      }

      return { success: true, alertsCreated: alerts?.length };
    } catch (error) {
      console.error('Error flagging suspicious clusters:', error);
      return { success: false, error: error?.message };
    }
  },

  async storeFraudAnalysis(fraudAnalysis, electionId) {
    try {
      const { error } = await supabase
        ?.from('gamified_fraud_analyses')
        ?.insert({
          election_id: electionId,
          fraud_score: fraudAnalysis?.fraudScore,
          risk_level: fraudAnalysis?.riskLevel,
          suspicious_clusters: fraudAnalysis?.suspiciousClusters,
          manipulation_indicators: fraudAnalysis?.manipulationIndicators,
          organized_fraud_attempts: fraudAnalysis?.organizedFraudAttempts,
          bot_activity_score: fraudAnalysis?.botActivityScore,
          account_farming_indicators: fraudAnalysis?.accountFarmingIndicators,
          sybil_attack_probability: fraudAnalysis?.sybilAttackProbability,
          recommendations: fraudAnalysis?.recommendations,
          confidence: fraudAnalysis?.confidence,
          reasoning: fraudAnalysis?.reasoning,
          analyzed_at: fraudAnalysis?.analyzedAt
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing fraud analysis:', error);
      return { success: false, error: error?.message };
    }
  },

  async getFraudAnalysisHistory(electionId, limit = 10) {
    try {
      const { data, error } = await supabase
        ?.from('gamified_fraud_analyses')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('analyzed_at', { ascending: false })
        ?.limit(limit);

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getLatestFraudAnalysis(electionId) {
    try {
      const { data, error } = await supabase
        ?.from('gamified_fraud_analyses')
        ?.select('*')
        ?.eq('election_id', electionId)
        ?.order('analyzed_at', { ascending: false })
        ?.limit(1)
        ?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};
