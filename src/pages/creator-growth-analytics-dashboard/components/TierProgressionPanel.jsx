import React from 'react';
import { TrendingUp } from 'lucide-react';

const TIER_ICONS = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Elite: '👑'
};

const TIER_COLORS = {
  Bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700', text: 'text-amber-500', bar: 'bg-amber-600' },
  Silver: { bg: 'bg-slate-700/20', border: 'border-slate-400', text: 'text-slate-300', bar: 'bg-slate-400' },
  Gold: { bg: 'bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-400', bar: 'bg-yellow-500' },
  Platinum: { bg: 'bg-cyan-900/20', border: 'border-cyan-400', text: 'text-cyan-300', bar: 'bg-cyan-400' },
  Elite: { bg: 'bg-purple-900/20', border: 'border-purple-400', text: 'text-purple-300', bar: 'bg-purple-500' }
};

export default function TierProgressionPanel({ tierData, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3" />
          <div className="h-32 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  const currentTier = tierData?.currentTier || { name: 'Bronze', level: 1 };
  const nextTier = tierData?.nextTier;
  const progress = tierData?.progressToNext || 0;
  const milestones = tierData?.milestones || [];
  const colors = TIER_COLORS?.[currentTier?.name] || TIER_COLORS?.Bronze;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Tier Progression Timeline
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors?.bg} ${colors?.border} ${colors?.text}`}>
          {TIER_ICONS?.[currentTier?.name]} {currentTier?.name}
        </span>
      </div>
      {/* Current Tier Progress */}
      <div className={`rounded-lg p-4 mb-6 border ${colors?.bg} ${colors?.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress to {nextTier?.name || 'Max Tier'}</span>
          <span className={`text-sm font-bold ${colors?.text}`}>{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${colors?.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Total Earnings: ${tierData?.totalEarnings?.toFixed(2) || '0.00'}</span>
          {nextTier && <span>${tierData?.earningsToNextTier?.toFixed(2) || '0'} to {nextTier?.name}</span>}
        </div>
      </div>
      {/* Tier Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />
        <div className="space-y-4">
          {milestones?.map((milestone, idx) => {
            const mColors = TIER_COLORS?.[milestone?.tier] || TIER_COLORS?.Bronze;
            const isActive = milestone?.tier === currentTier?.name;
            return (
              <div key={idx} className="flex items-center gap-4 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 z-10 ${
                  milestone?.achieved
                    ? `${mColors?.bg} ${mColors?.border}`
                    : 'bg-slate-700 border-slate-600'
                } ${isActive ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-indigo-500' : ''}`}>
                  {milestone?.achieved ? TIER_ICONS?.[milestone?.tier] : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${milestone?.achieved ? mColors?.text : 'text-slate-500'}`}>
                      {milestone?.tier} Tier
                    </span>
                    {isActive && (
                      <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Current</span>
                    )}
                    {milestone?.achieved && !isActive && (
                      <span className="text-xs text-emerald-400">✓ Achieved</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {milestone?.minEarnings === 0 ? 'Starting tier' : `$${milestone?.minEarnings?.toLocaleString()} earnings required`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
