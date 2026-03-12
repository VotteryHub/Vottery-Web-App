import React from 'react';
import Icon from '../../../components/AppIcon';

const ParticipantDashboardPanel = ({ participants, connectionHealth, onRefresh }) => {
  const onlineCount = participants?.filter(p => p?.status === 'online')?.length || 0;
  const awayCount = participants?.filter(p => p?.status === 'away')?.length || 0;
  const offlineCount = participants?.filter(p => p?.status === 'offline')?.length || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'moderator': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'participant': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'viewer': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon name="Users" size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Icon name="Clock" size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{awayCount}</p>
              <p className="text-xs text-muted-foreground">Away</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Icon name="UserX" size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{offlineCount}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Activity" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{connectionHealth?.latency}ms</p>
              <p className="text-xs text-muted-foreground">Latency</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Live Participants</h2>
              <p className="text-sm text-muted-foreground">
                {participants?.length} total members
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {participants?.map((participant) => (
            <div key={participant?.id} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(participant?.status)}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{participant?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(participant?.role)}`}>
                        {participant?.role}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {participant?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {participant?.reactions?.map((emoji, idx) => (
                    <span key={idx} className="text-lg">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Engagement Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Participation</span>
              <span className="text-sm font-bold text-primary">85%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Discussion Engagement</span>
              <span className="text-sm font-bold text-secondary">72%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-secondary rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Voting Participation</span>
              <span className="text-sm font-bold text-success">92%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-success rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboardPanel;