import React from 'react';
import { Brain, CheckCircle } from 'lucide-react';

const ClaudeContextualAnalysis = ({ data }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Claude Contextual Analysis
        </h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">AI Reasoning</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{data?.reasoningExplanation}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data?.relevanceScore?.toFixed(1)}%</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Relevance</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{data?.userInterestAlignment?.toFixed(1)}%</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Alignment</div>
          </div>
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data?.confidenceLevel?.toFixed(1)}%</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaudeContextualAnalysis;