import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DollarSign } from 'lucide-react';
import Icon from '../../../components/AppIcon';

const EarningsBreakdown = ({ data, timeRange }) => {
  const breakdown = data?.breakdown || {
    regularElections: 0,
    sponsoredElections: 0,
    bonusRewards: 0,
    referralEarnings: 0
  };

  const chartData = [
    { name: 'Regular Elections', value: breakdown?.regularElections, color: '#10B981' },
    { name: 'Sponsored Elections', value: breakdown?.sponsoredElections, color: '#3B82F6' },
    { name: 'Bonus Rewards', value: breakdown?.bonusRewards, color: '#8B5CF6' },
    { name: 'Referral Earnings', value: breakdown?.referralEarnings, color: '#F59E0B' }
  ];

  const totalEarnings = Object.values(breakdown)?.reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Earnings ({timeRange})</h3>
            <p className="text-4xl font-bold text-blue-600">${totalEarnings?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white rounded-full shadow-lg">
            <Icon icon={DollarSign} className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value?.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Details */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
          <div className="space-y-4">
            {chartData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item?.color }}></div>
                  <span className="font-medium text-gray-900">{item?.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${item?.value?.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {((item?.value / totalEarnings) * 100)?.toFixed(1)}% of total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.transactions?.slice(0, 10)?.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction?.createdAt)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {transaction?.transactionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction?.elections?.title || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                    +${parseFloat(transaction?.amount || 0)?.toFixed(2)}
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

export default EarningsBreakdown;
