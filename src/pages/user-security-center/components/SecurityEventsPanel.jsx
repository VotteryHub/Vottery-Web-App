import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityEventsPanel = ({ securityEvents, timeRange, onRefresh }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20'
    };
    return colors?.[severity] || colors?.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      low: 'Info',
      medium: 'AlertCircle',
      high: 'AlertTriangle',
      critical: 'AlertOctagon'
    };
    return icons?.[severity] || 'AlertCircle';
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      security: 'Shield',
      login: 'LogIn',
      transaction: 'DollarSign',
      account: 'User',
      fraud: 'AlertTriangle'
    };
    return icons?.[type] || 'Bell';
  };

  if (!securityEvents || securityEvents?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="CheckCircle" size={48} className="mx-auto text-green-600 mb-4" />
        <p className="text-foreground font-medium mb-2">No Security Events</p>
        <p className="text-sm text-muted-foreground">No security events detected in the last {timeRange}</p>
      </div>
    );
  }

  const eventsByType = securityEvents?.reduce((acc, event) => {
    const type = event?.alert_type || 'other';
    if (!acc?.[type]) acc[type] = [];
    acc?.[type]?.push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <Icon name="Activity" size={28} className="mx-auto text-primary mb-2" />
          <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
            {securityEvents?.length}
          </div>
          <div className="text-xs text-muted-foreground">Total Events</div>
        </div>

        <div className="card text-center">
          <Icon name="AlertTriangle" size={28} className="mx-auto text-red-600 mb-2" />
          <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
            {securityEvents?.filter(e => e?.severity === 'critical')?.length}
          </div>
          <div className="text-xs text-muted-foreground">Critical</div>
        </div>

        <div className="card text-center">
          <Icon name="AlertCircle" size={28} className="mx-auto text-orange-600 mb-2" />
          <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
            {securityEvents?.filter(e => e?.severity === 'high')?.length}
          </div>
          <div className="text-xs text-muted-foreground">High</div>
        </div>

        <div className="card text-center">
          <Icon name="CheckCircle" size={28} className="mx-auto text-green-600 mb-2" />
          <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
            {securityEvents?.filter(e => e?.status === 'resolved')?.length}
          </div>
          <div className="text-xs text-muted-foreground">Resolved</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          {securityEvents?.slice(0, 20)?.map((event, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`p-2 rounded-lg ${getSeverityColor(event?.severity)}`}>
                <Icon name={getAlertTypeIcon(event?.alert_type)} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{event?.message}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(event?.severity)}`}>
                    {event?.severity?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {new Date(event?.created_at)?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {event?.alert_type}
                  </span>
                  <span className={`flex items-center gap-1 ${
                    event?.status === 'resolved' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    <Icon name={event?.status === 'resolved' ? 'CheckCircle' : 'Clock'} size={12} />
                    {event?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(eventsByType)?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Events by Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(eventsByType)?.map(([type, events]) => (
              <div key={type} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={getAlertTypeIcon(type)} size={18} className="text-primary" />
                  <h4 className="text-sm font-semibold text-foreground capitalize">{type}</h4>
                </div>
                <div className="text-2xl font-heading font-bold text-foreground font-data">
                  {events?.length}
                </div>
                <div className="text-xs text-muted-foreground">events detected</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityEventsPanel;