import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ZONES = [
  { name: 'USA', multiplier: 1.0, color: '#6366f1', flag: '🇺🇸' },
  { name: 'Western Europe', multiplier: 0.95, color: '#22c55e', flag: '🇪🇺' },
  { name: 'Australasia', multiplier: 0.90, color: '#3b82f6', flag: '🇦🇺' },
  { name: 'Middle East/Asia', multiplier: 0.60, color: '#f59e0b', flag: '🌏' },
  { name: 'Eastern Europe', multiplier: 0.45, color: '#8b5cf6', flag: '🇵🇱' },
  { name: 'Latin America', multiplier: 0.35, color: '#ec4899', flag: '🌎' },
  { name: 'India', multiplier: 0.25, color: '#f97316', flag: '🇮🇳' },
  { name: 'Africa', multiplier: 0.20, color: '#ef4444', flag: '🌍' }
];

const ZoneEarningsPanel = ({ timeRange }) => {
  const [selectedZone, setSelectedZone] = useState(null);

  const baseRevenue = 45000;
  const zoneData = ZONES?.map(zone => ({
    ...zone,
    revenue: baseRevenue * zone?.multiplier * (0.8 + Math.random() * 0.4),
    creators: Math.floor(50 + zone?.multiplier * 200),
    avgPayout: (baseRevenue * zone?.multiplier / (50 + zone?.multiplier * 200))?.toFixed(2),
    growth: (Math.random() * 20 - 5)?.toFixed(1)
  }));

  const totalRevenue = zoneData?.reduce((sum, z) => sum + z?.revenue, 0);

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Zone Revenue Overview</h4>
          <span className="text-sm text-muted-foreground">Total: ${totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={zoneData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} />
            <Tooltip formatter={(v) => [`$${v?.toFixed(2)}`, 'Revenue']} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {zoneData?.map((entry, i) => <Cell key={i} fill={entry?.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {zoneData?.map(zone => (
          <div
            key={zone?.name}
            onClick={() => setSelectedZone(selectedZone === zone?.name ? null : zone?.name)}
            className={`rounded-xl p-4 border cursor-pointer transition-all ${
              selectedZone === zone?.name ? 'border-primary bg-primary/10' : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{zone?.flag}</span>
              <span className="text-xs font-medium text-foreground truncate">{zone?.name}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: zone?.color }}>${zone?.revenue?.toFixed(0)}</p>
            <div className="flex items-center gap-1 mt-1">
              <Icon name={parseFloat(zone?.growth) >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} className={parseFloat(zone?.growth) >= 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-xs ${parseFloat(zone?.growth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>{zone?.growth}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{zone?.creators} creators</p>
          </div>
        ))}
      </div>

      {selectedZone && (() => {
        const zone = zoneData?.find(z => z?.name === selectedZone);
        return zone ? (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h4 className="font-semibold text-foreground mb-4">{zone?.flag} {zone?.name} - Detailed Analytics</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold" style={{ color: zone?.color }}>${zone?.revenue?.toFixed(2)}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Creators</p>
                <p className="text-lg font-bold text-foreground">{zone?.creators}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Avg Payout</p>
                <p className="text-lg font-bold text-foreground">${zone?.avgPayout}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Multiplier</p>
                <p className="text-lg font-bold text-foreground">{zone?.multiplier}x</p>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default ZoneEarningsPanel;