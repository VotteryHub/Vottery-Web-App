import React from 'react';
import Icon from '../../../components/AppIcon';

const AdSensePerformancePanel = ({ data }) => {
  const adsenseFills = data?.fillRates?.adsenseFills || 0;
  const adsenseRevenue = data?.revenueAttribution?.adsenseRevenue || 0;
  const fillRate = data?.fillRates?.adsenseFillRate || 0;

  return (
    <div className="space-y-6">
      {/* AdSense Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="DollarSign" size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Google AdSense Performance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Impressions</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {adsenseFills?.toLocaleString()}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fill Rate</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {fillRate}%
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Revenue</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${adsenseRevenue?.toFixed(2)}
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">CPM</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ${adsenseFills > 0 ? ((adsenseRevenue / adsenseFills) * 1000)?.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
      {/* Placement Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Ad Placement Effectiveness
        </h3>
        
        <div className="space-y-4">
          {[
            { placement: 'Home Feed - After Stories', impressions: 2450, ctr: 0.8, revenue: 4.90 },
            { placement: 'Home Feed - Mid Feed 1', impressions: 1980, ctr: 0.6, revenue: 3.96 },
            { placement: 'Home Feed - Mid Feed 2', impressions: 1520, ctr: 0.5, revenue: 3.04 },
            { placement: 'Elections Hub - Sidebar', impressions: 980, ctr: 0.4, revenue: 1.96 },
            { placement: 'Profile - Sidebar', impressions: 720, ctr: 0.3, revenue: 1.44 }
          ]?.map((placement, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">{placement?.placement}</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  ${placement?.revenue?.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Impressions</p>
                  <p className="font-bold text-gray-900 dark:text-white">{placement?.impressions?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">CTR</p>
                  <p className="font-bold text-gray-900 dark:text-white">{placement?.ctr}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Optimization Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          AdSense Optimization Insights
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-600">
            <div className="flex items-start gap-3">
              <Icon name="TrendingUp" size={20} className="text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  High-Performing Placements
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  "After Stories" placement shows 0.8% CTR, 60% above platform average. Consider increasing ad density in this position.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border-l-4 border-green-600">
            <div className="flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Fallback System Working Effectively
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AdSense successfully fills {fillRate}% of slots when internal ads unavailable, ensuring zero revenue loss.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-600">
            <div className="flex items-start gap-3">
              <Icon name="DollarSign" size={20} className="text-purple-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  Revenue Optimization Opportunity
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Increasing internal ad inventory by 15% could reduce AdSense dependency and boost overall revenue by $250-350/month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSensePerformancePanel;
