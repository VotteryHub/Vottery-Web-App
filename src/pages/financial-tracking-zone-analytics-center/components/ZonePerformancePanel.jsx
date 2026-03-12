import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ZonePerformancePanel = ({ zoneData, timeRange, loading }) => {
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

  const chartData = zoneData?.map(zone => ({
    zone: zone?.zone?.replace('_', ' ')?.toUpperCase(),
    prizePools: parseFloat(zone?.totalPrizePools || 0) / 1000,
    fees: parseFloat(zone?.totalParticipationFees || 0) / 1000,
    adSpend: parseFloat(zone?.totalAdvertiserSpending || 0) / 1000,
    roi: parseFloat(zone?.averageRoi || 0)
  }));

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Zone Performance Analytics
            </h2>
            <p className="text-sm text-muted-foreground">
              Financial breakdown by purchasing power region with heatmap visualizations
            </p>
          </div>
          <Icon name="MapPin" size={24} className="text-primary" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Financial Metrics by Zone
          </h3>
          <div className="w-full h-80" aria-label="Zone Performance Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="zone" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" label={{ value: 'Amount (K)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="prizePools" fill="#2563EB" name="Prize Pools (K)" />
                <Bar dataKey="fees" fill="#7C3AED" name="Participation Fees (K)" />
                <Bar dataKey="adSpend" fill="#059669" name="Ad Spending (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zoneData?.map((zone) => (
            <div key={zone?.zone} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="MapPin" size={18} className="text-primary" />
                  </div>
                  <span className="font-heading font-semibold text-foreground">
                    {zone?.zone?.replace('_', ' ')?.toUpperCase()}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-success/10">
                  <span className="text-xs font-medium text-success">{zone?.averageRoi?.toFixed(1) || 0}% ROI</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prize Pools</p>
                  <p className="text-base font-heading font-bold text-foreground font-data">
                    ₹{zone?.totalPrizePools?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Participation Fees</p>
                  <p className="text-base font-heading font-bold text-foreground font-data">
                    ₹{zone?.totalParticipationFees?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ad Spending</p>
                  <p className="text-base font-heading font-bold text-foreground font-data">
                    ₹{zone?.totalAdvertiserSpending?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Participants</p>
                  <p className="text-base font-heading font-bold text-foreground font-data">
                    {zone?.totalParticipants?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Prize Distribution Rate</span>
                  <span className="text-sm font-bold text-foreground">{zone?.prizeDistributionRate?.toFixed(1) || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${zone?.prizeDistributionRate || 0}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZonePerformancePanel;