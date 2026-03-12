import React, { useState } from 'react';
import { Brain, RefreshCw, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const AI_CONFIGS = [
  { key: 'claude', label: 'Claude (Security)', color: 'from-orange-500 to-red-500', role: 'Security Pattern Analysis' },
  { key: 'openai', label: 'OpenAI (Semantic)', color: 'from-green-500 to-teal-500', role: 'Semantic Threat Analysis' },
  { key: 'perplexity', label: 'Perplexity (Threat Intel)', color: 'from-blue-500 to-cyan-500', role: 'Real-Time Threat Intelligence' },
  { key: 'gemini', label: 'Gemini (Pattern)', color: 'from-purple-500 to-indigo-500', role: 'Pattern Recognition' },
];

const MultiAIOrchestrationPanel = ({ aiStatuses, onRunAnalysis, threatScore }) => {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    await onRunAnalysis?.();
    setRunning(false);
  };

  const allComplete = Object.values(aiStatuses)?.every(s => s?.status === 'complete');
  const confidences = Object.values(aiStatuses)?.filter(s => s?.confidence > 0)?.map(s => s?.confidence);
  const consensusScore = confidences?.length ? Math.round(confidences?.reduce((a, b) => a + b, 0) / confidences?.length) : 0;
  const hasConflict = confidences?.length > 1 && Math.max(...confidences) - Math.min(...confidences) > 20;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Multi-AI Orchestration</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Parallel threat analysis across all 4 AI services</p>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
        >
          <Brain size={14} className={running ? 'animate-pulse' : ''} />
          {running ? 'Orchestrating...' : 'Run Parallel Analysis'}
        </button>
      </div>
      {/* Consensus Indicator */}
      {allComplete && (
        <div className={`rounded-xl p-4 border ${
          hasConflict ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : 'bg-green-50 dark:bg-green-900/20 border-green-300'
        }`}>
          <div className="flex items-center gap-3">
            {hasConflict ? <AlertTriangle size={18} className="text-yellow-600" /> : <CheckCircle size={18} className="text-green-600" />}
            <div>
              <div className={`font-semibold text-sm ${hasConflict ? 'text-yellow-800 dark:text-yellow-300' : 'text-green-800 dark:text-green-300'}`}>
                {hasConflict ? 'AI Conflict Detected — Manual Review Required' : 'AI Consensus Reached'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Consensus confidence: {consensusScore}/100</div>
            </div>
            <div className="ml-auto">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${hasConflict ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${consensusScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* AI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AI_CONFIGS?.map(({ key, label, color, role }) => {
          const ai = aiStatuses?.[key];
          return (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${color}`}>{label}</div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  ai?.status === 'complete' ? 'bg-green-100 text-green-700' :
                  ai?.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                  ai?.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>{ai?.status}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{role}</div>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp size={14} className="text-gray-400" />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-bold text-gray-900 dark:text-white">{ai?.confidence || 0}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${ai?.confidence || 0}%` }} />
                  </div>
                </div>
              </div>
              {ai?.summary && <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ai?.summary}</p>}
              {ai?.lastAnalysis && <div className="text-xs text-gray-400 mt-2">Last: {ai?.lastAnalysis}</div>}
              {ai?.status === 'analyzing' && (
                <div className="flex items-center gap-2 text-xs text-blue-600 mt-2">
                  <RefreshCw size={11} className="animate-spin" />Analyzing threat patterns...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiAIOrchestrationPanel;
