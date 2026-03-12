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

export const perplexityFraudPreventionService = {
  async detectAnomalies(votingData, historicalBaseline) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an advanced fraud detection analyst using extended reasoning for pattern recognition. Identify unusual winner distributions, coordinated voting behaviors, and statistical outliers with contextual analysis and threat classification.'
          },
          {
            role: 'user',
            content: `Detect anomalies in voting data: ${JSON.stringify(votingData)}. Historical baseline: ${JSON.stringify(historicalBaseline)}. Identify: unusualWinnerPatterns (array with pattern, frequency, deviationScore, suspicionLevel), coordinatedBehaviors (timing patterns, user clusters, coordination indicators), statisticalOutliers (outliers with z-scores and significance), contextualAnalysis (environmental factors explaining anomalies), threatClassification (severity levels: critical/high/medium/low), falsePositiveRisk (likelihood of false alarm 0-1), confidenceScore (0-1), reasoning (detailed anomaly detection logic). Return as JSON.`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let anomalyAnalysis;

      try {
        anomalyAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          anomalyAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse anomaly detection response');
        }
      }

      return {
        data: {
          ...anomalyAnalysis,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || [],
          detectedAt: new Date()?.toISOString()
        },
        error: null
      };
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

  async analyzeGeographicClustering(locationData, votingPatterns) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a geographic fraud analyst specializing in location-based fraud detection. Analyze suspicious voting patterns, IP correlation, and location-based fraud indicators with automated alert triggers.'
          },
          {
            role: 'user',
            content: `Analyze geographic clustering: Location data: ${JSON.stringify(locationData)}. Voting patterns: ${JSON.stringify(votingPatterns)}. Provide: clusteringHeatmap (geographic hotspots with coordinates and intensity), ipCorrelation (IP address patterns and suspicious correlations), locationFraudIndicators (indicators with severity and evidence), concentratedActivities (unusual geographic concentrations), vpnProxyDetection (detected VPN/proxy usage patterns), automatedAlerts (triggered alerts with thresholds and actions), confidenceScore (0-1), reasoning (geographic analysis methodology). Return as JSON.`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let geoAnalysis;

      try {
        geoAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          geoAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse geographic clustering response');
        }
      }

      return {
        data: {
          ...geoAnalysis,
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
        console.error('Error analyzing geographic clustering:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async detectCollusion(userRelationships, votingBehaviors) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a collusion detection specialist using network analysis and behavioral correlation algorithms. Identify coordinated fraud attempts with evidence collection and investigation workflows.'
          },
          {
            role: 'user',
            content: `Detect collusion patterns: User relationships: ${JSON.stringify(userRelationships)}. Voting behaviors: ${JSON.stringify(votingBehaviors)}. Identify: networkAnalysis (user relationship graphs with connection strength), coordinatedTiming (synchronized voting patterns with timing correlation), behavioralCorrelation (correlated behaviors with correlation coefficients), collusionEvidence (evidence items with strength and type), investigationWorkflow (recommended investigation steps), suspiciousGroups (identified groups with members and activity patterns), confidenceScore (0-1), reasoning (collusion detection logic). Return as JSON.`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let collusionAnalysis;

      try {
        collusionAnalysis = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          collusionAnalysis = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse collusion detection response');
        }
      }

      return {
        data: {
          ...collusionAnalysis,
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
        console.error('Error detecting collusion:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async generateEscalationWorkflow(threatData, severity) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an incident response coordinator specializing in automated escalation protocols. Generate comprehensive response workflows with severity-based routing and stakeholder notifications.'
          },
          {
            role: 'user',
            content: `Generate escalation workflow for threat: ${JSON.stringify(threatData)}. Severity: ${severity}. Provide: automatedResponses (immediate actions with triggers and execution steps), accountActions (account freezing, suspension, or monitoring recommendations), transactionBlocking (blocked transaction types and criteria), stakeholderNotifications (notification recipients, channels, and message templates), severityRouting (escalation paths by severity level), auditTrail (audit log entries and compliance documentation), timelineActions (time-based action sequence), confidenceScore (0-1), reasoning (escalation logic). Return as JSON.`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let escalationWorkflow;

      try {
        escalationWorkflow = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          escalationWorkflow = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse escalation workflow response');
        }
      }

      // Execute automated alerts if critical severity
      if (severity === 'critical' && escalationWorkflow?.stakeholderNotifications) {
        for (const notification of escalationWorkflow?.stakeholderNotifications) {
          await alertService?.createAlert({
            type: 'fraud_critical',
            severity: 'critical',
            message: notification?.message,
            metadata: { threat: threatData, workflow: escalationWorkflow }
          });
        }
      }

      return {
        data: {
          ...escalationWorkflow,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || [],
          generatedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating escalation workflow:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async predictiveThreatModeling(historicalThreats, currentContext) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a predictive threat modeling expert using machine learning and pattern recognition. Forecast emerging threats and optimize detection algorithms.'
          },
          {
            role: 'user',
            content: `Predict future threats: Historical threats: ${JSON.stringify(historicalThreats)}. Current context: ${JSON.stringify(currentContext)}. Provide: emergingThreats (predicted threats with probability and timeline), threatEvolution (how threats are evolving), vulnerabilityAssessment (system vulnerabilities with exploitation likelihood), mlOptimization (recommendations for improving detection algorithms), preventiveMeasures (proactive security measures), riskScore (overall risk 0-100), confidenceScore (0-1), reasoning (predictive modeling methodology). Return as JSON.`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'month',
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let threatModel;

      try {
        threatModel = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          threatModel = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse threat modeling response');
        }
      }

      return {
        data: {
          ...threatModel,
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
        console.error('Error in predictive threat modeling:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  }
};

export default perplexityFraudPreventionService;