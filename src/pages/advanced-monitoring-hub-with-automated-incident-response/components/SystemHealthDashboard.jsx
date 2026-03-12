import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const SystemHealthDashboard = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Elections & Voting', 'Analytics & Reporting', 'Payment & Financial', 'Security & Compliance', 'AI & Intelligence', 'Communication', 'Admin & Management'];

  const filteredScreens = data?.screenHealthData?.filter(screen => {
    const matchesCategory = selectedCategory === 'all' || screen?.category === selectedCategory;
    const matchesSearch = screen?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Screens</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{data?.totalScreens}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon name="Monitor" size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Healthy</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{data?.healthyScreens}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{data?.warningScreens}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{data?.criticalScreens}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <Icon name="XCircle" size={24} className="text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search screens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories?.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Screen Health Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Screen Health Status ({filteredScreens?.length} screens)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Screen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Health Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Error Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredScreens?.slice(0, 20)?.map((screen) => (
                <tr key={screen?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {screen?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {screen?.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            screen?.healthScore >= 95 ? 'bg-green-500' :
                            screen?.healthScore >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${screen?.healthScore}%` }}
                        />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{screen?.healthScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(screen?.status)}`}>
                      {screen?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {screen?.responseTime}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {(screen?.errorRate * 100)?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredScreens?.length > 20 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing 20 of {filteredScreens?.length} screens. Use search or filters to narrow results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthDashboard;