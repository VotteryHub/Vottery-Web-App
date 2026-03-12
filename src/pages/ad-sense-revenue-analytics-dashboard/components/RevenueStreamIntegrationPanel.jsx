import React from 'react';
import { TrendingUp, PieChart, Wallet } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RevenueStreamIntegrationPanel = ({ data }) => {
  const revenueBreakdown = [
    { name: 'Participation Fees', value: data?.revenueStreams?.participationFees, color: '#10B981' },
    { name: 'Advertiser Spending', value: data?.revenueStreams?.advertiserSpending, color: '#3B82F6' },
    { name: 'AdSense Earnings', value: data?.revenueStreams?.adsenseEarnings, color: '#8B5CF6' },
  ];

  const forecastData = [
    { month: 'Feb 2026', participation: 48000, advertiser: 82000, adsense: 14500, total: 144500 },
    { month: 'Mar 2026', participation: 51000, advertiser: 87000, adsense: 16200, total: 154200 },
    { month: 'Apr 2026', participation: 54500, advertiser: 92000, adsense: 18100, total: 164600 },
    { month: 'May 2026', participation: 58000, advertiser: 98000, adsense: 20300, total: 176300 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-600" />
              Revenue Distribution
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-green-600" />
              Revenue Breakdown
            </h2>
          </div>
          <div className="space-y-4">
            {revenueBreakdown?.map((stream, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stream?.name}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${stream?.value?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(stream?.value / data?.revenueStreams?.total) * 100}%`,
                      backgroundColor: stream?.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Total Combined Revenue
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${data?.revenueStreams?.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Revenue Forecasting (Next 4 Months)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Month
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Participation Fees
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Advertiser Spending
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  AdSense Earnings
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Projected
                </th>
              </tr>
            </thead>
            <tbody>
              {forecastData?.map((forecast, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                    {forecast?.month}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    ${forecast?.participation?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    ${forecast?.advertiser?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    ${forecast?.adsense?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-green-600 dark:text-green-400 text-right">
                    ${forecast?.total?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueStreamIntegrationPanel;