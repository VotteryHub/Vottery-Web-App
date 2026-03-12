import React, { useState } from 'react';
import { Trash2, CheckCircle, DollarSign, Award, RefreshCw } from 'lucide-react';
import analyticsCacheService from '../../../services/analyticsCacheService';

const CacheInvalidationPanel = () => {
  const [loading, setLoading] = useState(null);
  const [log, setLog] = useState([]);

  const addLog = (msg, type = 'success') => {
    const entry = { msg, type, time: new Date()?.toLocaleTimeString() };
    setLog(prev => [entry, ...prev]?.slice(0, 10));
  };

  const handlePayoutCompleted = async (creatorId = 'creator_demo') => {
    setLoading('payout');
    await analyticsCacheService?.onPayoutCompleted(creatorId);
    addLog(`Payout completed → invalidated earnings & revenue_streams for ${creatorId}`);
    setLoading(null);
  };

  const handleTierUpgraded = async (creatorId = 'creator_demo') => {
    setLoading('tier');
    await analyticsCacheService?.onTierUpgraded(creatorId);
    addLog(`Tier upgraded → invalidated tier_data & predictions for ${creatorId}`);
    setLoading(null);
  };

  const handlePruneExpired = async () => {
    setLoading('prune');
    await analyticsCacheService?.pruneExpired();
    addLog('Pruned all expired cache entries from IndexedDB');
    setLoading(null);
  };

  const handleResetMetrics = () => {
    analyticsCacheService?.resetMetrics();
    addLog('Cache metrics reset to zero', 'info');
  };

  const triggers = [
    {
      id: 'payout',
      label: 'Simulate Payout Completed',
      description: 'Invalidates earnings + revenue_streams cache',
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      action: handlePayoutCompleted
    },
    {
      id: 'tier',
      label: 'Simulate Tier Upgrade',
      description: 'Invalidates tier_data + predictions cache',
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      action: handleTierUpgraded
    },
    {
      id: 'prune',
      label: 'Prune Expired Entries',
      description: 'Remove stale entries from IndexedDB storage',
      icon: Trash2,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      action: handlePruneExpired
    },
    {
      id: 'reset',
      label: 'Reset Metrics',
      description: 'Reset hit/miss counters to zero',
      icon: RefreshCw,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      action: handleResetMetrics
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-5">
        <Trash2 className="w-5 h-5 text-red-400" />
        <h2 className="text-lg font-bold text-white">Cache Invalidation Triggers</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {triggers?.map(trigger => (
          <button
            key={trigger?.id}
            onClick={trigger?.action}
            disabled={loading === trigger?.id}
            className={`${trigger?.bg} rounded-xl p-4 border border-gray-800 text-left hover:border-gray-700 transition-colors disabled:opacity-50`}
          >
            <div className="flex items-center gap-2 mb-2">
              <trigger.icon className={`w-4 h-4 ${trigger?.color}`} />
              <span className="text-white text-sm font-medium">
                {loading === trigger?.id ? 'Processing...' : trigger?.label}
              </span>
            </div>
            <p className="text-gray-400 text-xs">{trigger?.description}</p>
          </button>
        ))}
      </div>
      {/* Invalidation log */}
      {log?.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Invalidation Log</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {log?.map((entry, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-xs">{entry?.msg}</p>
                  <p className="text-gray-600 text-xs">{entry?.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheInvalidationPanel;
