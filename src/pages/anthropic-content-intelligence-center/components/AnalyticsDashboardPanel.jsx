import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsDashboardPanel = () => {
  const analyticsData = {
    performanceMetrics: {
      totalAnalyzed: 156892,
      avgProcessingTime: '0.8s',
      accuracyRate: 96.8,
      falsePositiveRate: 2.1
    },
    trendData: [
      { month: 'Jan', violations: 3200, accuracy: 94.2 },
      { month: 'Feb', violations: 2950, accuracy: 95.1 },
      { month: 'Mar', violations: 2847, accuracy: 96.8 }
    ],
    categoryBreakdown: [
      { category: 'Misinformation', count: 1234, percentage: 43.4 },
      { category: 'Hate Speech', count: 892, percentage: 31.3 },
      { category: 'Spam', count: 456, percentage: 16.0 },
      { category: 'Other', count: 265, percentage: 9.3 }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Content Intelligence Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive reporting and performance tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="FileText" size={24} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">
            {analyticsData?.performanceMetrics?.totalAnalyzed?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Analyzed</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="Clock" size={24} className="text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">
            {analyticsData?.performanceMetrics?.avgProcessingTime}
          </p>
          <p className="text-sm text-muted-foreground">Avg Processing Time</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="CheckCircle" size={24} className="text-success mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">
            {analyticsData?.performanceMetrics?.accuracyRate}%
          </p>
          <p className="text-sm text-muted-foreground">Accuracy Rate</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <Icon name="XCircle" size={24} className="text-destructive mb-2" />
          <p className="text-2xl font-bold text-foreground mb-1">
            {analyticsData?.performanceMetrics?.falsePositiveRate}%
          </p>
          <p className="text-sm text-muted-foreground">False Positive Rate</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Violation Trends</h3>
        <div className="space-y-3">
          {analyticsData?.trendData?.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium text-foreground">{data?.month}</span>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Violations</p>
                  <p className="text-sm font-bold text-foreground">{data?.violations?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <p className="text-sm font-bold text-success">{data?.accuracy}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Violation Category Breakdown</h3>
        <div className="space-y-3">
          {analyticsData?.categoryBreakdown?.map((category, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{category?.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{category?.count?.toLocaleString()}</span>
                  <span className="text-sm font-bold text-primary">{category?.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category?.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPanel;