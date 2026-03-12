import React from 'react';
import { Users, DollarSign, TrendingUp, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CreatorRevenueSharePanel = ({ data }) => {
  const sharingData = [
    { month: 'Jan', platformRevenue: 102730, creatorRevenue: 34243 },
    { month: 'Feb', platformRevenue: 108250, creatorRevenue: 36083 },
    { month: 'Mar', platformRevenue: 115650, creatorRevenue: 38550 },
    { month: 'Apr', platformRevenue: 123450, creatorRevenue: 41150 },
  ];

  const allocationAlgorithm = [
    { factor: 'Platform Operations', allocation: 45, description: 'Infrastructure, maintenance, support' },
    { factor: 'AdSense Revenue Share', allocation: 30, description: 'Direct creator monetization from analytics views' },
    { factor: 'Development & Innovation', allocation: 15, description: 'New features, improvements, R&D' },
    { factor: 'Marketing & Growth', allocation: 10, description: 'User acquisition, brand building' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Platform Revenue</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${data?.creatorSharing?.platformRevenue?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {data?.creatorSharing?.sharingRatio}% of total revenue
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Creator Revenue</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${data?.creatorSharing?.creatorRevenue?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {100 - data?.creatorSharing?.sharingRatio}% of total revenue
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-3">
              <Percent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sharing Ratio</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data?.creatorSharing?.sharingRatio}/{100 - data?.creatorSharing?.sharingRatio}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Platform / Creator split</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Revenue Distribution Trends
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sharingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="platformRevenue" fill="#3B82F6" name="Platform Revenue" />
            <Bar dataKey="creatorRevenue" fill="#10B981" name="Creator Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Percent className="w-6 h-6 text-purple-600" />
            Transparent Revenue Allocation Algorithm
          </h2>
        </div>
        <div className="space-y-4">
          {allocationAlgorithm?.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item?.factor}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item?.description}</p>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {item?.allocation}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item?.allocation}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorRevenueSharePanel;