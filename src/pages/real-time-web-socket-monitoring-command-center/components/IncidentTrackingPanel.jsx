import React from 'react';
import Icon from '../../../components/AppIcon';

const IncidentTrackingPanel = ({ incidents, latency, expanded = false }) => {
  const displayIncidents = expanded ? incidents : incidents?.slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected': return 'text-destructive';
      case 'in_progress': return 'text-warning';
      case 'escalated': return 'text-primary';
      case 'resolved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'detected': return 'bg-destructive/10';
      case 'in_progress': return 'bg-warning/10';
      case 'escalated': return 'bg-primary/10';
      case 'resolved': return 'bg-success/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Incident Tracking
          </h2>
          <p className="text-sm text-muted-foreground">
            Live incident status with instant updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Update Latency</p>
            <p className="text-lg font-semibold text-success">
              {Math.round(latency?.current || 0)}ms
            </p>
          </div>
          <Icon name="AlertCircle" size={24} className="text-warning" />
        </div>
      </div>

      <div className="space-y-3">
        {displayIncidents?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-2 opacity-50" />
            <p>No active incidents</p>
          </div>
        ) : (
          displayIncidents?.map((incident, index) => (
            <div
              key={incident?.id || index}
              className={`p-4 rounded-lg border border-border ${getStatusBg(incident?.status)} animate-fadeIn`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon
                    name="AlertCircle"
                    size={18}
                    className={getStatusColor(incident?.status)}
                  />
                  <span className={`text-xs font-semibold uppercase ${getStatusColor(incident?.status)}`}>
                    {incident?.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  {new Date(incident?.detectedAt)?.toLocaleTimeString()}
                </div>
              </div>

              <h3 className="font-medium text-foreground mb-1">
                {incident?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {incident?.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Icon name="Shield" size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Threat: {incident?.threatLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Zap" size={12} className="text-success" />
                    <span className="text-success">
                      Updated in {incident?.latency || 0}ms
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  incident?.incidentType === 'fraud_detection' ?'bg-destructive/20 text-destructive' :'bg-warning/20 text-warning'
                }`}>
                  {incident?.incidentType?.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {!expanded && incidents?.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            +{incidents?.length - 5} more incidents
          </p>
        </div>
      )}
    </div>
  );
};

export default IncidentTrackingPanel;