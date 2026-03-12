import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

const ConflictResolutionPanel = ({ conflictAnalytics }) => {
  const [severityFilter, setSeverityFilter] = useState('all');

  if (!conflictAnalytics) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conflict Resolution</h2>
        <p className="text-gray-500">Loading conflict data...</p>
      </div>
    );
  }

  const resolutionRate = conflictAnalytics?.totalConflicts > 0
    ? ((conflictAnalytics?.resolvedConflicts / conflictAnalytics?.totalConflicts) * 100)?.toFixed(1)
    : 100;

  const filteredConflicts = severityFilter === 'all'
    ? conflictAnalytics?.recentConflicts
    : conflictAnalytics?.recentConflicts?.filter(c => c?.severity === severityFilter);

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700 border-blue-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors?.[severity] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          Conflict Resolution
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e?.target?.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Resolution Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Conflicts</p>
          <p className="text-2xl font-bold text-gray-900">{conflictAnalytics?.totalConflicts}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-700 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-700">{conflictAnalytics?.resolvedConflicts}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-xs text-orange-700 mb-1">Unresolved</p>
          <p className="text-2xl font-bold text-orange-700">{conflictAnalytics?.unresolvedConflicts}</p>
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
          <span className="text-sm font-bold text-gray-900">{resolutionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${resolutionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Conflicts by Severity */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">By Severity</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Low</p>
            <p className="text-xl font-bold text-blue-700">{conflictAnalytics?.conflictsBySeverity?.low || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <p className="text-xs text-orange-700 mb-1">Medium</p>
            <p className="text-xl font-bold text-orange-700">{conflictAnalytics?.conflictsBySeverity?.medium || 0}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <p className="text-xs text-red-700 mb-1">High</p>
            <p className="text-xl font-bold text-red-700">{conflictAnalytics?.conflictsBySeverity?.high || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Conflicts */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Conflicts</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {filteredConflicts?.map((conflict, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(conflict?.severity)}`}>
                  {conflict?.severity?.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  {conflict?.resolved ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(conflict?.detectedAt)?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-700">
                <p className="font-semibold mb-1">{conflict?.tableName}</p>
                <p className="text-gray-600">
                  {conflict?.type?.replace(/_/g, ' ')}
                  {conflict?.timeDiff && ` (${(conflict?.timeDiff / 1000)?.toFixed(1)}s apart)`}
                </p>
                {conflict?.resolution && (
                  <p className="text-green-600 mt-1">
                    Resolved: {conflict?.resolution?.strategy?.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredConflicts?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No conflicts detected</p>
        </div>
      )}
    </div>
  );
};

export default ConflictResolutionPanel;