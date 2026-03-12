import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WebSocketConnectionPanel = ({ connections, latencyMetrics, onTestConnection }) => {
  const connectionList = Object.entries(connections || {});

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            WebSocket Connection Status
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time connection monitoring with automatic reconnection
          </p>
        </div>
        <Icon name="Wifi" size={24} className="text-primary" />
      </div>

      <div className="space-y-4">
        {connectionList?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="WifiOff" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No active connections</p>
          </div>
        ) : (
          connectionList?.map(([name, data]) => (
            <div key={name} className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    data?.status === 'connected' ? 'bg-success animate-pulse' : 'bg-destructive'
                  }`} />
                  <div>
                    <h3 className="font-medium text-foreground capitalize">
                      {name?.replace('-', ' ')}
                    </h3>
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
                  Test
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Latency</p>
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

              {data?.reconnectAttempts > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-warning">
                  <Icon name="RefreshCw" size={12} />
                  <span>Reconnect attempts: {data?.reconnectAttempts}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/10">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Connection Features</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Automatic reconnection with exponential backoff</li>
              <li>• Heartbeat monitoring every 30 seconds</li>
              <li>• Sub-100ms latency for critical alerts</li>
              <li>• Connection multiplexing for efficiency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketConnectionPanel;