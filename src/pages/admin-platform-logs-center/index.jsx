import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, AlertTriangle, Info, AlertCircle, XCircle, Activity } from 'lucide-react';
import platformLoggingService from '../../services/platformLoggingService';

const AdminPlatformLogsCenter = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    searchTerm: '',
    startDate: '',
    endDate: '',
    userId: ''
  });
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0
  });

  useEffect(() => {
    fetchLogs();
    fetchStatistics();
  }, [filters, pagination?.offset]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { logs: fetchedLogs, total } = await platformLoggingService?.getAllLogs({
        ...filters,
        limit: pagination?.limit,
        offset: pagination?.offset
      });
      setLogs(fetchedLogs);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const statistics = await platformLoggingService?.getLogStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handleRefresh = () => {
    fetchLogs();
    fetchStatistics();
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'warn':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      security: 'bg-red-100 text-red-800',
      payment: 'bg-green-100 text-green-800',
      voting: 'bg-purple-100 text-purple-800',
      ai_analysis: 'bg-indigo-100 text-indigo-800',
      user_activity: 'bg-blue-100 text-blue-800',
      performance: 'bg-yellow-100 text-yellow-800',
      fraud_detection: 'bg-orange-100 text-orange-800',
      authentication: 'bg-pink-100 text-pink-800',
      system: 'bg-gray-100 text-gray-800',
      api: 'bg-teal-100 text-teal-800',
      integration: 'bg-cyan-100 text-cyan-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Logs Center</h1>
          <p className="text-gray-600">Cross-platform log viewing, analytics, and audit capabilities</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Logs</h3>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.total?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Critical Events</h3>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats?.byLevel?.critical || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Errors</h3>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats?.byLevel?.error || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Warnings</h3>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats?.byLevel?.warn || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters?.category}
                onChange={(e) => handleFilterChange('category', e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="security">Security</option>
                <option value="payment">Payment</option>
                <option value="voting">Voting</option>
                <option value="ai_analysis">AI Analysis</option>
                <option value="user_activity">User Activity</option>
                <option value="performance">Performance</option>
                <option value="fraud_detection">Fraud Detection</option>
                <option value="authentication">Authentication</option>
                <option value="system">System</option>
                <option value="api">API</option>
                <option value="integration">Integration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters?.level}
                onChange={(e) => handleFilterChange('level', e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters?.startDate}
                onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters?.endDate}
                onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters?.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
                  placeholder="Search logs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : logs?.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No logs found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs?.map((log) => (
                    <tr key={log?.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.created_at)?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(log?.log_level)}`}>
                          {getLevelIcon(log?.log_level)}
                          {log?.log_level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(log?.log_category)}`}>
                          {log?.log_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log?.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log?.user_profiles?.username || log?.user_profiles?.email || 'System'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {log?.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log?.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination?.total > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination?.offset + 1} to {Math.min(pagination?.offset + pagination?.limit, pagination?.total)} of {pagination?.total} logs
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev?.offset - prev?.limit) }))}
                  disabled={pagination?.offset === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev?.offset + prev?.limit }))}
                  disabled={pagination?.offset + pagination?.limit >= pagination?.total}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPlatformLogsCenter;