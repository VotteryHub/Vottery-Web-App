import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ConcurrentElectionsPanel = ({ data, timeRange }) => {
  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669'];

  const electionStatusData = [
    { name: 'Active', value: data?.activeElections || 0 },
    { name: 'Pending', value: Math.floor((data?.totalElections || 0) * 0.15) },
    { name: 'Completed', value: data?.completedElections || 0 },
    { name: 'Scheduled', value: Math.floor((data?.totalElections || 0) * 0.10) }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Concurrent Elections
          </h2>
          <p className="text-sm text-muted-foreground">
            Currently running elections and voting participation rates
          </p>
        </div>
        <Icon name="Vote" size={24} className="text-secondary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">Currently Running</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            {data?.activeElections || '0'}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+5 from yesterday</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Participation Rate</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            {data?.participationRate || '0'}%
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+8% increase</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Total Votes Cast</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            {data?.totalVotes?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+23% growth</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-accent/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Shield" size={18} className="text-accent" />
            <span className="text-sm text-muted-foreground">Blockchain Verified</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground font-data">
            {data?.verifiedVotes?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              {data?.totalVotes > 0 ? ((data?.verifiedVotes / data?.totalVotes) * 100)?.toFixed(1) : '0'}% verified
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Election Status Distribution
          </h3>
          <div className="w-full h-64" aria-label="Election Status Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {electionStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Completion Forecasts
          </h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Elections Ending Today</span>
                <span className="text-lg font-bold text-foreground font-data">
                  {Math.floor((data?.activeElections || 0) * 0.25)}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-destructive h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Elections Ending This Week</span>
                <span className="text-lg font-bold text-foreground font-data">
                  {Math.floor((data?.activeElections || 0) * 0.45)}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '55%' }} />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Elections Ending This Month</span>
                <span className="text-lg font-bold text-foreground font-data">
                  {Math.floor((data?.activeElections || 0) * 0.30)}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentElectionsPanel;