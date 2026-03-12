import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimeline = ({ logs, onRefresh }) => {
  const getActionIcon = (actionType) => {
    const icons = {
      user_management: 'Users',
      election_approval: 'CheckCircle',
      election_rejection: 'XCircle',
      content_moderation: 'Shield',
      system_configuration: 'Settings',
      security_event: 'Lock',
      data_export: 'Download',
      policy_update: 'FileText'
    };
    return icons?.[actionType] || 'Activity';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200',
      info: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200'
    };
    return colors?.[severity] || colors?.info;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Activity Timeline ({logs?.length})
          </h3>
        </div>

        <div className="space-y-4">
          {logs?.map((log, index) => (
            <div key={log?.id} className="relative">
              {index !== logs?.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
              )}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  getSeverityColor(log?.severity)?.split(' ')?.[1]
                }`}>
                  <Icon
                    name={getActionIcon(log?.actionType)}
                    size={20}
                    className={getSeverityColor(log?.severity)?.split(' ')?.[0]}
                  />
                </div>
                <div className="flex-1 card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(log?.severity)}`}>
                          {log?.severity?.toUpperCase()}
                        </span>
                        {log?.complianceRelevant && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium">
                            <Icon name="Shield" size={12} className="inline mr-1" />
                            Compliance
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground">{log?.actionDescription}</h4>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDate(log?.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {log?.admin?.name || log?.admin?.email || 'Unknown Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={12} />
                      {log?.actionType?.replace(/_/g, ' ')}
                    </span>
                    {log?.ipAddress && (
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {log?.ipAddress}
                      </span>
                    )}
                    {log?.affectedEntityType && (
                      <span className="flex items-center gap-1">
                        <Icon name="Target" size={12} />
                        {log?.affectedEntityType}
                      </span>
                    )}
                  </div>

                  {(log?.beforeState || log?.afterState) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
                      {log?.beforeState && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Before:</p>
                          <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                            {JSON.stringify(log?.beforeState, null, 2)}
                          </div>
                        </div>
                      )}
                      {log?.afterState && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">After:</p>
                          <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                            {JSON.stringify(log?.afterState, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {logs?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="FileSearch" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No activity logs found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;