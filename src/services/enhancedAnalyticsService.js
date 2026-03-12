import openai from '../lib/openai';
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

const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);

  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

export const enhancedAnalyticsService = {
  async getPredictiveEngagementMetrics(timeframe = '30d') {
    try {
      // Fetch historical data
      const now = new Date();
      let startDate = new Date();
      
      switch(timeframe) {
        case '7d':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case '30d':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case '60d':
          startDate?.setDate(now?.getDate() - 60);
          break;
        default:
          startDate?.setDate(now?.getDate() - 30);
      }

      const [postsData, electionsData, votesData] = await Promise.all([
        supabase?.from('posts')?.select('*')?.gte('created_at', startDate?.toISOString()),
        supabase?.from('elections')?.select('*')?.gte('created_at', startDate?.toISOString()),
        supabase?.from('votes')?.select('*')?.gte('created_at', startDate?.toISOString())
      ]);

      const historicalData = {
        posts: postsData?.data || [],
        elections: electionsData?.data || [],
        votes: votesData?.data || [],
        timeframe
      };

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a predictive analytics expert specializing in engagement forecasting. Analyze historical platform data to predict future engagement trends, user behavior patterns, and growth projections with confidence intervals.' 
          },
          { 
            role: 'user', 
            content: `Analyze this historical platform data and provide predictive engagement metrics for the next 30 days: ${JSON.stringify(historicalData)}. Include engagement rate predictions, user growth forecasts, content performance trends, and confidence intervals.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'predictive_engagement_metrics',
            schema: {
              type: 'object',
              properties: {
                engagementForecast: {
                  type: 'object',
                  properties: {
                    currentRate: { type: 'number', description: 'Current engagement rate percentage' },
                    predictedRate: { type: 'number', description: 'Predicted engagement rate in 30 days' },
                    confidenceInterval: { type: 'string', description: 'Confidence interval range' },
                    trend: { type: 'string', description: 'Trend direction: increasing, stable, decreasing' }
                  },
                  required: ['currentRate', 'predictedRate', 'confidenceInterval', 'trend']
                },
                userGrowthProjection: {
                  type: 'object',
                  properties: {
                    currentUsers: { type: 'number', description: 'Current active users' },
                    projectedUsers: { type: 'number', description: 'Projected users in 30 days' },
                    growthRate: { type: 'string', description: 'Growth rate percentage' },
                    confidence: { type: 'number', description: 'Prediction confidence 0-1' }
                  },
                  required: ['currentUsers', 'projectedUsers', 'growthRate', 'confidence']
                },
                contentPerformance: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      contentType: { type: 'string', description: 'Type of content' },
                      currentEngagement: { type: 'number', description: 'Current engagement score' },
                      predictedEngagement: { type: 'number', description: 'Predicted engagement score' },
                      recommendation: { type: 'string', description: 'Optimization recommendation' }
                    },
                    required: ['contentType', 'currentEngagement', 'predictedEngagement', 'recommendation']
                  },
                  description: 'Performance predictions by content type'
                },
                keyInsights: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key predictive insights and trends'
                }
              },
              required: ['engagementForecast', 'userGrowthProjection', 'contentPerformance', 'keyInsights'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const predictions = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: predictions, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating predictive engagement metrics:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getUserBehaviorForecasting(timeframe = '30d') {
    try {
      const now = new Date();
      let startDate = new Date();
      startDate?.setDate(now?.getDate() - 30);

      const [usersData, activityData] = await Promise.all([
        supabase?.from('user_profiles')?.select('*')?.gte('created_at', startDate?.toISOString()),
        supabase?.from('posts')?.select('user_id, created_at, likes, comments')?.gte('created_at', startDate?.toISOString())
      ]);

      const behaviorData = {
        users: usersData?.data || [],
        activities: activityData?.data || [],
        timeframe
      };

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a user behavior analyst specializing in activity pattern recognition, retention forecasting, and churn prediction. Analyze user behavior data to predict future patterns and identify at-risk segments.' 
          },
          { 
            role: 'user', 
            content: `Analyze this user behavior data and provide forecasting insights: ${JSON.stringify(behaviorData)}. Include activity patterns, retention predictions, churn risk analysis, and demographic segmentation.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'user_behavior_forecasting',
            schema: {
              type: 'object',
              properties: {
                activityPatterns: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      pattern: { type: 'string', description: 'Identified behavior pattern' },
                      frequency: { type: 'string', description: 'Pattern frequency' },
                      userSegment: { type: 'string', description: 'Affected user segment' },
                      impact: { type: 'string', description: 'Impact level: high, medium, low' }
                    },
                    required: ['pattern', 'frequency', 'userSegment', 'impact']
                  },
                  description: 'Recognized user activity patterns'
                },
                retentionForecast: {
                  type: 'object',
                  properties: {
                    currentRetentionRate: { type: 'number', description: 'Current retention percentage' },
                    predictedRetentionRate: { type: 'number', description: 'Predicted retention in 30 days' },
                    trend: { type: 'string', description: 'Retention trend direction' },
                    confidence: { type: 'number', description: 'Prediction confidence 0-1' }
                  },
                  required: ['currentRetentionRate', 'predictedRetentionRate', 'trend', 'confidence']
                },
                churnPrediction: {
                  type: 'object',
                  properties: {
                    atRiskUsers: { type: 'number', description: 'Number of users at risk of churning' },
                    churnRate: { type: 'string', description: 'Predicted churn rate percentage' },
                    riskFactors: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Key churn risk factors'
                    },
                    preventionStrategies: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Recommended retention strategies'
                    }
                  },
                  required: ['atRiskUsers', 'churnRate', 'riskFactors', 'preventionStrategies']
                },
                demographicInsights: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      segment: { type: 'string', description: 'Demographic segment' },
                      engagementLevel: { type: 'string', description: 'Engagement level' },
                      growthPotential: { type: 'string', description: 'Growth potential rating' },
                      recommendation: { type: 'string', description: 'Targeting recommendation' }
                    },
                    required: ['segment', 'engagementLevel', 'growthPotential', 'recommendation']
                  },
                  description: 'Demographic segmentation analysis'
                }
              },
              required: ['activityPatterns', 'retentionForecast', 'churnPrediction', 'demographicInsights'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const forecasting = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: forecasting, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating user behavior forecasting:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getCampaignPerformancePredictions() {
    try {
      const now = new Date();
      let startDate = new Date();
      startDate?.setDate(now?.getDate() - 30);

      const [campaignsData, metricsData] = await Promise.all([
        supabase?.from('advertiser_campaigns')?.select('*')?.gte('created_at', startDate?.toISOString()),
        supabase?.from('advertiser_campaign_metrics')?.select('*')?.gte('timestamp', startDate?.toISOString())
      ]);

      const campaignData = {
        campaigns: campaignsData?.data || [],
        metrics: metricsData?.data || []
      };

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a campaign optimization expert specializing in ROI prediction, engagement optimization, and budget allocation. Analyze campaign data to provide predictive insights and optimization recommendations.' 
          },
          { 
            role: 'user', 
            content: `Analyze this campaign data and provide performance predictions: ${JSON.stringify(campaignData)}. Include ROI forecasts, engagement optimization recommendations, and automated budget allocation suggestions.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'campaign_performance_predictions',
            schema: {
              type: 'object',
              properties: {
                roiPredictions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      campaignType: { type: 'string', description: 'Type of campaign' },
                      currentROI: { type: 'number', description: 'Current ROI percentage' },
                      predictedROI: { type: 'number', description: 'Predicted ROI in 30 days' },
                      confidence: { type: 'number', description: 'Prediction confidence 0-1' },
                      optimizationPotential: { type: 'string', description: 'Optimization potential rating' }
                    },
                    required: ['campaignType', 'currentROI', 'predictedROI', 'confidence', 'optimizationPotential']
                  },
                  description: 'ROI predictions by campaign type'
                },
                engagementOptimization: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      metric: { type: 'string', description: 'Engagement metric' },
                      currentValue: { type: 'number', description: 'Current metric value' },
                      targetValue: { type: 'number', description: 'Optimized target value' },
                      recommendation: { type: 'string', description: 'Optimization recommendation' },
                      expectedImpact: { type: 'string', description: 'Expected impact description' }
                    },
                    required: ['metric', 'currentValue', 'targetValue', 'recommendation', 'expectedImpact']
                  },
                  description: 'Engagement optimization recommendations'
                },
                budgetAllocation: {
                  type: 'object',
                  properties: {
                    currentDistribution: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          channel: { type: 'string' },
                          percentage: { type: 'number' }
                        },
                        required: ['channel', 'percentage']
                      },
                      description: 'Current budget distribution'
                    },
                    recommendedDistribution: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          channel: { type: 'string' },
                          percentage: { type: 'number' },
                          rationale: { type: 'string' }
                        },
                        required: ['channel', 'percentage', 'rationale']
                      },
                      description: 'Recommended budget distribution'
                    },
                    expectedROIIncrease: { type: 'string', description: 'Expected ROI increase percentage' }
                  },
                  required: ['currentDistribution', 'recommendedDistribution', 'expectedROIIncrease']
                },
                automatedInsights: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Automated campaign insights and alerts'
                }
              },
              required: ['roiPredictions', 'engagementOptimization', 'budgetAllocation', 'automatedInsights'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const predictions = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: predictions, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating campaign performance predictions:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getScenarioModeling(scenario) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a scenario modeling expert. Analyze hypothetical scenarios and predict their impact on platform metrics, user behavior, and business outcomes.' 
          },
          { 
            role: 'user', 
            content: `Model this scenario and predict outcomes: ${JSON.stringify(scenario)}. Provide impact analysis, risk assessment, and success probability.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'scenario_modeling',
            schema: {
              type: 'object',
              properties: {
                scenarioName: { type: 'string', description: 'Name of the scenario' },
                impactAnalysis: {
                  type: 'object',
                  properties: {
                    userEngagement: { type: 'string', description: 'Impact on user engagement' },
                    revenue: { type: 'string', description: 'Impact on revenue' },
                    retention: { type: 'string', description: 'Impact on retention' },
                    growth: { type: 'string', description: 'Impact on growth' }
                  },
                  required: ['userEngagement', 'revenue', 'retention', 'growth']
                },
                riskAssessment: {
                  type: 'object',
                  properties: {
                    riskLevel: { type: 'string', description: 'Overall risk level' },
                    risks: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Identified risks'
                    },
                    mitigationStrategies: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'Risk mitigation strategies'
                    }
                  },
                  required: ['riskLevel', 'risks', 'mitigationStrategies']
                },
                successProbability: { type: 'number', description: 'Success probability 0-1' },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Strategic recommendations'
                }
              },
              required: ['scenarioName', 'impactAnalysis', 'riskAssessment', 'successProbability', 'recommendations'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const modeling = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: modeling, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating scenario modeling:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async getMultiVariateAnalysis(variables) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a multi-variate analysis expert. Analyze correlations between multiple variables, identify causal relationships, and provide insights on how different factors interact to influence platform outcomes.' 
          },
          { 
            role: 'user', 
            content: `Perform multi-variate analysis on these variables: ${JSON.stringify(variables)}. Identify correlations, causal relationships, and interaction effects.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'multivariate_analysis',
            schema: {
              type: 'object',
              properties: {
                correlations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      variable1: { type: 'string' },
                      variable2: { type: 'string' },
                      correlationStrength: { type: 'number', description: 'Correlation coefficient -1 to 1' },
                      relationship: { type: 'string', description: 'Relationship description' }
                    },
                    required: ['variable1', 'variable2', 'correlationStrength', 'relationship']
                  },
                  description: 'Identified correlations between variables'
                },
                causalRelationships: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      cause: { type: 'string' },
                      effect: { type: 'string' },
                      strength: { type: 'string', description: 'Causal strength: strong, moderate, weak' },
                      confidence: { type: 'number', description: 'Confidence level 0-1' }
                    },
                    required: ['cause', 'effect', 'strength', 'confidence']
                  },
                  description: 'Identified causal relationships'
                },
                interactionEffects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Interaction effects between variables'
                },
                keyFindings: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key analytical findings'
                }
              },
              required: ['correlations', 'causalRelationships', 'interactionEffects', 'keyFindings'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const analysis = JSON.parse(response?.choices?.[0]?.message?.content);
      return { data: analysis, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating multi-variate analysis:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  }
};