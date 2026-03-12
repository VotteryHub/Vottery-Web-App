import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdvancedReportingPanel = ({ timeRange, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const reportTemplates = [
    {
      name: 'Comprehensive Financial Statement',
      description: 'Complete breakdown of all financial metrics across zones',
      icon: 'FileText',
      format: ['PDF', 'Excel', 'CSV'],
      frequency: 'Monthly'
    },
    {
      name: 'Zone Performance Comparison',
      description: 'Comparative analysis of all 8 purchasing power zones',
      icon: 'BarChart',
      format: ['PDF', 'PowerPoint'],
      frequency: 'Weekly'
    },
    {
      name: 'ROI Analytics Report',
      description: 'Detailed ROI breakdown with optimization insights',
      icon: 'Target',
      format: ['PDF', 'Excel'],
      frequency: 'Bi-weekly'
    },
    {
      name: 'Forecasting Summary',
      description: 'Predictive analytics and scenario modeling results',
      icon: 'TrendingUp',
      format: ['PDF', 'Excel'],
      frequency: 'Monthly'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Advanced Reporting
            </h2>
            <p className="text-sm text-muted-foreground">
              Custom financial reporting with exportable analytics
            </p>
          </div>
          <Icon name="FileText" size={24} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates?.map((template, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={template?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {template?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{template?.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {template?.format?.map((fmt, fmtIndex) => (
                  <span key={fmtIndex} className="px-2 py-1 text-xs font-medium bg-muted rounded">
                    {fmt}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Frequency: {template?.frequency}
                </span>
                <Button variant="outline" size="sm" iconName="Download">
                  Generate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-primary" />
          Custom Report Builder
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Zones</label>
            <div className="flex flex-wrap gap-2">
              {['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8']?.map((zone, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Metrics</label>
            <div className="flex flex-wrap gap-2">
              {['Prize Pools', 'Participation Fees', 'Advertiser Spending', 'ROI', 'Conversion Rate']?.map((metric, index) => (
                <button
                  key={index}
                  className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="default" iconName="FileText">
              Generate Custom Report
            </Button>
            <Button variant="outline" iconName="Save">
              Save Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReportingPanel;