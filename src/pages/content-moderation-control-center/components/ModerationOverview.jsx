import React from 'react';
import Icon from '../../../components/AppIcon';

const ModerationOverview = ({ analytics, modelPerformance }) => {
  const metrics = [
    {
      label: 'Total Scanned',
      value: analytics?.totalScanned?.toLocaleString() || '0',
      icon: 'Scan',
      bgColor: 'bg-primary/10',
      iconColor: 'var(--color-primary)',
      subtitle: 'Last 24 hours'
    },
    {
      label: 'Flagged Content',
      value: analytics?.flaggedContent?.toLocaleString() || '0',
      icon: 'Flag',
      bgColor: 'bg-warning/10',
      iconColor: 'var(--color-warning)',
      subtitle: 'Requires attention'
    },
    {
      label: 'Policy Violations',
      value: analytics?.policyViolations?.toLocaleString() || '0',
      icon: 'AlertTriangle',
      bgColor: 'bg-destructive/10',
      iconColor: 'var(--color-destructive)',
      subtitle: 'Confirmed violations'
    },
    {
      label: 'Auto Removed',
      value: analytics?.autoRemoved?.toLocaleString() || '0',
      icon: 'Trash2',
      bgColor: 'bg-success/10',
      iconColor: 'var(--color-success)',
      subtitle: 'Automated actions'
    },
    {
      label: 'Spam Detected',
      value: analytics?.spamDetected?.toLocaleString() || '0',
      icon: 'Ban',
      bgColor: 'bg-secondary/10',
      iconColor: 'var(--color-secondary)',
      subtitle: 'Spam content blocked'
    },
    {
      label: 'Misinformation',
      value: analytics?.misinformationFlags?.toLocaleString() || '0',
      icon: 'AlertCircle',
      bgColor: 'bg-accent/10',
      iconColor: 'var(--color-accent)',
      subtitle: 'False info flagged'
    },
    {
      label: 'Pending Review',
      value: analytics?.pendingReview?.toLocaleString() || '0',
      icon: 'Clock',
      bgColor: 'bg-warning/10',
      iconColor: 'var(--color-warning)',
      subtitle: 'Manual review queue'
    },
    {
      label: 'False Positive Rate',
      value: `${analytics?.falsePositiveRate || 0}%`,
      icon: 'Target',
      bgColor: 'bg-success/10',
      iconColor: 'var(--color-success)',
      subtitle: 'Model accuracy'
    }
  ];

  const performanceMetrics = [
    { label: 'Accuracy', value: `${modelPerformance?.accuracy || 0}%`, color: 'text-success' },
    { label: 'Precision', value: `${modelPerformance?.precision || 0}%`, color: 'text-primary' },
    { label: 'Recall', value: `${modelPerformance?.recall || 0}%`, color: 'text-secondary' },
    { label: 'F1 Score', value: `${modelPerformance?.f1Score || 0}%`, color: 'text-accent' },
    { label: 'Processing Speed', value: `${modelPerformance?.processingSpeed || 0} items/sec`, color: 'text-foreground' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{metric?.label}</p>
                <p className="text-xl font-heading font-bold text-foreground font-data">{metric?.value}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{metric?.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">AI Model Performance</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">Active</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {performanceMetrics?.map((metric, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
              <p className={`text-2xl font-heading font-bold ${metric?.color}`}>{metric?.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Continuous Learning Active</p>
              <p className="text-xs text-muted-foreground">
                Model automatically improves accuracy based on moderator feedback and false positive corrections.
                Last updated: {new Date(modelPerformance?.lastUpdated)?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationOverview;