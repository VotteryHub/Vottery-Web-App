import React, { useState } from 'react';
import { Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const IntegrationHealthPanel = () => {
  const [integrations] = useState([
    {
      id: 1,
      name: 'Supabase Real-Time',
      status: 'healthy',
      uptime: 99.98,
      latency: 42,
      lastCheck: '30s ago',
      endpoints: 8
    },
    {
      id: 2,
      name: 'Stripe Webhooks',
      status: 'healthy',
      uptime: 99.95,
      latency: 156,
      lastCheck: '45s ago',
      endpoints: 5
    },
    {
      id: 3,
      name: 'Resend Email API',
      status: 'healthy',
      uptime: 99.92,
      latency: 234,
      lastCheck: '1m ago',
      endpoints: 3
    },
    {
      id: 4,
      name: 'Google Analytics',
      status: 'degraded',
      uptime: 98.5,
      latency: 890,
      lastCheck: '2m ago',
      endpoints: 4
    },
    {
      id: 5,
      name: 'Slack Notifications',
      status: 'healthy',
      uptime: 99.88,
      latency: 312,
      lastCheck: '1m ago',
      endpoints: 2
    },
    {
      id: 6,
      name: 'Datadog APM',
      status: 'healthy',
      uptime: 99.99,
      latency: 78,
      lastCheck: '30s ago',
      endpoints: 6
    }
  ]);

  const [healthStats] = useState({
    totalIntegrations: 6,
    healthyIntegrations: 5,
    degradedIntegrations: 1,
    failedIntegrations: 0,
    avgUptime: 99.7
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'degraded': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-50 rounded-lg">
            <Activity className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Integration Health Monitoring</h2>
            <p className="text-sm text-gray-600">Real-time health checks with automated alerts</p>
          </div>
        </div>
      </div>

      {/* Health Statistics */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-cyan-50 to-white rounded-lg border border-cyan-200">
          <div className="text-xl font-bold text-cyan-600">{healthStats?.totalIntegrations}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-xl font-bold text-green-600">{healthStats?.healthyIntegrations}</div>
          <div className="text-xs text-gray-600">Healthy</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200">
          <div className="text-xl font-bold text-orange-600">{healthStats?.degradedIntegrations}</div>
          <div className="text-xs text-gray-600">Degraded</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200">
          <div className="text-xl font-bold text-red-600">{healthStats?.failedIntegrations}</div>
          <div className="text-xs text-gray-600">Failed</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-xl font-bold text-blue-600">{healthStats?.avgUptime}%</div>
          <div className="text-xs text-gray-600">Avg Uptime</div>
        </div>
      </div>

      {/* Integration Status List */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Integration Status</h3>
        <div className="space-y-2">
          {integrations?.map((integration) => {
            const statusColor = getStatusColor(integration?.status);
            return (
              <div
                key={integration?.id}
                className={`p-3 rounded-lg border bg-${statusColor}-50 border-${statusColor}-200`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(integration?.status)}
                    <span className="font-medium text-gray-900">{integration?.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                    {integration?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-gray-600">Uptime</div>
                    <div className="font-semibold text-gray-900">{integration?.uptime}%</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Latency</div>
                    <div className="font-semibold text-gray-900">{integration?.latency}ms</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Endpoints</div>
                    <div className="font-semibold text-gray-900">{integration?.endpoints}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Last Check</div>
                    <div className="font-semibold text-gray-900">{integration?.lastCheck}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Health Check Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">System Health: Excellent</span>
            </div>
            <span className="text-xs text-gray-600">Last updated: 30s ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHealthPanel;