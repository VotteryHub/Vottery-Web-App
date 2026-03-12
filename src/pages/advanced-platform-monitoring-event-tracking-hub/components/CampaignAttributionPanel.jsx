import React from 'react';
import Icon from '../../../components/AppIcon';

const CampaignAttributionPanel = ({ data, timeRange }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground text-center">No campaign attribution data available</p>
      </div>
    );
  }

  const segmentColors = {
    voter: { color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
    advertiser: { color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
    admin: { color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-1">
              Campaign Performance Attribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Cross-segment analysis with conversion tracking and ROI calculations
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="Target" size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-500">
              Top: {data?.topPerformingSegment || 'N/A'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon name="BarChart3" size={20} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Campaigns</p>
                <p className="text-2xl font-bold text-foreground">{data?.totalCampaigns || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon name="Users" size={20} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{data?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Segments Analyzed</p>
                <p className="text-2xl font-bold text-foreground">
                  {Object.keys(data?.segmentPerformance || {})?.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Segment Performance Analysis
        </h3>
        <div className="space-y-4">
          {Object.entries(data?.segmentPerformance || {})?.map(([segment, metrics]) => {
            const colors = segmentColors?.[segment] || segmentColors?.voter;
            return (
              <div key={segment} className={`bg-background rounded-lg border ${colors?.borderColor} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${colors?.bgColor} flex items-center justify-center`}>
                      <Icon name="Users" size={24} className={colors?.color} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground capitalize">{segment} Segment</p>
                      <p className="text-xs text-muted-foreground">{metrics?.users || 0} users tracked</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${colors?.color}`}>{metrics?.conversionRate || 0}%</p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Engagement</p>
                    <p className="text-lg font-bold text-foreground">{metrics?.avgEngagement || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Conversions</p>
                    <p className="text-lg font-bold text-foreground">{metrics?.totalConversions || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                    <p className="text-lg font-bold text-foreground">{metrics?.conversionRate || 0}%</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${colors?.color?.replace('text-', 'from-')} ${colors?.color?.replace('text-', 'to-')}`}
                      style={{ width: `${metrics?.conversionRate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          Attribution Insights & Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon name="Target" size={20} className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-500 mb-1">Top Performing Segment</p>
              <p className="text-xs text-muted-foreground">
                The {data?.topPerformingSegment} segment shows the highest conversion rate. Consider allocating more budget to this audience.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Icon name="TrendingUp" size={20} className="text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-500 mb-1">Cross-Segment Optimization</p>
              <p className="text-xs text-muted-foreground">
                Analyze user journey patterns across segments to identify cross-selling opportunities and improve attribution modeling.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <Icon name="Zap" size={20} className="text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-500 mb-1">ROI Maximization</p>
              <p className="text-xs text-muted-foreground">
                Focus campaign efforts on segments with highest engagement and conversion rates to maximize return on investment.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">
          User Journey Mapping
        </h3>
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon name="Eye" size={16} className="text-blue-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Impression</span>
            </div>
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Icon name="MousePointer" size={16} className="text-purple-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Click</span>
            </div>
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Icon name="Activity" size={16} className="text-orange-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Engagement</span>
            </div>
            <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={16} className="text-green-500" />
              </div>
              <span className="text-sm font-medium text-foreground">Conversion</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Track user interactions across all touchpoints to understand the complete conversion path and optimize campaign performance.
        </p>
      </div>
    </div>
  );
};

export default CampaignAttributionPanel;