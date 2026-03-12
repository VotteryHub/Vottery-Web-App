import React from 'react';
import Icon from '../../../components/AppIcon';

const ScreeningOverviewPanel = ({ statistics, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Processed',
      value: statistics?.totalProcessed?.toLocaleString() || '0',
      icon: 'FileText',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Approved',
      value: statistics?.approved?.toLocaleString() || '0',
      icon: 'CheckCircle',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Flagged',
      value: statistics?.flagged?.toLocaleString() || '0',
      icon: 'Flag',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Blocked',
      value: statistics?.blocked?.toLocaleString() || '0',
      icon: 'XCircle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Pending Review',
      value: statistics?.pendingReview?.toLocaleString() || '0',
      icon: 'Clock',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Human Review Required',
      value: statistics?.humanReviewRequired?.toLocaleString() || '0',
      icon: 'User',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Average Confidence',
      value: `${statistics?.averageConfidence || '0'}%`,
      icon: 'Target',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'False Positive Rate',
      value: '3.2%',
      icon: 'AlertTriangle',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric?.bgColor}`}>
                <Icon name={metric?.icon} className={metric?.color} size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-sm text-muted-foreground">{metric?.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Real-Time Processing Queue
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Processing Speed</span>
            <span className="text-sm font-medium text-foreground">1,247 items/hour</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Queue Depth</span>
            <span className="text-sm font-medium text-foreground">{statistics?.pendingReview || 0} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Processing Time</span>
            <span className="text-sm font-medium text-foreground">1.2 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningOverviewPanel;