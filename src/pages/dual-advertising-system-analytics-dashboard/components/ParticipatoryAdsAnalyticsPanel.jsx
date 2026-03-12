import React from 'react';
import Icon from '../../../components/AppIcon';

const ParticipatoryAdsAnalyticsPanel = ({ data }) => {
  const engagement = data?.participatoryEngagement || 0;
  const revenue = data?.revenueAttribution?.internalRevenue || 0;
  const fillRate = data?.fillRates?.internalFillRate || 0;

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Users" size={24} className="text-green-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Participatory Ads Engagement Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Votes</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {engagement?.toLocaleString()}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Engagement Rate</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {fillRate > 0 ? ((engagement / fillRate) * 100)?.toFixed(1) : 0}%
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revenue per Engagement</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${engagement > 0 ? (revenue / engagement)?.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
      {/* Ad Format Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Ad Format Performance
        </h3>
        
        <div className="space-y-4">
          {[
            { format: 'Market Research', votes: 1250, revenue: 625, rate: 85 },
            { format: 'Hype Prediction', votes: 980, revenue: 490, rate: 78 },
            { format: 'CSR Elections', votes: 720, revenue: 288, rate: 92 }
          ]?.map((format, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{format?.format}</span>
                <span className="text-sm text-green-600 dark:text-green-400">{format?.rate}% engagement</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Votes</p>
                  <p className="font-bold text-gray-900 dark:text-white">{format?.votes?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="font-bold text-gray-900 dark:text-white">${format?.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Zone Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Purchasing Power Zone Performance
        </h3>
        
        <div className="space-y-3">
          {[
            { zone: 'Zone 1 (Premium)', engagement: 95, revenue: 1200 },
            { zone: 'Zone 2 (High)', engagement: 88, revenue: 980 },
            { zone: 'Zone 3 (Upper-Mid)', engagement: 82, revenue: 750 },
            { zone: 'Zone 4 (Mid)', engagement: 75, revenue: 620 },
            { zone: 'Zone 5 (Lower-Mid)', engagement: 68, revenue: 480 },
            { zone: 'Zone 6 (Low)', engagement: 62, revenue: 350 },
            { zone: 'Zone 7 (Basic)', engagement: 55, revenue: 220 },
            { zone: 'Zone 8 (Entry)', engagement: 48, revenue: 150 }
          ]?.map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{zone?.zone}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {zone?.engagement}% engagement
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  ${zone?.revenue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipatoryAdsAnalyticsPanel;
