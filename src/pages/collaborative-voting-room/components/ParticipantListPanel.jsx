import React from 'react';


const ParticipantListPanel = ({ participants = [], currentUserId }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'moderator') {
      return (
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
          Moderator
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Participants</h2>
        <span className="text-sm text-muted-foreground">{participants?.length} online</span>
      </div>

      <div className="space-y-3">
        {participants?.map((participant) => (
          <div
            key={participant?.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              participant?.id === currentUserId ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {participant?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(
                  participant?.status
                )} rounded-full border-2 border-card`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-foreground truncate">{participant?.name}</p>
                {getRoleBadge(participant?.role)}
                {participant?.id === currentUserId && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Joined {new Date(participant?.joinedAt)?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantListPanel;