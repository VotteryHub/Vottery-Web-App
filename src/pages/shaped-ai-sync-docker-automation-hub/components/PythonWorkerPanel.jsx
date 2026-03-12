import React from 'react';
import Icon from '../../../components/AppIcon';

const PythonWorkerPanel = ({ workerStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'idle':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Icon name="Code" className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Python Worker Management</h2>
            <p className="text-sm text-muted-foreground">Automated deployment and processing queues</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${workerStatus?.status === 'active' ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className={`text-xs ${getStatusColor(workerStatus?.status)} capitalize`}>
            {workerStatus?.status}
          </span>
        </div>
      </div>

      {/* Worker Info */}
      <div className="space-y-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Process ID</span>
              <span className="text-sm font-mono text-foreground">{workerStatus?.processId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Queue Size</span>
              <span className="text-sm font-semibold text-foreground">{workerStatus?.queueSize} events</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Processing Rate</span>
              <span className="text-sm font-semibold text-primary">{workerStatus?.processingRate} events/min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="text-sm font-semibold text-destructive">{workerStatus?.errorRate}%</span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Last Heartbeat</span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {workerStatus?.lastHeartbeat?.toLocaleTimeString()}
            </div>
            <div className="text-xs text-success mt-1">
              ✓ Healthy
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Queue Status</span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {workerStatus?.queueSize < 10 ? 'Normal' : 'High Load'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {workerStatus?.queueSize} pending
            </div>
          </div>
        </div>

        {/* Worker Logs Preview */}
        <div className="bg-background border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
            <Icon name="Terminal" className="w-3 h-3" />
            Recent Logs
          </h3>
          <div className="space-y-1 font-mono text-xs">
            <div className="text-success">[INFO] Vote event processed: vote-{Date.now()}</div>
            <div className="text-primary">[SYNC] Shaped API sync completed: 15 events</div>
            <div className="text-muted-foreground">[INFO] Weight multiplier applied: 2.0x</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonWorkerPanel;