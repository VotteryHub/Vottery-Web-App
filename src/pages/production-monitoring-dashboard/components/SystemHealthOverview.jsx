import React from 'react';
import Icon from '../../../components/AppIcon';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemHealthOverview = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Activity" size={48} className="mx-auto mb-3 opacity-30" />
        <p>Loading system health data...</p>
      </div>
    );
  }

  const performanceTrendData = [
    { time: '00:00', health: 95, alerts: 3 },
    { time: '04:00', health: 96, alerts: 2 },
    { time: '08:00', health: 94, alerts: 5 },
    { time: '12:00', health: 97, alerts: 1 },
    { time: '16:00', health: 96, alerts: 2 },
    { time: '20:00', health: 97, alerts: 1 },
    { time: 'Now', health: data?.overallScore, alerts: data?.criticalAlerts }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Health Card */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Overall System Health
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Status: <span className="font-semibold text-primary capitalize">{data?.performanceTrend}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-primary mb-2">{data?.overallScore}%</div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{data?.criticalAlerts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Critical</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Active Alerts</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{data?.serviceAvailability}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Service Availability</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data?.performanceMetrics?.avgResponseTime}ms</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Response Time</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{data?.performanceMetrics?.throughput}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">req/min</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Throughput</h3>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          24-Hour Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceTrendData}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Area
              type="monotone"
              dataKey="health"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#healthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Service Dependency Map */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          Service Dependency Mapping
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Core Services</h4>
            <div className="space-y-2">
              {['Supabase', 'Stripe', 'Resend']?.map((service) => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Services</h4>
            <div className="space-y-2">
              {['OpenAI', 'Anthropic', 'Perplexity']?.map((service) => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Analytics & Ads</h4>
            <div className="space-y-2">
              {['Google Analytics', 'AdSense', 'Twilio']?.map((service) => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthOverview;