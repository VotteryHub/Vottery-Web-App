import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Target, Award, Calendar, Download } from 'lucide-react';

const QuestAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData] = useState({
    completionTrends: [
      { date: '2026-01-26', easy: 85, medium: 68, hard: 42 },
      { date: '2026-01-27', easy: 87, medium: 71, hard: 45 },
      { date: '2026-01-28', easy: 89, medium: 69, hard: 48 },
      { date: '2026-01-29', easy: 91, medium: 73, hard: 51 },
      { date: '2026-01-30', easy: 88, medium: 75, hard: 49 },
      { date: '2026-01-31', easy: 90, medium: 72, hard: 52 },
      { date: '2026-02-01', easy: 92, medium: 76, hard: 54 }
    ],
    userEngagement: {
      totalUsers: 45230,
      activeQuestUsers: 32847,
      avgQuestsPerUser: 4.2,
      dailyActiveUsers: 18420
    },
    rewardDistribution: {
      totalVPDistributed: 458920,
      totalXPDistributed: 229460,
      avgVPPerQuest: 142,
      avgXPPerQuest: 71
    },
    categoryPerformance: [
      { category: 'Politics', quests: 3420, completion: 72, engagement: 85 },
      { category: 'Entertainment', quests: 2890, completion: 78, engagement: 82 },
      { category: 'Sports', quests: 2650, completion: 75, engagement: 79 },
      { category: 'Technology', quests: 2340, completion: 68, engagement: 88 },
      { category: 'General', quests: 1920, completion: 81, engagement: 76 }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Quest Analytics & Performance Metrics
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics for quest system optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
      {/* Completion Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Quest Completion Trends by Difficulty
        </h3>

        <div className="space-y-4">
          {/* Chart Visualization */}
          <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-end justify-between h-full gap-2">
              {analyticsData?.completionTrends?.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${day?.easy}%` }}
                      title={`Easy: ${day?.easy}%`}
                    ></div>
                    <div
                      className="w-full bg-yellow-500"
                      style={{ height: `${day?.medium}%` }}
                      title={`Medium: ${day?.medium}%`}
                    ></div>
                    <div
                      className="w-full bg-red-500"
                      style={{ height: `${day?.hard}%` }}
                      title={`Hard: ${day?.hard}%`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{new Date(day?.date)?.getDate()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Easy (avg 89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-700">Medium (avg 72%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Hard (avg 49%)</span>
            </div>
          </div>
        </div>
      </div>
      {/* User Engagement Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          User Engagement Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.userEngagement?.totalUsers?.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Platform-wide</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Active Quest Users</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.userEngagement?.activeQuestUsers?.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1">72.6% participation</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Avg Quests/User</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.userEngagement?.avgQuestsPerUser}</div>
            <div className="text-xs text-gray-500 mt-1">Per week</div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">Daily Active Users</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.userEngagement?.dailyActiveUsers?.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-1">+15% vs last week</div>
          </div>
        </div>
      </div>
      {/* Reward Distribution Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Reward Distribution Analytics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm text-gray-600 mb-2">Total VP Distributed</div>
            <div className="text-2xl font-bold text-gray-900">{(analyticsData?.rewardDistribution?.totalVPDistributed / 1000)?.toFixed(0)}K</div>
            <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-2">Total XP Distributed</div>
            <div className="text-2xl font-bold text-gray-900">{(analyticsData?.rewardDistribution?.totalXPDistributed / 1000)?.toFixed(0)}K</div>
            <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-2">Avg VP/Quest</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.rewardDistribution?.avgVPPerQuest}</div>
            <div className="text-xs text-gray-500 mt-1">Across all difficulties</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-600 mb-2">Avg XP/Quest</div>
            <div className="text-2xl font-bold text-gray-900">{analyticsData?.rewardDistribution?.avgXPPerQuest}</div>
            <div className="text-xs text-gray-500 mt-1">Across all difficulties</div>
          </div>
        </div>
      </div>
      {/* Category Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Category Performance Analysis
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Quests</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Completion Rate</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Engagement Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.categoryPerformance?.map((cat, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{cat?.category}</td>
                  <td className="py-3 px-4 text-gray-700">{cat?.quests?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${cat?.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{cat?.completion}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${cat?.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{cat?.engagement}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cat?.engagement > 85 ? 'bg-green-100 text-green-800' :
                      cat?.engagement > 75 ? 'bg-yellow-100 text-yellow-800': 'bg-red-100 text-red-800'
                    }`}>
                      {cat?.engagement > 85 ? 'Excellent' : cat?.engagement > 75 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Strategic Optimization Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Increase Technology category quest frequency by 20%</p>
              <p className="text-xs text-gray-600">Highest engagement score (88%) indicates strong user interest</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Adjust hard difficulty VP rewards to 400 points</p>
              <p className="text-xs text-gray-600">Low completion rate (49%) suggests rewards may not justify difficulty</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Implement weekend bonus multiplier of 1.3x</p>
              <p className="text-xs text-gray-600">Daily active users spike 35% on weekends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestAnalytics;