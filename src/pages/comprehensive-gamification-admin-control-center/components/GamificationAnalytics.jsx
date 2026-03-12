import React from 'react';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';

const GamificationAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gamification Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Comprehensive performance metrics and engagement insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Engagement Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">78.5%</div>
          <div className="text-sm text-green-600 mt-1">+12.3% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Avg Session Time</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">24.5m</div>
          <div className="text-sm text-green-600 mt-1">+8.7% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Daily Active Users</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">32.1K</div>
          <div className="text-sm text-green-600 mt-1">+15.2% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Retention Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">85.3%</div>
          <div className="text-sm text-green-600 mt-1">+5.8% from last month</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">VP Earning Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart: VP earned over time</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Completion Rates</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart: Challenge completion percentages</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Redemption Patterns</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart: Most redeemed items</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement by Level</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart: Engagement metrics by user level</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationAnalytics;