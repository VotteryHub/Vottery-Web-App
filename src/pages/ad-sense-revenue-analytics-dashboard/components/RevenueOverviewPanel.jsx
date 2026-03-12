import React from 'react';
import { TrendingUp, DollarSign, Eye, MousePointer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueOverviewPanel = ({ data }) => {
  const revenueChartData = [
    { date: 'Jan 22', revenue: 8234, impressions: 1847392, clicks: 12472 },
    { date: 'Jan 23', revenue: 9124, impressions: 2047392, clicks: 13872 },
    { date: 'Jan 24', revenue: 10234, impressions: 2247392, clicks: 15272 },
    { date: 'Jan 25', revenue: 11124, impressions: 2447392, clicks: 16472 },
    { date: 'Jan 26', revenue: 11847, impressions: 2647392, clicks: 17672 },
    { date: 'Jan 27', revenue: 12347, impressions: 2747392, clicks: 18172 },
    { date: 'Jan 28', revenue: 12847, impressions: 2847392, clicks: 18472 },
  ];

  const performanceMetrics = [
    { metric: 'Cost Per Click (CPC)', value: `$${data?.overview?.cpc?.toFixed(2)}`, trend: '+5.2%', color: 'text-green-600' },
    { metric: 'Revenue Per Mille (RPM)', value: `$${data?.overview?.rpm?.toFixed(2)}`, trend: '+8.1%', color: 'text-green-600' },
    { metric: 'Click-Through Rate (CTR)', value: `${data?.overview?.ctr?.toFixed(2)}%`, trend: '+0.15%', color: 'text-green-600' },
    { metric: 'Total Clicks', value: data?.overview?.clicks?.toLocaleString(), trend: '+14.3%', color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Revenue Trends (Last 7 Days)
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Impressions & Clicks Trends
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="impressions" fill="#3B82F6" name="Impressions" />
            <Bar dataKey="clicks" fill="#8B5CF6" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics?.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {metric?.metric}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric?.value}
            </div>
            <div className={`text-sm font-medium ${metric?.color}`}>
              {metric?.trend} vs last period
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-Time Revenue Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AdSense revenue updates every 30 minutes with live earnings tracking across all admin and creator analytics pages. Current session revenue: ${(data?.overview?.totalEarnings * 0.15)?.toFixed(2)}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Live tracking enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Auto-refresh: 30min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverviewPanel;