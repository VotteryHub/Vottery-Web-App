import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const MOCK_HISTORY = [
  { date: 'Jan 20', ctr: 3.2, response: 1.8 },
  { date: 'Jan 27', ctr: 3.8, response: 2.1 },
  { date: 'Feb 3', ctr: 4.1, response: 2.4 },
  { date: 'Feb 10', ctr: 3.9, response: 2.2 },
  { date: 'Feb 17', ctr: 4.6, response: 2.8 },
  { date: 'Feb 24', ctr: 5.2, response: 3.1 }
];

const VARIANT_COMPARISON = [
  { name: 'Variant A', ctr: 4.2, response: 2.4, sends: 850 },
  { name: 'Variant B', ctr: 5.8, response: 3.2, sends: 820 },
  { name: 'Variant C', ctr: 3.9, response: 2.1, sends: 780 }
];

const MetricCard = ({ icon, label, value, change, color }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`w-8 h-8 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
        <Icon name={icon} size={16} className={`text-${color}-400`} />
      </div>
      {change !== undefined && (
        <span className={`text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <div className={`text-xl font-bold text-${color}-400`}>{value}</div>
    <div className="text-gray-500 text-xs mt-1">{label}</div>
  </div>
);

const EngagementMetricsPanel = ({ variants }) => {
  const avgCTR = variants?.length
    ? (variants?.reduce((sum, v) => sum + (v?.ctr || 0), 0) / variants?.length)?.toFixed(1)
    : '4.8';
  const avgResponse = variants?.length
    ? (variants?.reduce((sum, v) => sum + (v?.responseRate || 0), 0) / variants?.length)?.toFixed(1)
    : '2.7';

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={20} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Engagement Metrics</h3>
          <p className="text-gray-400 text-sm">Performance tracking by message variant</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard icon="MousePointer" label="Avg Click-Through Rate" value={`${avgCTR}%`} change={12.4} color="blue" />
        <MetricCard icon="MessageSquare" label="Avg Response Rate" value={`${avgResponse}%`} change={8.7} color="green" />
        <MetricCard icon="Send" label="Total Sends" value="2,450" change={5.2} color="purple" />
        <MetricCard icon="Star" label="Opt. Score Avg" value="87/100" change={15.3} color="yellow" />
      </div>

      {/* Variant Comparison Bar Chart */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 block">Variant CTR Comparison</label>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={VARIANT_COMPARISON} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#60A5FA' }}
              />
              <Bar dataKey="ctr" fill="#3B82F6" radius={[4, 4, 0, 0]} name="CTR %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Trend */}
      <div>
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 block">Historical Performance Trend</label>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_HISTORY} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Line type="monotone" dataKey="ctr" stroke="#3B82F6" strokeWidth={2} dot={false} name="CTR %" />
              <Line type="monotone" dataKey="response" stroke="#10B981" strokeWidth={2} dot={false} name="Response %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-gray-500 text-xs">CTR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-green-500" />
            <span className="text-gray-500 text-xs">Response Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementMetricsPanel;
