import React from 'react';
import Icon from '../../../components/AppIcon';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ModerationActionsPanel = ({ actions }) => {
  const COLORS = ['#DC2626', '#F59E0B', '#7C3AED', '#059669', '#2563EB'];

  const actionIcons = {
    'Content Removed': 'Trash2',
    'User Warned': 'AlertTriangle',
    'Account Restricted': 'Ban',
    'Approved': 'CheckCircle',
    'Escalated': 'ArrowUpCircle'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Actions Distribution</h3>
          <div className="w-full h-80" aria-label="Actions Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={actions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ action, percentage }) => `${action}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {actions?.map((entry, index) => (
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

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Action Breakdown</h3>
          <div className="space-y-3">
            {actions?.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS?.[index % COLORS?.length]}20` }}
                  >
                    <Icon
                      name={actionIcons?.[action?.action] || 'Shield'}
                      size={20}
                      style={{ color: COLORS?.[index % COLORS?.length] }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action?.action}</p>
                    <p className="text-xs text-muted-foreground">{action?.count} actions taken</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-heading font-bold text-foreground">{action?.percentage}%</p>
                  <p className="text-xs text-muted-foreground">of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Enforcement Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={20} className="text-success" />
              <p className="text-sm font-medium text-foreground">Automated</p>
            </div>
            <p className="text-2xl font-heading font-bold text-success">78%</p>
            <p className="text-xs text-muted-foreground mt-1">Actions automated</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={20} className="text-primary" />
              <p className="text-sm font-medium text-foreground">Avg Response</p>
            </div>
            <p className="text-2xl font-heading font-bold text-primary">2.3m</p>
            <p className="text-xs text-muted-foreground mt-1">Time to action</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Target" size={20} className="text-accent" />
              <p className="text-sm font-medium text-foreground">Accuracy</p>
            </div>
            <p className="text-2xl font-heading font-bold text-accent">96.8%</p>
            <p className="text-xs text-muted-foreground mt-1">Action accuracy</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Users" size={20} className="text-warning" />
              <p className="text-sm font-medium text-foreground">Appeals</p>
            </div>
            <p className="text-2xl font-heading font-bold text-warning">12</p>
            <p className="text-xs text-muted-foreground mt-1">Under review</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationActionsPanel;