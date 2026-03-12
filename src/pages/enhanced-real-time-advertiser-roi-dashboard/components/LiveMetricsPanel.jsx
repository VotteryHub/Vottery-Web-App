import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const LiveMetricsPanel = ({ data }) => {
  const metrics = [
    {
      label: 'Active Campaigns',
      value: data?.overview?.activeCampaigns || 0,
      icon: 'BarChart3',
      color: 'bg-primary/10 text-primary',
      trend: '+5',
      trendUp: true
    },
    {
      label: 'Live Participants',
      value: data?.liveMetrics?.voteParticipation?.toLocaleString() || '0',
      icon: 'Users',
      color: 'bg-secondary/10 text-secondary',
      trend: '+12.5%',
      trendUp: true
    },
    {
      label: 'Cost/Participant',
      value: `$${data?.liveMetrics?.costPerEngagement || 0}`,
      icon: 'DollarSign',
      color: 'bg-accent/10 text-accent',
      trend: '-0.3',
      trendUp: true
    },
    {
      label: 'Conversion Rate',
      value: `${data?.conversion?.conversionRate || 0}%`,
      icon: 'Target',
      color: 'bg-success/10 text-success',
      trend: '+1.8%',
      trendUp: true
    }
  ];

  const engagementData = [
    { time: '00:00', ctr: 4.2, participation: 2800, completion: 86 },
    { time: '04:00', ctr: 3.8, participation: 2400, completion: 84 },
    { time: '08:00', ctr: 4.5, participation: 3200, completion: 88 },
    { time: '12:00', ctr: 5.1, participation: 3800, completion: 90 },
    { time: '16:00', ctr: 4.8, participation: 3500, completion: 89 },
    { time: '20:00', ctr: 4.3, participation: 3100, completion: 87 },
    { time: '23:59', ctr: 4.5, participation: 3200, completion: 88 }
  ];

  const zonePerformance = [
    { zone: 'Zone 1', participants: 420, ctr: 5.2, conversion: 12.8, roi: 185 },
    { zone: 'Zone 2', participants: 380, ctr: 4.8, conversion: 11.2, roi: 172 },
    { zone: 'Zone 3', participants: 510, ctr: 5.5, conversion: 13.5, roi: 198 },
    { zone: 'Zone 4', participants: 680, ctr: 4.2, conversion: 10.8, roi: 165 },
    { zone: 'Zone 5', participants: 450, ctr: 4.9, conversion: 11.9, roi: 178 },
    { zone: 'Zone 6', participants: 340, ctr: 4.5, conversion: 10.5, roi: 162 },
    { zone: 'Zone 7', participants: 280, ctr: 5.8, conversion: 14.2, roi: 205 },
    { zone: 'Zone 8', participants: 240, ctr: 5.1, conversion: 12.5, roi: 188 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full ${metric?.color} flex items-center justify-center`}>
                <Icon name={metric?.icon} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                metric?.trendUp ? 'text-success' : 'text-destructive'
              }`}>
                <Icon name={metric?.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
                <span>{metric?.trend}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground font-data">
              {metric?.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Real-Time Engagement Metrics
            </h2>
            <p className="text-sm text-muted-foreground">
              Live tracking with 30-second refresh intervals
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live Data</span>
          </div>
        </div>
        <div className="w-full h-80" aria-label="Engagement Metrics Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
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
              <Line type="monotone" dataKey="ctr" stroke="#2563EB" strokeWidth={2} name="CTR %" />
              <Line type="monotone" dataKey="participation" stroke="#7C3AED" strokeWidth={2} name="Participants" />
              <Line type="monotone" dataKey="completion" stroke="#059669" strokeWidth={2} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Zone-Specific Performance Heatmap
          </h2>
          <Icon name="Map" size={24} className="text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Zone</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Participants</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">CTR %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Conversion %</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">ROI %</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">Performance</th>
              </tr>
            </thead>
            <tbody>
              {zonePerformance?.map((zone, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{zone?.zone}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground text-right font-data">
                    {zone?.participants}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground text-right font-data">
                    {zone?.ctr}%
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground text-right font-data">
                    {zone?.conversion}%
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-success text-right font-data">
                    {zone?.roi}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {zone?.roi >= 190 && (
                        <>
                          <Icon name="TrendingUp" size={16} className="text-success" />
                          <span className="text-xs font-medium text-success">Excellent</span>
                        </>
                      )}
                      {zone?.roi >= 170 && zone?.roi < 190 && (
                        <>
                          <Icon name="ArrowUp" size={16} className="text-primary" />
                          <span className="text-xs font-medium text-primary">Good</span>
                        </>
                      )}
                      {zone?.roi < 170 && (
                        <>
                          <Icon name="Minus" size={16} className="text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Average</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveMetricsPanel;