import React from 'react';

const TIERS = [
  { name: 'Bronze', color: '#cd7f32', icon: '🥉', minEarnings: 0, maxEarnings: 500 },
  { name: 'Silver', color: '#c0c0c0', icon: '🥈', minEarnings: 500, maxEarnings: 2000 },
  { name: 'Gold', color: '#ffd700', icon: '🥇', minEarnings: 2000, maxEarnings: 5000 },
  { name: 'Platinum', color: '#e5e4e2', icon: '💫', minEarnings: 5000, maxEarnings: 15000 },
  { name: 'Elite', color: '#b9f2ff', icon: '💎', minEarnings: 15000, maxEarnings: Infinity }
];

const MobileTierProgress = ({ currentTier = 'Gold', totalEarnings = 3240 }) => {
  const tierIndex = TIERS?.findIndex(t => t?.name === currentTier);
  const tier = TIERS?.[tierIndex] || TIERS?.[0];
  const nextTier = TIERS?.[tierIndex + 1];

  const progressPct = nextTier
    ? Math.min(((totalEarnings - tier?.minEarnings) / (nextTier?.minEarnings - tier?.minEarnings)) * 100, 100)
    : 100;

  const remaining = nextTier ? Math.max(nextTier?.minEarnings - totalEarnings, 0) : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Current Tier</p>
      {/* Current tier display */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-gray-800">
          {tier?.icon}
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: tier?.color }}>{tier?.name}</p>
          <p className="text-gray-400 text-sm">Creator Tier</p>
        </div>
      </div>
      {/* Progress to next tier */}
      {nextTier && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-xs">Progress to {nextTier?.name} {nextTier?.icon}</span>
            <span className="text-white text-xs font-bold">{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, backgroundColor: tier?.color }}
            />
          </div>
          <p className="text-gray-500 text-xs">${remaining?.toLocaleString()} more to reach {nextTier?.name}</p>
        </div>
      )}
      {!nextTier && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-3 text-center">
          <p className="text-blue-300 font-semibold text-sm">🏆 Maximum Tier Achieved!</p>
        </div>
      )}
      {/* Tier steps */}
      <div className="flex items-center justify-between mt-4">
        {TIERS?.map((t, i) => (
          <div key={t?.name} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                i < tierIndex ? 'border-green-500 bg-green-900/30' :
                i === tierIndex ? 'border-white bg-gray-700 scale-110': 'border-gray-700 bg-gray-800 opacity-50'
              }`}
            >
              {t?.icon}
            </div>
            <span className="text-xs" style={{ color: i <= tierIndex ? t?.color : '#6b7280', fontSize: '9px' }}>{t?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileTierProgress;
