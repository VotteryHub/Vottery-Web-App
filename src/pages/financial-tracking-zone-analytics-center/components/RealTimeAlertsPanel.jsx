import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimeAlertsPanel = ({ loading }) => {
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

  const alerts = [
    {
      type: 'warning',
      title: 'Budget Threshold Approaching',
      message: 'Zone 4 advertiser spending is at 85% of allocated budget',
      zone: 'Zone 4',
      timestamp: '5 minutes ago',
      action: 'Review Budget'
    },
    {
      type: 'success',
      title: 'ROI Target Exceeded',
      message: 'Zone 3 has exceeded target ROI by 12.5%',
      zone: 'Zone 3',
      timestamp: '15 minutes ago',
      action: 'View Details'
    },
    {
      type: 'info',
      title: 'Prize Pool Optimization Available',
      message: 'New optimization recommendation for Zone 1 prize distribution',
      zone: 'Zone 1',
      timestamp: '1 hour ago',
      action: 'Apply Optimization'
    },
    {
      type: 'critical',
      title: 'Payment Processing Delay',
      message: 'Zone 7 participation fee processing experiencing delays',
      zone: 'Zone 7',
      timestamp: '2 hours ago',
      action: 'Investigate'
    }
  ];

  const getAlertStyle = (type) => {
    const styles = {
      critical: { icon: 'AlertCircle', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
      warning: { icon: 'AlertTriangle', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
      success: { icon: 'CheckCircle', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
      info: { icon: 'Info', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
    };
    return styles?.[type] || styles?.info;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Real-Time Alerts
            </h2>
            <p className="text-sm text-muted-foreground">
              Automated alert configuration for budget thresholds and optimization controls
            </p>
          </div>
          <Icon name="Bell" size={24} className="text-primary" />
        </div>

        <div className="space-y-3">
          {alerts?.map((alert, index) => {
            const style = getAlertStyle(alert?.type);
            return (
              <div key={index} className={`p-4 border ${style?.border} rounded-lg ${style?.bg}`}>
                <div className="flex items-start gap-3">
                  <Icon name={style?.icon} size={20} className={`${style?.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-heading font-semibold text-foreground">{alert?.title}</h3>
                      <span className="text-xs text-muted-foreground">{alert?.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{alert?.message}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        <Icon name="MapPin" size={12} className="inline mr-1" />
                        {alert?.zone}
                      </span>
                      <Button variant="outline" size="sm" iconName="ArrowRight">
                        {alert?.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-primary" />
          Alert Configuration
        </h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Budget Threshold Alerts</span>
              <button className="w-10 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Notify when zone spending reaches 80% of budget</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">ROI Performance Alerts</span>
              <button className="w-10 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Alert on significant ROI changes (±10%)</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Optimization Recommendations</span>
              <button className="w-10 h-6 bg-primary rounded-full relative">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Notify when new optimization opportunities are detected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAlertsPanel;