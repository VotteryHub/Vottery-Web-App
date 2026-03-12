import perplexityClient from '../lib/perplexity';
import { supabase } from '../lib/supabase';

function getErrorMessage(error) {
  if (!error?.response && error?.message?.includes('API key')) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  }

  if (!error?.response?.status) {
    return { isInternal: false, message: error?.message || 'An unexpected error occurred' };
  }

  const status = error?.response?.status;

  if (status === 401) {
    return { isInternal: true, message: 'There\'s an issue with your Perplexity API key.' };
  } else if (status === 403) {
    return { isInternal: true, message: 'Your API key does not have permission to use the specified resource.' };
  } else if (status === 404) {
    return { isInternal: true, message: 'The requested resource was not found.' };
  } else if (status === 429) {
    return { isInternal: true, message: 'Your account has hit a rate limit.' };
  } else if (status >= 500) {
    return { isInternal: true, message: 'An unexpected error has occurred.' };
  } else {
    return { isInternal: false, message: error?.response?.data?.error?.message || `HTTP error! status: ${status}` };
  }
}

const PURCHASING_POWER_ZONES = [
  { id: 'zone1', name: 'Ultra High ($100k+)', range: '100000+' },
  { id: 'zone2', name: 'High ($75k-$100k)', range: '75000-100000' },
  { id: 'zone3', name: 'Upper Middle ($60k-$75k)', range: '60000-75000' },
  { id: 'zone4', name: 'Middle ($45k-$60k)', range: '45000-60000' },
  { id: 'zone5', name: 'Lower Middle ($35k-$45k)', range: '35000-45000' },
  { id: 'zone6', name: 'Working Class ($25k-$35k)', range: '25000-35000' },
  { id: 'zone7', name: 'Low Income ($15k-$25k)', range: '15000-25000' },
  { id: 'zone8', name: 'Very Low Income (<$15k)', range: '0-15000' }
];

