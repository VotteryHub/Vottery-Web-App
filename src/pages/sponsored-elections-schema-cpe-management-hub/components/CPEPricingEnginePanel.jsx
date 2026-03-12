import React, { useState } from 'react';
import { Settings, Calculator, TrendingUp } from 'lucide-react';

const CPEPricingEnginePanel = ({ zones }) => {
  const [selectedZone, setSelectedZone] = useState(zones?.[0]?.zone_code || 'PT1');
  const [adFormat, setAdFormat] = useState('MARKET_RESEARCH');
  const [audienceQuality, setAudienceQuality] = useState('standard');
  const [estimatedVotes, setEstimatedVotes] = useState(1000);

  const calculateCPE = () => {
    const zone = zones?.find(z => z?.zone_code === selectedZone);
    if (!zone) return 0;

    let baseCPE = zone?.base_cpe * zone?.premium_multiplier;

    // Format multiplier
    const formatMultipliers = {
      MARKET_RESEARCH: 1.2,
      HYPE_PREDICTION: 1.0,
      CSR: 0.8
    };
    baseCPE *= formatMultipliers?.[adFormat] || 1.0;

    // Audience quality multiplier
    const qualityMultipliers = {
      standard: 1.0,
      high: 1.2,
      premium: 1.5
    };
    baseCPE *= qualityMultipliers?.[audienceQuality] || 1.0;

    return baseCPE?.toFixed(2);
  };

  const calculateTotalBudget = () => {
    return (calculateCPE() * estimatedVotes)?.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          CPE Pricing Engine
        </h2>
        <p className="text-gray-600 mb-6">
          Calculate optimal Cost-Per-Engagement pricing with dynamic bid optimization
        </p>

        {/* Pricing Calculator */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            Interactive Pricing Calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e?.target?.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {zones?.map((zone) => (
                    <option key={zone?.zone_code} value={zone?.zone_code}>
                      {zone?.zone_name} ({zone?.zone_code}) - ${zone?.base_cpe}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Format</label>
                <select
                  value={adFormat}
                  onChange={(e) => setAdFormat(e?.target?.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MARKET_RESEARCH">Market Research (+20%)</option>
                  <option value="HYPE_PREDICTION">Hype Prediction (Base)</option>
                  <option value="CSR">CSR (-20%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audience Quality</label>
                <select
                  value={audienceQuality}
                  onChange={(e) => setAudienceQuality(e?.target?.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="standard">Standard (1.0x)</option>
                  <option value="high">High Quality (+20%)</option>
                  <option value="premium">Premium Badge Holders (+50%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Votes</label>
                <input
                  type="number"
                  value={estimatedVotes}
                  onChange={(e) => setEstimatedVotes(parseInt(e?.target?.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">Calculated CPE</div>
                <div className="text-5xl font-bold text-blue-600">${calculateCPE()}</div>
                <div className="text-sm text-gray-500 mt-1">per engagement</div>
              </div>

              <div className="space-y-3 pt-6 border-t border-blue-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estimated Votes:</span>
                  <span className="font-medium text-gray-900">{estimatedVotes?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget:</span>
                  <span className="font-medium text-gray-900">${parseFloat(calculateTotalBudget())?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Engagement Rate:</span>
                  <span className="font-medium text-gray-900">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected Impressions:</span>
                  <span className="font-medium text-gray-900">{Math.round(estimatedVotes / 0.042)?.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Campaign with These Settings
              </button>
            </div>
          </div>
        </div>

        {/* Bid Optimization Recommendations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Automated Bid Optimization Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="font-medium text-gray-900">Optimal Time Slots</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Peak engagement hours for your target audience
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">6 PM - 9 PM:</span>
                  <span className="font-medium text-green-600">+35% engagement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">12 PM - 2 PM:</span>
                  <span className="font-medium text-green-600">+20% engagement</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="font-medium text-gray-900">Budget Pacing</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Recommended daily spend to maximize ROI
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Budget:</span>
                  <span className="font-medium text-blue-600">${(parseFloat(calculateTotalBudget()) / 7)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign Duration:</span>
                  <span className="font-medium text-blue-600">7 days</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="font-medium text-gray-900">A/B Testing</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Test multiple creatives for optimal performance
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Variant A:</span>
                  <span className="font-medium text-purple-600">50% budget</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Variant B:</span>
                  <span className="font-medium text-purple-600">50% budget</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance-Based Pricing Tiers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance-Based Pricing Tiers</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <div className="font-medium text-gray-900">Standard Tier</div>
                <div className="text-sm text-gray-600">Base CPE pricing with standard targeting</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">${calculateCPE()}</div>
                <div className="text-xs text-gray-500">per engagement</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <div className="font-medium text-gray-900">Performance Tier</div>
                <div className="text-sm text-gray-600">Pay only for quality engagements (5+ sec view time)</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">${(calculateCPE() * 1.3)?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">per quality engagement</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <div className="font-medium text-gray-900">Conversion Tier</div>
                <div className="text-sm text-gray-600">Pay only for conversions (click-through to website)</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">${(calculateCPE() * 2.5)?.toFixed(2)}</div>
                <div className="text-xs text-gray-500">per conversion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPEPricingEnginePanel;