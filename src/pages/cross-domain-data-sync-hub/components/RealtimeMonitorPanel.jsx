import React from 'react';
import Icon from '../../../components/AppIcon';

const RealtimeMonitorPanel = ({ events }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Real-time Monitor</h3>
        <div className="flex items-center gap-1.5 text-xs text-green-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="Activity" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Waiting for sync events...</p>
          </div>
        ) : (
          events?.map((event, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                event?.type === 'INSERT' ? 'bg-green-500' :
                event?.type === 'UPDATE' ? 'bg-blue-500' :
                event?.type === 'DELETE' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">
                  <span className="font-medium">{event?.table}</span> — {event?.type}
                </p>
                <p className="text-xs text-muted-foreground truncate">{event?.details}</p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{event?.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RealtimeMonitorPanel;
