import React from 'react';
import Icon from '../../../components/AppIcon';

const STATUS_CONFIG = {
  healthy: { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'CheckCircle', label: 'Healthy' },
  warning: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'AlertTriangle', label: 'Warning' },
  error: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'XCircle', label: 'Error' },
  syncing: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'RefreshCw', label: 'Syncing' },
};

const SyncStatusMatrix = ({ domains }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Sync Status Matrix</h3>
        <span className="text-xs text-muted-foreground">Auto-refreshes every 15s</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {domains?.map(domain => {
          const cfg = STATUS_CONFIG?.[domain?.status] || STATUS_CONFIG?.healthy;
          return (
            <div key={domain?.id} className={`border ${cfg?.border} ${cfg?.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name={domain?.icon} size={18} className={cfg?.color} />
                  <span className="font-medium text-foreground text-sm">{domain?.name}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${cfg?.color}`}>
                  <Icon name={cfg?.icon} size={12} className={domain?.status === 'syncing' ? 'animate-spin' : ''} />
                  {cfg?.label}
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="text-foreground font-medium">{domain?.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Changes</span>
                  <span className={`font-medium ${domain?.pendingChanges > 0 ? 'text-yellow-500' : 'text-foreground'}`}>{domain?.pendingChanges}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conflicts</span>
                  <span className={`font-medium ${domain?.conflicts > 0 ? 'text-red-500' : 'text-foreground'}`}>{domain?.conflicts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Records</span>
                  <span className="text-foreground font-medium">{domain?.recordCount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyncStatusMatrix;
