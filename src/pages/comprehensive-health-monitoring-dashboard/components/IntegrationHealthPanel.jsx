import React from 'react';
import Icon from '../../../components/AppIcon';

const IntegrationHealthPanel = ({ integrations }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'outage': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLatencyStatus = (latency) => {
    if (latency < 200) return 'excellent';
    if (latency < 500) return 'good';
    if (latency < 1000) return 'fair';
    return 'poor';
  };

  const webhookDelivery = [
    { service: 'Stripe Webhooks', deliveryRate: 99.8, avgLatency: 234, failedDeliveries: 3 },
    { service: 'Supabase Realtime', deliveryRate: 99.9, avgLatency: 45, failedDeliveries: 1 },
    { service: 'External APIs', deliveryRate: 98.5, avgLatency: 456, failedDeliveries: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Integration Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations?.map((integration, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(integration?.status)}`}></div>
                <span className="font-semibold text-foreground">{integration?.name}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                integration?.status === 'operational' ? 'bg-green-500/10 text-green-500' :
                integration?.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {integration?.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Latency</span>
                  <span className={`text-xs font-semibold ${
                    getLatencyStatus(integration?.latency) === 'excellent' ? 'text-green-500' :
                    getLatencyStatus(integration?.latency) === 'good' ? 'text-blue-500' :
                    getLatencyStatus(integration?.latency) === 'fair' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {integration?.latency}ms
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      getLatencyStatus(integration?.latency) === 'excellent' ? 'bg-green-500' :
                      getLatencyStatus(integration?.latency) === 'good' ? 'bg-blue-500' :
                      getLatencyStatus(integration?.latency) === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((1000 - integration?.latency) / 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Uptime</span>
                  <span className="text-xs font-semibold text-green-500">{integration?.uptime}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${integration?.uptime}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Delivery Status */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Webhook" size={20} className="text-primary" />
          Webhook Delivery Status
        </h3>
        <div className="space-y-4">
          {webhookDelivery?.map((webhook, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{webhook?.service}</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                  {webhook?.deliveryRate}% success
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Delivery Rate</span>
                  <div className="text-sm font-semibold text-foreground">{webhook?.deliveryRate}%</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Avg Latency</span>
                  <div className="text-sm font-semibold text-foreground">{webhook?.avgLatency}ms</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Failed</span>
                  <div className="text-sm font-semibold text-foreground">{webhook?.failedDeliveries}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External API Performance */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">External API Performance</h3>
        <div className="space-y-3">
          {integrations?.map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(integration?.status)}`}></div>
                <span className="text-sm font-medium text-foreground">{integration?.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Response Time</div>
                  <div className="text-sm font-semibold text-foreground">{integration?.latency}ms</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Uptime</div>
                  <div className="text-sm font-semibold text-green-500">{integration?.uptime}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Failover Status */}
      <div className="card p-6 border-2 border-blue-500/30 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="RefreshCw" size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-foreground">Automated Failover Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <span className="font-medium text-foreground">Primary Systems</span>
            </div>
            <p className="text-sm text-muted-foreground">All primary systems operational</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Shield" size={18} className="text-blue-500" />
              <span className="font-medium text-foreground">Backup Systems</span>
            </div>
            <p className="text-sm text-muted-foreground">Ready for automatic failover</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHealthPanel;