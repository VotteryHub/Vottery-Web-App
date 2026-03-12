import openai from '../lib/openai';
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

export const aiSentimentService = {
  async analyzeVoterSentiment(votingData, timeRange = '30d') {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert political analyst specializing in voter sentiment analysis. Analyze voting patterns and provide detailed sentiment insights with confidence scores.' 
          },
          { 
            role: 'user', 
            content: `Analyze voter sentiment trends for the past ${timeRange}. Voting data summary: ${JSON.stringify(votingData)}. Provide sentiment breakdown (positive, neutral, negative percentages), key themes, and confidence level.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'sentiment_analysis',
            schema: {
              type: 'object',
              properties: {
                positive: { type: 'number', description: 'Percentage of positive sentiment' },
                neutral: { type: 'number', description: 'Percentage of neutral sentiment' },
                negative: { type: 'number', description: 'Percentage of negative sentiment' },
                keyThemes: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Top 3-5 key themes identified'
                },
                confidence: { type: 'number', description: 'Confidence score 0-1' },
                trendDirection: { type: 'string', description: 'Overall trend: improving, declining, or stable' }
              },
              required: ['positive', 'neutral', 'negative', 'keyThemes', 'confidence', 'trendDirection'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'medium',
      });

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing voter sentiment:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async analyzeCampaignReactions(campaignData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a campaign strategy expert. Analyze campaign performance data and provide actionable insights on audience reactions, engagement patterns, and optimization opportunities.' 
          },
          { 
            role: 'user', 
            content: `Analyze campaign reaction data: ${JSON.stringify(campaignData)}. Provide insights on engagement quality, audience response patterns, and strategic recommendations.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'campaign_reaction_analysis',
            schema: {
              type: 'object',
              properties: {
                engagementQuality: { type: 'string', description: 'Overall engagement quality assessment' },
                topPerformingElements: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Campaign elements with highest engagement'
                },
                audienceSegments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      segment: { type: 'string' },
                      responseRate: { type: 'number' },
                      sentiment: { type: 'string' }
                    },
                    required: ['segment', 'responseRate', 'sentiment']
                  },
                  description: 'Breakdown by audience segment'
                },
                recommendations: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Strategic recommendations for optimization'
                }
              },
              required: ['engagementQuality', 'topPerformingElements', 'audienceSegments', 'recommendations'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'medium',
      });

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error analyzing campaign reactions:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async predictEngagement(historicalData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a predictive analytics expert specializing in engagement forecasting. Analyze historical engagement data and provide accurate predictions with confidence intervals.' 
          },
          { 
            role: 'user', 
            content: `Based on historical engagement data: ${JSON.stringify(historicalData)}, predict engagement metrics for the next 7 days with confidence intervals.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'engagement_prediction',
            schema: {
              type: 'object',
              properties: {
                predictions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      date: { type: 'string' },
                      predicted: { type: 'number' },
                      confidenceLow: { type: 'number' },
                      confidenceHigh: { type: 'number' }
                    },
                    required: ['date', 'predicted', 'confidenceLow', 'confidenceHigh']
                  },
                  description: '7-day engagement predictions'
                },
                overallTrend: { type: 'string', description: 'Overall trend direction' },
                confidence: { type: 'number', description: 'Overall prediction confidence 0-1' }
              },
              required: ['predictions', 'overallTrend', 'confidence'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'low',
      });

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error predicting engagement:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async generateStrategicInsights(analyticsData) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a strategic advisor for political campaigns and advertising. Provide actionable, data-driven insights to optimize campaign strategy and content.' 
          },
          { 
            role: 'user', 
            content: `Based on comprehensive analytics: ${JSON.stringify(analyticsData)}, provide strategic insights for advertiser strategy and content optimization.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'strategic_insights',
            schema: {
              type: 'object',
              properties: {
                contentOptimization: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Content optimization recommendations'
                },
                targetingStrategy: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Audience targeting strategies'
                },
                timingRecommendations: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Optimal timing for campaigns'
                },
                budgetAllocation: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Budget allocation suggestions'
                },
                riskFactors: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Potential risks to monitor'
                }
              },
              required: ['contentOptimization', 'targetingStrategy', 'timingRecommendations', 'budgetAllocation', 'riskFactors'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      return { data: JSON.parse(response?.choices?.[0]?.message?.content), error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error generating strategic insights:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  // Mock data fallback for demo purposes
  async getMockSentimentData() {
    return {
      data: {
        positive: 58.3,
        neutral: 28.5,
        negative: 13.2,
        keyThemes: ['Economic Policy', 'Healthcare Reform', 'Education Funding', 'Climate Action'],
        confidence: 0.87,
        trendDirection: 'improving'
      },
      error: null
    };
  },

  async getMockCampaignReactions() {
    return {
      data: {
        engagementQuality: 'High - Strong positive response with sustained interaction',
        topPerformingElements: ['Video content', 'Interactive polls', 'Infographics'],
        audienceSegments: [
          { segment: '18-24', responseRate: 72.5, sentiment: 'positive' },
          { segment: '25-34', responseRate: 68.3, sentiment: 'positive' },
          { segment: '35-44', responseRate: 61.8, sentiment: 'neutral' },
          { segment: '45+', responseRate: 54.2, sentiment: 'neutral' }
        ],
        recommendations: [
          'Increase video content production by 30%',
          'Focus on 18-34 demographic for maximum ROI',
          'Test interactive elements in underperforming segments',
          'Optimize posting times for peak engagement'
        ]
      },
      error: null
    };
  },

  async getMockEngagementPredictions() {
    return {
      data: {
        predictions: [
          { date: '2026-01-23', predicted: 15200, confidenceLow: 14500, confidenceHigh: 15900 },
          { date: '2026-01-24', predicted: 16100, confidenceLow: 15300, confidenceHigh: 16900 },
          { date: '2026-01-25', predicted: 17300, confidenceLow: 16400, confidenceHigh: 18200 },
          { date: '2026-01-26', predicted: 18500, confidenceLow: 17500, confidenceHigh: 19500 },
          { date: '2026-01-27', predicted: 19800, confidenceLow: 18700, confidenceHigh: 20900 },
          { date: '2026-01-28', predicted: 21200, confidenceLow: 20000, confidenceHigh: 22400 },
          { date: '2026-01-29', predicted: 22800, confidenceLow: 21500, confidenceHigh: 24100 }
        ],
        overallTrend: 'Strong upward trajectory with increasing engagement',
        confidence: 0.84
      },
      error: null
    };
  }
};