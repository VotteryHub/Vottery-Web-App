import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { alertService } from '../../../services/alertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const CriticalAlertsPanel = ({ alerts, onRefresh }) => {
  const [processing, setProcessing] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const handleAcknowledge = async (alertId) => {
    try {
      setProcessing(alertId);
      const { error } = await alertService?.acknowledgeAlert(alertId);
      if (error) throw new Error(error.message);
      
      // Track mobile alert acknowledgment
      const alert = alerts?.find(a => a?.id === alertId);
      if (alert) {
        analytics?.trackEvent('mobile_alert_acknowledged', {
          alert_id: alertId,
          alert_severity: alert?.severity,
          device_type: 'mobile'
        });
      }
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      setProcessing(alertId);
      const { error } = await alertService?.resolveAlert(alertId, 'Resolved via mobile dashboard');
      if (error) throw new Error(error.message);
      
      // Track mobile alert resolution
      const alert = alerts?.find(a => a?.id === alertId);
      if (alert) {
        analytics?.trackEvent('mobile_alert_resolved', {
          alert_id: alertId,
          alert_severity: alert?.severity,
          device_type: 'mobile'
        });
      }
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-red-600" />
          <h3 className="text-base font-heading font-semibold text-foreground">
            Critical Alerts
          </h3>
          {alerts?.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {alerts?.length}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {alerts?.length > 0 ? (
          alerts?.map((alert) => (
            <div key={alert?.id} className="border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === alert?.id ? null : alert?.id)}
                className="w-full p-4 text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {alert?.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {alert?.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                        {alert?.category?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert?.createdAt)?.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Icon 
                    name={expanded === alert?.id ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                    className="text-muted-foreground flex-shrink-0" 
                  />
                </div>
              </button>

              {expanded === alert?.id && (
                <div className="p-4 bg-card border-t border-red-200 dark:border-red-800">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Details</p>
                      <p className="text-sm text-foreground">{alert?.description}</p>
                    </div>
                    {alert?.metadata && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Additional Info</p>
                        <pre className="text-xs text-foreground bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(alert?.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Check"
                        onClick={() => handleAcknowledge(alert?.id)}
                        disabled={processing === alert?.id}
                        className="flex-1"
                      >
                        Acknowledge
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        iconName="CheckCircle"
                        onClick={() => handleResolve(alert?.id)}
                        disabled={processing === alert?.id}
                        className="flex-1"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">No Critical Alerts</p>
            <p className="text-xs text-muted-foreground">System is operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalAlertsPanel;