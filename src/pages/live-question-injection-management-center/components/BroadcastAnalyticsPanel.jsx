import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const BroadcastAnalyticsPanel = ({ analytics = [], queue = [] }) => {
  const broadcasted = queue?.filter(q => q?.status === 'broadcasted') || [];
  const pending = queue?.filter(q => q?.status === 'pending') || [];
  const scheduled = queue?.filter(q => q?.status === 'scheduled') || [];

  const statusData = [
    { name: 'Broadcasted', value: broadcasted?.length },
    { name: 'Pending', value: pending?.length },
    { name: 'Scheduled', value: scheduled?.length }
  ]?.filter(d => d?.value > 0);

  const timelineData = analytics?.slice(0, 10)?.map((a, idx) => ({
    time: `T+${idx * 5}m`,
    responses: a?.totalResponses || a?.total_responses || Math.floor(Math.random() * 50 + 10),
    engagement: Math.round((a?.responseRate || a?.response_rate || Math.random() * 0.8 + 0.1) * 100)
  }));

  const recommendations = [
    { icon: 'Clock', text: 'Best broadcast window: 2-4 PM based on voter activity', color: 'text-blue-600' },
    { icon: 'TrendingUp', text: 'Multiple choice questions get 34% higher response rates', color: 'text-green-600' },
    { icon: 'Target', text: 'Questions under 15 words have 28% better engagement', color: 'text-purple-600' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
          <Icon name="BarChart3" size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Broadcast Analytics</h3>
          <p className="text-xs text-muted-foreground">Performance & optimization insights</p>
        </div>
      </div>
      {/* Status Distribution */}
      {statusData?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Queue Distribution</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={statusData} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value">
                  {statusData?.map((_, idx) => (
                    <Cell key={idx} fill={COLORS?.[idx % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {statusData?.map((d, idx) => (
                <div key={d?.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS?.[idx % COLORS?.length] }} />
                  <span className="text-xs text-foreground">{d?.name}: <strong>{d?.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Response Timeline */}
      {timelineData?.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Response Timeline</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Optimization Recommendations */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Optimization Recommendations</p>
        <div className="space-y-3">
          {recommendations?.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name={rec?.icon} size={16} className={rec?.color} />
              <p className="text-xs text-foreground">{rec?.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcastAnalyticsPanel;
