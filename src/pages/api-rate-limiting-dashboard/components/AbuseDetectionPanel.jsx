import React from 'react';
import Icon from '../../../components/AppIcon';

const AbuseDetectionPanel = ({ violations, metrics }) => {
  const highSeverityViolations = violations?.filter(v => v?.severity === 'high');
  const mediumSeverityViolations = violations?.filter(v => v?.severity === 'medium');
  const blockedViolations = violations?.filter(v => v?.blocked);

  const severityStats = [
    {
      label: 'High Severity',
      value: highSeverityViolations?.length,
      icon: 'AlertTriangle',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Medium Severity',
      value: mediumSeverityViolations?.length,
      icon: 'AlertCircle',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Blocked Requests',
      value: blockedViolations?.length,
      icon: 'Shield',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getViolationTypeIcon = (type) => {
    switch (type) {
      case 'quota_exceeded': return 'TrendingUp';
      case 'burst_detected': return 'Zap';
      case 'suspicious_pattern': return 'Eye';
      default: return 'AlertTriangle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Severity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {severityStats?.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat?.label}</span>
              <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
            </div>
            <div className={`text-3xl font-bold ${stat?.color}`}>{stat?.value}</div>
          </div>
        ))}
      </div>

      {/* Abuse Detection Status */}
      {metrics?.abuseDetected && (
        <div className="card p-6 border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Shield" size={24} className="text-red-500" />
            <h3 className="text-lg font-semibold text-foreground">Active Abuse Detected</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Multiple high-severity violations detected. Automated blocking is active.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-500">
              {highSeverityViolations?.length} High Severity Incidents
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-purple-500">
              {blockedViolations?.length} Requests Blocked
            </span>
          </div>
        </div>
      )}

      {/* Recent Violations */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-primary" />
          Recent Violations
        </h3>
        <div className="space-y-3">
          {violations?.slice(0, 20)?.map((violation, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              violation?.severity === 'high' ? 'border-red-500/30 bg-red-500/5' :
              violation?.severity === 'medium'? 'border-yellow-500/30 bg-yellow-500/5' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Icon name={getViolationTypeIcon(violation?.violationType)} size={18} className={`${
                    violation?.severity === 'high' ? 'text-red-500' :
                    violation?.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                  }`} />
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                    {violation?.method}
                  </span>
                  <span className="font-mono text-sm font-medium text-foreground">{violation?.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  {violation?.blocked && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-500 flex items-center gap-1">
                      <Icon name="Shield" size={12} />
                      Blocked
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                    violation?.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                    violation?.severity === 'medium'? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {violation?.severity}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-semibold text-foreground capitalize">{violation?.violationType?.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Requests:</span>
                  <span className="ml-2 font-semibold text-foreground">{violation?.requestCount} / {violation?.quotaLimit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time:</span>
                  <span className="ml-2 font-semibold text-foreground">{new Date(violation?.createdAt)?.toLocaleTimeString()}</span>
                </div>
              </div>
              {violation?.ipAddress && (
                <div className="mt-2 text-xs text-muted-foreground">
                  IP: <span className="font-mono">{violation?.ipAddress}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbuseDetectionPanel;