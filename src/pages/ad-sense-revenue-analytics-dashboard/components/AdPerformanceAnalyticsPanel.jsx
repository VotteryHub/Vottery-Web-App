import React from 'react';
import { Eye, MousePointer, Users, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdPerformanceAnalyticsPanel = ({ data }) => {
  const performanceData = [
    { hour: '00:00', impressions: 45000, clicks: 280, engagement: 62 },
    { hour: '04:00', impressions: 32000, clicks: 195, engagement: 58 },
    { hour: '08:00', impressions: 78000, clicks: 520, engagement: 72 },
    { hour: '12:00', impressions: 125000, clicks: 890, engagement: 85 },
    { hour: '16:00', impressions: 98000, clicks: 670, engagement: 78 },
    { hour: '20:00', impressions: 67000, clicks: 445, engagement: 68 },
  ];

  const audienceSegments = [
    { segment: 'Admin Users', impressions: 847392, clicks: 5472, ctr: 0.65, revenue: 2847.52 },
    { segment: 'Creator Analysts', impressions: 647392, clicks: 4472, ctr: 0.69, revenue: 1847.52 },
    { segment: 'Platform Managers', impressions: 547392, clicks: 3472, ctr: 0.63, revenue: 1547.52 },
    { segment: 'Revenue Analysts', impressions: 447392, clicks: 2872, ctr: 0.64, revenue: 1247.52 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-blue-600" />
            24-Hour Performance Analytics
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} name="Impressions" />
            <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={2} name="Clicks" />
            <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} name="Engagement %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Audience Engagement Correlation
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Audience Segment
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Impressions
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Clicks
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  CTR
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {audienceSegments?.map((segment, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">
                    {segment?.segment}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {segment?.impressions?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {segment?.clicks?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {segment?.ctr?.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-green-600 dark:text-green-400 text-right">
                    ${segment?.revenue?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
              <MousePointer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Peak Performance Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Highest engagement occurs between 12:00-16:00 with 85% engagement correlation. Optimize ad delivery during these hours.
              </p>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12:00 - 16:00</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Top Performing Segment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Creator Analysts show highest CTR at 0.69% with strong revenue generation. Focus targeting on this segment.
              </p>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Creator Analysts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPerformanceAnalyticsPanel;