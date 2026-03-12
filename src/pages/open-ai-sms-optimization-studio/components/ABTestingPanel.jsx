import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ABTestingPanel = ({ variants, onVariantUpdate, isOptimizing }) => {
  const [activeVariant, setActiveVariant] = useState('A');
  const [newVariantText, setNewVariantText] = useState('');

  const getSignificanceColor = (significance) => {
    if (significance >= 95) return 'text-green-400';
    if (significance >= 80) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getWinnerBadge = (variant) => {
    if (!variants || variants?.length < 2) return null;
    const maxCTR = Math.max(...variants?.map(v => v?.ctr || 0));
    if (variant?.ctr === maxCTR && maxCTR > 0) {
      return <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-green-400 text-xs font-medium">Winner</span>;
    }
    return null;
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Icon name="GitBranch" size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">A/B Testing</h3>
            <p className="text-gray-400 text-sm">Compare message variants</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOptimizing && (
            <div className="flex items-center gap-1.5 text-blue-400 text-xs">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Optimizing
            </div>
          )}
        </div>
      </div>
      {/* Variant Tabs */}
      <div className="flex gap-2">
        {(variants || [])?.map((v, i) => (
          <button
            key={v?.id}
            onClick={() => setActiveVariant(v?.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeVariant === v?.id
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400' :'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            Variant {v?.id}
          </button>
        ))}
      </div>
      {/* Active Variant Detail */}
      {(variants || [])?.filter(v => v?.id === activeVariant)?.map(variant => (
        <div key={variant?.id} className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Message Content</label>
              {getWinnerBadge(variant)}
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{variant?.content}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
              <span className={`text-xs ${
                (variant?.content?.length || 0) > 160 ? 'text-red-400' : 'text-green-400'
              }`}>
                {variant?.content?.length || 0}/160 chars
              </span>
              <span className="text-gray-500 text-xs">{variant?.tone} tone</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{variant?.ctr?.toFixed(1) || '0.0'}%</div>
              <div className="text-gray-500 text-xs mt-1">Click-Through Rate</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-400">{variant?.responseRate?.toFixed(1) || '0.0'}%</div>
              <div className="text-gray-500 text-xs mt-1">Response Rate</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 text-center">
              <div className={`text-lg font-bold ${getSignificanceColor(variant?.significance)}`}>
                {variant?.significance?.toFixed(0) || '0'}%
              </div>
              <div className="text-gray-500 text-xs mt-1">Significance</div>
            </div>
          </div>

          {/* Sends */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Sends</span>
            <span className="text-white font-medium">{(variant?.sends || 0)?.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((variant?.sends || 0) / 1000 * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
      {/* Statistical Summary */}
      {variants && variants?.length >= 2 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="BarChart2" size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">Statistical Analysis</span>
          </div>
          <div className="space-y-2">
            {variants?.map(v => (
              <div key={v?.id} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-16">Variant {v?.id}</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${v?.ctr || 0}%` }}
                  />
                </div>
                <span className="text-white text-xs w-12 text-right">{v?.ctr?.toFixed(1) || '0.0'}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestingPanel;
