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

export const enhancedPredictiveThreatService = {
  async extendedReasoningForecast(historicalData, timeframe = '30-90-days') {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an elite threat intelligence analyst with extended reasoning capabilities. Use DeepSeek R1-powered chain-of-thought analysis to predict fraud patterns 30-90 days ahead with cross-domain threat correlation, seasonal anomaly modeling, and automated mitigation workflow generation.'
          },
          {
            role: 'user',
            content: `Perform extended reasoning analysis on historical fraud data: ${JSON.stringify(historicalData)}. Generate ${timeframe} predictive forecast with: 1) Fraud pattern predictions with confidence intervals, 2) Cross-domain threat correlations (payment fraud, identity theft, account takeover, synthetic identity), 3) Seasonal anomaly modeling, 4) Emerging threat vector detection, 5) Automated mitigation workflows, 6) Regulatory compliance forecasting. Return JSON with: extendedForecast (array with timeframe, threatType, probability, confidenceInterval), crossDomainCorrelations (array), seasonalAnomalies (array), emergingVectors (array), mitigationWorkflows (array with steps), regulatoryImpact (object), reasoning (string with chain-of-thought).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'month',
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
          throw new Error('Failed to parse extended reasoning forecast');
        }
      }

      return {
        data: {
          ...forecastAnalysis,
          searchResults: response?.search_results || [],
          relatedQuestions: response?.related_questions || [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('Error in extended reasoning forecast:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async crossDomainThreatCorrelation(threatData) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a cross-domain threat correlation specialist. Analyze threat patterns across payment fraud, identity theft, account takeover, synthetic identity fraud, and social engineering to identify hidden correlations and attack chain sequences.'
          },
          {
            role: 'user',
            content: `Analyze cross-domain threat correlations: ${JSON.stringify(threatData)}. Identify: 1) Attack chain sequences, 2) Cross-platform indicators, 3) Shared infrastructure patterns, 4) Coordinated campaign signatures, 5) Attribution confidence. Return JSON with: correlations (array with domains, linkageStrength, sharedIndicators), attackChains (array), coordinatedCampaigns (array), attributionAnalysis (object), threatActorProfiles (array), reasoning (string).`
          }
        ],
        temperature: 0.3,
        searchRecencyFilter: 'week',
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
          throw new Error('Failed to parse correlation analysis');
        }
      }

      return {
        data: {
          ...correlationAnalysis,
          searchResults: response?.search_results || [],
          analyzedAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('Error in cross-domain correlation:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async automatedMitigationWorkflow(threatAnalysis) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an automated threat mitigation architect. Generate step-by-step mitigation workflows with automated response actions, stakeholder notifications, and compliance documentation.'
          },
          {
            role: 'user',
            content: `Generate automated mitigation workflow for threat: ${JSON.stringify(threatAnalysis)}. Create: 1) Immediate response actions, 2) Investigation procedures, 3) Stakeholder notification cascade, 4) Evidence preservation steps, 5) Compliance documentation requirements, 6) Recovery procedures. Return JSON with: workflow (array with step, action, automation, priority, estimatedTime), notifications (array), complianceSteps (array), recoveryPlan (object), reasoning (string).`
          }
        ],
        temperature: 0.2,
        searchRecencyFilter: 'week'
      });

      const content = response?.choices?.[0]?.message?.content;
      let workflowPlan;

      try {
        workflowPlan = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          workflowPlan = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse mitigation workflow');
        }
      }

      return {
        data: {
          ...workflowPlan,
          createdAt: new Date()?.toISOString()
        },
        error: null
      };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (!errorInfo?.isInternal) {
        console.error('Error generating mitigation workflow:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async storeThreatForecast(forecastData) {
    try {
      const { data, error } = await supabase
        ?.from('threat_forecasts')
        ?.insert({
          forecast_data: forecastData,
          forecast_timeframe: forecastData?.timeframe || '30-90-days',
          threat_score: forecastData?.threatScore || 0,
          confidence_level: forecastData?.mlConfidence || 0,
          created_at: new Date()?.toISOString()
        })
        ?.select()
        ?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error storing threat forecast:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};