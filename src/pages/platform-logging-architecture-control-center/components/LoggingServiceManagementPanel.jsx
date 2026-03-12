import React, { useState } from 'react';
import { Server, CheckCircle, AlertCircle, Activity, Zap } from 'lucide-react';

const LoggingServiceManagementPanel = () => {
  const [services] = useState([
    {
      name: 'Client-Side Logger',
      type: 'client',
      status: 'active',
      health: 'healthy',
      logsPerMinute: 1250,
      errorRate: 0.8,
      avgLatency: 45
    },
    {
      name: 'Server-Side Logger',
      type: 'server',
      status: 'active',
      health: 'healthy',
      logsPerMinute: 3400,
      errorRate: 1.2,
      avgLatency: 12
    },
    {
      name: 'AI Service Logger',
      type: 'ai_service',
      status: 'active',
      health: 'healthy',
      logsPerMinute: 850,
      errorRate: 2.1,
      avgLatency: 230
    },
    {
      name: 'Third-Party Logger',
      type: 'third_party',
      status: 'active',
      health: 'healthy',
      logsPerMinute: 420,
      errorRate: 3.5,
      avgLatency: 180
    }
  ]);

  const getStatusColor = (health) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusIcon = (health) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <Server className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">Logging Service Management</h2>
      </div>

      <div className="space-y-4">
        {services?.map((service, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(service?.health)}
                <div>
                  <h3 className="font-semibold text-slate-900">{service?.name}</h3>
                  <p className="text-sm text-slate-600">Type: {service?.type}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service?.health)} bg-opacity-10`}>
                {service?.health?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-600">Logs/Min</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {service?.logsPerMinute?.toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-600">Error Rate</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {service?.errorRate}%
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-slate-500" />
                  <p className="text-xs text-slate-600">Avg Latency</p>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {service?.avgLatency}ms
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Monitoring */}
      <div className="mt-6 border-t border-slate-200 pt-6">
        <h3 className="font-semibold text-slate-900 mb-4">AI System Integrations</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-slate-900">Fraud Detection</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-slate-900">Security Alerts</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-slate-900">Payment Processing</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm font-medium text-slate-900">Content Moderation</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggingServiceManagementPanel;