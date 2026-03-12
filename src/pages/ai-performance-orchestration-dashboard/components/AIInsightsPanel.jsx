import React from 'react';
import Icon from '../../../components/AppIcon';

const AIInsightsPanel = ({ analyses }) => {
  if (!analyses) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="Brain" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No AI Insights Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Run AI analysis to generate comprehensive insights from Claude, Perplexity, and OpenAI
        </p>
      </div>
    );
  }

  const { claudeAnalysis, perplexityAnalysis, openaiAnalysis } = analyses;

  return (
    <div className="space-y-6">
      {/* Claude Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
            <Icon name="Brain" size={24} className="text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Claude AI Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Anthropic Claude Sonnet 4.5 Analysis</p>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {claudeAnalysis?.analysis}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
          <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {claudeAnalysis?.confidence}%
          </span>
        </div>
      </div>

      {/* Perplexity Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Icon name="Search" size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Perplexity AI Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sonar Reasoning Pro Analysis</p>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {perplexityAnalysis?.analysis}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {perplexityAnalysis?.confidence}%
          </span>
        </div>
      </div>

      {/* OpenAI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Icon name="Sparkles" size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">OpenAI Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">GPT-4o Analysis</p>
          </div>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {openaiAnalysis?.analysis}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Confidence Score</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {openaiAnalysis?.confidence}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
