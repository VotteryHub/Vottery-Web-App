import React from 'react';
import Icon from '../../../components/AppIcon';

const OptimizationOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Lightbulb" size={24} className="text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Active</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Total Recommendations</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.totalRecommendations || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Icon name="AlertCircle" size={24} className="text-red-600" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600 font-medium">High Priority</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">High Priority Actions</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.highPriority || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Icon name="TrendingUp" size={24} className="text-success" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Zap" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">Projected</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Potential ROI Increase</p>
        <p className="text-3xl font-heading font-bold text-success font-data">
          {data?.potentialRoiIncrease || '+0%'}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Icon name="Target" size={24} className="text-accent" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="CheckCircle" size={14} className="text-accent" />
            <span className="text-xs text-accent font-medium">{data?.avgConfidence || 0}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Avg Confidence Score</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.avgConfidence || 0}%
        </p>
      </div>
    </div>
  );
};

export default OptimizationOverview;