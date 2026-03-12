import React from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const PerformanceAnalyticsPanel = ({ statistics }) => {
  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
            <p className="text-gray-600">Response time tracking and bottleneck identification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Response Time Distribution</h3>
            <div className="space-y-3">
              {['< 50ms', '50-100ms', '100-200ms', '200-500ms', '> 500ms']?.map((range, index) => {
                const percentage = [45, 30, 15, 8, 2]?.[index];
                return (
                  <div key={range}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{range}</span>
                      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Endpoint Performance</h3>
            {statistics?.endpointBreakdown?.slice(0, 5)?.map((endpoint) => (
              <div key={endpoint?.endpoint} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs text-gray-600">{endpoint?.endpoint}</code>
                  <span className="text-sm font-semibold text-gray-900">{endpoint?.averageResponseTime}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min((endpoint?.averageResponseTime / 500) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Error Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Error Rate Analysis</h2>
            <p className="text-gray-600">Identify and track API errors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">4xx Errors</span>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">23</p>
            <p className="text-xs text-gray-500">Client errors (24h)</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">5xx Errors</span>
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">5</p>
            <p className="text-xs text-gray-500">Server errors (24h)</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Timeout Errors</span>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
            <p className="text-xs text-gray-500">Request timeouts (24h)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPanel;