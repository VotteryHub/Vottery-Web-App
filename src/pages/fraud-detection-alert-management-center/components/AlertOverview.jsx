import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertOverview = ({ statistics, recentAlerts, onRefresh }) => {
  const overviewCards = [
    {
      label: 'Total Alerts',
      value: statistics?.total || 0,
      icon: 'AlertTriangle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Active Alerts',
      value: statistics?.active || 0,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Acknowledged',
      value: statistics?.acknowledged || 0,
      icon: 'CheckCircle',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      label: 'Resolved',
      value: statistics?.resolved || 0,
      icon: 'CheckCircle2',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      info: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    };
    return colors?.[severity] || colors?.info;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards?.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card?.label}</p>
                <p className="text-2xl font-heading font-bold text-foreground font-data">{card?.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alerts by Severity</h3>
          <div className="space-y-3">
            {Object.entries(statistics?.bySeverity || {})?.map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)?.split(' ')?.[1]}`} />
                  <span className="text-sm font-medium text-foreground capitalize">{severity}</span>
                </div>
                <span className="text-sm font-bold text-foreground font-data">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Alerts by Category</h3>
          <div className="space-y-3">
            {Object.entries(statistics?.byCategory || {})?.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground capitalize">
                  {category?.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-bold text-foreground font-data">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Recent Alerts</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
        <div className="space-y-3">
          {recentAlerts?.length > 0 ? (
            recentAlerts?.map((alert) => (
              <div key={alert?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(alert?.severity)}`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert?.createdAt)?.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{alert?.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert?.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert?.status === 'active' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    alert?.status === 'acknowledged'? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {alert?.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="CheckCircle2" size={48} className="mx-auto mb-2" />
              <p>No recent alerts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertOverview;