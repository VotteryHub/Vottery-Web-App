import React from 'react';
import Icon from '../../../components/AppIcon';

const ComparativeAnalysisPanel = ({ data }) => {
  const fillRates = data?.fillRates || {};
  const revenue = data?.revenueAttribution || {};

  const comparisonMetrics = [
    {
      metric: 'Fill Rate',
      internal: fillRates?.internalFillRate || 0,
      adsense: fillRates?.adsenseFillRate || 0,
      unit: '%',
      winner: 'internal'
    },
    {
      metric: 'Revenue per Slot',
      internal: fillRates?.internalFills > 0 ? (revenue?.internalRevenue / fillRates?.internalFills) : 0,
      adsense: fillRates?.adsenseFills > 0 ? (revenue?.adsenseRevenue / fillRates?.adsenseFills) : 0,
      unit: '$',
      winner: 'internal'
    },
    {
      metric: 'User Engagement',
      internal: 85,
      adsense: 0,
      unit: '%',
      winner: 'internal'
    },
    {
      metric: 'Implementation Complexity',
      internal: 8,
      adsense: 3,
      unit: '/10',
      winner: 'adsense'
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Performance Ratios */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          System Performance Comparison
        </h3>
        
        <div className="space-y-6">
          {comparisonMetrics?.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{metric?.metric}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Winner: {metric?.winner === 'internal' ? 'Internal Ads' : 'AdSense'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  metric?.winner === 'internal' ?'bg-green-50 dark:bg-green-900/10 border-2 border-green-600' :'bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Internal Participatory</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric?.unit === '$' ? '$' : ''}{metric?.internal?.toFixed(2)}{metric?.unit !== '$' ? metric?.unit : ''}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  metric?.winner === 'adsense' ?'bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-600' :'bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Google AdSense</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric?.unit === '$' ? '$' : ''}{metric?.adsense?.toFixed(2)}{metric?.unit !== '$' ? metric?.unit : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Revenue Contribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Revenue Contribution Breakdown
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Participatory Ads</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {revenue?.internalPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${revenue?.internalPercentage || 0}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google AdSense</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {revenue?.adsensePercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${revenue?.adsensePercentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Optimization Opportunities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Strategic Optimization Opportunities
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-4 border-green-600">
            <div className="flex items-start gap-3">
              <Icon name="TrendingUp" size={20} className="text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Increase Internal Ad Inventory
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current internal fill rate: {fillRates?.internalFillRate}%. Target: 85%. Opportunity: +${((revenue?.totalRevenue * 0.15) || 0)?.toFixed(2)}/month
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-600">
            <div className="flex items-start gap-3">
              <Icon name="Target" size={20} className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Optimize AdSense Placement
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AdSense fills {fillRates?.adsenseFillRate}% of slots. Optimize placement positions to maximize CPM and reduce wasted impressions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-600">
            <div className="flex items-start gap-3">
              <Icon name="Zap" size={20} className="text-purple-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Balanced Advertising Strategy
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Maintain internal ads as primary ({revenue?.internalPercentage}%) while leveraging AdSense fallback ({revenue?.adsensePercentage}%) for optimal revenue diversification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeAnalysisPanel;
