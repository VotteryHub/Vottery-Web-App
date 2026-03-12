import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConversionAnalyticsPanel = ({ data }) => {
  const conversionFunnel = [
    { stage: 'Impressions', count: 125000, rate: 100, dropoff: 0 },
    { stage: 'Clicks', count: 5625, rate: 4.5, dropoff: 95.5 },
    { stage: 'Participants', count: 3200, rate: 2.56, dropoff: 43.1 },
    { stage: 'Engaged Users', count: 2816, rate: 2.25, dropoff: 12.0 },
    { stage: 'Conversions', count: 368, rate: 0.29, dropoff: 86.9 }
  ];

  const cohortData = [
    { cohort: 'Week 1', participants: 850, conversions: 102, ltv: 1250, roi: 185 },
    { cohort: 'Week 2', participants: 920, conversions: 115, ltv: 1380, roi: 192 },
    { cohort: 'Week 3', participants: 780, conversions: 89, ltv: 1120, roi: 178 },
    { cohort: 'Week 4', participants: 650, conversions: 72, ltv: 980, roi: 165 }
  ];

  const attributionModel = [
    { touchpoint: 'First Touch', contribution: 35, conversions: 129 },
    { touchpoint: 'Mid-Touch', contribution: 40, conversions: 147 },
    { touchpoint: 'Last Touch', contribution: 25, conversions: 92 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Conversion Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Participant journey and multi-touch attribution
          </p>
        </div>
        <Icon name="Target" size={24} className="text-success" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Overall Conversion</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.conversion?.conversionRate || 0}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Avg Lifetime Value</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            $1,183
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Conversion Funnel Analysis
        </h3>
        <div className="space-y-3">
          {conversionFunnel?.map((stage, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{stage?.stage}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground font-data">{stage?.count?.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-foreground font-data">{stage?.rate}%</span>
                  {stage?.dropoff > 0 && (
                    <span className="text-xs text-destructive font-data">-{stage?.dropoff}%</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-success h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stage?.rate * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Cohort Tracking
        </h3>
        <div className="w-full h-64" aria-label="Cohort Performance Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohortData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="cohort" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="conversions" fill="#2563EB" name="Conversions" />
              <Bar dataKey="roi" fill="#059669" name="ROI %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Multi-Touch Attribution
        </h3>
        <div className="space-y-3">
          {attributionModel?.map((model, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{model?.touchpoint}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-data">{model?.conversions} conversions</span>
                  <span className="text-sm font-bold text-foreground font-data">{model?.contribution}%</span>
                </div>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${model?.contribution}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversionAnalyticsPanel;