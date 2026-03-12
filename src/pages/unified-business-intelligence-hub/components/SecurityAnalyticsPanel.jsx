import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityAnalyticsPanel = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Security Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Security Score</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.securityScore || 0}%
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Threats (24h)</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalThreats || 0}
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Critical Threats</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
              {data?.criticalThreats || 0}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {Math.round(data?.avgResolutionTime || 0)}m
            </p>
          </div>
        </div>
      </div>

      {/* Fraud Detection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="ShieldAlert" size={20} className="text-red-500" />
          Fraud Detection Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Fraud Alerts</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalFraudAlerts || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.activeFraudCases || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Threat Trend</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2 capitalize">
              {data?.threatTrend || 'Stable'}
            </p>
          </div>
        </div>
      </div>

      {/* Incident Response */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" size={20} className="text-blue-500" />
          Incident Response Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Incidents (7d)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
              {data?.totalIncidents || 0}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved Incidents</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
              {data?.resolvedIncidents || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalyticsPanel;