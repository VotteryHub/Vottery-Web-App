import React from 'react';
import Icon from '../../../components/AppIcon';

const MultiAIComparisonPanel = ({ aiAnalyses, selectedIncident, onAnalyze }) => {
  if (!selectedIncident) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Select an incident to analyze with AI</p>
      </div>
    );
  }

  const extractConfidence = (analysis) => {
    if (!analysis) return 0;
    const text = typeof analysis === 'string' ? analysis : analysis?.analysis || '';
    const match = text?.match(/confidence[:\s]*(\d+)%?/i) || text?.match(/(\d+)%/i);
    return match ? parseInt(match?.[1]) : 75;
  };

  return (
    <div className="space-y-6">
      {/* Side-by-Side AI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claude Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Claude</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Contextual Reasoning</p>
            </div>
          </div>

          {aiAnalyses?.claude ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${extractConfidence(aiAnalyses?.claude)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {extractConfidence(aiAnalyses?.claude)}%
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Decision Rationale
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                  {aiAnalyses?.claude?.analysis}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Icon name="Zap" size={14} />
                <span>Tokens: {aiAnalyses?.claude?.usage?.total_tokens || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Brain" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click "Analyze All" to start</p>
            </div>
          )}
        </div>

        {/* Perplexity Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Perplexity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Extended Analysis</p>
            </div>
          </div>

          {aiAnalyses?.perplexity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${extractConfidence(aiAnalyses?.perplexity)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {extractConfidence(aiAnalyses?.perplexity)}%
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Threat Intelligence
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                  {aiAnalyses?.perplexity?.analysis}
                </p>
              </div>

              {aiAnalyses?.perplexity?.searchResults?.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <Icon name="Search" size={14} className="inline mr-1" />
                  {aiAnalyses?.perplexity?.searchResults?.length} sources analyzed
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Zap" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click "Analyze All" to start</p>
            </div>
          )}
        </div>

        {/* OpenAI Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">OpenAI</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Semantic Matching</p>
            </div>
          </div>

          {aiAnalyses?.openai ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${extractConfidence(aiAnalyses?.openai)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {extractConfidence(aiAnalyses?.openai)}%
                  </span>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
                  Semantic Analysis
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-6">
                  {aiAnalyses?.openai?.analysis}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Icon name="Zap" size={14} />
                <span>Tokens: {aiAnalyses?.openai?.usage?.total_tokens || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="Sparkles" size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Click "Analyze All" to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiAIComparisonPanel;