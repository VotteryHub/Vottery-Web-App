import React, { useState } from 'react';
import { Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import analyticsCacheService, { TTL_CONFIG } from '../../../services/analyticsCacheService';

const TTL_LABELS = {
  tier_data: 'Tier Data',
  earnings: 'Earnings',
  predictions: 'Predictions',
  revenue_streams: 'Revenue Streams',
  churn_risk: 'Churn Risk',
  zone_data: 'Zone Data'
};

const SmartCacheEnginePanel = () => {
  const [invalidating, setInvalidating] = useState(null);
  const [invalidated, setInvalidated] = useState([]);

  const handleInvalidate = async (dataType) => {
    setInvalidating(dataType);
    await analyticsCacheService?.invalidate(dataType);
    setInvalidated(prev => [...prev, dataType]);
    setInvalidating(null);
    setTimeout(() => setInvalidated(prev => prev?.filter(k => k !== dataType)), 2000);
  };

  const handleWarmCache = async () => {
    await analyticsCacheService?.warmCache({
      tier_data: { params: {}, fetchFn: async () => ({ warmed: true, timestamp: Date.now() }) },
      earnings: { params: {}, fetchFn: async () => ({ warmed: true, timestamp: Date.now() }) },
      predictions: { params: {}, fetchFn: async () => ({ warmed: true, timestamp: Date.now() }) }
    });
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Smart Cache Engine</h2>
        </div>
        <button
          onClick={handleWarmCache}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
        >
          Warm Cache
        </button>
      </div>
      <div className="space-y-3">
        {Object.entries(TTL_LABELS)?.map(([dataType, label]) => {
          const ttlMs = TTL_CONFIG?.[dataType] || TTL_CONFIG?.default;
          const ttlMin = ttlMs / 60000;
          const isInvalidating = invalidating === dataType;
          const wasInvalidated = invalidated?.includes(dataType);

          return (
            <div key={dataType} className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-gray-400 text-xs">TTL: {ttlMin} min{ttlMin !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {wasInvalidated && <CheckCircle className="w-4 h-4 text-green-400" />}
                <button
                  onClick={() => handleInvalidate(dataType)}
                  disabled={isInvalidating}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {isInvalidating ? 'Clearing...' : 'Invalidate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-300">
            Stale-while-revalidate: Cached data is served immediately while fresh data is fetched in the background. Cache warming prefetches critical data on app load.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartCacheEnginePanel;
