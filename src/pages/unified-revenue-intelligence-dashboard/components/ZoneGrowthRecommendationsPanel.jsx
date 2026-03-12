import React, { useState } from 'react';
import { Globe, TrendingUp, Target, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ZONE_COLORS = {
  'USA': '#6366f1',
  'Western Europe': '#8b5cf6',
  'Eastern Europe': '#ec4899',
  'India': '#f59e0b',
  'Latin America': '#10b981',
  'Africa': '#3b82f6',
  'Middle East/Asia': '#ef4444',
  'Australasia': '#06b6d4'
};

const ZoneGrowthRecommendationsPanel = ({ zoneRecommendations, onRefreshZones, isLoading }) => {
  const [expandedZone, setExpandedZone] = useState(null);
  const [sortBy, setSortBy] = useState('opportunity');

  const sortedZones = [...(zoneRecommendations || [])]?.sort((a, b) => {
    if (sortBy === 'opportunity') return (b?.opportunity_score || 0) - (a?.opportunity_score || 0);
    if (sortBy === 'growth') return parseFloat(b?.growth_potential || 0) - parseFloat(a?.growth_potential || 0);
    return 0;
  });

  const getOpportunityColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-400/10';
    if (score >= 75) return 'text-yellow-400 bg-yellow-400/10';
    if (score >= 60) return 'text-orange-400 bg-orange-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">8-Zone Growth Recommendations</h2>
            <p className="text-gray-400 text-sm">Zone-specific monetization optimization strategies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5"
          >
            <option value="opportunity">By Opportunity Score</option>
            <option value="growth">By Growth Potential</option>
          </select>
          <button
            onClick={onRefreshZones}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {/* Zone overview grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {sortedZones?.slice(0, 8)?.map((zone, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-750 transition-colors"
            onClick={() => setExpandedZone(expandedZone === zone?.zone ? null : zone?.zone)}
            style={{ borderTop: `3px solid ${ZONE_COLORS?.[zone?.zone] || '#6366f1'}` }}
          >
            <p className="text-white text-xs font-medium truncate">{zone?.zone}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: ZONE_COLORS?.[zone?.zone] || '#6366f1' }}>
              {zone?.opportunity_score}
            </p>
            <p className="text-gray-500 text-xs">opp. score</p>
          </div>
        ))}
      </div>
      {/* Detailed zone cards */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(4)]?.map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedZones?.map((zone, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
                onClick={() => setExpandedZone(expandedZone === zone?.zone ? null : zone?.zone)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${ZONE_COLORS?.[zone?.zone] || '#6366f1'}20` }}
                  >
                    {zone?.zone === 'USA' ? '🇺🇸' :
                     zone?.zone === 'Western Europe' ? '🇪🇺' :
                     zone?.zone === 'Eastern Europe' ? '🌍' :
                     zone?.zone === 'India' ? '🇮🇳' :
                     zone?.zone === 'Latin America' ? '🌎' :
                     zone?.zone === 'Africa' ? '🌍' :
                     zone?.zone === 'Middle East/Asia' ? '🌏' : '🇦🇺'}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{zone?.zone}</p>
                    <p className="text-gray-400 text-xs">{zone?.primary_strategy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${getOpportunityColor(zone?.opportunity_score)}`}>
                      Score: {zone?.opportunity_score}
                    </div>
                    <p className="text-green-400 text-xs mt-1 flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {zone?.growth_potential} potential
                    </p>
                  </div>
                  {expandedZone === zone?.zone ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedZone === zone?.zone && (
                <div className="px-4 pb-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Top Revenue Stream
                      </p>
                      <p className="text-white text-sm bg-gray-700 rounded px-2 py-1 inline-block">
                        {zone?.top_revenue_stream}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-medium mb-2">Market Index</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${zone?.current_index}%`,
                              backgroundColor: ZONE_COLORS?.[zone?.zone] || '#6366f1'
                            }}
                          />
                        </div>
                        <span className="text-white text-xs">{zone?.current_index}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-gray-400 text-xs font-medium mb-2">Optimization Tactics</p>
                    <ul className="space-y-1">
                      {zone?.tactics?.map((tactic, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                          <span className="text-blue-400 mt-0.5">→</span>
                          {tactic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {zone?.cultural_notes && (
                    <div className="mt-3 bg-yellow-900/20 border border-yellow-700/20 rounded-lg p-3">
                      <p className="text-yellow-400 text-xs font-medium mb-1">Cultural Adaptation</p>
                      <p className="text-gray-300 text-xs">{zone?.cultural_notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ZoneGrowthRecommendationsPanel;
