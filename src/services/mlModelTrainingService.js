import openai from '../lib/openai';
import perplexityClient from '../lib/perplexity';
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

export const mlModelTrainingService = {
  async getModelPerformance() {
    try {
      const { data, error } = await supabase?.from('ml_model_performance')?.select('*')?.order('created_at', { ascending: false })?.limit(10);

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching model performance:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async trainModel(trainingData, modelConfig) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are an ML model training specialist for fraud detection systems. Analyze training data, optimize algorithm parameters, validate model performance, and provide accuracy improvements with statistical significance testing.' 
          },
          { 
            role: 'user', 
            content: `Train fraud detection model with this data: ${JSON.stringify(trainingData)}. Model configuration: ${JSON.stringify(modelConfig)}. Provide training progress, accuracy metrics, false positive tracking, and optimization suggestions.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'model_training_results',
            schema: {
              type: 'object',
              properties: {
                trainingProgress: { type: 'number', description: 'Training progress percentage 0-100' },
                accuracyMetrics: {
                  type: 'object',
                  properties: {
                    accuracy: { type: 'number' },
                    precision: { type: 'number' },
                    recall: { type: 'number' },
                    f1Score: { type: 'number' }
                  }
                },
                falsePositiveRate: { type: 'number', description: 'False positive rate 0-1' },
                falseNegativeRate: { type: 'number', description: 'False negative rate 0-1' },
                optimizationSuggestions: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                modelVersion: { type: 'string', description: 'Model version identifier' },
                trainingDuration: { type: 'number', description: 'Training duration in seconds' },
                datasetSize: { type: 'number', description: 'Number of training samples' },
                reasoning: { type: 'string', description: 'Training analysis explanation' }
              },
              required: ['trainingProgress', 'accuracyMetrics', 'falsePositiveRate', 'falseNegativeRate', 'optimizationSuggestions', 'modelVersion', 'trainingDuration', 'datasetSize', 'reasoning'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const trainingResults = JSON.parse(response?.choices?.[0]?.message?.content);
      
      // Store training results
      await this.saveModelPerformance(trainingResults);
      
      return { data: trainingResults, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error training model:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async labelFalsePositives(caseData, adminLabel) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are a fraud detection model refinement specialist. Analyze admin-labeled false positives to improve model accuracy and reduce future false positive rates.' 
          },
          { 
            role: 'user', 
            content: `Analyze this false positive case: ${JSON.stringify(caseData)}. Admin label: ${adminLabel}. Provide model refinement recommendations and pattern adjustments.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'false_positive_analysis',
            schema: {
              type: 'object',
              properties: {
                refinementRecommendations: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                patternAdjustments: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                confidenceAdjustment: { type: 'number', description: 'Confidence threshold adjustment -1 to 1' },
                impactScore: { type: 'number', description: 'Impact on model accuracy 0-100' },
                reasoning: { type: 'string' }
              },
              required: ['refinementRecommendations', 'patternAdjustments', 'confidenceAdjustment', 'impactScore', 'reasoning'],
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
        console.error('Error analyzing false positive:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async testDetectionRules(testCases) {
    try {
      const response = await perplexityClient?.createChatCompletion({
        model: 'sonar-reasoning-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a fraud detection rule testing specialist. Evaluate custom detection rules against test cases, measure effectiveness, and provide performance analytics with statistical validation.'
          },
          {
            role: 'user',
            content: `Test these fraud detection rules against test cases: ${JSON.stringify(testCases)}. Provide rule effectiveness metrics, performance analytics, edge case detection, and optimization recommendations. Return JSON with: ruleEffectiveness (array), performanceMetrics (object), edgeCases (array), optimizationRecommendations (array), overallScore (0-100), confidence (0-1), reasoning (string).`
          }
        ],
        temperature: 0.2,
        returnRelatedQuestions: true
      });

      const content = response?.choices?.[0]?.message?.content;
      let testResults;

      try {
        testResults = JSON.parse(content);
      } catch (parseError) {
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          testResults = JSON.parse(jsonMatch?.[0]);
        } else {
          throw new Error('Failed to parse test results');
        }
      }

      return { data: testResults, error: null };
    } catch (error) {
      console.error('Error testing detection rules:', error);
      return { data: null, error: { message: error?.message || 'Failed to test rules' } };
    }
  },

  async submitCreatorFeedback(feedback) {
    try {
      const { data, error } = await supabase?.from('creator_feedback_for_training')?.insert({
        creator_id: feedback?.creatorId || null,
        source: feedback?.source || 'stripe_connect',
        feedback_type: feedback?.type || 'payout_dispute',
        content: feedback?.content || null,
        label: feedback?.label || null,
        metadata: feedback?.metadata || {}
      })?.select()?.single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: { message: e?.message } };
    }
  },

  async getCreatorFeedbackForTraining(limit = 100) {
    try {
      const { data, error } = await supabase?.from('creator_feedback_for_training')?.select('*')?.order('created_at', { ascending: false })?.limit(limit);
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: { message: e?.message } };
    }
  },

  async getTrainingDatasets() {
    try {
      const { data: creatorFeedback } = await this.getCreatorFeedbackForTraining(50);
      const feedbackCount = creatorFeedback?.length || 0;
      const datasets = [
        {
          id: 1,
          name: 'Historical Fraud Cases',
          size: 15420,
          lastUpdated: new Date()?.toISOString(),
          quality: 0.92,
          type: 'labeled'
        },
        {
          id: 2,
          name: 'Behavioral Patterns',
          size: 28934,
          lastUpdated: new Date()?.toISOString(),
          quality: 0.88,
          type: 'unlabeled'
        },
        {
          id: 3,
          name: 'Transaction Anomalies',
          size: 12567,
          lastUpdated: new Date()?.toISOString(),
          quality: 0.95,
          type: 'labeled'
        },
        ...(feedbackCount > 0 ? [{
          id: 4,
          name: 'Creator Feedback (Connect)',
          size: feedbackCount,
          lastUpdated: new Date()?.toISOString(),
          quality: 0.85,
          type: 'labeled',
          source: 'creator_feedback_for_training'
        }] : [])
      ];

      return { data: datasets, error: null };
    } catch (error) {
      console.error('Error fetching training datasets:', error);
      return { data: [], error: { message: error?.message } };
    }
  },

  async compareModelVersions(version1, version2) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { 
            role: 'system', 
            content: 'You are an ML model comparison specialist. Analyze performance differences between model versions, identify improvements, and provide deployment recommendations with A/B testing insights.' 
          },
          { 
            role: 'user', 
            content: `Compare fraud detection model versions: Version 1: ${version1}, Version 2: ${version2}. Provide performance comparison, accuracy improvements, false positive reduction, and deployment recommendations.` 
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'model_comparison',
            schema: {
              type: 'object',
              properties: {
                performanceComparison: {
                  type: 'object',
                  properties: {
                    accuracyDelta: { type: 'number' },
                    precisionDelta: { type: 'number' },
                    recallDelta: { type: 'number' },
                    f1ScoreDelta: { type: 'number' }
                  }
                },
                improvements: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                falsePositiveReduction: { type: 'number', description: 'Percentage reduction in false positives' },
                deploymentRecommendation: { type: 'string', description: 'Deploy, rollback, or continue testing' },
                abTestingInsights: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                reasoning: { type: 'string' }
              },
              required: ['performanceComparison', 'improvements', 'falsePositiveReduction', 'deploymentRecommendation', 'abTestingInsights', 'reasoning'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'high',
      });

      const comparison = JSON.parse(response?.choices?.[0]?.message?.content);
      
      return { data: comparison, error: null };
    } catch (error) {
      const errorInfo = getErrorMessage(error);
      if (errorInfo?.isInternal) {
        console.log(errorInfo?.message);
      } else {
        console.error('Error comparing model versions:', error);
      }
      return { data: null, error: { message: errorInfo?.message } };
    }
  },

  async saveModelPerformance(performanceData) {
    try {
      const { data, error } = await supabase?.from('ml_model_performance')?.insert({
          model_version: performanceData?.modelVersion,
          accuracy: performanceData?.accuracyMetrics?.accuracy,
          precision: performanceData?.accuracyMetrics?.precision,
          recall: performanceData?.accuracyMetrics?.recall,
          f1_score: performanceData?.accuracyMetrics?.f1Score,
          false_positive_rate: performanceData?.falsePositiveRate,
          false_negative_rate: performanceData?.falseNegativeRate,
          training_duration: performanceData?.trainingDuration,
          dataset_size: performanceData?.datasetSize,
          metadata: {
            optimizationSuggestions: performanceData?.optimizationSuggestions,
            reasoning: performanceData?.reasoning
          }
        })?.select()?.single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error saving model performance:', error);
      return { data: null, error: { message: error?.message } };
    }
  },

  async getAutomatedRetraining() {
    try {
      // Mock automated retraining schedule
      const schedule = {
        enabled: true,
        frequency: 'weekly',
        lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)?.toISOString(),
        nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)?.toISOString(),
        successRate: 0.94,
        averageImprovement: 2.3
      };

      return { data: schedule, error: null };
    } catch (error) {
      console.error('Error fetching retraining schedule:', error);
      return { data: null, error: { message: error?.message } };
    }
  }
};