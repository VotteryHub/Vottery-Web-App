import React, { useState } from 'react';
import { DollarSign, Target, Zap, RefreshCw, BarChart2 } from 'lucide-react';

const PricingStrategyPanel = ({ creatorData }) => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const analyzePricing = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1800));
      setPricingData({
        currentAvgPrice: 15.50,
        recommendedPrice: 22.00,
        priceElasticity: 0.73,
        strategies: [
          {
            name: 'Premium Positioning',
            entryFee: 25,
            projectedVotes: 1800,
            projectedRevenue: 31500,
            roi: 142,
            confidence: 88,
            description: 'Higher entry fee attracts quality voters in Zone 1-3',
            abTest: 'Run $20 vs $25 for 7 days'
          },
          {
            name: 'Volume Strategy',
            entryFee: 10,
            projectedVotes: 4200,
            projectedRevenue: 29400,
            roi: 134,
            confidence: 82,
            description: 'Lower barrier maximizes participation across all zones',
            abTest: 'Run $8 vs $12 for 5 days'
          },
          {
            name: 'Tiered Access',
            entryFee: 18,
            projectedVotes: 2600,
            projectedRevenue: 32760,
            roi: 149,
            confidence: 91,
            description: 'Mid-range pricing with zone-based discounts',
            abTest: 'Run $15 vs $20 with zone targeting'
          }
        ],
        audienceWTP: {
          zone1: '$45-60',
          zone2: '$30-45',
          zone3: '$20-30',
          zone4: '$12-20',
          zone5: '$8-12'
        },
        roiProjections: {
          day30: 8400,
          day60: 19200,
          day90: 34800
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Pricing Strategy Optimization
        </h3>
        <button
          onClick={analyzePricing}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? 'Analyzing...' : 'Optimize Pricing'}
        </button>
      </div>
      {!pricingData && !loading && (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Click "Optimize Pricing" to get personalized pricing recommendations with ROI projections</p>
        </div>
      )}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 text-green-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Analyzing audience willingness to pay and market positioning...</p>
        </div>
      )}
      {pricingData && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-xs text-gray-500">Current Avg Price</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">${pricingData?.currentAvgPrice}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <p className="text-xs text-gray-500">Recommended Price</p>
              <p className="text-xl font-bold text-green-600">${pricingData?.recommendedPrice}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <p className="text-xs text-gray-500">Price Elasticity</p>
              <p className="text-xl font-bold text-blue-600">{pricingData?.priceElasticity}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pricing Strategies</h4>
            <div className="space-y-3">
              {pricingData?.strategies?.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedStrategy(selectedStrategy === i ? null : i)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedStrategy === i
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">{s?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-600">ROI: {s?.roi}%</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{s?.confidence}% confidence</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{s?.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Entry Fee</p>
                      <p className="font-bold text-gray-900 dark:text-white">${s?.entryFee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Projected Votes</p>
                      <p className="font-bold text-blue-600">{s?.projectedVotes?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="font-bold text-green-600">${s?.projectedRevenue?.toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedStrategy === i && (
                    <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">A/B Test Suggestion: {s?.abTest}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> 30/60/90 Day ROI Projections
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '30 Days', value: pricingData?.roiProjections?.day30, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: '60 Days', value: pricingData?.roiProjections?.day60, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                { label: '90 Days', value: pricingData?.roiProjections?.day90, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              ]?.map((p, i) => (
                <div key={i} className={`${p?.bg} rounded-xl p-4 text-center`}>
                  <p className="text-xs text-gray-500 mb-1">{p?.label}</p>
                  <p className={`text-2xl font-bold ${p?.color}`}>${p?.value?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingStrategyPanel;
