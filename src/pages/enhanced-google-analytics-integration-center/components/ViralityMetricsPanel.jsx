import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ViralityMetricsPanel = ({ timeRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = {
        viralityScore: 8.7,
        viralCoefficient: 1.8,
        socialShares: {
          whatsapp: 5678,
          facebook: 3456,
          twitter: 2345,
          linkedin: 1234,
          telegram: 987
        },
        referralTraffic: {
          direct: 45.2,
          social: 28.7,
          organic: 18.3,
          referral: 7.8
        },
        viralContent: [
          { title: 'Presidential Election 2026', shares: 12456, viralScore: 9.2 },
          { title: 'Best Tech Innovation', shares: 8765, viralScore: 8.8 },
          { title: 'Sports Championship', shares: 6543, viralScore: 8.5 }
        ],
        networkEffect: {
          avgInvitesPerUser: 3.2,
          inviteAcceptanceRate: 45.8,
          secondOrderConnections: 15678
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Error loading virality metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Virality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="TrendingUp" size={24} className="text-primary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">{data?.viralityScore}</p>
          <p className="text-sm font-medium text-foreground">Virality Score</p>
          <p className="text-xs text-muted-foreground">Out of 10</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Share2" size={24} className="text-secondary mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">{data?.viralCoefficient}</p>
          <p className="text-sm font-medium text-foreground">Viral Coefficient</p>
          <p className="text-xs text-muted-foreground">Avg new users per user</p>
        </div>
        <div className="p-6 bg-card rounded-xl border border-border">
          <Icon name="Users" size={24} className="text-success mb-3" />
          <p className="text-3xl font-bold text-foreground mb-2">
            {Object.values(data?.socialShares)?.reduce((a, b) => a + b, 0)?.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-foreground">Total Social Shares</p>
          <p className="text-xs text-muted-foreground">Across all platforms</p>
        </div>
      </div>

      {/* Social Shares Breakdown */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Social Sharing Breakdown
        </h3>
        <div className="space-y-4">
          {Object.entries(data?.socialShares)?.map(([platform, count]) => (
            <div key={platform}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground capitalize">{platform}</span>
                <span className="text-sm text-muted-foreground">{count?.toLocaleString()} shares</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ 
                    width: `${(count / Object.values(data?.socialShares)?.reduce((a, b) => a + b, 0)) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viral Content */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Top Viral Content
        </h3>
        <div className="space-y-3">
          {data?.viralContent?.map((content, index) => (
            <div key={index} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{content?.title}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                  Score: {content?.viralScore}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {content?.shares?.toLocaleString()} shares
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Network Effect */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-6">
          Network Effect Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-2xl font-bold text-foreground mb-2">{data?.networkEffect?.avgInvitesPerUser}</p>
            <p className="text-sm text-muted-foreground">Avg Invites Per User</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-2xl font-bold text-foreground mb-2">{data?.networkEffect?.inviteAcceptanceRate}%</p>
            <p className="text-sm text-muted-foreground">Invite Acceptance Rate</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-2xl font-bold text-foreground mb-2">
              {data?.networkEffect?.secondOrderConnections?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">2nd Order Connections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralityMetricsPanel;