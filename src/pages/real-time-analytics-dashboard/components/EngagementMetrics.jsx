import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementMetrics = ({ data, trends, timeRange }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Engagement Metrics
          </h2>
          <p className="text-sm text-muted-foreground">
            User activity heatmaps and interaction analytics
          </p>
        </div>
        <Icon name="Activity" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Heart" size={18} className="text-destructive" />
            <span className="text-sm text-muted-foreground">Total Likes</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.totalLikes?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="MessageCircle" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Total Comments</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.totalComments?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Share2" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Total Shares</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            {data?.totalShares?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      <div className="w-full h-80" aria-label="Engagement Trend Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends}>
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
            <Line type="monotone" dataKey="engagement" stroke="#2563EB" strokeWidth={2} name="Engagement" />
            <Line type="monotone" dataKey="posts" stroke="#7C3AED" strokeWidth={2} name="Posts" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EngagementMetrics;
