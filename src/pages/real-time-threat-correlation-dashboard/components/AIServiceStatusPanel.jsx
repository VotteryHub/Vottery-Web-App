import React from 'react';
import { Brain, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const AI_SERVICES = [
  { key: 'claude', name: 'Claude Security', provider: 'Anthropic', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  { key: 'openai', name: 'OpenAI Semantic', provider: 'OpenAI', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  { key: 'perplexity', name: 'Perplexity Threat', provider: 'Perplexity', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { key: 'gemini', name: 'Gemini Pattern', provider: 'Google', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
];

const AIServiceStatusPanel = ({ serviceStatuses, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Brain size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Multi-AI Orchestration</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">4 AI services running in parallel</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {AI_SERVICES?.map((service) => {
          const status = serviceStatuses?.[service?.key];
          const isLoading = loading || status?.loading;
          const hasError = status?.error;
          const score = status?.score;

          return (
            <div key={service?.key} className={`${service?.bg} ${service?.border} border rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className={`text-xs font-bold ${service?.color}`}>{service?.name}</p>
                  <p className="text-xs text-gray-400">{service?.provider}</p>
                </div>
                {isLoading ? (
                  <Loader size={16} className={`${service?.color} animate-spin`} />
                ) : hasError ? (
                  <AlertCircle size={16} className="text-red-500" />
                ) : (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Threat Score</span>
                  <span className={`text-sm font-bold ${service?.color}`}>
                    {isLoading ? '...' : hasError ? 'ERR' : (score ?? '—')}
                  </span>
                </div>
                {!isLoading && !hasError && score !== undefined && (
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${score}%`,
                        backgroundColor: score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 25 ? '#eab308' : '#22c55e',
                      }}
                    />
                  </div>
                )}
                {status?.summary && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{status?.summary}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIServiceStatusPanel;
