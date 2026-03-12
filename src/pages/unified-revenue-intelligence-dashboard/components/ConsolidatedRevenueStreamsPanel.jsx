import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ConsolidatedRevenueStreamsPanel = ({ streams, totalRevenue, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          {[...Array(6)]?.map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Consolidated Revenue Streams</h2>
          <p className="text-gray-400 text-sm mt-1">All 6 platform monetization channels</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-white">${totalRevenue?.toLocaleString()}</p>
        </div>
      </div>

      {/* Revenue bar visualization */}
      <div className="mb-6">
        <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
          {streams?.map((stream, i) => (
            <div
              key={i}
              className="h-full transition-all duration-500"
              style={{ width: `${stream?.percentage}%`, backgroundColor: stream?.color }}
              title={`${stream?.source}: ${stream?.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {streams?.map((stream, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stream?.color }}></div>
              <span className="text-xs text-gray-400">{stream?.source} ({stream?.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual stream cards */}
      <div className="space-y-3">
        {streams?.map((stream, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${stream?.color}20` }}
                >
                  {stream?.icon}
                </div>
                <div>
                  <p className="text-white font-medium">{stream?.source}</p>
                  <p className="text-gray-400 text-xs">{stream?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">${stream?.total?.toLocaleString()}</p>
                <div className="flex items-center justify-end gap-1">
                  {stream?.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${stream?.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    +{stream?.growth}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{stream?.transactions?.toLocaleString()} transactions</span>
                <span>{stream?.percentage}% of total</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${stream?.percentage}%`, backgroundColor: stream?.color }}
                />
              </div>
            </div>

            {/* Carousel breakdown if available */}
            {stream?.breakdown && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {stream?.breakdown?.map((item, i) => (
                  <div key={i} className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">{item?.type}</p>
                    <p className="text-white text-sm font-medium">${Math.round(item?.amount)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsolidatedRevenueStreamsPanel;
