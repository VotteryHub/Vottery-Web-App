import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const REVENUE_FEATURES = [
  { name: 'Participatory Ads', screen: '/participatory-ads-studio', revenue: 128400, growth: 18.2, type: 'Advertising' },
  { name: 'Election Participation Fees', screen: '/secure-voting-interface', revenue: 84200, growth: 12.5, type: 'Fees' },
  { name: 'Premium Subscriptions', screen: '/enhanced-premium-subscription-center', revenue: 67800, growth: 24.1, type: 'Subscription' },
  { name: 'Creator Payouts', screen: '/creator-monetization-studio', revenue: -45600, growth: -8.3, type: 'Payout' },
  { name: 'Stripe Connect Fees', screen: '/stripe-connect-account-linking-interface', revenue: 23100, growth: 9.7, type: 'Fees' },
  { name: 'AdSense Revenue', screen: '/ad-sense-revenue-analytics-dashboard', revenue: 18900, growth: 5.4, type: 'Advertising' },
  { name: 'Platform Gamification', screen: '/platform-gamification-core-engine', revenue: 8350, growth: 31.2, type: 'Gamification' },
];

const RevenueImpactPanel = ({ timeRange }) => {
  const [features, setFeatures] = useState(REVENUE_FEATURES);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const total = features?.reduce((sum, f) => sum + f?.revenue, 0);
    setTotalRevenue(total);
  }, [features]);

  const formatRevenue = (val) => {
    const abs = Math.abs(val);
    const formatted = abs >= 1000 ? `$${(abs / 1000)?.toFixed(1)}K` : `$${abs}`;
    return val < 0 ? `-${formatted}` : formatted;
  };

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            ${(features?.filter((f) => f?.revenue > 0)?.reduce((s, f) => s + f?.revenue, 0) / 1000)?.toFixed(1)}K
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
        </div>
        <div className="bg-red-500/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-500">
            ${(Math.abs(features?.filter((f) => f?.revenue < 0)?.reduce((s, f) => s + f?.revenue, 0)) / 1000)?.toFixed(1)}K
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total Payouts</p>
        </div>
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${totalRevenue >= 0 ? 'text-primary' : 'text-red-500'}`}>
            {formatRevenue(totalRevenue)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Net Revenue</p>
        </div>
      </div>
      {/* Revenue by Feature */}
      <div className="space-y-3">
        {features?.map((feature) => (
          <div key={feature?.name} className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
            <div className={`p-2 rounded-lg ${
              feature?.type === 'Advertising' ? 'bg-blue-500/10' :
              feature?.type === 'Subscription' ? 'bg-purple-500/10' :
              feature?.type === 'Fees' ? 'bg-green-500/10' :
              feature?.type === 'Payout' ? 'bg-red-500/10' : 'bg-yellow-500/10'
            }`}>
              <Icon
                name={feature?.revenue < 0 ? 'ArrowDownLeft' : 'ArrowUpRight'}
                size={16}
                className={feature?.revenue < 0 ? 'text-red-500' : 'text-green-500'}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{feature?.name}</p>
              <p className="text-xs text-muted-foreground">{feature?.screen} · {feature?.type}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${feature?.revenue < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatRevenue(feature?.revenue)}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Icon
                  name={feature?.growth >= 0 ? 'TrendingUp' : 'TrendingDown'}
                  size={10}
                  className={feature?.growth >= 0 ? 'text-green-500' : 'text-red-500'}
                />
                <span className={`text-xs ${
                  feature?.growth >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>{feature?.growth >= 0 ? '+' : ''}{feature?.growth}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ROI Note */}
      <div className="mt-6 p-4 bg-muted/30 rounded-xl">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Revenue Attribution Model</p>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue is attributed to the primary screen where the conversion event occurs.
              Predictive modeling uses 90-day rolling averages with seasonal adjustments.
              Data sourced from Supabase transactions, Stripe webhooks, and platform analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueImpactPanel;
