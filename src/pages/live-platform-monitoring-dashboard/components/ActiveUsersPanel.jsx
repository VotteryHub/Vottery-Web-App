import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActiveUsersPanel = ({ data, timeRange }) => {
  const geographicData = [
    { region: 'North America', users: Math.floor((data?.activeUsers || 0) * 0.35) },
    { region: 'Europe', users: Math.floor((data?.activeUsers || 0) * 0.28) },
    { region: 'Asia', users: Math.floor((data?.activeUsers || 0) * 0.22) },
    { region: 'Latin America', users: Math.floor((data?.activeUsers || 0) * 0.10) },
    { region: 'Africa', users: Math.floor((data?.activeUsers || 0) * 0.05) }
  ];

  const peakActivityData = [
    { hour: '00:00', activity: 45 },
    { hour: '04:00', activity: 25 },
    { hour: '08:00', activity: 65 },
    { hour: '12:00', activity: 85 },
    { hour: '16:00', activity: 95 },
    { hour: '20:00', activity: 78 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Active Users
          </h2>
          <p className="text-sm text-muted-foreground">
            Online user count and geographic distribution
          </p>
        </div>
        <Icon name="Users" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Current Active Users</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            {data?.activeUsers?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+12% from last period</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Avg Session Duration</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            24m
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+3m from last period</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Peak Activity Time</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            4:00 PM
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">Local timezone</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Geographic Distribution
        </h3>
        <div className="space-y-3">
          {geographicData?.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-32 text-sm text-foreground font-medium">{item?.region}</div>
              <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-primary flex items-center justify-end px-3 transition-all duration-500"
                  style={{ width: `${(item?.users / (data?.activeUsers || 1)) * 100}%` }}
                >
                  <span className="text-xs font-semibold text-white">
                    {item?.users?.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-16 text-sm text-muted-foreground text-right">
                {((item?.users / (data?.activeUsers || 1)) * 100)?.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Peak Activity Patterns (24h)
        </h3>
        <div className="w-full h-64" aria-label="Peak Activity Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="activity" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersPanel;