import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const RealTimeProcessingPanel = ({ alerts, processingRate, onRefresh }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const recentAlerts = alerts
    ?.filter(a => {
      const createdAt = new Date(a?.createdAt);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return createdAt > fiveMinutesAgo;
    })
    ?.filter(a => filterSeverity === 'all' || a?.severity === filterSeverity)
    ?.filter(a => !searchQuery || a?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertOctagon';
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEscalationWorkflow = (alert) => {
    if (alert?.severity === 'critical') {
      return ['SMS', 'Email', 'In-App', 'Webhook'];
    } else if (alert?.severity === 'high') {
      return ['Email', 'In-App', 'SMS'];
    } else {
      return ['In-App', 'Email'];
    }
  };

  return (
    <div className="space-y-6">
      {/* Processing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Icon name="Activity" size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing Rate</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">{processingRate}/5min</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery Success</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">98.9%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-heading font-bold text-foreground font-data">1.8s</p>
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              icon="Search"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              options={severityOptions}
            />
          </div>
        </div>
      </div>
      {/* Live Alert Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Live Alert Feed (Last 5 Minutes)</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {recentAlerts?.length > 0 ? (
            recentAlerts?.map((alert) => (
              <div key={alert?.id} className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(alert?.severity)}`}>
                    <Icon name={getSeverityIcon(alert?.severity)} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{alert?.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert?.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(alert?.createdAt)?.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(alert?.severity)}`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground capitalize">
                        {alert?.category?.replace(/_/g, ' ')}
                      </span>
                      {alert?.confidenceScore && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                          Confidence: {alert?.confidenceScore}%
                        </span>
                      )}
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground mb-2">Escalation Workflow:</p>
                      <div className="flex items-center gap-2">
                        {getEscalationWorkflow(alert)?.map((channel, index) => (
                          <React.Fragment key={channel}>
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                                <Icon 
                                  name={
                                    channel === 'SMS' ? 'MessageSquare' :
                                    channel === 'Email' ? 'Mail' :
                                    channel === 'In-App'? 'Bell' : 'Webhook'
                                  } 
                                  size={12} 
                                  className="text-primary" 
                                />
                              </div>
                              <span className="text-xs font-medium text-foreground">{channel}</span>
                            </div>
                            {index < getEscalationWorkflow(alert)?.length - 1 && (
                              <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {alert?.metadata?.deliveryStatus && (
                      <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="flex items-center gap-2">
                          <Icon name="CheckCircle" size={14} className="text-green-600" />
                          <span className="text-xs text-green-700 dark:text-green-400">
                            Delivered via {alert?.metadata?.deliveryChannel} at {new Date(alert?.metadata?.deliveredAt)?.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="CheckCircle2" size={48} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No alerts in the last 5 minutes</p>
            </div>
          )}
        </div>
      </div>
      {/* Escalation Rules */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Escalation Rules</h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertOctagon" size={20} className="text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Critical Alerts</h4>
                <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                  Immediate SMS + Email + In-App + Webhook notification to all admins
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">
                  Escalation: If not acknowledged within 5 minutes, send to secondary contact list
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-orange-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-1">High Priority Alerts</h4>
                <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">
                  Email + In-App notification, SMS if not acknowledged within 10 minutes
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500">
                  Escalation: Secondary notification after 15 minutes
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Standard Alerts</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  In-App notification only, email digest sent daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeProcessingPanel;