import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamPresencePanel = ({ presence, onRefresh }) => {
  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-400'
    };
    return colors?.[status] || colors?.offline;
  };

  const getStatusLabel = (status) => {
    const labels = {
      online: 'Online',
      away: 'Away',
      offline: 'Offline'
    };
    return labels?.[status] || 'Unknown';
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date?.toLocaleDateString();
  };

  const onlineMembers = presence?.filter(p => p?.status === 'online') || [];
  const awayMembers = presence?.filter(p => p?.status === 'away') || [];
  const offlineMembers = presence?.filter(p => p?.status === 'offline') || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Online</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground font-data">{onlineMembers?.length}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">Away</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground font-data">{awayMembers?.length}</div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm font-medium text-muted-foreground">Offline</span>
          </div>
          <div className="text-3xl font-heading font-bold text-foreground font-data">{offlineMembers?.length}</div>
        </div>
      </div>

      {onlineMembers?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Online Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineMembers?.map((member) => (
              <div key={member?.userId} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                      {member?.name?.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(member?.status)} rounded-full border-2 border-background`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{member?.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Icon name="Circle" size={8} className="text-green-500" />
                      <span>{getStatusLabel(member?.status)}</span>
                    </div>
                    {member?.currentPage && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="Eye" size={12} />
                        <span>Viewing: {member?.currentPage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {awayMembers?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Away</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awayMembers?.map((member) => (
              <div key={member?.userId} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-muted text-foreground flex items-center justify-center text-lg font-bold">
                      {member?.name?.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(member?.status)} rounded-full border-2 border-background`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground mb-1">{member?.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} />
                      <span>Last active: {formatLastActive(member?.lastActive)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {offlineMembers?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Offline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offlineMembers?.map((member) => (
              <div key={member?.userId} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center text-sm font-bold">
                      {member?.name?.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(member?.status)} rounded-full border-2 border-background`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{member?.name}</h4>
                    <p className="text-xs text-muted-foreground">{formatLastActive(member?.lastActive)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Activity Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Edit" size={20} className="text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Simultaneous Editing</h4>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
              2 team members are currently editing campaign parameters
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                S
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                M
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="MessageSquare" size={20} className="text-purple-600" />
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Active Discussions</h4>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
              3 strategy threads with recent activity
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Icon name="Users" size={14} />
              <span>4 participants engaged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPresencePanel;