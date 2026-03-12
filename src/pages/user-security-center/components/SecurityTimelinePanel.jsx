import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityTimelinePanel = ({ securityTimeline, onRefresh }) => {
  const getActionIcon = (action) => {
    const icons = {
      login: 'LogIn',
      logout: 'LogOut',
      password_change: 'Key',
      profile_update: 'User',
      security_setting: 'Settings',
      alert_created: 'Bell',
      alert_resolved: 'CheckCircle'
    };
    return icons?.[action] || 'Activity';
  };

  const getActionColor = (action) => {
    const colors = {
      login: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      logout: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20',
      password_change: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      profile_update: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      security_setting: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      alert_created: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      alert_resolved: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    };
    return colors?.[action] || 'text-primary bg-primary/10';
  };

  if (!securityTimeline || securityTimeline?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No security timeline data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Security Activity Timeline</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Chronological security events, authentication logs, and protective actions taken
        </p>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />
          <div className="space-y-6">
            {securityTimeline?.map((event, index) => (
              <div key={index} className="relative flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${getActionColor(event?.action)}`}>
                  <Icon name={getActionIcon(event?.action)} size={20} />
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{event?.action_description || event?.action}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event?.created_at)?.toLocaleString()}
                      </span>
                    </div>
                    {event?.details && (
                      <p className="text-sm text-muted-foreground mb-2">{event?.details}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {event?.ip_address && (
                        <span className="flex items-center gap-1">
                          <Icon name="Globe" size={12} />
                          {event?.ip_address}
                        </span>
                      )}
                      {event?.user_agent && (
                        <span className="flex items-center gap-1">
                          <Icon name="Monitor" size={12} />
                          {event?.user_agent?.substring(0, 30)}...
                        </span>
                      )}
                      {event?.compliance_relevant && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Icon name="Shield" size={12} />
                          Compliance Relevant
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Timeline Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Activity" size={24} className="mx-auto text-primary mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {securityTimeline?.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Events</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="LogIn" size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {securityTimeline?.filter(e => e?.action === 'login')?.length}
            </div>
            <div className="text-xs text-muted-foreground">Login Events</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Shield" size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">
              {securityTimeline?.filter(e => e?.compliance_relevant)?.length}
            </div>
            <div className="text-xs text-muted-foreground">Compliance Events</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTimelinePanel;