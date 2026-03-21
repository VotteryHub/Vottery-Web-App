import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveIncidentsPanel = ({
  incidents,
  filters,
  setFilters,
  onSelectIncident,
  onRefresh,
  onAssignIncident,
  onEscalateIncident,
}) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'resolved': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={16} />
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={filters?.status}
              onChange={(e) => setFilters({ ...filters, status: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
            <select
              value={filters?.severity}
              onChange={(e) => setFilters({ ...filters, severity: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select
              value={filters?.type}
              onChange={(e) => setFilters({ ...filters, type: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="fraud_alert">Fraud Alert</option>
              <option value="system_failure">System Failure</option>
              <option value="revenue_anomaly">Revenue Anomaly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No active incidents found</p>
          </div>
        ) : (
          incidents?.map((incident) => (
            <div
              key={incident?.id}
              onClick={() => onSelectIncident(incident)}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident?.severity)}`}>
                      {incident?.severity?.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(incident?.status)}`}>
                      {incident?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {incident?.incidentType?.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {incident?.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {incident?.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {new Date(incident?.detectedAt)?.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        const ownerUserId = window.prompt('Assign owner user ID/team', incident?.assignedTo || '');
                        if (!ownerUserId) return;
                        const notes = window.prompt('Assignment notes (optional)', '') || null;
                        onAssignIncident?.(incident, ownerUserId, notes);
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      Assign
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        const escalationLevelInput = window.prompt('Escalation level: P0, P1, P2, P3', 'P1');
                        if (!escalationLevelInput) return;
                        const escalationLevel = escalationLevelInput.toUpperCase();
                        if (!['P0', 'P1', 'P2', 'P3'].includes(escalationLevel)) return;
                        const notes = window.prompt('Escalation notes (optional)', '') || null;
                        onEscalateIncident?.(incident, escalationLevel, notes);
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
                <Icon name="ChevronRight" size={20} className="text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveIncidentsPanel;