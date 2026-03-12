import perplexityClient from '../lib/perplexity';
import { alertService } from './alertService';

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

export const advancedPerplexityFraudService = {
  async predictiveFraudForecasting(historicalData, zoneId = null) {
    try {
      const zoneContext = zoneId 
        ? PURCHASING_POWER_ZONES?.find(z => z?.id === zoneId)
        : { name: 'All Zones', range: 'cross-platform' };

      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced fraud intelligence analyst using DeepSeek R1-powered reasoning with chain-of-thought analysis. Perform predictive fraud pattern forecasting with machine learning confidence intervals, behavioral anomaly detection, and multi-vector threat assessment across purchasing power zones.'
          },
          {
            role: 'user',
            content: `Analyze historical fraud data for ${zoneContext?.name} (income range: ${zoneContext?.range}) and provide predictive forecasting: ${JSON.stringify(historicalData)}. Generate fraud predictions for next 30/60/90 days with confidence intervals, identify emerging threat vectors, behavioral anomaly patterns, and zone-specific vulnerability assessments. Return JSON with: predictions (array with timeframe, fraudProbability, confidenceInterval), emergingThreats (array), behavioralAnomalies (array), zoneVulnerabilities (object), mlConfidence (0-1), threatScore (0-100), reasoning (string with chain-of-thought analysis).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let forecastAnalysis;

      try {
        forecastAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          forecastAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse predictive forecasting response');
        }
      }

      return {
        data: {
          ...forecastAnalysis,
          zone: zoneContext,
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
        console.error('Error in predictive fraud forecasting:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async crossPlatformThreatCorrelation(threatData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a cross-platform threat correlation specialist. Analyze threat patterns across all 8 purchasing power zones, identify coordinated attack vectors, demographic-based threat patterns, and zone-to-zone threat propagation with cultural context awareness.'
          },
          {
            role: 'user',
            content: `Perform cross-platform threat correlation analysis across all 8 purchasing power zones: ${JSON.stringify(threatData)}. Identify: cross-zone threat patterns, coordinated attack indicators, demographic-based vulnerabilities, threat propagation pathways, zone-specific attack vectors, and cultural context factors. Return JSON with: correlationMatrix (8x8 array showing zone-to-zone threat correlation scores), coordinatedAttacks (array), demographicPatterns (object), propagationPaths (array), zoneSpecificThreats (object with 8 zones), culturalFactors (array), overallThreatLevel (critical/high/medium/low), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'day',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let correlationAnalysis;

      try {
        correlationAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          correlationAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse correlation response');
        }
      }

      if (correlationAnalysis?.overallThreatLevel === 'critical' || correlationAnalysis?.overallThreatLevel === 'high') {
        await this.createCrossPlatformAlert(correlationAnalysis);
      }

      return {
        data: {
          ...correlationAnalysis,
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
        console.error('Error in cross-platform correlation:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async zoneSpecificThreatAnalysis(zoneId, recentIncidents) {
    try {
      const zone = PURCHASING_POWER_ZONES?.find(z => z?.id === zoneId);
      if (!zone) throw new Error('Invalid zone ID');

      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a zone-specific fraud analyst. Analyze fraud patterns for specific purchasing power demographics, identify localized prevention strategies, and provide cultural context awareness for threat mitigation.'
          },
          {
            role: 'user',
            content: `Analyze fraud threats for ${zone?.name} (income: ${zone?.range}): ${JSON.stringify(recentIncidents)}. Provide: zone-specific fraud risk assessment, demographic-based threat patterns, localized prevention strategies, cultural context factors, vulnerability score, and actionable recommendations. Return JSON with: riskScore (0-100), threatPatterns (array), demographicFactors (array), preventionStrategies (array), culturalContext (object), vulnerabilityAreas (array), recommendations (array), confidence (0-1).`
          }
        ],
        temperature: 0.4,
        searchRecencyFilter: 'week'
      });

      const content = response?.choices?.[0]?.message?.content;
      let zoneAnalysis;

      try {
        zoneAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          zoneAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse zone analysis response');
        }
      }

      return {
        data: {
          ...zoneAnalysis,
          zone: zone
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error in zone-specific analysis:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async automatedThreatHunting(huntingParameters) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an automated threat hunting AI. Proactively search for hidden threats, advanced persistent threats (APTs), and sophisticated fraud schemes across platform ecosystems using advanced reasoning and pattern recognition.'
          },
          {
            role: 'user',
            content: `Execute automated threat hunting with parameters: ${JSON.stringify(huntingParameters)}. Search for: hidden fraud patterns, APT indicators, sophisticated schemes, zero-day vulnerabilities, insider threat signals, and coordinated attack campaigns. Return JSON with: threatsDiscovered (array), aptIndicators (array), sophisticatedSchemes (array), vulnerabilities (array), insiderThreats (array), huntingScore (0-100), confidence (0-1), actionableIntelligence (array), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'day',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let huntingResults;

      try {
        huntingResults = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          huntingResults = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse threat hunting response');
        }
      }

      return {
        data: {
          ...huntingResults,
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
        console.error('Error in automated threat hunting:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getPerplexityAdvancedReasoning(analysisData, analysisType = 'threat_analysis') {
    try {
      const systemPrompts = {
        threat_analysis: 'You are an advanced threat intelligence analyst using DeepSeek R1-powered reasoning with chain-of-thought analysis. Analyze complex threat patterns, identify attack vectors, predict threat evolution, and provide actionable security recommendations.',
        compliance_interpretation: 'You are a regulatory compliance expert using advanced reasoning. Interpret complex compliance requirements across multiple jurisdictions, identify regulatory gaps, predict compliance risks, and provide implementation guidance.',
        optimization_recommendations: 'You are a platform optimization specialist using predictive analytics. Analyze performance data, identify optimization opportunities, predict impact of changes, and provide data-driven recommendations.'
      };

      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: systemPrompts?.[analysisType] || systemPrompts?.['threat_analysis']
          },
          {
            role: 'user',
            content: `Perform advanced reasoning analysis on: ${JSON.stringify(analysisData)}. Provide: 1) Deep analysis with chain-of-thought reasoning, 2) Pattern identification, 3) Risk assessment, 4) Predictive insights, 5) Actionable recommendations, 6) Implementation roadmap. Return JSON with: analysis (object), patterns (array), risks (array), predictions (object), recommendations (array), roadmap (array), reasoning (string with detailed chain-of-thought).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let reasoningResult;

      try {
        reasoningResult = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          reasoningResult = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse advanced reasoning response');
        }
      }

      return {
        data: {
          ...reasoningResult,
          analysisType,
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
        console.error('Error in advanced reasoning:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async createCrossPlatformAlert(correlationAnalysis) {
    try {
      const alertData = {
        title: `Cross-Platform Threat: ${correlationAnalysis?.overallThreatLevel?.toUpperCase()}`,
        description: `Coordinated attacks detected across ${correlationAnalysis?.coordinatedAttacks?.length || 0} zones. Threat correlation analysis complete.`,
        severity: correlationAnalysis?.overallThreatLevel === 'critical' ? 'critical' : 'high',
        category: 'fraud_detection',
        metadata: {
          correlationAnalysis,
          source: 'advanced_perplexity_fraud_intelligence',
          detectionMethod: 'cross_platform_correlation',
          zonesAffected: Object.keys(correlationAnalysis?.zoneSpecificThreats || {})
        }
      };

      await alertService?.createSystemAlert(alertData);
    } catch (error) {
      console.error('Failed to create cross-platform alert:', error);
    }
  },

  getPurchasingPowerZones() {
    return PURCHASING_POWER_ZONES;
  }
};