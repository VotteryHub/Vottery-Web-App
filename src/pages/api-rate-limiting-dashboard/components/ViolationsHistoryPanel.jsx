import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ViolationsHistoryPanel = ({ violations, timeRange }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterEndpoint, setFilterEndpoint] = useState('all');

  const filteredViolations = violations?.filter(v => {
    if (filterSeverity !== 'all' && v?.severity !== filterSeverity) return false;
    if (filterEndpoint !== 'all' && v?.endpoint !== filterEndpoint) return false;
    return true;
  });

  const uniqueEndpoints = [...new Set(violations?.map(v => v?.endpoint))];

  const violationsByType = violations?.reduce((acc, v) => {
    acc[v?.violationType] = (acc?.[v?.violationType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Endpoint</label>
            <select
              value={filterEndpoint}
              onChange={(e) => setFilterEndpoint(e?.target?.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Endpoints</option>
              {uniqueEndpoints?.map(endpoint => (
                <option key={endpoint} value={endpoint}>{endpoint}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <div className="text-sm text-muted-foreground">Time Range: {timeRange}</div>
            <div className="text-lg font-bold text-foreground">{filteredViolations?.length} violations</div>
          </div>
        </div>
      </div>

      {/* Violation Type Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="PieChart" size={20} className="text-primary" />
          Violations by Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(violationsByType)?.map(([type, count]) => (
            <div key={type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-muted-foreground capitalize mb-1">{type?.replace('_', ' ')}</div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Violations Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} className="text-primary" />
          Violations Timeline
        </h3>
        <div className="space-y-2">
          {filteredViolations?.map((violation, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    violation?.severity === 'high' ? 'bg-red-500' :
                    violation?.severity === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                    {violation?.method}
                  </span>
                  <span className="font-mono text-sm text-foreground">{violation?.endpoint}</span>
                  <span className="text-xs text-muted-foreground capitalize">{violation?.violationType?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  {violation?.blocked && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-500">
                      Blocked
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(violation?.createdAt)?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViolationsHistoryPanel;