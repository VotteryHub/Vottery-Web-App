import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DrillDownDashboardPanel = ({ reports }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);

  const dashboardMetrics = [
    {
      id: 'platform_kpis',
      name: 'Platform KPIs',
      icon: 'BarChart',
      metrics: [
        { name: 'Total Revenue', value: '$2.4M', change: '+12.5%', trend: 'up' },
        { name: 'Active Users', value: '45.2K', change: '+8.3%', trend: 'up' },
        { name: 'Engagement Rate', value: '68%', change: '+5.2%', trend: 'up' },
        { name: 'Conversion Rate', value: '3.2%', change: '-1.1%', trend: 'down' }
      ]
    },
    {
      id: 'fraud_patterns',
      name: 'Fraud Patterns',
      icon: 'Shield',
      metrics: [
        { name: 'Fraud Incidents', value: '23', change: '-15%', trend: 'down' },
        { name: 'Detection Rate', value: '94%', change: '+3%', trend: 'up' },
        { name: 'False Positives', value: '12', change: '-8%', trend: 'down' },
        { name: 'Avg Response Time', value: '4.2min', change: '-22%', trend: 'down' }
      ]
    },
    {
      id: 'compliance_status',
      name: 'Compliance Status',
      icon: 'FileCheck',
      metrics: [
        { name: 'Compliance Score', value: '98%', change: '+2%', trend: 'up' },
        { name: 'Pending Submissions', value: '3', change: '0%', trend: 'neutral' },
        { name: 'Audit Findings', value: '0', change: '-100%', trend: 'down' },
        { name: 'Policy Updates', value: '5', change: '+25%', trend: 'up' }
      ]
    },
    {
      id: 'revenue_metrics',
      name: 'Revenue Metrics',
      icon: 'DollarSign',
      metrics: [
        { name: 'Monthly Revenue', value: '$820K', change: '+15%', trend: 'up' },
        { name: 'Advertiser Spend', value: '$450K', change: '+18%', trend: 'up' },
        { name: 'Prize Payouts', value: '$280K', change: '+10%', trend: 'up' },
        { name: 'Net Margin', value: '34%', change: '+2%', trend: 'up' }
      ]
    }
  ];

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'neutral': return 'Minus';
      default: return 'Minus';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="BarChart" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Interactive Drill-Down Dashboards</h2>
            <p className="text-sm text-muted-foreground">Comprehensive data exploration with real-time metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {dashboardMetrics?.map((dashboard) => (
            <div
              key={dashboard?.id}
              className={`bg-background border rounded-lg p-6 cursor-pointer transition-all duration-250 ${
                selectedMetric === dashboard?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/40'
              }`}
              onClick={() => setSelectedMetric(selectedMetric === dashboard?.id ? null : dashboard?.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name={dashboard?.icon} size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-foreground">{dashboard?.name}</h3>
                </div>
                <Icon
                  name={selectedMetric === dashboard?.id ? 'ChevronUp' : 'ChevronDown'}
                  size={20}
                  className="text-muted-foreground"
                />
              </div>

              {selectedMetric === dashboard?.id && (
                <div className="space-y-3 animate-fade-in">
                  {dashboard?.metrics?.map((metric, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{metric?.name}</p>
                          <p className="text-2xl font-bold text-foreground">{metric?.value}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name={getTrendIcon(metric?.trend)} size={16} className={getTrendColor(metric?.trend)} />
                          <span className={`text-sm font-medium ${getTrendColor(metric?.trend)}`}>
                            {metric?.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" iconName="ExternalLink" className="w-full">
                    View Full Dashboard
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Icon name="Info" size={24} className="text-primary mt-1" />
            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">Drill-Down Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                  <span>Real-time performance monitoring across all KPIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                  <span>Custom metric analysis with historical comparisons</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                  <span>Claude-generated insights and trend analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                  <span>One-click export to executive reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrillDownDashboardPanel;