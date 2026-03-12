import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationHealthPanel = ({ healthStatus, onRefresh }) => {
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'degraded':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'down':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'maintenance':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle2';
      case 'degraded':
        return 'AlertTriangle';
      case 'down':
        return 'XCircle';
      case 'maintenance':
        return 'Wrench';
      default:
        return 'HelpCircle';
    }
  };

  const getIntegrationIcon = (type) => {
    switch (type) {
      case 'perplexity':
        return 'Brain';
      case 'resend':
        return 'Mail';
      case 'twilio':
        return 'MessageSquare';
      case 'supabase_realtime':
        return 'Radio';
      case 'stripe':
        return 'CreditCard';
      default:
        return 'Server';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Activity" className="w-6 h-6 text-green-500" />
            Integration Health Monitoring
          </h2>
          <Button onClick={onRefresh} className="flex items-center gap-2">
            <Icon name="RefreshCw" className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthStatus?.map((integration) => (
            <div key={integration?.id} className={`p-6 rounded-lg border-2 ${getHealthStatusColor(integration?.healthStatus)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Icon name={getIntegrationIcon(integration?.integrationType)} className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {integration?.integrationName}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {integration?.integrationType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name={getHealthIcon(integration?.healthStatus)} className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">
                    {integration?.healthStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Success Rate (24h)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {integration?.successRate24h?.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      integration?.successRate24h >= 99 ? 'bg-green-500' :
                      integration?.successRate24h >= 95 ? 'bg-yellow-500': 'bg-red-500'
                    }`}
                    style={{ width: `${integration?.successRate24h}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Avg Response</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {integration?.averageResponseTimeMs || 0}ms
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Total Calls</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                      {integration?.totalCalls24h?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Failed Calls</span>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-1">
                      {integration?.failedCalls24h || 0}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Last Check</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(integration?.lastHealthCheck)?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {integration?.lastSuccessfulCall && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="CheckCircle2" className="w-3 h-3 text-green-500" />
                    <span>Last success: {new Date(integration?.lastSuccessfulCall)?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {integration?.lastFailedCall && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="XCircle" className="w-3 h-3 text-red-500" />
                    <span>Last failure: {new Date(integration?.lastFailedCall)?.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
          Alert Thresholds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="TrendingDown" className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Error Rate</h4>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">10%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Critical threshold</p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Response Time</h4>
            </div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">5000ms</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Warning threshold</p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Activity" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Uptime</h4>
            </div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">99.5%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Minimum SLA</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Auto-Retry</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">3x</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Max retry attempts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHealthPanel;
