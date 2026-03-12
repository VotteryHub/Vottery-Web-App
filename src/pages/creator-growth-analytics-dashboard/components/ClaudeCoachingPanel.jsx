import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Zap, Target, TrendingUp, DollarSign, Users } from 'lucide-react';

const CATEGORY_ICONS = {
  content: <Zap className="w-4 h-4" />,
  monetization: <DollarSign className="w-4 h-4" />,
  engagement: <Users className="w-4 h-4" />,
  tier_advancement: <TrendingUp className="w-4 h-4" />,
  marketplace: <Target className="w-4 h-4" />
};

const IMPACT_COLORS = {
  high: 'text-red-400 bg-red-900/30 border-red-700',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  low: 'text-green-400 bg-green-900/30 border-green-700'
};

export default function ClaudeCoachingPanel({ recommendations, loading }) {
  const [expanded, setExpanded] = useState(null);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          {[1, 2, 3]?.map(i => <div key={i} className="h-20 bg-slate-700 rounded" />)}
        </div>
      </div>
    );
  }

  const recs = recommendations || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-400" />
          Claude AI Growth Coaching
        </h2>
        <span className="text-xs text-violet-400 bg-violet-900/30 px-2 py-1 rounded-full">AI-Powered</span>
      </div>
      <div className="space-y-3">
        {recs?.map((rec, idx) => (
          <div key={idx} className="bg-slate-700/40 rounded-lg border border-slate-600 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className="w-full p-4 text-left hover:bg-slate-700/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 bg-violet-900/40 rounded-lg flex items-center justify-center text-violet-400 flex-shrink-0 mt-0.5">
                    {CATEGORY_ICONS?.[rec?.category] || <Zap className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{rec?.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${IMPACT_COLORS?.[rec?.impact] || IMPACT_COLORS?.medium}`}>
                        {rec?.impact} impact
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-emerald-400">{rec?.estimatedEarningsBoost}</span>
                      <span className="text-xs text-slate-500">Confidence: {rec?.confidence}%</span>
                    </div>
                  </div>
                </div>
                {expanded === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </div>
            </button>

            {expanded === idx && (
              <div className="px-4 pb-4 border-t border-slate-600">
                <p className="text-sm text-slate-300 mt-3 mb-3">{rec?.description}</p>
                {rec?.implementationSteps?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-400 mb-2">Implementation Steps:</h4>
                    <ol className="space-y-1">
                      {rec?.implementationSteps?.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="w-5 h-5 bg-violet-900/40 text-violet-400 rounded-full flex items-center justify-center flex-shrink-0 font-medium">{sIdx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>AI Confidence</span>
                    <span>{rec?.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-violet-500"
                      style={{ width: `${rec?.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {recs?.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Generating personalized recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );
}
