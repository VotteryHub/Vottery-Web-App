import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueStreamsPanel = ({ data, timeRange }) => {
  const zoneRevenueData = [
    { zone: 'Zone 1 (US)', revenue: parseFloat(data?.totalRevenue || 0) * 0.28 },
    { zone: 'Zone 2 (EU)', revenue: parseFloat(data?.totalRevenue || 0) * 0.22 },
    { zone: 'Zone 3 (CA)', revenue: parseFloat(data?.totalRevenue || 0) * 0.15 },
    { zone: 'Zone 4 (AU/NZ)', revenue: parseFloat(data?.totalRevenue || 0) * 0.12 },
    { zone: 'Zone 5 (Asia)', revenue: parseFloat(data?.totalRevenue || 0) * 0.10 },
    { zone: 'Zone 6 (LATAM)', revenue: parseFloat(data?.totalRevenue || 0) * 0.08 },
    { zone: 'Zone 7 (Emerging)', revenue: parseFloat(data?.totalRevenue || 0) * 0.03 },
    { zone: 'Zone 8 (Africa)', revenue: parseFloat(data?.totalRevenue || 0) * 0.02 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Revenue Streams
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time participation fees and prize pool distributions
          </p>
        </div>
        <Icon name="DollarSign" size={24} className="text-success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            ${parseFloat(data?.totalRevenue || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+18% from last period</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wallet" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Platform Fees</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            ${parseFloat(data?.platformFees || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+15% growth</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Trophy" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Prize Pool</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            ${parseFloat(data?.totalPrizePool || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              {data?.totalRevenue > 0 ? ((parseFloat(data?.totalPrizePool || 0) / parseFloat(data?.totalRevenue || 1)) * 100)?.toFixed(1) : '0'}% of revenue
            </span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Avg Entry Fee</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            ${parseFloat(data?.averageEntryFee || 0)?.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">Per election</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Revenue by Purchasing Power Zone
        </h3>
        <div className="w-full h-80" aria-label="Zone Revenue Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneRevenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" stroke="var(--color-muted-foreground)" />
              <YAxis dataKey="zone" type="category" stroke="var(--color-muted-foreground)" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
                formatter={(value) => `$${value?.toFixed(2)}`}
              />
              <Bar dataKey="revenue" fill="#059669" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueStreamsPanel;