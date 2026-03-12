import React from 'react';
import Icon from '../../../components/AppIcon';

const ActiveIncidentsPanel = ({ incidents, filters, setFilters, onSelectIncident, onRefresh }) => {
  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters?.status}
              onChange={(e) => setFilters({ ...filters, status: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Statuses</option>
              <option value="detected">Detected</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Threat Level
            </label>
            <select
              value={filters?.threatLevel}
              onChange={(e) => setFilters({ ...filters, threatLevel: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Incident Type
            </label>
            <select
              value={filters?.incidentType}
              onChange={(e) => setFilters({ ...filters, incidentType: e?.target?.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              <option value="fraud_detection">Fraud Detection</option>
              <option value="coordinated_attack">Coordinated Attack</option>
              <option value="account_compromise">Account Compromise</option>
              <option value="payment_fraud">Payment Fraud</option>
              <option value="policy_violation">Policy Violation</option>
              <option value="security_breach">Security Breach</option>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getThreatLevelColor(incident?.threatLevel)}`}>
                      {incident?.threatLevel?.toUpperCase()}
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
                    {incident?.escalationLevel && (
                      <span className="flex items-center gap-1">
                        <Icon name="TrendingUp" size={14} />
                        Escalation Level {incident?.escalationLevel}
                      </span>
                    )}
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