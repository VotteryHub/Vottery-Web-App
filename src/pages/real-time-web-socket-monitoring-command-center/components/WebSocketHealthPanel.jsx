import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebSocketHealthPanel = ({ connections, latencyMetrics, onTestConnection }) => {
  const connectionList = Object.entries(connections || {});

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            WebSocket Health Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Connection monitoring, reconnection protocols, and failover mechanisms
          </p>
        </div>
        <Icon name="Activity" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Healthy Connections</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {connectionList?.filter(([_, data]) => data?.status === 'connected')?.length}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-warning/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="RefreshCw" size={18} className="text-warning" />
            <span className="text-sm text-muted-foreground">Reconnection Attempts</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {connectionList?.reduce((sum, [_, data]) => sum + (data?.reconnectAttempts || 0), 0)}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Avg Latency</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {Math.round(
              connectionList?.reduce((sum, [_, data]) => sum + (data?.latency?.average || 0), 0) /
              (connectionList?.length || 1)
            )}ms
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Connection Details
        </h3>
        {connectionList?.map(([name, data]) => (
          <div key={name} className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  data?.status === 'connected' ? 'bg-success animate-pulse' : 'bg-destructive'
                }`} />
                <div>
                  <h4 className="font-medium text-foreground capitalize">
                    {name?.replace('-', ' ')}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Status: {data?.status}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTestConnection?.(name)}
              >
                <Icon name="Activity" size={14} className="mr-1" />
                Test Connection
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(data?.latency?.current || 0)}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Average</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(data?.latency?.average || 0)}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Min</p>
                <p className="text-lg font-semibold text-success">
                  {Math.round(data?.latency?.min || 0)}ms
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max</p>
                <p className="text-lg font-semibold text-warning">
                  {Math.round(data?.latency?.max || 0)}ms
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="RefreshCw" size={12} />
                <span>Reconnects: {data?.reconnectAttempts || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                <span>Heartbeat: 30s</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Shield" size={12} />
                <span>Auto-failover enabled</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-start gap-3">
            <Icon name="Zap" size={18} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Connection Multiplexing</h4>
              <p className="text-sm text-muted-foreground">
                Efficient resource usage through shared connections and message queuing
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-start gap-3">
            <Icon name="Shield" size={18} className="text-success mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Automatic Reconnection</h4>
              <p className="text-sm text-muted-foreground">
                Exponential backoff strategy with max 5 attempts and message queuing during offline periods
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketHealthPanel;