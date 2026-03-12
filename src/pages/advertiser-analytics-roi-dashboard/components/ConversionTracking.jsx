import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConversionTracking = ({ data }) => {
  const conversionFunnelData = [
    { stage: 'Impressions', value: 10000, rate: 100 },
    { stage: 'Clicks', value: 850, rate: 8.5 },
    { stage: 'Participants', value: 620, rate: 6.2 },
    { stage: 'Engaged', value: 480, rate: 4.8 },
    { stage: 'Conversions', value: 125, rate: 1.25 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Conversion Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Participant journey and conversion analysis
          </p>
        </div>
        <Icon name="Target" size={24} className="text-success" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.conversionRate || 0}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Star" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Quality Score</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.qualityScore || 0}/10
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Conversion Funnel
        </h3>
        <div className="w-full h-64" aria-label="Conversion Funnel Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={conversionFunnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} name="Count" />
              <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2} name="Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Attribution Model
        </h3>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">First Touch</span>
            <span className="text-sm font-bold text-foreground font-data">35%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }} />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Mid-Touch</span>
            <span className="text-sm font-bold text-foreground font-data">40%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div className="bg-secondary h-2 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Last Touch</span>
            <span className="text-sm font-bold text-foreground font-data">25%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: '25%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionTracking;