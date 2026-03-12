import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DockerStatusPanel = ({ dockerStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-success';
      case 'stopped':
        return 'text-destructive';
      case 'restarting':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'CheckCircle';
      case 'stopped':
        return 'XCircle';
      case 'restarting':
        return 'RefreshCw';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Box" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Docker Container Status</h2>
            <p className="text-sm text-muted-foreground">Automated deployment and orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dockerStatus?.status === 'running' ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
          <span className="text-xs text-muted-foreground capitalize">{dockerStatus?.status}</span>
        </div>
      </div>

      {/* Container Info */}
      <div className="space-y-4">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon
                name={getStatusIcon(dockerStatus?.status)}
                className={`w-5 h-5 ${getStatusColor(dockerStatus?.status)}`}
              />
              <span className="font-semibold text-foreground">Container Running</span>
            </div>
            <span className="text-sm text-muted-foreground">Uptime: {dockerStatus?.uptime}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Container ID:</span>
              <span className="text-foreground font-mono text-xs">{dockerStatus?.containerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Image:</span>
              <span className="text-foreground font-mono text-xs">{dockerStatus?.image}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Restart Count:</span>
              <span className="text-foreground">{dockerStatus?.restartCount}</span>
            </div>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Cpu" className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">CPU Usage</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">
              {dockerStatus?.cpuUsage}%
            </div>
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all"
                style={{ width: `${dockerStatus?.cpuUsage}%` }}
              />
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="HardDrive" className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Memory Usage</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-2">
              {dockerStatus?.memoryUsage}MB
            </div>
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-success transition-all"
                style={{ width: `${(dockerStatus?.memoryUsage / dockerStatus?.memoryLimit) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {dockerStatus?.memoryLimit}MB limit
            </div>
          </div>
        </div>

        {/* Container Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Icon name="RefreshCw" className="w-3 h-3 mr-1" />
            Restart
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Icon name="Terminal" className="w-3 h-3 mr-1" />
            Logs
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Icon name="Settings" className="w-3 h-3 mr-1" />
            Config
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DockerStatusPanel;