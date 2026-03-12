import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceThresholdsPanel = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'above_threshold':
        return 'bg-success/10 text-success border-success/30';
      case 'below_threshold':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'above_threshold':
        return 'TrendingUp';
      case 'below_threshold':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Performance Thresholds
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of campaign performance against target thresholds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Activity" size={24} className="text-primary" />
          <span className="text-sm font-medium text-primary">Live Monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((threshold) => (
          <div 
            key={threshold?.id} 
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              threshold?.triggered ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  getStatusColor(threshold?.status)
                }`}>
                  <Icon name={getStatusIcon(threshold?.status)} size={20} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-semibold text-foreground capitalize">
                    {threshold?.metric?.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {threshold?.threshold}{threshold?.metric === 'roi' ? '%' : ''}
                  </p>
                </div>
              </div>
              {threshold?.triggered && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  Triggered
                </span>
              )}
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Current Value</span>
                <span className="text-lg font-heading font-bold text-foreground font-data">
                  {threshold?.currentValue}{threshold?.metric === 'roi' || threshold?.metric === 'engagement_rate' || threshold?.metric === 'conversion_rate' ? '%' : ''}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    threshold?.status === 'above_threshold' ? 'bg-success' : 'bg-warning'
                  }`}
                  style={{ width: `${Math.min((threshold?.currentValue / threshold?.threshold) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
                <p className="text-xs text-muted-foreground">{threshold?.recommendation}</p>
              </div>
            </div>

            {threshold?.action && threshold?.action !== 'maintain' && (
              <div className="mt-3 flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary capitalize">
                  Auto-Action: {threshold?.action?.replace('_', ' ')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceThresholdsPanel;