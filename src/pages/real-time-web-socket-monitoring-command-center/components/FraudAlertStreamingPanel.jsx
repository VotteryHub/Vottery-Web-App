import React from 'react';
import Icon from '../../../components/AppIcon';

const FraudAlertStreamingPanel = ({ alerts, latency, expanded = false }) => {
  const displayAlerts = expanded ? alerts : alerts?.slice(0, 5);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10';
      case 'high': return 'bg-warning/10';
      case 'medium': return 'bg-primary/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Fraud Alert Streaming
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time fraud detection with instant delivery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Delivery Latency</p>
            <p className="text-lg font-semibold text-success">
              {Math.round(latency?.current || 0)}ms
            </p>
          </div>
          <Icon name="AlertTriangle" size={24} className="text-destructive" />
        </div>
      </div>

      <div className="space-y-3">
        {displayAlerts?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No active fraud alerts</p>
          </div>
        ) : (
          displayAlerts?.map((alert, index) => (
            <div
              key={alert?.id || index}
              className={`p-4 rounded-lg border border-border ${getSeverityBg(alert?.severity)} animate-fadeIn`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    name="AlertTriangle"
                    size={18}
                    className={getSeverityColor(alert?.severity)}
                  />
                  <span className={`text-xs font-semibold uppercase ${getSeverityColor(alert?.severity)}`}>
                    {alert?.severity}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  {new Date(alert?.createdAt)?.toLocaleTimeString()}
                </div>
              </div>

              <h3 className="font-medium text-foreground mb-1">
                {alert?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {alert?.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Icon name="Target" size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Confidence: {alert?.confidenceScore || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Zap" size={12} className="text-success" />
                    <span className="text-success">
                      Delivered in {alert?.latency || 0}ms
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  alert?.status === 'active' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  {alert?.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {!expanded && alerts?.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            +{alerts?.length - 5} more alerts
          </p>
        </div>
      )}
    </div>
  );
};

export default FraudAlertStreamingPanel;