import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = ({ analyticsData }) => {
  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">User Engagement Trend</h3>
          <div className="w-full h-64" aria-label="User Engagement Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.engagementTrend}>
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
                <Line type="monotone" dataKey="activeUsers" stroke="#2563EB" strokeWidth={2} name="Active Users" />
                <Line type="monotone" dataKey="votes" stroke="#7C3AED" strokeWidth={2} name="Votes Cast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Election Types Distribution</h3>
          <div className="w-full h-64" aria-label="Election Types Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.electionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData?.electionTypes?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Revenue by Category</h3>
        <div className="w-full h-80" aria-label="Revenue Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#2563EB" name="Revenue ($)" />
              <Bar dataKey="fees" fill="#7C3AED" name="Fees ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData?.keyMetrics?.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{metric?.label}</p>
                <p className="text-xl font-heading font-bold text-foreground font-data">{metric?.value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={`text-xs font-medium ${metric?.trend?.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {metric?.trend}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;