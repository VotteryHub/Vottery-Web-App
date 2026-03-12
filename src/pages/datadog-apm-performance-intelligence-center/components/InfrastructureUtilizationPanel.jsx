import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { datadogAPMService } from '../../../services/datadogAPMService';

const InfrastructureUtilizationPanel = () => {
  const [utilization, setUtilization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUtilization();
  }, []);

  const loadUtilization = async () => {
    try {
      const { data, error } = await datadogAPMService?.getInfrastructureUtilization();
      if (error) throw error;
      setUtilization(data);
    } catch (error) {
      console.error('Error loading utilization:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (value) => {
    if (value >= 80) return 'text-red-600 dark:text-red-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} />
          Database Utilization
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Connection Pool</div>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization?.database?.connectionPoolUsage)}`}>
              {utilization?.database?.connectionPoolUsage}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${utilization?.database?.connectionPoolUsage}%` }}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Storage Usage</div>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization?.database?.storageUsage)}`}>
              {utilization?.database?.storageUsage}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${utilization?.database?.storageUsage}%` }}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">CPU Usage</div>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization?.database?.cpuUsage)}`}>
              {utilization?.database?.cpuUsage}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${utilization?.database?.cpuUsage}%` }}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Memory Usage</div>
            <div className={`text-2xl font-bold ${getUtilizationColor(utilization?.database?.memoryUsage)}`}>
              {utilization?.database?.memoryUsage}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${utilization?.database?.memoryUsage}%` }}
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Query Queue</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {utilization?.database?.queryQueueLength}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">queries</div>
          </div>
        </div>
      </div>

      {/* API Server Utilization */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Server" size={20} />
          API Server Utilization
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Active Connections</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {utilization?.api?.activeConnections}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Requests/Second</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {utilization?.api?.requestsPerSecond}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Concurrency</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {utilization?.api?.avgConcurrency}
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Peak Concurrency</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {utilization?.api?.peakConcurrency}
            </div>
          </div>
        </div>
      </div>

      {/* Capacity Planning Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Capacity Planning Recommendations
        </h3>
        <div className="space-y-3">
          {utilization?.recommendations?.map((rec, index) => {
            const priorityColor = rec?.priority === 'critical' ? 'red' :
                                 rec?.priority === 'high' ? 'orange' :
                                 rec?.priority === 'medium' ? 'yellow' : 'blue';
            return (
              <div
                key={index}
                className={`p-4 bg-${priorityColor}-50 dark:bg-${priorityColor}-900/20 rounded-lg border border-${priorityColor}-200 dark:border-${priorityColor}-800`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${priorityColor}-100 dark:bg-${priorityColor}-900/20 text-${priorityColor}-700 dark:text-${priorityColor}-400 uppercase`}>
                    {rec?.priority}
                  </span>
                  <span className={`text-xs text-${priorityColor}-700 dark:text-${priorityColor}-400 uppercase`}>
                    {rec?.type}
                  </span>
                </div>
                <p className={`text-sm text-${priorityColor}-800 dark:text-${priorityColor}-400 mb-2`}>
                  {rec?.message}
                </p>
                <div className={`text-xs font-semibold text-${priorityColor}-900 dark:text-${priorityColor}-300`}>
                  Action: {rec?.action}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfrastructureUtilizationPanel;