import React from 'react';
import Icon from '../../../components/AppIcon';

const MultiAICorrelationPanel = ({ intelligence }) => {
  return (
    <div className="space-y-6">
      {/* Correlation Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitMerge" size={20} />
          AI Service Correlation Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Perplexity × Claude Correlation
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              High agreement on threat severity and response urgency
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Correlation:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="text-xs font-semibold text-primary">92%</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/10 dark:to-green-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Claude × OpenAI Correlation
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Strong alignment on content policy and user behavior patterns
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Correlation:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full" style={{ width: '89%' }} />
              </div>
              <span className="text-xs font-semibold text-primary">89%</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-green-50 dark:from-purple-900/10 dark:to-green-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Perplexity × OpenAI Correlation
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Moderate agreement on semantic content analysis and user intent
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Correlation:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full" style={{ width: '76%' }} />
              </div>
              <span className="text-xs font-semibold text-primary">76%</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-900/10 dark:to-purple-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Platform × All AI Services
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Platform data validates AI predictions with high accuracy
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Correlation:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-600 to-purple-600 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
              <span className="text-xs font-semibold text-primary">94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Synthesis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Recommendation Synthesis</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-green-900/10 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unified Recommendation (All Services)
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Implement enhanced fraud detection in Zone 3 with automated Claude decision support and Perplexity threat monitoring. OpenAI semantic matching shows 82% accuracy in identifying related patterns.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Perplexity: 85%</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Scale" size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Claude: 88%</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Sparkles" size={14} className="text-green-600 dark:text-green-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">OpenAI: 82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Scoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Combined Confidence Scoring</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Threat Detection Accuracy</span>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">91%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '91%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Decision Reasoning Quality</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">88%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Semantic Matching Precision</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">82%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiAICorrelationPanel;