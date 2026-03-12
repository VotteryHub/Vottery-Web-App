import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const EndpointMonitoringPanel = ({ rateLimits, quotaMonitoring, onRefresh }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEndpoints = rateLimits?.filter(endpoint => 
    endpoint?.endpoint?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    endpoint?.method?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const getStatusColor = (utilization) => {
    if (utilization > 80) return 'text-red-500';
    if (utilization > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusBadge = (utilization) => {
    if (utilization > 80) return { label: 'Critical', color: 'bg-red-500/10 text-red-500' };
    if (utilization > 60) return { label: 'Warning', color: 'bg-yellow-500/10 text-yellow-500' };
    return { label: 'Healthy', color: 'bg-green-500/10 text-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
            <Icon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" size={20} className="text-primary" />
          All Endpoints ({filteredEndpoints?.length})
        </h3>
        <div className="space-y-3">
          {filteredEndpoints?.map((endpoint, index) => {
            const minuteUtilization = ((endpoint?.currentMinuteCount / endpoint?.quotaPerMinute) * 100)?.toFixed(1);
            const hourUtilization = ((endpoint?.currentHourCount / endpoint?.quotaPerHour) * 100)?.toFixed(1);
            const dayUtilization = ((endpoint?.currentDayCount / endpoint?.quotaPerDay) * 100)?.toFixed(1);
            const status = getStatusBadge(parseFloat(minuteUtilization));

            return (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                      {endpoint?.method}
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">{endpoint?.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {endpoint?.throttleEnabled && (
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
                        <Icon name="Sliders" size={12} />
                        Throttled
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${status?.color}`}>
                      {status?.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Per Minute</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(parseFloat(minuteUtilization))?.replace('text-', 'bg-')}`}
                          style={{ width: `${Math.min(parseFloat(minuteUtilization), 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${getStatusColor(parseFloat(minuteUtilization))}`}>
                        {minuteUtilization}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {endpoint?.currentMinuteCount} / {endpoint?.quotaPerMinute}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Per Hour</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(parseFloat(hourUtilization))?.replace('text-', 'bg-')}`}
                          style={{ width: `${Math.min(parseFloat(hourUtilization), 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${getStatusColor(parseFloat(hourUtilization))}`}>
                        {hourUtilization}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {endpoint?.currentHourCount} / {endpoint?.quotaPerHour}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Per Day</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(parseFloat(dayUtilization))?.replace('text-', 'bg-')}`}
                          style={{ width: `${Math.min(parseFloat(dayUtilization), 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${getStatusColor(parseFloat(dayUtilization))}`}>
                        {dayUtilization}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {endpoint?.currentDayCount} / {endpoint?.quotaPerDay}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EndpointMonitoringPanel;