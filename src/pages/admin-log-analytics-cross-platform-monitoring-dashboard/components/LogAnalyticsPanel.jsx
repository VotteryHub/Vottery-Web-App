import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

const LogAnalyticsPanel = () => {
  const trendData = [
    { hour: '00:00', logs: 1200, errors: 15 },
    { hour: '04:00', logs: 800, errors: 8 },
    { hour: '08:00', logs: 3400, errors: 42 },
    { hour: '12:00', logs: 5200, errors: 68 },
    { hour: '16:00', logs: 4800, errors: 55 },
    { hour: '20:00', logs: 2900, errors: 32 }
  ];

  const categoryDistribution = [
    { category: 'User Activity', count: 34200, percentage: 42 },
    { category: 'AI Analysis', count: 18900, percentage: 23 },
    { category: 'Security', count: 12450, percentage: 15 },
    { category: 'Payment', count: 8340, percentage: 10 },
    { category: 'Performance', count: 4890, percentage: 6 },
    { category: 'Other', count: 3220, percentage: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Trend Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Trend Analysis</h2>
        </div>

        <div className="space-y-4">
          {trendData?.map((data, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600 w-16">{data?.hour}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-lg"
                      style={{ width: `${(data?.logs / 5200) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-20 text-right">
                    {data?.logs?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(data?.errors / 68) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-red-600 w-20 text-right">
                    {data?.errors} errors
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Category Distribution</h2>
        </div>

        <div className="space-y-3">
          {categoryDistribution?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 w-32">{item?.category}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
                      style={{ width: `${item?.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-24 text-right">
                    {item?.count?.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {item?.percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Rate Monitoring */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Error Rate Monitoring</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-600">Current Error Rate</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">2.1%</p>
            <p className="text-xs text-green-600 mt-1">↓ 0.3% from yesterday</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-slate-600">Performance Issues</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">12</p>
            <p className="text-xs text-yellow-600 mt-1">↑ 3 from yesterday</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-600">Critical Errors</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">3</p>
            <p className="text-xs text-green-600 mt-1">↓ 2 from yesterday</p>
          </div>
        </div>
      </div>

      {/* Predictive Alerting */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-slate-900">Predictive Alerting</h4>
        </div>
        <p className="text-sm text-slate-600">
          Machine learning algorithms analyze log patterns to predict potential issues before they impact users. 
          Automated alerts are triggered when anomalies are detected in error rates, performance metrics, or security events.
        </p>
      </div>
    </div>
  );
};

export default LogAnalyticsPanel;