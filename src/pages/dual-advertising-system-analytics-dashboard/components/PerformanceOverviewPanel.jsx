import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOverviewPanel = ({ data }) => {
  const fillRates = data?.fillRates || {};
  const revenue = data?.revenueAttribution || {};
  const engagement = data?.participatoryEngagement || 0;

  const metrics = [
    {
      label: 'Total Ad Slots Filled',
      value: fillRates?.total || 0,
      icon: 'Grid',
      color: 'blue',
      trend: '+12%'
    },
    {
      label: 'Internal Ads Fill Rate',
      value: `${fillRates?.internalFillRate || 0}%`,
      icon: 'Users',
      color: 'green',
      trend: '+8%'
    },
    {
      label: 'AdSense Fallback Rate',
      value: `${fillRates?.adsenseFillRate || 0}%`,
      icon: 'DollarSign',
      color: 'purple',
      trend: '-5%'
    },
    {
      label: 'Total Revenue',
      value: `$${revenue?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: 'TrendingUp',
      color: 'orange',
      trend: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${metric?.color}-100 dark:bg-${metric?.color}-900/20 rounded-lg`}>
                <Icon name={metric?.icon} size={24} className={`text-${metric?.color}-600 dark:text-${metric?.color}-400`} />
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                {metric?.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric?.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metric?.label}
            </p>
          </div>
        ))}
      </div>
      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internal Participatory Ads */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon name="Users" size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Internal Participatory Ads
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Primary Revenue System</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Slots Filled</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {fillRates?.internalFills || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Fill Rate</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {fillRates?.internalFillRate || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Revenue</span>
              <span className="font-bold text-gray-900 dark:text-white">
                ${revenue?.internalRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Revenue Share</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {revenue?.internalPercentage || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">User Engagement</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {engagement?.toLocaleString()} votes
              </span>
            </div>
          </div>
        </div>

        {/* Google AdSense */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon name="DollarSign" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Google AdSense
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Secondary Fallback Revenue</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Slots Filled</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {fillRates?.adsenseFills || 0}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Fill Rate</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {fillRates?.adsenseFillRate || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Revenue (Estimated)</span>
              <span className="font-bold text-gray-900 dark:text-white">
                ${revenue?.adsenseRevenue?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Revenue Share</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {revenue?.adsensePercentage || 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Impressions</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {fillRates?.adsenseFills?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Waterfall Logic Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Ad Slot Waterfall Logic
        </h3>
        
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3">
              <Icon name="Grid" size={48} className="text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Ad Slot Available</p>
          </div>
          
          <Icon name="ArrowRight" size={32} className="text-gray-400" />
          
          <div className="text-center">
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-3">
              <Icon name="Users" size={48} className="text-green-600 dark:text-green-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Try Internal Ads</p>
            <p className="text-sm text-green-600 dark:text-green-400">Priority 1</p>
          </div>
          
          <Icon name="ArrowRight" size={32} className="text-gray-400" />
          
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3">
              <Icon name="DollarSign" size={48} className="text-purple-600 dark:text-purple-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Fallback to AdSense</p>
            <p className="text-sm text-purple-600 dark:text-purple-400">Priority 2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverviewPanel;
