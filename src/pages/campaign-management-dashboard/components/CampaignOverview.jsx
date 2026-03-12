import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignOverview = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Megaphone" size={24} className="text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+12%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Active Campaigns</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.activeCampaigns || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Icon name="DollarSign" size={24} className="text-accent" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+8%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          ${data?.totalSpend?.toLocaleString() || 0}
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
            <Icon name="Users" size={24} className="text-secondary" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+15%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Engagement Rate</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.engagementRate || 0}%
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Icon name="Target" size={24} className="text-success" />
          </div>
          <div className="flex items-center gap-1">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-xs text-success font-medium">+22%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Avg. Participation</p>
        <p className="text-3xl font-heading font-bold text-foreground font-data">
          {data?.avgParticipation?.toLocaleString() || 0}
        </p>
      </div>
    </div>
  );
};

export default CampaignOverview;