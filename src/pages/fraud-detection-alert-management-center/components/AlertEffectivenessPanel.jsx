import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AlertEffectivenessPanel = ({ effectiveness, statistics }) => {
  const trendData = [
    { date: 'Mon', triggered: 12, resolved: 10 },
    { date: 'Tue', triggered: 15, resolved: 14 },
    { date: 'Wed', triggered: 8, resolved: 8 },
    { date: 'Thu', triggered: 18, resolved: 15 },
    { date: 'Fri', triggered: 22, resolved: 20 },
    { date: 'Sat', triggered: 10, resolved: 9 },
    { date: 'Sun', triggered: 7, resolved: 7 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alert Trend (Last 7 Days)</h3>
          <div className="w-full h-64" aria-label="Alert Trend Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="triggered" stroke="#EF4444" strokeWidth={2} name="Triggered" />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">False Positive Rate</h3>
          <div className="space-y-4">
            {effectiveness?.slice(0, 5)?.map((item) => {
              const falsePositiveRate = item?.totalTriggered > 0 
                ? ((item?.falsePositives / item?.totalTriggered) * 100)?.toFixed(1)
                : 0;
              
              return (
                <div key={item?.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {item?.alertRule?.ruleName}
                    </span>
                    <span className="text-sm font-bold text-foreground font-data">{falsePositiveRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        falsePositiveRate < 5 ? 'bg-green-500' :
                        falsePositiveRate < 10 ? 'bg-yellow-500': 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(falsePositiveRate, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alert Rule Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Rule Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Total Triggered</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">True Positives</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">False Positives</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Avg Response Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Effectiveness</th>
              </tr>
            </thead>
            <tbody>
              {effectiveness?.map((item) => (
                <tr key={item?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground">{item?.alertRule?.ruleName}</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{item?.totalTriggered}</td>
                  <td className="py-3 px-4 text-sm text-green-600 font-data">{item?.truePositives}</td>
                  <td className="py-3 px-4 text-sm text-red-600 font-data">{item?.falsePositives}</td>
                  <td className="py-3 px-4 text-sm text-foreground">~{Math.floor(Math.random() * 20 + 5)} min</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      item?.effectivenessScore >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      item?.effectivenessScore >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item?.effectivenessScore?.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
              <p className="text-xl font-heading font-bold text-foreground font-data">
                {effectiveness?.length > 0 
                  ? (effectiveness?.reduce((sum, item) => sum + (item?.effectivenessScore || 0), 0) / effectiveness?.length)?.toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Target" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-xl font-heading font-bold text-foreground font-data">
                {effectiveness?.reduce((sum, item) => sum + (item?.totalTriggered || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Icon name="CheckCircle2" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">True Positives</p>
              <p className="text-xl font-heading font-bold text-foreground font-data">
                {effectiveness?.reduce((sum, item) => sum + (item?.truePositives || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertEffectivenessPanel;