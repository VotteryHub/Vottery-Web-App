import React from 'react';
import Icon from '../../../components/AppIcon';

const RevenueAttributionPanel = ({ data }) => {
  const revenue = data?.revenueAttribution || {};
  const fillRates = data?.fillRates || {};

  const revenueBreakdown = [
    {
      source: 'Internal Participatory Ads',
      amount: revenue?.internalRevenue || 0,
      percentage: revenue?.internalPercentage || 0,
      color: 'green',
      icon: 'Users'
    },
    {
      source: 'Google AdSense',
      amount: revenue?.adsenseRevenue || 0,
      percentage: revenue?.adsensePercentage || 0,
      color: 'purple',
      icon: 'DollarSign'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Total Revenue Overview */}
      <div className="bg-gradient-to-br from-green-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 mb-2">Total Advertising Revenue</p>
            <h2 className="text-5xl font-bold">
              ${revenue?.totalRevenue?.toFixed(2) || '0.00'}
            </h2>
            <p className="text-white/80 mt-2">Across all advertising systems</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full">
            <Icon name="TrendingUp" size={48} />
          </div>
        </div>
      </div>
      {/* Revenue Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {revenueBreakdown?.map((source, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-${source?.color}-100 dark:bg-${source?.color}-900/20 rounded-lg`}>
                <Icon name={source?.icon} size={24} className={`text-${source?.color}-600 dark:text-${source?.color}-400`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{source?.source}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${source?.amount?.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Revenue Share</span>
                <span className={`font-bold text-${source?.color}-600 dark:text-${source?.color}-400`}>
                  {source?.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`bg-${source?.color}-600 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${source?.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Detailed Earnings Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Detailed Earnings Breakdown
        </h3>
        
        <div className="space-y-4">
          {/* Internal Ads Breakdown */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900 dark:text-white">Internal Participatory Ads</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                ${revenue?.internalRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Slots Filled</p>
                <p className="font-bold text-gray-900 dark:text-white">{fillRates?.internalFills || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Avg. Revenue/Slot</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  ${fillRates?.internalFills > 0 ? (revenue?.internalRevenue / fillRates?.internalFills)?.toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
                <p className="font-bold text-green-600 dark:text-green-400">Processed</p>
              </div>
            </div>
          </div>
          
          {/* AdSense Breakdown */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-900 dark:text-white">Google AdSense</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                ${revenue?.adsenseRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Impressions</p>
                <p className="font-bold text-gray-900 dark:text-white">{fillRates?.adsenseFills || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Estimated CPM</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  ${fillRates?.adsenseFills > 0 ? ((revenue?.adsenseRevenue / fillRates?.adsenseFills) * 1000)?.toFixed(2) : '0.00'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
                <p className="font-bold text-orange-600 dark:text-orange-400">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Profit Margin Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Profit Margin Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Internal Ads Profit Margin</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">70%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              After platform costs and creator revenue share
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">AdSense Profit Margin</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">68%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              After Google's revenue share (32%)
            </p>
          </div>
        </div>
      </div>
      {/* Automated Reporting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Automated Reporting Capabilities
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Daily Revenue Report</span>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Mail" size={20} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Weekly Executive Summary</span>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Download" size={20} className="text-green-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Monthly Financial Export</span>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAttributionPanel;
