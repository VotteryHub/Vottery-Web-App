import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ViolationAnalytics = ({ violations, analytics }) => {
  const violationChartData = violations?.map(v => ({
    category: v?.category,
    count: v?.count
  })) || [];

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Violations by Category</h3>
        <div className="w-full h-80" aria-label="Violations Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={violationChartData}>
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
              <Bar dataKey="count" fill="#DC2626" name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {violations?.map((violation, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{violation?.category}</p>
                  <p className="text-xs text-muted-foreground">Last 24 hours</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-heading font-bold text-foreground">{violation?.count}</p>
                <p className="text-xs text-muted-foreground mt-1">Total violations</p>
              </div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                violation?.trend?.startsWith('+') ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
              }`}>
                {violation?.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Policy Enforcement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Shield" size={20} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Total Violations</p>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{analytics?.policyViolations || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={20} className="text-warning" />
              <p className="text-sm font-medium text-foreground">Auto-Detected</p>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">
              {Math.round((analytics?.policyViolations || 0) * 0.85)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">85% detection rate</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={20} className="text-accent" />
              <p className="text-sm font-medium text-foreground">Manual Reports</p>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">
              {Math.round((analytics?.policyViolations || 0) * 0.15)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Community flagged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationAnalytics;