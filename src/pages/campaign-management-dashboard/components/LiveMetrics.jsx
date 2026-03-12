import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LiveMetrics = ({ data }) => {
  const engagementTrendData = [
    { time: '00:00', participation: 120, ctr: 3.2, completion: 85 },
    { time: '04:00', participation: 95, ctr: 2.8, completion: 78 },
    { time: '08:00', participation: 180, ctr: 4.1, completion: 92 },
    { time: '12:00', participation: 245, ctr: 4.8, completion: 88 },
    { time: '16:00', participation: 290, ctr: 5.2, completion: 94 },
    { time: '20:00', participation: 210, ctr: 4.5, completion: 90 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Live Metrics
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time engagement data across campaigns
          </p>
        </div>
        <Icon name="Activity" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Vote Participation</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.voteParticipation?.toLocaleString() || 0}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MousePointer" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Click-Through Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.clickThroughRate || 0}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Completion Rate</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.completionRate || 0}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Cost/Engagement</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.costPerEngagement || 0}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Engagement Trend (24h)
        </h3>
        <div className="w-full h-64" aria-label="Engagement Trend Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementTrendData}>
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
              <Line type="monotone" dataKey="participation" stroke="#2563EB" strokeWidth={2} name="Participation" />
              <Line type="monotone" dataKey="ctr" stroke="#7C3AED" strokeWidth={2} name="CTR %" />
              <Line type="monotone" dataKey="completion" stroke="#059669" strokeWidth={2} name="Completion %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;