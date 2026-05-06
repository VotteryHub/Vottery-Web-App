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

  const mobileEngagementData = [
    { event: 'App Launch', count: 12500, status: 'Healthy' },
    { event: 'Biometric Auth', count: 8400, status: 'Healthy' },
    { event: 'Vote Submission', count: 5600, status: 'Healthy' },
    { event: 'Passkey Reg', count: 1200, status: 'Warning' }
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

      {/* Security Intelligence */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Shield" className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-slate-900">Security Intelligence</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="text-sm font-semibold text-red-900 mb-4">Auth Method Distribution</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-700">Biometric (Passkey)</span>
                  <span className="font-bold text-red-900">68%</span>
                </div>
                <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-700">Password / Email</span>
                  <span className="font-bold text-red-900">24%</span>
                </div>
                <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-700">OAuth (Google/Apple)</span>
                  <span className="font-bold text-red-900">8%</span>
                </div>
                <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-300 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Real-Time Threat Map</h3>
            <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Icon name="Map" className="w-full h-full text-slate-300" />
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest font-bold">
              AI-Detected Anomalies in last 5m
            </p>
          </div>
        </div>
      </div>

      {/* Mobile App Specifics */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Mobile Telemetry Overview</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Top Mobile Events</h3>
            {mobileEngagementData?.map((data, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-900">{data?.event}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{data?.count?.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    data?.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {data?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">Cross-Platform Sync Latency</h3>
            <div className="flex items-end gap-1 h-32 mb-4">
              {[45, 60, 55, 80, 40, 35, 50, 65, 45, 55]?.map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-400 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-indigo-600">
              <span>Avg: 120ms</span>
              <span>P99: 450ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogAnalyticsPanel;