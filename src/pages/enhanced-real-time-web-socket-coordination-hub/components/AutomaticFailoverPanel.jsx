import React, { useState } from 'react';
import { RefreshCw, Server, CheckCircle, AlertCircle } from 'lucide-react';

const AutomaticFailoverPanel = () => {
  const [connections] = useState([
    { id: 1, name: 'Primary WebSocket', status: 'active', uptime: 99.99, latency: 42, region: 'US-East' },
    { id: 2, name: 'Secondary WebSocket', status: 'standby', uptime: 99.95, latency: 48, region: 'US-West' },
    { id: 3, name: 'Tertiary WebSocket', status: 'standby', uptime: 99.92, latency: 55, region: 'EU-Central' }
  ]);

  const [failoverEvents] = useState([
    {
      id: 1,
      timestamp: '2024-01-28 10:15:23',
      from: 'Primary WebSocket',
      to: 'Secondary WebSocket',
      reason: 'High latency detected',
      duration: '1.2s',
      status: 'completed'
    },
    {
      id: 2,
      timestamp: '2024-01-28 08:42:11',
      from: 'Secondary WebSocket',
      to: 'Primary WebSocket',
      reason: 'Automatic recovery',
      duration: '0.8s',
      status: 'completed'
    },
    {
      id: 3,
      timestamp: '2024-01-28 06:30:45',
      from: 'Primary WebSocket',
      to: 'Tertiary WebSocket',
      reason: 'Connection timeout',
      duration: '2.1s',
      status: 'completed'
    }
  ]);

  const [failoverConfig] = useState({
    autoFailover: true,
    healthCheckInterval: '5s',
    failoverThreshold: '3 failures',
    recoveryDelay: '30s',
    zeroDowntime: true
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <RefreshCw className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Automatic Failover Management</h2>
            <p className="text-sm text-gray-600">Redundant monitoring with instant failover & zero-downtime recovery</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="space-y-3 mb-6">
        {connections?.map((conn) => (
          <div
            key={conn?.id}
            className={`p-4 rounded-lg border ${
              conn?.status === 'active' ?'bg-green-50 border-green-200' :'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Server className={`w-5 h-5 ${
                  conn?.status === 'active' ? 'text-green-600' : 'text-gray-400'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{conn?.name}</span>
                    {conn?.status === 'active' && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{conn?.region}</div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                conn?.status === 'active' ?'bg-green-100 text-green-700' :'bg-gray-100 text-gray-700'
              }`}>
                {conn?.status?.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <div className="text-xs text-gray-600">Uptime</div>
                <div className="text-sm font-semibold text-gray-900">{conn?.uptime}%</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Latency</div>
                <div className="text-sm font-semibold text-gray-900">{conn?.latency}ms</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Status</div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    conn?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm font-semibold text-gray-900">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Failover Configuration */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          Failover Configuration
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Auto Failover:</span>
            <span className="font-medium text-green-600">{failoverConfig?.autoFailover ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Health Check:</span>
            <span className="font-medium text-gray-900">{failoverConfig?.healthCheckInterval}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Threshold:</span>
            <span className="font-medium text-gray-900">{failoverConfig?.failoverThreshold}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Recovery Delay:</span>
            <span className="font-medium text-gray-900">{failoverConfig?.recoveryDelay}</span>
          </div>
        </div>
      </div>

      {/* Recent Failover Events */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-teal-600" />
          Recent Failover Events
        </h3>
        <div className="space-y-2">
          {failoverEvents?.map((event) => (
            <div
              key={event?.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">{event?.timestamp}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {event?.status?.toUpperCase()}
                </span>
              </div>
              <div className="text-gray-900 mb-1">
                <span className="font-medium">{event?.from}</span>
                <span className="mx-2">→</span>
                <span className="font-medium">{event?.to}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Reason: {event?.reason}</span>
                <span>Duration: {event?.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomaticFailoverPanel;