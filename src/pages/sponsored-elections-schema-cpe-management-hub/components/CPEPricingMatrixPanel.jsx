import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

const CPEPricingMatrixPanel = ({ zones }) => {
  const getTierColor = (zoneName) => {
    if (zoneName?.includes('Premium')) return 'from-yellow-400 to-yellow-600';
    if (zoneName?.includes('Mid')) return 'from-blue-400 to-blue-600';
    if (zoneName?.includes('Emerging')) return 'from-green-400 to-green-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          CPE Pricing Matrix Across 8 Purchasing Power Zones
        </h2>
        <p className="text-gray-600 mb-6">
          Dynamic Cost-Per-Engagement pricing optimized for each region's purchasing power and advertiser ROI
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones?.map((zone) => (
            <div key={zone?.id} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
              <div className={`bg-gradient-to-r ${getTierColor(zone?.zone_name)} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{zone?.zone_name}</div>
                    <div className="text-sm opacity-90">{zone?.zone_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${zone?.base_cpe}</div>
                    <div className="text-xs opacity-90">Base CPE</div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Premium Multiplier</span>
                  <span className="font-medium text-gray-900">{zone?.premium_multiplier}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Purchasing Power Index</span>
                  <span className="font-medium text-gray-900">{zone?.purchasing_power_index}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-2">Included Countries</div>
                  <div className="flex flex-wrap gap-1">
                    {zone?.countries?.slice(0, 6)?.map((country) => (
                      <span key={country} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {country}
                      </span>
                    ))}
                    {zone?.countries?.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        +{zone?.countries?.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-Time Engagement Cost Calculator */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Real-Time Engagement Cost Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Market Research Format</div>
            <div className="space-y-2">
              {zones?.slice(0, 3)?.map((zone) => (
                <div key={zone?.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{zone?.zone_code}</span>
                  <span className="font-medium text-blue-600">${(zone?.base_cpe * zone?.premium_multiplier * 1.2)?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Hype Prediction Format</div>
            <div className="space-y-2">
              {zones?.slice(0, 3)?.map((zone) => (
                <div key={zone?.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{zone?.zone_code}</span>
                  <span className="font-medium text-purple-600">${(zone?.base_cpe * zone?.premium_multiplier * 1.0)?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">CSR Format</div>
            <div className="space-y-2">
              {zones?.slice(0, 3)?.map((zone) => (
                <div key={zone?.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{zone?.zone_code}</span>
                  <span className="font-medium text-green-600">${(zone?.base_cpe * zone?.premium_multiplier * 0.8)?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Dynamic Bidding Algorithms */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Dynamic Bidding Algorithms
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-2">Audience Quality Multiplier</div>
            <div className="text-sm text-gray-600">
              CPE automatically adjusts based on user engagement history, badge levels, and voting accuracy
            </div>
            <div className="mt-2 text-xs text-blue-600 font-medium">
              High-quality voters: +20% CPE | Premium badge holders: +30% CPE
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
            <div className="font-semibold text-gray-900 mb-2">Conversion Potential Algorithm</div>
            <div className="text-sm text-gray-600">
              Real-time bid optimization based on predicted conversion rates and historical campaign performance
            </div>
            <div className="mt-2 text-xs text-green-600 font-medium">
              High conversion zones: +15% CPE | Repeat engagers: +25% CPE
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="font-semibold text-gray-900 mb-2">Budget Allocation Recommendations</div>
            <div className="text-sm text-gray-600">
              AI-powered suggestions for optimal budget distribution across zones and ad formats
            </div>
            <div className="mt-2 text-xs text-yellow-600 font-medium">
              Recommended: 40% Premium Tier | 35% Mid Tier | 25% Emerging Tier
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPEPricingMatrixPanel;