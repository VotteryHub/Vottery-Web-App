import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ZoneReachAnalytics = ({ data }) => {
  const totalReach = data?.totalReach || 91300;
  const avgEngagement = data?.avgEngagement || 7.7;
  const zones = data?.zones || 8;
  const zoneReachData = data?.zoneReachData ?? Array.from({ length: zones }, (_, i) => {
    const variance = 0.85 + (i % 5) * 0.06;
    return {
      zone: `Zone ${i + 1}`,
      reach: Math.round((totalReach / zones) * variance),
      engagement: parseFloat((avgEngagement * (0.9 + (i % 3) * 0.05)).toFixed(1)),
      effectiveness: 60 + (i % 4) * 8
    };
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Zone Reach Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Geographic performance across 8 purchasing power zones
          </p>
        </div>
        <Icon name="MapPin" size={24} className="text-primary" />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Reach & Engagement by Zone
        </h3>
        <div className="w-full h-80" aria-label="Zone Reach Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneReachData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="zone" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="reach" fill="#2563EB" name="Reach" />
              <Bar dataKey="engagement" fill="#7C3AED" name="Engagement %" />
              <Bar dataKey="effectiveness" fill="#059669" name="Effectiveness %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zoneReachData?.map((zone) => (
          <div key={zone?.zone} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="MapPin" size={18} className="text-primary" />
                </div>
                <span className="font-heading font-semibold text-foreground">{zone?.zone}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/10">
                <span className="text-xs font-medium text-success">{zone?.effectiveness}% effective</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reach</p>
                <p className="text-base font-heading font-bold text-foreground font-data">
                  {zone?.reach?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                <p className="text-base font-heading font-bold text-foreground font-data">
                  {zone?.engagement}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Market</p>
                <p className="text-base font-heading font-bold text-foreground font-data">
                  {zone?.effectiveness}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZoneReachAnalytics;