import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MobileMetricCard = ({ label, value, trend, trendValue, color = 'blue', icon, onClick, large = false }) => {
  const colorMap = {
    blue: 'border-blue-700 bg-blue-900/20',
    green: 'border-green-700 bg-green-900/20',
    orange: 'border-orange-700 bg-orange-900/20',
    red: 'border-red-700 bg-red-900/20',
    purple: 'border-purple-700 bg-purple-900/20',
    yellow: 'border-yellow-700 bg-yellow-900/20'
  };
  const textColorMap = {
    blue: 'text-blue-400', green: 'text-green-400', orange: 'text-orange-400',
    red: 'text-red-400', purple: 'text-purple-400', yellow: 'text-yellow-400'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 ${colorMap?.[color]} active:scale-95 transition-transform touch-manipulation`}
      style={{ minHeight: large ? '120px' : '90px' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`font-bold ${large ? 'text-3xl' : 'text-2xl'} ${textColorMap?.[color]}`}>{value}</p>
          {trendValue && (
            <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
              <TrendIcon size={12} strokeWidth={2} />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && <span className={`text-2xl ml-2 ${large ? 'text-3xl' : ''}`}>{icon}</span>}
      </div>
    </button>
  );
};

export default MobileMetricCard;