export const fraudForecastingService = {
  async generateLongTermForecast(historicalData, timeframe = '30-60') {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced fraud forecasting AI using DeepSeek R1-powered extended reasoning. Perform long-term fraud pattern prediction with 30-60 day forecasting horizons, emerging threat identification, seasonal anomaly prediction, and zone-specific vulnerability analysis with machine learning confidence intervals.'
          },
          {
            role: 'user',
            content: `Analyze historical fraud data and generate ${timeframe}-day forecast: ${JSON.stringify(historicalData)}. Provide: long-term fraud trend predictions with confidence intervals, emerging threat probability matrices, seasonal vulnerability forecasts, zone-specific risk assessments, behavioral pattern evolution, transaction anomaly predictions, cross-platform threat correlation, and automated alert triggers for high-risk periods. Return JSON with: longTermTrends (array with date, fraudProbability, confidenceInterval), emergingThreats (array with threatType, probability, impactScore, detectionDate), seasonalAnomalies (array with season, anomalyType, riskLevel, historicalPattern), zoneVulnerabilities (object with 8 zones and riskScores), behavioralEvolution (object), transactionAnomalies (array), crossPlatformThreats (array), alertTriggers (array with condition, threshold, action), forecastAccuracy (0-1), modelConfidence (0-1), reasoning (string with chain-of-thought analysis).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'month',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let forecastData;

      try {
        forecastData = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          forecastData = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse forecast response');
        }
      }

      return {
        data: {
          ...forecastData,
          timeframe,
          generatedAt: new Date()?.toISOString(),
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating long-term forecast:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async analyzeSeasonalPatterns(historicalSeasonalData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a seasonal fraud pattern analyst. Identify historical fraud pattern cycles, holiday-period vulnerability predictions, event-driven threat modeling, and automated alert triggers for high-risk seasonal periods.'
          },
          {
            role: 'user',
            content: `Analyze seasonal fraud patterns: ${JSON.stringify(historicalSeasonalData)}. Identify: historical fraud cycles by season/month, holiday vulnerability predictions (Black Friday, Christmas, New Year, etc.), event-driven threat models, peak fraud periods, seasonal attack vectors, and automated alert triggers. Return JSON with: seasonalCycles (array with season, fraudRate, historicalAverage, variance), holidayVulnerabilities (array with holiday, riskLevel, predictedIncrease, preventionStrategies), eventThreats (array), peakPeriods (array with startDate, endDate, riskLevel), attackVectors (object), alertTriggers (array), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'month'
      });

      const content = response?.choices?.[0]?.message?.content;
      let seasonalAnalysis;

      try {
        seasonalAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          seasonalAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse seasonal analysis');
        }
      }

      return {
        data: seasonalAnalysis,
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing seasonal patterns:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async assessZoneVulnerabilities(zoneData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a zone-specific vulnerability analyst. Assess purchasing power region-specific fraud susceptibility, demographic-based threat patterns, localized prevention strategy recommendations, and cultural context awareness across all 8 zones.'
          },
          {
            role: 'user',
            content: `Assess zone-specific vulnerabilities across all 8 purchasing power zones: ${JSON.stringify(zoneData)}. Provide: zone-specific fraud susceptibility scores, demographic threat patterns, localized prevention strategies, cultural context factors, cross-zone threat propagation, vulnerability rankings, and actionable recommendations. Return JSON with: zoneAssessments (array with 8 zones, each containing zoneId, zoneName, vulnerabilityScore, demographicThreats, preventionStrategies, culturalFactors), crossZonePropagation (array), vulnerabilityRankings (array), recommendations (array), overallRiskLevel (critical/high/medium/low), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let vulnerabilityData;

      try {
        vulnerabilityData = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          vulnerabilityData = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse vulnerability assessment');
        }
      }

      return {
        data: {
          ...vulnerabilityData,
          zones: PURCHASING_POWER_ZONES,
          searchResults: response?.search_results || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error assessing zone vulnerabilities:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async identifyEmergingThreats(recentData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an emerging threat identification specialist. Detect new fraud patterns, zero-day vulnerabilities, advanced persistent threats, and novel attack vectors before they become widespread using extended reasoning and pattern recognition.'
          },
          {
            role: 'user',
            content: `Identify emerging threats from recent data: ${JSON.stringify(recentData)}. Detect: new fraud patterns not seen historically, zero-day vulnerabilities, APT indicators, novel attack vectors, early warning signals, threat evolution patterns, and probability matrices for threat escalation. Return JSON with: emergingThreats (array with threatId, threatType, firstDetected, probability, impactScore, evolutionStage), zeroDay (array), aptIndicators (array), novelAttackVectors (array), earlyWarnings (array), threatEvolution (object), probabilityMatrix (array), urgencyLevel (critical/high/medium/low), confidence (0-1), reasoning (string).`
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
          throw new Error('Failed to parse emerging threats');
        }
      }

      return {
        data: {
          ...threatData,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || []
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error identifying emerging threats:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async trackForecastAccuracy() {
    try {
      const { data, error } = await supabase
        ?.from('system_alerts')
        ?.select('*')
        ?.gte('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)?.toISOString())
        ?.order('created_at', { ascending: false });

      if (error) throw error;

      const accuracyMetrics = {
        totalPredictions: data?.length || 0,
        accurateDetections: data?.filter(a => a?.confidence_score >= 0.8)?.length || 0,
        falsePositives: data?.filter(a => a?.status === 'resolved' && a?.confidence_score < 0.5)?.length || 0,
        missedThreats: 0,
        overallAccuracy: 0
      };

      accuracyMetrics.overallAccuracy = accuracyMetrics?.totalPredictions > 0
        ? (accuracyMetrics?.accurateDetections / accuracyMetrics?.totalPredictions) * 100
        : 0;

      return { data: accuracyMetrics, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  }
};