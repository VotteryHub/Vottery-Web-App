import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ScenarioComparisonPanel = ({ globalConfig, campaigns, aiForecasts }) => {
  const scenarios = [
    {
      name: 'Current Split',
      creatorPercentage: globalConfig?.creatorPercentage || 70,
      platformPercentage: globalConfig?.platformPercentage || 30,
      projectedCreatorEarnings: 350000,
      projectedPlatformRevenue: 150000,
      satisfactionScore: 75,
      retentionRate: 82
    },
    {
      name: '90/10 Morale Booster',
      creatorPercentage: 90,
      platformPercentage: 10,
      projectedCreatorEarnings: 450000,
      projectedPlatformRevenue: 50000,
      satisfactionScore: 95,
      retentionRate: 94
    },
    {
      name: '80/20 Balanced',
      creatorPercentage: 80,
      platformPercentage: 20,
      projectedCreatorEarnings: 400000,
      projectedPlatformRevenue: 100000,
      satisfactionScore: 88,
      retentionRate: 89
    },
    {
      name: '68/32 Conservative',
      creatorPercentage: 68,
      platformPercentage: 32,
      projectedCreatorEarnings: 340000,
      projectedPlatformRevenue: 160000,
      satisfactionScore: 72,
      retentionRate: 78
    }
  ];

  const timeSeriesData = [
    { month: 'Month 1', current: 350000, morale: 450000, balanced: 400000, conservative: 340000 },
    { month: 'Month 2', current: 365000, morale: 472500, balanced: 420000, conservative: 347000 },
    { month: 'Month 3', current: 380000, morale: 495000, balanced: 440000, conservative: 354000 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {scenarios?.map((scenario, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 ${
              scenario?.name === 'Current Split' ?'border-blue-500 dark:border-blue-400' :'border-gray-200 dark:border-gray-700'
            } p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {scenario?.name}
              </h3>
              {scenario?.name === 'Current Split' && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Revenue Split</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {scenario?.creatorPercentage}/{scenario?.platformPercentage}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Creator Earnings</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ${(scenario?.projectedCreatorEarnings / 1000)?.toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Platform Revenue</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ${(scenario?.projectedPlatformRevenue / 1000)?.toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</span>
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {scenario?.satisfactionScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Retention</span>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {scenario?.retentionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Distribution Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Distribution Comparison
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="projectedCreatorEarnings" fill="#10B981" name="Creator Earnings" />
              <Bar dataKey="projectedPlatformRevenue" fill="#3B82F6" name="Platform Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction & Retention Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Satisfaction & Retention Impact
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="satisfactionScore" fill="#A855F7" name="Satisfaction Score" />
              <Bar dataKey="retentionRate" fill="#F59E0B" name="Retention Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Time Series Projection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            3-Month Revenue Projection by Scenario
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2} name="Current (70/30)" />
            <Line type="monotone" dataKey="morale" stroke="#10B981" strokeWidth={2} name="Morale Booster (90/10)" />
            <Line type="monotone" dataKey="balanced" stroke="#A855F7" strokeWidth={2} name="Balanced (80/20)" />
            <Line type="monotone" dataKey="conservative" stroke="#F59E0B" strokeWidth={2} name="Conservative (68/32)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Key Insights from Scenario Analysis
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-white">Best for Creator Morale</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              90/10 split shows 95% satisfaction and 94% retention - ideal for morale booster campaigns
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">Best Balance</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              80/20 split provides strong creator satisfaction (88%) while maintaining healthy platform revenue
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-gray-900 dark:text-white">Platform Sustainability</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              68/32 split maximizes platform revenue but may impact creator satisfaction and retention
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="font-medium text-gray-900 dark:text-white">Recommendation</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Consider 80/20 for long-term sustainability or 90/10 for short-term morale campaigns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparisonPanel;