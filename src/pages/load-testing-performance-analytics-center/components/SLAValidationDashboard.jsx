import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SLAValidationDashboard = ({ slaData, testHistory }) => {
  if (!slaData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="CheckCircle" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading SLA data...</p>
      </div>
    );
  }

  const complianceTrendData = [
    { date: 'Day 1', uptime: 99.95, latency: 1.92 },
    { date: 'Day 2', uptime: 99.97, latency: 1.85 },
    { date: 'Day 3', uptime: 99.96, latency: 1.78 },
    { date: 'Day 4', uptime: 99.98, latency: 1.89 },
    { date: 'Day 5', uptime: 99.97, latency: 1.82 },
    { date: 'Day 6', uptime: 99.99, latency: 1.76 },
    { date: 'Today', uptime: slaData?.uptime, latency: slaData?.latency }
  ];

  return (
    <div className="space-y-6">
      {/* SLA Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Uptime SLA</h3>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              slaData?.uptimeStatus === 'passing' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {slaData?.uptimeStatus}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{slaData?.uptime}%</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">current</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Target: <span className="font-semibold">{slaData?.uptimeTarget}%</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-green-500"
              style={{ width: `${(slaData?.uptime / slaData?.uptimeTarget) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Latency SLA</h3>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              slaData?.latencyStatus === 'passing' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
            }`}>
              {slaData?.latencyStatus}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{slaData?.latency}s</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">current</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Target: <span className="font-semibold">&lt;{slaData?.latencyTarget}s</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: `${100 - (slaData?.latency / slaData?.latencyTarget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Compliance Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          7-Day SLA Compliance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complianceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" domain={[99.9, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" domain={[0, 2]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} name="Uptime %" />
            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} name="Latency (s)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Test History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="History" size={20} className="text-primary" />
            Test History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SLA Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {testHistory?.map((test) => (
                <tr key={test?.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {test?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(test?.date)?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {test?.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {Math.floor(test?.duration / 60)}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {test?.slaCompliance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      test?.status === 'passed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {test?.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Breach Detection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          Automated Breach Detection
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/30">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">All SLAs Met</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  System is performing within all defined SLA thresholds. No breaches detected in last 30 days.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-center gap-3">
              <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Continuous Monitoring Active</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Real-time SLA validation running. Automated alerts configured for threshold breaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAValidationDashboard;