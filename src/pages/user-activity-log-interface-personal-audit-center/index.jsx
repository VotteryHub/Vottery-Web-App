import React, { useState, useEffect } from 'react';
import { Download, Eye, Shield, Clock, Activity, Filter, FileText, Lock, Unlock } from 'lucide-react';
import platformLoggingService from '../../services/platformLoggingService';
import { useAuth } from '../../contexts/AuthContext';

const UserActivityLogInterface = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    limit: 25,
    offset: 0,
    total: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserLogs();
      fetchUserStatistics();
    }
  }, [user, filters, pagination?.offset]);

  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      const { logs: fetchedLogs, total } = await platformLoggingService?.getUserLogs({
        ...filters,
        limit: pagination?.limit,
        offset: pagination?.offset
      });
      setLogs(fetchedLogs);
      setPagination(prev => ({ ...prev, total }));
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const statistics = await platformLoggingService?.getLogStatistics(user?.id);
      setStats(statistics);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      await platformLoggingService?.exportUserLogs(format);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      user_activity: <Activity className="w-4 h-4" />,
      voting: <FileText className="w-4 h-4" />,
      payment: <Lock className="w-4 h-4" />,
      security: <Shield className="w-4 h-4" />,
      authentication: <Unlock className="w-4 h-4" />
    };
    return icons?.[category] || <Activity className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      user_activity: 'bg-blue-100 text-blue-800 border-blue-200',
      voting: 'bg-purple-100 text-purple-800 border-purple-200',
      payment: 'bg-green-100 text-green-800 border-green-200',
      security: 'bg-red-100 text-red-800 border-red-200',
      authentication: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personal Activity Log</h1>
          <p className="text-gray-600">Transparent access to your personal activity logs and audit trail</p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Privacy & Transparency</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                This interface provides you with complete transparency into your platform activity. All logs shown here are non-sensitive and available for your review. 
                Sensitive information (such as payment details and security events) is automatically redacted to protect your privacy while maintaining accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Activities</h3>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.total?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">User Actions</h3>
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats?.byCategory?.user_activity || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Votes Cast</h3>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats?.byCategory?.voting || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">This Week</h3>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-orange-600">
                {Object.entries(stats?.byDate || {})?.filter(([date]) => {
                    const logDate = new Date(date);
                    const weekAgo = new Date();
                    weekAgo?.setDate(weekAgo?.getDate() - 7);
                    return logDate >= weekAgo;
                  })?.reduce((sum, [, count]) => sum + count, 0)}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filter Your Activity</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('json')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters?.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="user_activity">User Activity</option>
                <option value="voting">Voting</option>
                <option value="authentication">Authentication</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters?.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters?.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters?.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e?.target?.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : logs?.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No activity logs found</p>
                <p className="text-sm text-gray-500 mt-2">Your activity will appear here as you use the platform</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs?.map((log, index) => (
                  <div key={log?.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getCategoryColor(log?.log_category)}`}>
                        {getCategoryIcon(log?.log_category)}
                      </div>
                      {index < logs?.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{log?.event_type}</h3>
                            <p className="text-sm text-gray-600 mt-1">{log?.message}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(log?.log_category)}`}>
                            {log?.log_category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.created_at)?.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {log?.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination?.total > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination?.offset + 1} to {Math.min(pagination?.offset + pagination?.limit, pagination?.total)} of {pagination?.total} activities
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

        {/* GDPR Compliance Notice */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Data Portability & Privacy Rights</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            In compliance with GDPR and data protection regulations, you have the right to export your personal data at any time using the export buttons above. 
            Your activity logs are retained for 1 year, and sensitive logs are automatically deleted after 90 days. 
            For data deletion requests or privacy inquiries, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserActivityLogInterface;