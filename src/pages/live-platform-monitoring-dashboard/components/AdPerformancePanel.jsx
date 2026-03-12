import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdPerformancePanel = ({ data, timeRange }) => {
  const performanceTrendData = [
    { time: '00:00', impressions: 1200, clicks: 85, conversions: 12 },
    { time: '04:00', impressions: 800, clicks: 52, conversions: 8 },
    { time: '08:00', impressions: 2100, clicks: 145, conversions: 22 },
    { time: '12:00', impressions: 3200, clicks: 225, conversions: 35 },
    { time: '16:00', impressions: 3800, clicks: 280, conversions: 42 },
    { time: '20:00', impressions: 2900, clicks: 195, conversions: 28 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Ad Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Campaign metrics and ROI tracking
          </p>
        </div>
        <Icon name="Target" size={24} className="text-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Eye" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Impressions</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.totalImpressions?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+25% increase</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MousePointer" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Click-Through Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.ctr || '0'}%
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+0.8% improvement</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.conversionRate || '0'}%
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+1.2% growth</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Return on Investment</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.roi || '0'}%
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Positive ROI</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Campaign Performance Trend (24h)
        </h3>
        <div className="w-full h-64" aria-label="Performance Trend Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="#2563EB" strokeWidth={2} name="Impressions" />
              <Line type="monotone" dataKey="clicks" stroke="#7C3AED" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="conversions" stroke="#059669" strokeWidth={2} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Cost Per Click</span>
            <Icon name="MousePointer" size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.costPerClick || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Cost Per Conversion</span>
            <Icon name="Target" size={18} className="text-success" />
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.costPerConversion || '0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdPerformancePanel;