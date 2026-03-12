import React, { useState } from 'react';
import { Globe, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const POTENTIAL_COLORS = {
  high: 'text-emerald-400 bg-emerald-900/30 border-emerald-700',
  medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  low: 'text-slate-400 bg-slate-700/30 border-slate-600'
};

export default function ZoneGrowthPanel({ zoneRecommendations, loading }) {
  const [expandedZone, setExpandedZone] = useState(null);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-700 rounded w-1/2" />
          {[1, 2, 3]?.map(i => <div key={i} className="h-16 bg-slate-700 rounded" />)}
        </div>
      </div>
    );
  }

  const zones = zoneRecommendations || [];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          8-Zone Growth Recommendations
        </h2>
        <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded-full">AI-Optimized</span>
      </div>
      <div className="space-y-2">
        {zones?.map((zone, idx) => (
          <div key={idx} className="bg-slate-700/40 rounded-lg border border-slate-600 overflow-hidden">
            <button
              onClick={() => setExpandedZone(expandedZone === idx ? null : idx)}
              className="w-full p-4 text-left hover:bg-slate-700/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{zone?.flag || '🌍'}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{zone?.zone}</div>
                    <div className="text-xs text-slate-400">${zone?.currentRevenue?.toLocaleString() || '0'}/month</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded border ${POTENTIAL_COLORS?.[zone?.growthPotential] || POTENTIAL_COLORS?.medium}`}>
                    {zone?.growthPotential} potential
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">{zone?.targetGrowth}</span>
                  {expandedZone === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            </button>

            {expandedZone === idx && (
              <div className="px-4 pb-4 border-t border-slate-600">
                <div className="mt-3 mb-3">
                  <span className="text-xs text-slate-400">Top Opportunity: </span>
                  <span className="text-sm text-cyan-300">{zone?.topOpportunity}</span>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-slate-400 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {zone?.recommendations?.map((rec, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <TrendingUp className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-xs text-slate-500">
                  Key Metric: <span className="text-slate-300">{zone?.keyMetric}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
