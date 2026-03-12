import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="BarChart3" size={24} className="text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+18%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Total Campaigns</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.totalCampaigns || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+25%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Aggregate ROI</p>
        <p className="text-3xl font-heading font-bold text-success font-data">
          {data?.aggregateROI || 0}%
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Icon name="DollarSign" size={24} className="text-accent" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingDown" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">-12%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Cost Efficiency</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          ${data?.costEfficiency || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <Icon name="Target" size={24} className="text-secondary" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+8%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.conversionRate || 0}%
        </p>
      </div>
    </div>
  );
};

export default PerformanceOverview;