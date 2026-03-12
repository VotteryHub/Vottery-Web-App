import React from 'react';
import Icon from '../../../components/AppIcon';

const IncidentTimelinePanel = ({ incidents }) => {
  const allTimelineEvents = [];

  incidents?.forEach(incident => {
    allTimelineEvents?.push({
      timestamp: incident?.detectedAt,
      event: 'Incident Detected',
      incidentTitle: incident?.title,
      incidentId: incident?.id,
      type: 'detection',
      severity: incident?.threatLevel
    });

    if (incident?.escalatedAt) {
      allTimelineEvents?.push({
        timestamp: incident?.escalatedAt,
        event: 'Incident Escalated',
        incidentTitle: incident?.title,
        incidentId: incident?.id,
        type: 'escalation',
        severity: incident?.threatLevel
      });
    }

    if (incident?.resolvedAt) {
      allTimelineEvents?.push({
        timestamp: incident?.resolvedAt,
        event: 'Incident Resolved',
        incidentTitle: incident?.title,
        incidentId: incident?.id,
        type: 'resolution',
        severity: incident?.threatLevel
      });
    }

    incident?.timelineEvents?.forEach(timelineEvent => {
      allTimelineEvents?.push({
        timestamp: timelineEvent?.timestamp,
        event: timelineEvent?.event,
        details: timelineEvent?.details,
        incidentTitle: incident?.title,
        incidentId: incident?.id,
        type: 'activity',
        severity: incident?.threatLevel
      });
    });
  });

  const sortedEvents = allTimelineEvents?.sort((a, b) => 
    new Date(b?.timestamp) - new Date(a?.timestamp)
  );

  const getEventIcon = (type) => {
    switch(type) {
      case 'detection': return 'AlertTriangle';
      case 'escalation': return 'ArrowUp';
      case 'resolution': return 'CheckCircle2';
      default: return 'Activity';
    }
  };

  const getEventColor = (type, severity) => {
    if (type === 'resolution') return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (type === 'escalation') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (type === 'detection') {
      if (severity === 'critical') return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      if (severity === 'high') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    }
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-4">Incident Timeline</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Comprehensive timeline of all incident events and response actions
        </p>

        {sortedEvents?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No timeline events</h3>
            <p className="text-sm text-muted-foreground">Timeline will appear as incidents are detected and processed</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {sortedEvents?.map((event, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${getEventColor(event?.type, event?.severity)}`}>
                    <Icon name={getEventIcon(event?.type)} size={20} />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{event?.event}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {new Date(event?.timestamp)?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event?.incidentTitle}</p>
                      {event?.details && (
                        <p className="text-sm text-foreground mt-2 p-2 bg-muted/30 rounded">
                          {event?.details}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          event?.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          event?.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          event?.severity === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {event?.severity?.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ID: {event?.incidentId?.substring(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimelinePanel;