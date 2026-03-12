import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Calendar, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const PerformanceOverviewPanel = ({ brandData, selectedCampaign, onSelectCampaign }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [formatDistribution, setFormatDistribution] = useState([]);

  useEffect(() => {
    if (brandData?.campaigns) {
      // Generate time series data
      const timeSeries = brandData?.campaigns?.map(campaign => ({
        name: campaign?.elections?.title?.substring(0, 15) || 'Campaign',
        engagements: campaign?.total_engagements,
        spent: parseFloat(campaign?.total_spent),
        rate: parseFloat(campaign?.engagement_rate)
      }));
      setTimeSeriesData(timeSeries);

      // Calculate format distribution
      const formats = brandData?.campaigns?.reduce((acc, campaign) => {
        const format = campaign?.ad_format || 'Unknown';
        acc[format] = (acc?.[format] || 0) + 1;
        return acc;
      }, {});

      const formatData = Object.entries(formats)?.map(([name, value]) => ({
        name: name?.replace('_', ' '),
        value
      }));
      setFormatDistribution(formatData);
    }
  }, [brandData]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Campaign Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Campaign Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="engagements" stroke="#3B82F6" strokeWidth={2} name="Engagements" />
            <Line yAxisId="right" type="monotone" dataKey="spent" stroke="#10B981" strokeWidth={2} name="Spent ($)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ad Format Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Ad Format Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formatDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formatDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Rate by Campaign */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Engagement Rate Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rate" fill="#F59E0B" name="Engagement Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Campaign List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-green-600" />
          Active Campaigns
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brandData?.campaigns?.map((campaign, index) => (
                <tr 
                  key={index}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedCampaign?.id === campaign?.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onSelectCampaign(campaign)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign?.elections?.title || 'Untitled Campaign'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {campaign?.ad_format?.replace('_', ' ') || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign?.total_engagements?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(campaign?.total_spent || 0)?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">
                        {parseFloat(campaign?.engagement_rate || 0)?.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
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

export default PerformanceOverviewPanel;