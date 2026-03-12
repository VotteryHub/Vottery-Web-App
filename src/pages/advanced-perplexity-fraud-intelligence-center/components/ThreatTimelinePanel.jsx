import React from 'react';
import Icon from '../../../components/AppIcon';

const ThreatTimelinePanel = ({ zones }) => {
  const timelineEvents = [
    {
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      type: 'critical',
      title: 'Coordinated Attack Detected',
      description: 'Multi-zone credential stuffing campaign targeting Zones 1, 2, and 3',
      zones: ['Zone 1', 'Zone 2', 'Zone 3'],
      impact: 'high',
      status: 'investigating'
    },
    {
      timestamp: new Date(Date.now() - 900000)?.toISOString(),
      type: 'high',
      title: 'Synthetic Identity Fraud Pattern',
      description: 'Emerging synthetic identity creation detected in Zone 4 and Zone 5',
      zones: ['Zone 4', 'Zone 5'],
      impact: 'medium',
      status: 'mitigated'
    },
    {
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      type: 'medium',
      title: 'Velocity Anomaly Spike',
      description: 'Unusual voting velocity detected across Zone 6, 7, and 8',
      zones: ['Zone 6', 'Zone 7', 'Zone 8'],
      impact: 'low',
      status: 'resolved'
    },
    {
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      type: 'high',
      title: 'Payment Card Testing Activity',
      description: 'Automated payment testing detected in Zone 1',
      zones: ['Zone 1'],
      impact: 'medium',
      status: 'resolved'
    },
    {
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      type: 'medium',
      title: 'Geographic Clustering Anomaly',
      description: 'Suspicious geographic patterns in Zone 3 voting activity',
      zones: ['Zone 3'],
      impact: 'low',
      status: 'resolved'
    }
  ];

  const getSeverityColor = (type) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors?.[type] || colors?.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      investigating: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      mitigated: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      resolved: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    };
    return colors?.[status] || colors?.investigating;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date?.toLocaleDateString() + ' ' + date?.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">Threat Timeline</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Chronological view of threat detection and investigation activities across all zones
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
              <span className="text-sm font-semibold text-red-900 dark:text-red-100">Critical</span>
            </div>
            <div className="text-2xl font-heading font-bold text-red-600 font-data">
              {timelineEvents?.filter(e => e?.type === 'critical')?.length}
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertCircle" size={20} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">High</span>
            </div>
            <div className="text-2xl font-heading font-bold text-orange-600 font-data">
              {timelineEvents?.filter(e => e?.type === 'high')?.length}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={20} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">Medium</span>
            </div>
            <div className="text-2xl font-heading font-bold text-yellow-600 font-data">
              {timelineEvents?.filter(e => e?.type === 'medium')?.length}
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-100">Resolved</span>
            </div>
            <div className="text-2xl font-heading font-bold text-green-600 font-data">
              {timelineEvents?.filter(e => e?.status === 'resolved')?.length}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Threat Activity</h3>
        <div className="space-y-4">
          {timelineEvents?.map((event, index) => (
            <div key={index} className="relative">
              {index < timelineEvents?.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-muted" />
              )}
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full ${getSeverityColor(event?.type)} flex items-center justify-center flex-shrink-0 relative z-10`}>
                  <Icon name="AlertTriangle" size={20} className="text-white" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-foreground">{event?.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(event?.status)}`}>
                            {event?.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event?.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {event?.zones?.map((zone, zIndex) => (
                          <span key={zIndex} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                            {zone}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="Clock" size={14} />
                        <span>{formatTimestamp(event?.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Investigation Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Icon name="Search" size={18} className="text-blue-600" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Automated threat hunting initiated</span>
              <p className="text-xs text-muted-foreground">Scanning for APTs and coordinated attacks</p>
            </div>
            <span className="text-xs text-muted-foreground">5 min ago</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Icon name="Shield" size={18} className="text-yellow-600" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Mitigation protocols deployed</span>
              <p className="text-xs text-muted-foreground">Enhanced monitoring activated for Zones 1-3</p>
            </div>
            <span className="text-xs text-muted-foreground">15 min ago</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Icon name="CheckCircle" size={18} className="text-green-600" />
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">Threat successfully contained</span>
              <p className="text-xs text-muted-foreground">Zone 6-8 velocity anomaly resolved</p>
            </div>
            <span className="text-xs text-muted-foreground">30 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatTimelinePanel;