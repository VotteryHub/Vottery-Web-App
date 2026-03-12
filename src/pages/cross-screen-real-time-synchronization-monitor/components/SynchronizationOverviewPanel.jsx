import React from 'react';
import { Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const SynchronizationOverviewPanel = ({ syncOverview }) => {
  if (!syncOverview) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Synchronization Overview</h2>
        <p className="text-gray-500">Loading synchronization data...</p>
      </div>
    );
  }

  const healthPercentage = syncOverview?.totalScreens > 0
    ? ((syncOverview?.healthyConnections / syncOverview?.activeSubscriptions) * 100)?.toFixed(1)
    : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Synchronization Overview
        </h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          Live Updates
        </span>
      </div>

      {/* Health Matrix */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Health</span>
          <span className="text-sm font-bold text-gray-900">{healthPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Connection Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Healthy</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{syncOverview?.healthyConnections}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Stale</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{syncOverview?.staleConnections}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{syncOverview?.errorConnections}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Active</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{syncOverview?.activeSubscriptions}</p>
        </div>
      </div>

      {/* Platform Coverage */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Platform Coverage</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Screens</span>
            <span className="text-sm font-bold text-gray-900">{syncOverview?.totalScreens}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monitored Tables</span>
            <span className="text-sm font-bold text-gray-900">{syncOverview?.activeSubscriptions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">AI Recommendations</span>
            <span className="text-sm font-bold text-gray-900">{syncOverview?.aiRecommendations}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Resolved Conflicts</span>
            <span className="text-sm font-bold text-gray-900">{syncOverview?.resolvedConflicts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynchronizationOverviewPanel;