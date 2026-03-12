import React from 'react';
import Icon from '../../../components/AppIcon';

const OfflineQueuePanel = ({ queue }) => {
  const isOnline = navigator?.onLine !== false;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Offline Queue</h3>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
          isOnline ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {!queue || queue?.length === 0 ? (
        <div className="text-center py-6">
          <Icon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Queue is empty — all operations synced</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{queue?.length}</p>
              <p className="text-xs text-muted-foreground">Queued Ops</p>
            </div>
            <div className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-500">{queue?.filter(q => q?.status === 'retrying')?.length}</p>
              <p className="text-xs text-muted-foreground">Retrying</p>
            </div>
            <div className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-500">{queue?.filter(q => q?.status === 'failed')?.length}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {queue?.map((op, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name={op?.type === 'INSERT' ? 'Plus' : op?.type === 'UPDATE' ? 'Edit2' : 'Trash2'} size={12} className="text-muted-foreground" />
                  <span className="text-foreground font-medium">{op?.table}</span>
                  <span className="text-muted-foreground">{op?.type}</span>
                </div>
                <span className={`font-medium ${
                  op?.status === 'pending' ? 'text-yellow-500' :
                  op?.status === 'retrying' ? 'text-blue-500' : 'text-red-500'
                }`}>{op?.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineQueuePanel;
