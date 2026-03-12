import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedAlertingSystem = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  if (!alerts || alerts?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="CheckCircle" size={48} className="mx-auto mb-3 opacity-30 text-green-500" />
        <p>No active alerts</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'investigating': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'resolved': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const alertChannels = [
    { id: 'email', name: 'Email', icon: 'Mail', enabled: true },
    { id: 'sms', name: 'SMS', icon: 'MessageSquare', enabled: true },
    { id: 'slack', name: 'Slack', icon: 'MessageCircle', enabled: true },
    { id: 'webhook', name: 'Webhook', icon: 'Webhook', enabled: false }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="text-red-600 dark:text-red-400" />
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">
              {alerts?.filter(a => a?.status === 'active')?.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Active Alerts</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Search" size={24} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {alerts?.filter(a => a?.status === 'investigating')?.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Investigating</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-orange-600 dark:text-orange-400" />
            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {alerts?.filter(a => a?.severity === 'high' || a?.severity === 'critical')?.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">High Priority</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={24} className="text-gray-600 dark:text-gray-400" />
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">2.3m</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Avg Response Time</h3>
        </div>
      </div>

      {/* Alert Channels Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          Alert Channels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {alertChannels?.map((channel) => (
            <div key={channel?.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name={channel?.icon} size={20} className="text-gray-700 dark:text-gray-300" />
                <div className={`w-2 h-2 rounded-full ${
                  channel?.enabled ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{channel?.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {channel?.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="List" size={20} className="text-primary" />
            Active Alerts
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alerts?.map((alert) => (
            <div key={alert?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${getSeverityColor(alert?.severity)}`}>
                    {alert?.severity}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(alert?.status)}`}>
                    {alert?.status}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert?.service}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(alert?.timestamp)?.toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{alert?.message}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedAlert(alert)}>
                  <Icon name="Eye" size={14} className="mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Icon name="CheckCircle" size={14} className="mr-1" />
                  Acknowledge
                </Button>
                <Button size="sm" variant="outline">
                  <Icon name="XCircle" size={14} className="mr-1" />
                  Resolve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Protocols */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} className="text-primary" />
          Escalation Protocols
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Critical Alert Escalation</h4>
              <span className="text-xs text-gray-600 dark:text-gray-400">Tier 1 → Tier 2 → Tier 3</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Clock" size={14} />
                <span>Tier 1: Immediate notification (0-5 min)</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Clock" size={14} />
                <span>Tier 2: Escalate if unresolved (5-15 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} />
                <span>Tier 3: Executive notification (15+ min)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">High Priority Escalation</h4>
              <span className="text-xs text-gray-600 dark:text-gray-400">Tier 1 → Tier 2</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Clock" size={14} />
                <span>Tier 1: Team notification (0-10 min)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} />
                <span>Tier 2: Manager escalation (10-30 min)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedAlertingSystem;