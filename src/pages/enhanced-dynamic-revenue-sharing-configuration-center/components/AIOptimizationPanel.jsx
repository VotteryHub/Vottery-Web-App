import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, AlertCircle, CheckCircle, Brain, Zap } from 'lucide-react';
import { revenueSplitForecastingService } from '../../../services/revenueSplitForecastingService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const AIOptimizationPanel = ({ globalConfig, aiForecasts, onGenerateForecast }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const handleAnalyzeImpact = async (recommendation) => {
    try {
      setLoading(true);
      const result = await revenueSplitForecastingService?.analyzeCreatorImpact(
        {
          from: { creatorPercentage: globalConfig?.creatorPercentage, platformPercentage: globalConfig?.platformPercentage },
          to: { creatorPercentage: recommendation?.newSplit?.creator, platformPercentage: recommendation?.newSplit?.platform }
        },
        { totalCreators: 1000, avgRevenue: 5000 }
      );

      setSelectedRecommendation({
        ...recommendation,
        impactAnalysis: result?.data
      });

      analytics?.trackEvent('ai_recommendation_analyzed', {
        recommendation_type: recommendation?.title
      });
    } catch (error) {
      console.error('Error analyzing impact:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRiskColor = (risk) => {
    if (risk === 'low') return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (risk === 'medium') return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg shadow-sm border border-orange-200 dark:border-orange-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI-Powered Revenue Optimization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Strategic recommendations from OpenAI and Anthropic Claude
              </p>
            </div>
          </div>
          <button
            onClick={onGenerateForecast}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Generating...' : 'Regenerate Forecast'}
          </button>
        </div>
      </div>

      {!aiForecasts ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No AI Forecasts Generated Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click "Generate AI Forecast" to get strategic revenue optimization recommendations
          </p>
          <button
            onClick={onGenerateForecast}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Forecast
          </button>
        </div>
      ) : (
        <>
          {/* AI Consensus */}
          {aiForecasts?.consensus && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Consensus Analysis
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">OpenAI Confidence</div>
                  <div className={`text-2xl font-bold ${getConfidenceColor(aiForecasts?.consensus?.openAIConfidence)}`}>
                    {aiForecasts?.consensus?.openAIConfidence}%
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Claude Confidence</div>
                  <div className={`text-2xl font-bold ${getConfidenceColor(aiForecasts?.consensus?.claudeConfidence)}`}>
                    {aiForecasts?.consensus?.claudeConfidence}%
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consensus Level</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {((aiForecasts?.consensus?.openAIConfidence + aiForecasts?.consensus?.claudeConfidence) / 2)?.toFixed(0)}%
                  </div>
                </div>
              </div>
              {aiForecasts?.consensus?.recommendations?.map((rec, index) => (
                <div
                  key={index}
                  className="mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{rec?.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Claude Optimizations */}
          {aiForecasts?.claudeOptimizations?.recommendations && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Claude Strategic Recommendations
                </h3>
              </div>
              <div className="space-y-4">
                {aiForecasts?.claudeOptimizations?.recommendations?.map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-5 border border-purple-200 dark:border-purple-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {recommendation?.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {recommendation?.reasoning}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(recommendation?.risk)}`}>
                        {recommendation?.risk} risk
                      </span>
                    </div>

                    {recommendation?.newSplit && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recommended Split</div>
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {recommendation?.newSplit?.creator}% / {recommendation?.newSplit?.platform}%
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Confidence</div>
                          <div className={`text-lg font-bold ${getConfidenceColor(recommendation?.confidence)}`}>
                            {recommendation?.confidence}%
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <TrendingUp className="w-4 h-4" />
                      <span>Expected Impact: {recommendation?.impact}</span>
                    </div>

                    <button
                      onClick={() => handleAnalyzeImpact(recommendation)}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Analyze Detailed Impact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OpenAI Forecasts */}
          {aiForecasts?.openAIForecast?.scenarios && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  OpenAI Revenue Projections
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiForecasts?.openAIForecast?.scenarios?.map((scenario, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-700"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {scenario?.scenarioName}
                    </h4>
                    <div className="space-y-2">
                      {scenario?.projections && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">30-day Revenue</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${scenario?.projections?.['30d']?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">60-day Revenue</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${scenario?.projections?.['60d']?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">90-day Revenue</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${scenario?.projections?.['90d']?.toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</span>
                          <span className={`font-semibold ${getConfidenceColor(scenario?.satisfaction)}`}>
                            {scenario?.satisfaction}/100
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                          <span className={`font-semibold ${getConfidenceColor(scenario?.confidence)}`}>
                            {scenario?.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Recommendation Impact */}
          {selectedRecommendation?.impactAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Detailed Impact Analysis: {selectedRecommendation?.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Satisfaction Impact</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedRecommendation?.impactAnalysis?.satisfactionImpact > 0 ? '+' : ''}
                    {selectedRecommendation?.impactAnalysis?.satisfactionImpact}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Retention Change</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedRecommendation?.impactAnalysis?.retentionChange > 0 ? '+' : ''}
                    {selectedRecommendation?.impactAnalysis?.retentionChange}%
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Churn Risk</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedRecommendation?.impactAnalysis?.churnRisk}
                  </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Morale Score</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedRecommendation?.impactAnalysis?.moraleAnalysis?.score || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIOptimizationPanel;