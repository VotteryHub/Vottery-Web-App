import React from 'react';
import { TrendingUp, Users, DollarSign, Clock, BarChart3 } from 'lucide-react';

const PerformanceAnalytics = ({ experiments = [] }) => {
  const performanceData = {
    conversionRateChange: 12.4,
    revenueImpact: 8450,
    userEngagementChange: 18.2,
    avgSessionDuration: 245,
    bounceRateChange: -5.3
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">+{performanceData?.conversionRateChange}%</span>
          </div>
          <h3 className="text-sm font-medium text-green-900 dark:text-green-100">Conversion Rate Lift</h3>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">vs. control group</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${performanceData?.revenueImpact?.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Revenue Impact</h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">additional revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">+{performanceData?.userEngagementChange}%</span>
          </div>
          <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">User Engagement</h3>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">interaction increase</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{performanceData?.avgSessionDuration}s</span>
          </div>
          <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">Avg Session Duration</h3>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">time on site</p>
        </div>
      </div>
      {/* Conversion Rate Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Conversion Rate Analysis
          </h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Control Group</h3>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">2.4%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gray-600" style={{ width: '24%' }} />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                120 conversions / 5,000 visitors
              </div>
            </div>

            <div className="border border-green-200 dark:border-green-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Variant A (Winner)</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+31.7%</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">3.2%</span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '32%' }} />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                158 conversions / 5,000 visitors
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Variant B</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+20.8%</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">2.9%</span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '29%' }} />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                145 conversions / 5,000 visitors
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* User Behavior Impact */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            User Behavior Impact
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Bounce Rate</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">42.3%</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">{performanceData?.bounceRateChange}%</span>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pages per Session</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">4.2</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+8.5%</span>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Return Rate</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">28.7%</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cohort Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Long-Term Effect Tracking (Cohort Analysis)
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Cohort</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Week 1</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Week 2</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Week 3</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Week 4</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Control</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">2.4%</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">2.3%</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">2.5%</td>
                  <td className="text-right py-3 px-4 text-gray-900 dark:text-white">2.4%</td>
                </tr>
                <tr className="bg-green-50 dark:bg-green-900/10">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">Variant A</td>
                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400 font-medium">3.2%</td>
                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400 font-medium">3.1%</td>
                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400 font-medium">3.3%</td>
                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400 font-medium">3.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Variant A shows consistent performance improvement across all cohorts, indicating sustainable long-term impact.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;