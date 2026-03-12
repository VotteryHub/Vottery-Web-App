import React from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeliveryAnalyticsPanel = ({ deliveryStats, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const trendData = [
    { date: 'Week 1', deliveries: 45, success: 43 },
    { date: 'Week 2', deliveries: 52, success: 51 },
    { date: 'Week 3', deliveries: 48, success: 47 },
    { date: 'Week 4', deliveries: 61, success: 59 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground mb-1">{deliveryStats?.totalDeliveries || 0}</div>
          <div className="text-sm text-muted-foreground">Total Deliveries</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500 mb-1">{deliveryStats?.successfulDeliveries || 0}</div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-red-500 mb-1">{deliveryStats?.failedDeliveries || 0}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground mb-1">{deliveryStats?.deliveryRate || 0}%</div>
          <div className="text-sm text-muted-foreground">Delivery Rate</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Delivery Trends</h3>
        <div className="w-full h-80" aria-label="Delivery Trends Chart">
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
              <Line type="monotone" dataKey="deliveries" stroke="#2563EB" strokeWidth={2} name="Total Deliveries" />
              <Line type="monotone" dataKey="success" stroke="#059669" strokeWidth={2} name="Successful" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAnalyticsPanel;