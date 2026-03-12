import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BeforeAfterComparison = ({ original, optimized, engagementData, onCopyOptimized }) => {
  const [view, setView] = useState('split');

  const improvement = engagementData ? {
    ctr: ((engagementData?.optimizedCTR - engagementData?.originalCTR) / Math.max(engagementData?.originalCTR, 0.01) * 100)?.toFixed(1),
    response: ((engagementData?.optimizedResponseRate - engagementData?.originalResponseRate) / Math.max(engagementData?.originalResponseRate, 0.01) * 100)?.toFixed(1),
    score: engagementData?.optimizationScore || 0
  } : null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Icon name="ArrowLeftRight" size={20} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Before / After Comparison</h3>
            <p className="text-gray-400 text-sm">Optimization impact analysis</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['split', 'before', 'after']?.map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-all ${
                view === v ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {/* Comparison View */}
      <div className={`grid gap-4 ${view === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {(view === 'split' || view === 'before') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Before</span>
            </div>
            <div className="bg-gray-800 border border-red-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {original || 'No original message provided'}
              </p>
              {original && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                  <span className={`text-xs ${original?.length > 160 ? 'text-red-400' : 'text-gray-500'}`}>
                    {original?.length} chars
                  </span>
                  {engagementData && (
                    <span className="text-gray-500 text-xs">CTR: {engagementData?.originalCTR?.toFixed(1)}%</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {(view === 'split' || view === 'after') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">After</span>
            </div>
            <div className="bg-gray-800 border border-green-500/20 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {optimized || 'Run optimization to see result'}
              </p>
              {optimized && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                  <span className={`text-xs ${optimized?.length > 160 ? 'text-red-400' : 'text-green-400'}`}>
                    {optimized?.length} chars
                  </span>
                  {engagementData && (
                    <span className="text-green-400 text-xs">CTR: {engagementData?.optimizedCTR?.toFixed(1)}%</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Engagement Impact */}
      {improvement && optimized && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="TrendingUp" size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium uppercase tracking-wider">Engagement Impact</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">+{improvement?.ctr}%</div>
              <div className="text-gray-500 text-xs mt-1">CTR Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">+{improvement?.response}%</div>
              <div className="text-gray-500 text-xs mt-1">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{improvement?.score}/100</div>
              <div className="text-gray-500 text-xs mt-1">Optimization Score</div>
            </div>
          </div>
        </div>
      )}
      {/* Copy Button */}
      {optimized && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            navigator.clipboard?.writeText(optimized);
            onCopyOptimized?.(optimized);
          }}
        >
          <Icon name="Copy" size={14} className="mr-2" />
          Copy Optimized Message
        </Button>
      )}
    </div>
  );
};

export default BeforeAfterComparison;
