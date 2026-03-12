import React from 'react';
import Icon from '../../../components/AppIcon';

const ServiceHealthMatrix = ({ services }) => {
  if (!services || services?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500 dark:text-gray-400">
        <Icon name="Server" size={48} className="mx-auto mb-3 opacity-30" />
        <p>No service data available</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {services?.map((service) => (
          <div key={service?.name} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(service?.status)} animate-pulse`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{service?.name}</h3>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusBadge(service?.status)}`}>
                {service?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{service?.uptime}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Response Time</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{service?.responseTime}ms</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Error Rate</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{service?.errorRate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Check</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Date(service?.lastCheck)?.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Connection Quality Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Connection Quality</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {service?.uptime >= 99.95 ? 'Excellent' : service?.uptime >= 99.9 ? 'Good' : 'Fair'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStatusColor(service?.status)}`}
                  style={{ width: `${service?.uptime}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            Service Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {services?.map((service) => (
                <tr key={service?.name}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(service?.status)}`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{service?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusBadge(service?.status)}`}>
                      {service?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {service?.uptime}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {service?.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {service?.errorRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceHealthMatrix;