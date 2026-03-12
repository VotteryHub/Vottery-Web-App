import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ErrorLogAggregation = ({ errorLogs }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterService, setFilterService] = useState('all');

  if (!errorLogs || errorLogs?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="CheckCircle" size={48} className="mx-auto mb-3 opacity-30 text-green-500" />
        <p>No errors detected</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'error': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'XCircle';
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      default: return 'Info';
    }
  };

  const uniqueServices = [...new Set(errorLogs?.map(log => log?.service))];

  const filteredLogs = errorLogs?.filter(log => {
    if (filterSeverity !== 'all' && log?.severity !== filterSeverity) return false;
    if (filterService !== 'all' && log?.service !== filterService) return false;
    return true;
  });

  const severityCounts = {
    critical: errorLogs?.filter(log => log?.severity === 'critical')?.length,
    error: errorLogs?.filter(log => log?.severity === 'error')?.length,
    warning: errorLogs?.filter(log => log?.severity === 'warning')?.length
  };

  return (
    <div className="space-y-6">
      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="XCircle" size={24} className="text-red-600 dark:text-red-400" />
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{severityCounts?.critical}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Critical Errors</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-orange-200 dark:border-orange-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="text-orange-600 dark:text-orange-400" />
            <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">{severityCounts?.error}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Errors</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertTriangle" size={24} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{severityCounts?.warning}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Warnings</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e?.target?.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e?.target?.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Services</option>
            {uniqueServices?.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLogs?.length} of {errorLogs?.length} errors
          </div>
        </div>
      </div>

      {/* Error Log Stream */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="List" size={20} className="text-primary" />
            Real-Time Error Stream
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
          {filteredLogs?.map((log) => (
            <div key={log?.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name={getSeverityIcon(log?.severity)} size={20} className={getSeverityColor(log?.severity)?.split(' ')?.[1]} />
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${getSeverityColor(log?.severity)}`}>
                    {log?.severity}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{log?.service}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log?.timestamp)?.toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{log?.message}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Occurrences: <span className="font-semibold">{log?.count}</span></span>
                <span>•</span>
                <span>Last seen: {new Date(log?.timestamp)?.toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Search" size={20} className="text-primary" />
          Automated Root Cause Analysis
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">Stripe Payment Timeout Pattern</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  Correlation detected: 3 payment timeouts in last 5 minutes. Possible network latency issue.
                </p>
                <div className="text-xs text-red-600 dark:text-red-400">
                  Recommendation: Check Stripe API status and network connectivity
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">OpenAI Rate Limit Warning</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                  Approaching rate limit threshold. 12 warnings in last hour.
                </p>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Recommendation: Implement request throttling or upgrade API tier
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLogAggregation;