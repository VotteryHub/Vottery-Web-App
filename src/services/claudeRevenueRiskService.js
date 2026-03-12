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

const PURCHASING_POWER_ZONES = [
  { id: 'zone_1', name: 'Ultra High ($100k+)', range: '100000+' },
  { id: 'zone_2', name: 'High ($75k-$100k)', range: '75000-100000' },
  { id: 'zone_3', name: 'Upper Middle ($60k-$75k)', range: '60000-75000' },
  { id: 'zone_4', name: 'Middle ($45k-$60k)', range: '45000-60000' },
  { id: 'zone_5', name: 'Lower Middle ($35k-$45k)', range: '35000-45000' },
  { id: 'zone_6', name: 'Working Class ($25k-$35k)', range: '25000-35000' },
  { id: 'zone_7', name: 'Low Income ($15k-$25k)', range: '15000-25000' },
  { id: 'zone_8', name: 'Very Low Income (<$15k)', range: '0-15000' }
];

export const claudeRevenueRiskService = {
  async forecastRevenueTrends(forecastPeriod = '30-90-day') {
    try {
      const zoneData = await this.gatherZoneRevenueData();
      let forecast = await this.performClaudeRevenueForecast(zoneData, forecastPeriod);
      await this.storeForecastResults(forecast, 'revenue_trends');
      return { data: forecast, error: null };
    } catch (error) {
      console.error('Error forecasting revenue trends:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async predictUserChurn() {
    try {
      const userData = await this.gatherUserBehaviorData();
      const churnPrediction = await this.performClaudeChurnAnalysis(userData);
      await this.storeChurnPredictions(churnPrediction);
      return { data: churnPrediction, error: null };
    } catch (error) {
      console.error('Error predicting user churn:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async analyzeFraudRiskPatterns() {
    try {
      const fraudData = await this.gatherFraudData();
      const riskAnalysis = await this.performClaudeFraudRiskAnalysis(fraudData);
      await this.storeFraudRiskAnalysis(riskAnalysis);
      return { data: riskAnalysis, error: null };
    } catch (error) {
      console.error('Error analyzing fraud risk patterns:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async gatherZoneRevenueData() {
    try {
      const zoneData = {};

      for (const zone of PURCHASING_POWER_ZONES) {
        const { data: financialTracking } = await supabase
          ?.from('financial_tracking')
          ?.select('*')
          ?.eq('zone', zone?.id)
          ?.gte('recorded_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString())
          ?.order('recorded_at', { ascending: true });

        const { data: zonePerformance } = await supabase
          ?.from('zone_performance_metrics')
          ?.select('*')
          ?.eq('zone', zone?.id)
          ?.order('created_at', { ascending: false })
          ?.limit(1);

        const { data: sponsoredElections } = await supabase
          ?.from('sponsored_elections')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString());

        zoneData[zone?.id] = {
          zone: zone,
          financialHistory: financialTracking || [],
          currentPerformance: zonePerformance?.[0] || null,
          sponsoredElections: sponsoredElections || [],
          totalRevenue: this.calculateTotalRevenue(financialTracking),
          revenueGrowthRate: this.calculateGrowthRate(financialTracking)
        };
      }

      return zoneData;
    } catch (error) {
      console.error('Error gathering zone revenue data:', error);
      throw error;
    }
  },

  async gatherUserBehaviorData() {
    try {
      const userData = {};

      for (const zone of PURCHASING_POWER_ZONES) {
        const { data: users } = await supabase
          ?.from('user_profiles')
          ?.select('id, created_at, last_login')
          ?.eq('zone_identifier', zone?.id);

        const { data: votes } = await supabase
          ?.from('votes')
          ?.select('user_id, created_at')
          ?.in('user_id', users?.map(u => u?.id) || [])
          ?.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString());

        const { data: gamification } = await supabase
          ?.from('user_gamification')
          ?.select('*')
          ?.in('user_id', users?.map(u => u?.id) || []);

        userData[zone?.id] = {
          zone: zone,
          totalUsers: users?.length || 0,
          activeUsers: this.calculateActiveUsers(users, votes),
          engagementMetrics: this.calculateEngagementMetrics(votes, gamification),
          churnRisk: this.calculateChurnRisk(users, votes)
        };
      }

      return userData;
    } catch (error) {
      console.error('Error gathering user behavior data:', error);
      throw error;
    }
  },

  async gatherFraudData() {
    try {
      const fraudData = {};

      for (const zone of PURCHASING_POWER_ZONES) {
        const { data: fraudAnalyses } = await supabase
          ?.from('gamified_fraud_analyses')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString());

        const { data: incidents } = await supabase
          ?.from('incident_response_workflows')
          ?.select('*')
          ?.eq('zone_identifier', zone?.id)
          ?.eq('incident_category', 'financial_fraud')
          ?.gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)?.toISOString());

        fraudData[zone?.id] = {
          zone: zone,
          fraudAnalyses: fraudAnalyses || [],
          incidents: incidents || [],
          fraudScore: this.calculateAverageFraudScore(fraudAnalyses),
          incidentTrend: this.calculateIncidentTrend(incidents)
        };
      }

      return fraudData;
    } catch (error) {
      console.error('Error gathering fraud data:', error);
      throw error;
    }
  },

  async performClaudeRevenueForecast(zoneData, forecastPeriod) {
    try {
      const systemPrompt = `You are an advanced financial forecasting AI specializing in revenue trend analysis across 8 purchasing power zones. Analyze historical revenue data including participation fees, advertiser spending, and prize distributions to predict 30-60-90 day revenue trends with confidence scoring and seasonal adjustments.`;

      const userPrompt = `Forecast revenue trends across 8 purchasing power zones:

${JSON.stringify(zoneData, null, 2)}

Forecast Period: ${forecastPeriod}

Provide:
1. 30-day revenue forecast per zone with confidence score (0-100)
2. 60-day revenue forecast per zone with confidence score
3. 90-day revenue forecast per zone with confidence score
4. Revenue growth predictions (percentage increase/decrease)
5. Seasonal adjustment factors
6. Market condition modeling (economic indicators impact)
7. Risk factors affecting forecasts
8. Optimization recommendations per zone

Return forecast in JSON format:
{
  "overallForecast": {"30day": 0, "60day": 0, "90day": 0},
  "zoneForecast s": {
    "zone_1": {
      "30day": {"revenue": 0, "confidence": 0-100, "growthRate": 0},
      "60day": {"revenue": 0, "confidence": 0-100, "growthRate": 0},
      "90day": {"revenue": 0, "confidence": 0-100, "growthRate": 0}
    },
    ...
  },
  "seasonalAdjustments": [{"zone": "", "factor": 0, "reason": ""}],
  "marketConditions": {"economicIndicators": [], "impact": ""},
  "riskFactors": [{"zone": "", "risk": "", "impact": ""}],
  "recommendations": [{"zone": "", "action": "", "expectedImpact": ""}],
  "confidence": 0-1,
  "reasoning": "detailed explanation"
}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const forecastText = response?.content?.[0]?.text;
      let forecast;

      try {
        forecast = JSON.parse(forecastText);
      } catch (parseError) {
        const jsonMatch = forecastText?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          forecast = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude forecast response');
        }
      }

      return {
        ...forecast,
        forecastedAt: new Date()?.toISOString(),
        forecastPeriod
      };
    } catch (error) {
      console.error('Error performing Claude revenue forecast:', error);
      throw error;
    }
  },

  async performClaudeChurnAnalysis(userData) {
    try {
      const systemPrompt = `You are a user retention specialist AI analyzing churn probability across 8 purchasing power zones. Predict user churn using behavioral patterns, engagement metrics, and demographic segmentation with intervention recommendations.`;

      const userPrompt = `Predict user churn probability across 8 zones:

${JSON.stringify(userData, null, 2)}

Provide:
1. Churn probability score per zone (0-100)
2. High-risk user segments
3. Behavioral pattern analysis
4. Intervention recommendations
5. Retention strategy suggestions
6. Demographic correlation factors
7. Engagement correlation analysis
8. 30-60-90 day churn forecasts

Return analysis in JSON format:
{
  "overallChurnRate": 0-100,
  "zoneChurnPredictions": {
    "zone_1": {
      "churnProbability": 0-100,
      "confidence": 0-100,
      "highRiskUsers": 0,
      "30dayForecast": 0,
      "60dayForecast": 0,
      "90dayForecast": 0
    },
    ...
  },
  "behavioralPatterns": [{"pattern": "", "zones": [], "churnCorrelation": 0}],
  "interventionRecommendations": [{"zone": "", "action": "", "expectedRetention": 0}],
  "retentionStrategies": [{"zone": "", "strategy": "", "priority": ""}],
  "demographicFactors": [{"factor": "", "impact": ""}],
  "engagementCorrelation": {"xpLevel": 0, "votingFrequency": 0, "streaks": 0},
  "confidence": 0-1,
  "reasoning": "detailed explanation"
}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const analysisText = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude churn analysis response');
        }
      }

      return {
        ...analysis,
        analyzedAt: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error performing Claude churn analysis:', error);
      throw error;
    }
  },

  async performClaudeFraudRiskAnalysis(fraudData) {
    try {
      const systemPrompt = `You are a fraud risk intelligence AI specializing in predictive threat modeling across 8 purchasing power zones. Analyze fraud patterns, predict emerging threats, and assess zone-specific vulnerabilities with automated alert triggers.`;

      const userPrompt = `Analyze fraud risk patterns across 8 zones:

${JSON.stringify(fraudData, null, 2)}

Provide:
1. Fraud risk score per zone (0-100)
2. Pattern evolution forecasting (30-60-90 days)
3. Zone-specific vulnerability assessments
4. Emerging threat predictions
5. Automated alert trigger recommendations
6. Mitigation strategies per zone
7. Cross-zone fraud correlation
8. Confidence intervals for predictions

Return analysis in JSON format:
{
  "overallFraudRisk": 0-100,
  "zoneFraudRisks": {
    "zone_1": {
      "riskScore": 0-100,
      "confidence": 0-100,
      "vulnerabilities": [],
      "30dayForecast": {"riskLevel": "", "probability": 0},
      "60dayForecast": {"riskLevel": "", "probability": 0},
      "90dayForecast": {"riskLevel": "", "probability": 0}
    },
    ...
  },
  "patternEvolution": [{"pattern": "", "zones": [], "trend": "", "severity": ""}],
  "emergingThreats": [{"threat": "", "zones": [], "probability": 0, "timeframe": ""}],
  "alertTriggers": [{"zone": "", "condition": "", "threshold": 0, "action": ""}],
  "mitigationStrategies": [{"zone": "", "strategy": "", "priority": ""}],
  "crossZoneCorrelation": [{"zones": [], "correlation": 0, "description": ""}],
  "confidence": 0-1,
  "reasoning": "detailed explanation"
}`;

      const response = await claude?.messages?.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const analysisText = response?.content?.[0]?.text;
      let analysis;

      try {
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        const jsonMatch = analysisText?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse Claude fraud risk analysis response');
        }
      }

      if (analysis?.overallFraudRisk >= 70) {
        await this.createFraudAlerts(analysis?.alertTriggers);
      }

      return {
        ...analysis,
        analyzedAt: new Date()?.toISOString()
      };
    } catch (error) {
      console.error('Error performing Claude fraud risk analysis:', error);
      throw error;
    }
  },

  async storeForecastResults(forecast, forecastType) {
    try {
      const records = [];

      Object.entries(forecast?.zoneForecasts || {})?.forEach(([zone, predictions]) => {
        ['30day', '60day', '90day']?.forEach(period => {
          if (predictions?.[period]) {
            records?.push({
              zone,
              forecast_type: forecastType,
              forecast_period: period,
              predicted_value: predictions?.[period]?.revenue,
              confidence_level: predictions?.[period]?.confidence >= 80 ? 'high' : predictions?.[period]?.confidence >= 60 ? 'medium' : 'low',
              confidence_score: predictions?.[period]?.confidence,
              growth_rate: predictions?.[period]?.growthRate,
              scenario_data: { seasonalAdjustments: forecast?.seasonalAdjustments, marketConditions: forecast?.marketConditions },
              optimization_recommendations: forecast?.recommendations?.filter(r => r?.zone === zone),
              valid_until: new Date(Date.now() + (period === '30day' ? 30 : period === '60day' ? 60 : 90) * 24 * 60 * 60 * 1000)?.toISOString()
            });
          }
        });
      });

      const { error } = await supabase
        ?.from('financial_forecasts')
        ?.insert(records);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing forecast results:', error);
      return { success: false, error: error?.message };
    }
  },

  async storeChurnPredictions(churnPrediction) {
    try {
      const records = [];

      Object.entries(churnPrediction?.zoneChurnPredictions || {})?.forEach(([zone, prediction]) => {
        records?.push({
          zone,
          forecast_type: 'user_churn',
          forecast_period: '30-90-day',
          predicted_value: prediction?.churnProbability,
          confidence_level: prediction?.confidence >= 80 ? 'high' : prediction?.confidence >= 60 ? 'medium' : 'low',
          confidence_score: prediction?.confidence,
          scenario_data: {
            highRiskUsers: prediction?.highRiskUsers,
            forecasts: {
              '30day': prediction?.['30dayForecast'],
              '60day': prediction?.['60dayForecast'],
              '90day': prediction?.['90dayForecast']
            },
            behavioralPatterns: churnPrediction?.behavioralPatterns,
            demographicFactors: churnPrediction?.demographicFactors
          },
          optimization_recommendations: churnPrediction?.interventionRecommendations?.filter(r => r?.zone === zone),
          valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)?.toISOString()
        });
      });

      const { error } = await supabase
        ?.from('financial_forecasts')
        ?.insert(records);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing churn predictions:', error);
      return { success: false, error: error?.message };
    }
  },

  async storeFraudRiskAnalysis(riskAnalysis) {
    try {
      const records = [];

      Object.entries(riskAnalysis?.zoneFraudRisks || {})?.forEach(([zone, risk]) => {
        records?.push({
          zone,
          forecast_type: 'fraud_risk',
          forecast_period: '30-90-day',
          predicted_value: risk?.riskScore,
          confidence_level: risk?.confidence >= 80 ? 'high' : risk?.confidence >= 60 ? 'medium' : 'low',
          confidence_score: risk?.confidence,
          scenario_data: {
            vulnerabilities: risk?.vulnerabilities,
            forecasts: {
              '30day': risk?.['30dayForecast'],
              '60day': risk?.['60dayForecast'],
              '90day': risk?.['90dayForecast']
            },
            patternEvolution: riskAnalysis?.patternEvolution,
            emergingThreats: riskAnalysis?.emergingThreats,
            crossZoneCorrelation: riskAnalysis?.crossZoneCorrelation
          },
          optimization_recommendations: riskAnalysis?.mitigationStrategies?.filter(s => s?.zone === zone),
          valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)?.toISOString()
        });
      });

      const { error } = await supabase
        ?.from('financial_forecasts')
        ?.insert(records);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error storing fraud risk analysis:', error);
      return { success: false, error: error?.message };
    }
  },

  async createFraudAlerts(alertTriggers) {
    try {
      if (!alertTriggers || alertTriggers?.length === 0) return;

      const alertRecords = alertTriggers?.map(trigger => ({
        category: 'fraud_detection',
        severity: 'high',
        title: `Fraud Risk Alert: ${trigger?.zone}`,
        message: `${trigger?.condition} - Threshold: ${trigger?.threshold}`,
        metadata: {
          zone: trigger?.zone,
          condition: trigger?.condition,
          threshold: trigger?.threshold,
          action: trigger?.action,
          autoGenerated: true,
          source: 'claude_fraud_risk_analysis'
        },
        auto_response_enabled: true
      }));

      const { error } = await supabase
        ?.from('system_alerts')
        ?.insert(alertRecords);

      if (error) throw error;
      return { success: true, alertsCreated: alertRecords?.length };
    } catch (error) {
      console.error('Error creating fraud alerts:', error);
      return { success: false, error: error?.message };
    }
  },

  calculateTotalRevenue(financialTracking) {
    if (!financialTracking || financialTracking?.length === 0) return 0;
    return financialTracking?.reduce((sum, record) => sum + parseFloat(record?.amount || 0), 0);
  },

  calculateGrowthRate(financialTracking) {
    if (!financialTracking || financialTracking?.length < 2) return 0;
    const sorted = financialTracking?.sort((a, b) => new Date(a?.recorded_at) - new Date(b?.recorded_at));
    const oldestRevenue = parseFloat(sorted?.[0]?.amount || 0);
    const latestRevenue = parseFloat(sorted?.[sorted?.length - 1]?.amount || 0);
    if (oldestRevenue === 0) return 0;
    return ((latestRevenue - oldestRevenue) / oldestRevenue) * 100;
  },

  calculateActiveUsers(users, votes) {
    if (!users || !votes) return 0;
    const activeUserIds = new Set(votes?.map(v => v?.user_id));
    return activeUserIds?.size;
  },

  calculateEngagementMetrics(votes, gamification) {
    return {
      totalVotes: votes?.length || 0,
      avgXP: gamification?.reduce((sum, g) => sum + (g?.current_xp || 0), 0) / (gamification?.length || 1),
      avgLevel: gamification?.reduce((sum, g) => sum + (g?.current_level || 0), 0) / (gamification?.length || 1)
    };
  },

  calculateChurnRisk(users, votes) {
    if (!users || users?.length === 0) return 0;
    const inactiveUsers = users?.filter(user => {
      const lastLogin = new Date(user?.last_login);
      const daysSinceLogin = (Date.now() - lastLogin?.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLogin > 30;
    });
    return (inactiveUsers?.length / users?.length) * 100;
  },

  calculateAverageFraudScore(fraudAnalyses) {
    if (!fraudAnalyses || fraudAnalyses?.length === 0) return 0;
    return fraudAnalyses?.reduce((sum, analysis) => sum + (analysis?.fraud_score || 0), 0) / fraudAnalyses?.length;
  },

  calculateIncidentTrend(incidents) {
    if (!incidents || incidents?.length < 2) return 'stable';
    const sorted = incidents?.sort((a, b) => new Date(a?.created_at) - new Date(b?.created_at));
    const midpoint = Math.floor(sorted?.length / 2);
    const firstHalf = sorted?.slice(0, midpoint)?.length;
    const secondHalf = sorted?.slice(midpoint)?.length;
    if (secondHalf > firstHalf * 1.2) return 'increasing';
    if (secondHalf < firstHalf * 0.8) return 'decreasing';
    return 'stable';
  },

  async getLatestForecasts(forecastType = null) {
    try {
      let query = supabase
        ?.from('financial_forecasts')
        ?.select('*')
        ?.gte('valid_until', new Date()?.toISOString())
        ?.order('created_at', { ascending: false });

      if (forecastType) {
        query = query?.eq('forecast_type', forecastType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data: toCamelCase(data), error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};