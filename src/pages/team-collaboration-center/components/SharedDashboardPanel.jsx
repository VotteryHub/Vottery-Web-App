import React from 'react';
import Icon from '../../../components/AppIcon';

const SharedDashboardPanel = ({ metrics, onRefresh }) => {
  const realTimeMetrics = metrics?.realTimeMetrics || {
    activeUsers: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    roi: 0
  };

  const performanceByZone = metrics?.performanceByZone || [];
  const teamActivity = metrics?.teamActivity || [];
  const alerts = metrics?.alerts || [];

  const metricCards = [
    { label: 'Active Users', value: realTimeMetrics?.activeUsers?.toLocaleString(), icon: 'Users', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Impressions', value: realTimeMetrics?.impressions?.toLocaleString(), icon: 'Eye', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Clicks', value: realTimeMetrics?.clicks?.toLocaleString(), icon: 'MousePointer', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Conversions', value: realTimeMetrics?.conversions?.toLocaleString(), icon: 'Target', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Revenue', value: `$${realTimeMetrics?.revenue?.toLocaleString()}`, icon: 'DollarSign', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'CTR', value: `${realTimeMetrics?.ctr?.toFixed(2)}%`, icon: 'TrendingUp', color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { label: 'Conv. Rate', value: `${realTimeMetrics?.conversionRate?.toFixed(2)}%`, icon: 'Percent', color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: 'ROI', value: `${realTimeMetrics?.roi?.toFixed(1)}%`, icon: 'TrendingUp', color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    };
    return colors?.[severity] || colors?.low;
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">Real-Time Campaign Performance</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {metricCards?.map((card, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card?.bgColor} mb-3`}>
                <Icon name={card?.icon} size={20} className={card?.color} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card?.label}</p>
              <p className="text-lg font-heading font-bold text-foreground font-data">{card?.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Performance by Zone</h3>
          <div className="space-y-3">
            {performanceByZone?.map((zone, index) => (
              <div key={index} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{zone?.zone}</span>
                  <span className="text-sm font-bold text-primary font-data">{zone?.roi}% ROI</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block">Impressions</span>
                    <span className="font-bold text-foreground font-data">{zone?.impressions?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block">Conversions</span>
                    <span className="font-bold text-foreground font-data">{zone?.conversions}</span>
                  </div>
                  <div>
                    <span className="block">Revenue</span>
                    <span className="font-bold text-foreground font-data">${zone?.revenue?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{ width: `${(zone?.roi / 250) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Team Activity</h3>
          <div className="space-y-3">
            {teamActivity?.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {activity?.member?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity?.member}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity?.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity?.timestamp)?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {alerts && alerts?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Performance Alerts</h3>
          <div className="space-y-3">
            {alerts?.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(alert?.severity)}`}>
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" size={20} className={alert?.severity === 'high' ? 'text-red-600' : alert?.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground capitalize">{alert?.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert?.timestamp)?.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{alert?.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Collaborative Annotations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Team members can add comments and annotations to specific metrics for strategic planning
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Icon name="MessageSquare" size={20} className="text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">Sarah Chen commented on Zone 1 ROI</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                "Excellent performance! Let's maintain this momentum by increasing budget allocation by 10%."
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">5 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDashboardPanel;