import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdROIMonitoring = ({ data, timeRange }) => {
  const performanceData = [
    { metric: 'Impressions', value: data?.totalImpressions || 0 },
    { metric: 'Clicks', value: data?.totalClicks || 0 },
    { metric: 'Conversions', value: data?.totalConversions || 0 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Ad ROI Monitoring
          </h2>
          <p className="text-sm text-muted-foreground">
            Campaign performance and cost-per-engagement metrics
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
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MousePointer" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Click-Through Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.ctr || '0'}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.conversionRate || '0'}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Total Spend</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.totalSpend?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cost Per Click (CPC)</p>
            <p className="text-xl font-heading font-bold text-foreground font-data">
              ${data?.costPerClick || '0'}
            </p>
          </div>
          <Icon name="MousePointer" size={24} className="text-primary" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cost Per Conversion</p>
            <p className="text-xl font-heading font-bold text-foreground font-data">
              ${data?.costPerConversion || '0'}
            </p>
          </div>
          <Icon name="Target" size={24} className="text-success" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-success/10">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Return on Investment (ROI)</p>
            <p className="text-2xl font-heading font-bold text-foreground font-data">
              {data?.roi || '0'}%
            </p>
          </div>
          <Icon name="TrendingUp" size={32} className="text-success" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Campaign Performance Funnel
        </h3>
        <div className="w-full h-48" aria-label="Campaign Performance Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="metric" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} name="Performance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdROIMonitoring;
