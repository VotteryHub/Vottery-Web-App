import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../../../services/analyticsService';

const RevenueTracking = ({ data, timeRange }) => {
  const [revenueByCategory, setRevenueByCategory] = useState([]);

  useEffect(() => {
    loadRevenueData();
  }, [timeRange]);

  const loadRevenueData = async () => {
    const result = await analyticsService?.getRevenueByCategory(timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30);
    if (result?.data) {
      setRevenueByCategory(result?.data);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Revenue Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Participation fees and prize pool distributions
          </p>
        </div>
        <Icon name="DollarSign" size={24} className="text-success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.totalRevenue || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">From participation fees</p>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wallet" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Platform Fees</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.platformFees || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Net platform revenue</p>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Gift" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Prize Pool</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.totalPrizePool || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Distributed to winners</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Avg Entry Fee</span>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground font-data">
            ${data?.averageEntryFee || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Per election</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Revenue by Category
        </h3>
        <div className="w-full h-64" aria-label="Revenue by Category Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="category" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#2563EB" name="Revenue ($)" />
              <Bar dataKey="fees" fill="#7C3AED" name="Fees ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracking;
