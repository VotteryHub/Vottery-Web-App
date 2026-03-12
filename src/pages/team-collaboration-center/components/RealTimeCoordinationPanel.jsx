import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeCoordinationPanel = ({ metrics, presence, onRefresh }) => {
  const onlineMembers = presence?.filter(p => p?.status === 'online') || [];
  const recentChanges = [
    { user: 'Sarah Chen', action: 'Increased Zone 1 budget', timestamp: new Date(Date.now() - 180000), field: 'budget', oldValue: '$20,000', newValue: '$25,000' },
    { user: 'Mike Johnson', action: 'Updated targeting parameters', timestamp: new Date(Date.now() - 360000), field: 'targeting', oldValue: '25-45', newValue: '30-50' },
    { user: 'Emily Rodriguez', action: 'Added creative variant', timestamp: new Date(Date.now() - 540000), field: 'creative', oldValue: null, newValue: 'banner_v3.jpg' }
  ];

  const criticalAlerts = metrics?.alerts?.filter(a => a?.severity === 'high') || [];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-xl font-heading font-semibold text-foreground">Real-Time Coordination</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Users" size={24} className="text-green-600" />
              <div>
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">Active Team Members</h3>
                <p className="text-2xl font-heading font-bold text-green-600 font-data">{onlineMembers?.length}</p>
              </div>
            </div>
            <div className="space-y-2">
              {onlineMembers?.map((member) => (
                <div key={member?.userId} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-900 dark:text-green-100 font-medium">{member?.name}</span>
                  {member?.currentPage && (
                    <span className="text-green-700 dark:text-green-300 text-xs">- {member?.currentPage}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Activity" size={24} className="text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Live Metric Updates</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">Refreshing every 30 seconds</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Impressions</p>
                <p className="text-lg font-heading font-bold text-blue-600 font-data">
                  {metrics?.realTimeMetrics?.impressions?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Conversions</p>
                <p className="text-lg font-heading font-bold text-blue-600 font-data">
                  {metrics?.realTimeMetrics?.conversions?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Simultaneous Editing Activity</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track real-time changes made by team members with instant notifications
        </p>
        <div className="space-y-3">
          {recentChanges?.map((change, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {change?.user?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{change?.user}</p>
                    <p className="text-xs text-muted-foreground">{change?.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - change?.timestamp) / 60000)} min ago
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Field:</span>
                  <span className="font-medium text-foreground capitalize">{change?.field}</span>
                </div>
                {change?.oldValue && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium text-red-600">{change?.oldValue}</span>
                    </div>
                    <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                  </>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium text-green-600">{change?.newValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {criticalAlerts?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Critical Performance Alerts</h3>
          <div className="space-y-3">
            {criticalAlerts?.map((alert, index) => (
              <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-red-900 dark:text-red-100 capitalize">{alert?.type}</span>
                      <span className="text-xs text-red-600 dark:text-red-400">
                        {new Date(alert?.timestamp)?.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-200">{alert?.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Coordination Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Bell" size={20} className="text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">Instant Notifications</h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Receive real-time alerts when team members make critical changes or performance thresholds are reached
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Edit" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Collaborative Editing</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Multiple team members can adjust campaign parameters simultaneously with conflict resolution
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Eye" size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">Live Presence Indicators</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  See who's online and what they're working on in real-time for better coordination
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Lock" size={20} className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">Role-Based Permissions</h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Control access levels and editing permissions based on team member roles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCoordinationPanel;