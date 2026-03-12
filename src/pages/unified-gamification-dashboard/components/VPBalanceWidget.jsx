import React from 'react';
import { useNavigate } from 'react-router-dom';

const VPBalanceWidget = ({ vpData, gamification, progressPercent, currentLevelXP, nextLevelXP }) => {
  const navigate = useNavigate();
  const tierMultipliers = { 1: '1x', 2: '2x', 3: '3x', 4: '4x', 5: '5x' };
  const tierNames = { 1: 'Free', 2: 'Basic', 3: 'Pro', 4: 'Pro+', 5: 'Elite' };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-yellow-500 rounded-xl shadow-lg p-5 text-white col-span-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-white/70 uppercase tracking-wide">VP Balance</p>
          <p className="text-3xl font-bold">{(vpData?.balance || 0)?.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>Level {vpData?.level || 1}</span>
          <span>{currentLevelXP}/{nextLevelXP} XP</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/70">
          Tier: {tierNames?.[Math.min(5, vpData?.level || 1)]} • {tierMultipliers?.[Math.min(5, vpData?.level || 1)]} VP
        </span>
        <button
          onClick={() => navigate('/vottery-points-vp-universal-currency-center')}
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
        >
          Redeem →
        </button>
      </div>
    </div>
  );
};

export default VPBalanceWidget;
