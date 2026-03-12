import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { alertService } from '../../../services/alertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const LiveAlertsPanel = ({ alerts, onRefresh }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    category: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'info', label: 'Info' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fraud_detection', label: 'Fraud Detection' },
    { value: 'policy_violation', label: 'Policy Violation' },
    { value: 'performance_anomaly', label: 'Performance Anomaly' },
    { value: 'security_event', label: 'Security Event' },
    { value: 'system_health', label: 'System Health' }
  ];

  const filteredAlerts = alerts?.filter(alert => {
    const matchesStatus = filters?.status === 'all' || alert?.status === filters?.status;
    const matchesSeverity = filters?.severity === 'all' || alert?.severity === filters?.severity;
    const matchesCategory = filters?.category === 'all' || alert?.category === filters?.category;
    const matchesSearch = !searchQuery || 
      alert?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      alert?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesStatus && matchesSeverity && matchesCategory && matchesSearch;
  });

  const handleAcknowledge = async (alertId) => {
    try {
      setProcessing(alertId);
      const { error } = await alertService?.acknowledgeAlert(alertId);
      if (error) throw new Error(error.message);
      
      // Track alert acknowledgment
      const alert = alerts?.find(a => a?.id === alertId);
      if (alert) {
        analytics?.trackAlertAcknowledged(alertId, alert?.severity);
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
      const { error } = await alertService?.resolveAlert(alertId, 'Resolved by administrator');
      if (error) throw new Error(error.message);
      
      // Track alert resolution
      const alert = alerts?.find(a => a?.id === alertId);
      if (alert) {
        analytics?.trackEvent('alert_resolved', {
          alert_id: alertId,
          alert_severity: alert?.severity,
          alert_category: alert?.category
        });
      }
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      setProcessing(alertId);
      const { error } = await alertService?.dismissAlert(alertId);
      if (error) throw new Error(error.message);
      
      // Track alert dismissal
      analytics?.trackEvent('alert_dismissed', {
        alert_id: alertId
      });
      
      await onRefresh();
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    } finally {
      setProcessing(null);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200',
      high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200',
      medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200',
      info: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200'
    };
    return colors?.[severity] || colors?.info;
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="search"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="md:col-span-1"
          />
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          />
          <Select
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => setFilters(prev => ({ ...prev, severity: value }))}
          />
          <Select
            options={categoryOptions}
            value={filters?.category}
            onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts?.map((alert) => (
          <div key={alert?.id} className={`card border-l-4 ${
            alert?.severity === 'critical' ? 'border-l-red-500' :
            alert?.severity === 'high' ? 'border-l-orange-500' :
            alert?.severity === 'medium'? 'border-l-yellow-500' : 'border-l-blue-500'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(alert?.severity)}`}>
                    {alert?.severity?.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert?.status === 'active' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    alert?.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    alert?.status === 'resolved'? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {alert?.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert?.createdAt)?.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{alert?.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{alert?.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Tag" size={12} />
                    {alert?.category?.replace(/_/g, ' ')}
                  </span>
                  {alert?.detectionMethod && (
                    <span className="flex items-center gap-1">
                      <Icon name="Cpu" size={12} />
                      {alert?.detectionMethod}
                    </span>
                  )}
                  {alert?.confidenceScore && (
                    <span className="flex items-center gap-1">
                      <Icon name="Target" size={12} />
                      {alert?.confidenceScore}% confidence
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {alert?.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Check"
                    onClick={() => handleAcknowledge(alert?.id)}
                    disabled={processing === alert?.id}
                  >
                    Acknowledge
                  </Button>
                )}
                {(alert?.status === 'active' || alert?.status === 'acknowledged') && (
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="CheckCircle2"
                    onClick={() => handleResolve(alert?.id)}
                    disabled={processing === alert?.id}
                  >
                    Resolve
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  onClick={() => handleDismiss(alert?.id)}
                  disabled={processing === alert?.id}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="CheckCircle2" size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No alerts found</h3>
          <p className="text-sm text-muted-foreground">All systems operating normally</p>
        </div>
      )}
    </div>
  );
};

export default LiveAlertsPanel;