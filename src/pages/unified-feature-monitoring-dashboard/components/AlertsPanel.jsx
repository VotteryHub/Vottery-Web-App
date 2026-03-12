import React from 'react';
import { AlertTriangle, Bell, XCircle, CheckCircle } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      severity: 'warning',
      feature: 'Live Streaming',
      message: 'CPU usage above 75% threshold',
      time: '5 min ago',
      action: 'Scale resources'
    },
    {
      id: 2,
      severity: 'info',
      feature: 'Prediction Pools',
      message: 'Adoption rate increased 25%',
      time: '12 min ago',
      action: 'Monitor'
    },
    {
      id: 3,
      severity: 'warning',
      feature: 'Behavioral Heatmaps',
      message: 'Response time degradation detected',
      time: '18 min ago',
      action: 'Optimize queries'
    }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200'
        };
      case 'info':
        return {
          icon: Bell,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Active Alerts</h2>
          <p className="text-sm text-gray-600">Real-time monitoring</p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {alerts?.map((alert) => {
          const config = getSeverityConfig(alert?.severity);
          const Icon = config?.icon;

          return (
            <div
              key={alert?.id}
              className={`p-4 rounded-lg border ${config?.bg} ${config?.border}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${config?.color} mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {alert?.feature}
                    </span>
                    <span className="text-xs text-gray-500">{alert?.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert?.message}</p>
                  <button
                    className={`text-xs font-medium ${config?.color} hover:underline`}
                  >
                    {alert?.action} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Automated Rollback Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Automated Rollback Triggers
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Error rate &gt; 5%</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Response time &gt; 2s</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Crash rate &gt; 1%</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
      {/* A/B Testing Integration */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-900">
            A/B Testing Integration
          </span>
        </div>
        <p className="text-xs text-purple-700">
          2 active experiments running with automated winner promotion
        </p>
      </div>
    </div>
  );
};

export default AlertsPanel;