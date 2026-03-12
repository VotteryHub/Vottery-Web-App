import React, { useState, useEffect } from 'react';
import { errorRecoveryService } from '../../services/errorRecoveryService';
import { performanceMonitoringService } from '../../services/performanceMonitoringService';
import Icon from '../../components/AppIcon';
import { Line, Bar, Pie } from 'recharts';
import { LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ErrorRecoveryDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [errorTrends, setErrorTrends] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResult, trendsResult, perfResult] = await Promise.all([
        errorRecoveryService?.getErrorStatistics(timeRange),
        errorRecoveryService?.getErrorTrends(timeRange === '24h' ? 7 : 30),
        performanceMonitoringService?.getPerformanceAnalytics(timeRange)
      ]);

      if (statsResult?.data) {
        setErrorStats(statsResult?.data);
      }

      if (trendsResult?.data) {
        setErrorTrends(trendsResult?.data);
      }

      if (perfResult?.data) {
        setPerformanceData(perfResult?.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-neutral-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                <Icon name="Shield" size={32} color="#3B82F6" />
                Error Recovery & Performance Dashboard
              </h1>
              <p className="text-neutral-600 mt-2">
                Real-time monitoring of system health, error recovery, and performance metrics across all 103+ screens
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e?.target?.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg bg-white text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={loadDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Icon name="RefreshCw" size={18} color="#fff" />
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-neutral-200">
            {[
              { id: 'overview', label: 'Overview', icon: 'BarChart3' },
              { id: 'errors', label: 'Error Analysis', icon: 'AlertTriangle' },
              { id: 'performance', label: 'Performance', icon: 'Zap' },
              { id: 'bottlenecks', label: 'Bottlenecks', icon: 'TrendingDown' }
            ]?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setSelectedTab(tab?.id)}
                className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
                  selectedTab === tab?.id
                    ? 'text-blue-600 border-b-2 border-blue-600' :'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && errorStats && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-600">Total Errors</h3>
                  <Icon name="AlertCircle" size={20} color="#3B82F6" />
                </div>
                <p className="text-3xl font-bold text-neutral-900">{errorStats?.overview?.totalErrors || 0}</p>
                <p className="text-xs text-neutral-500 mt-1">Across all screens</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-600">Recovered</h3>
                  <Icon name="CheckCircle" size={20} color="#10B981" />
                </div>
                <p className="text-3xl font-bold text-green-600">{errorStats?.overview?.recoveredErrors || 0}</p>
                <p className="text-xs text-neutral-500 mt-1">{errorStats?.overview?.recoveryRate}% recovery rate</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-600">Failed</h3>
                  <Icon name="XCircle" size={20} color="#EF4444" />
                </div>
                <p className="text-3xl font-bold text-red-600">{errorStats?.overview?.failedErrors || 0}</p>
                <p className="text-xs text-neutral-500 mt-1">Unrecovered errors</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-neutral-600">Avg Retries</h3>
                  <Icon name="RotateCw" size={20} color="#F59E0B" />
                </div>
                <p className="text-3xl font-bold text-neutral-900">{errorStats?.overview?.averageRetries || 0}</p>
                <p className="text-xs text-neutral-500 mt-1">Per error incident</p>
              </div>
            </div>

            {/* Error Trends Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={20} color="#3B82F6" />
                Error Trends Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={errorTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3B82F6" name="Total Errors" strokeWidth={2} />
                  <Line type="monotone" dataKey="recovered" stroke="#10B981" name="Recovered" strokeWidth={2} />
                  <Line type="monotone" dataKey="failed" stroke="#EF4444" name="Failed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* System Health Score */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">System Health Score</h3>
                  <p className="text-blue-100">Based on error recovery rate and performance metrics</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold">{errorStats?.overview?.recoveryRate || 0}%</div>
                  <p className="text-sm text-blue-100 mt-1">Recovery Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Analysis Tab */}
        {selectedTab === 'errors' && errorStats && (
          <div className="space-y-6">
            {/* Errors by Type */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="PieChart" size={20} color="#3B82F6" />
                Errors by Type
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(errorStats?.errorsByType || {})?.map(([type, stats]) => ({
                        name: type,
                        value: stats?.count
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry?.name}: ${entry?.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(errorStats?.errorsByType || {})?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {Object.entries(errorStats?.errorsByType || {})?.map(([type, stats], index) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                        />
                        <span className="font-medium text-neutral-900">{type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-neutral-900">{stats?.count}</p>
                        <p className="text-xs text-neutral-500">
                          {stats?.recovered} recovered, {stats?.failed} failed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Errors by Screen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="Layout" size={20} color="#3B82F6" />
                Errors by Screen
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={Object.entries(errorStats?.errorsByScreen || {})?.slice(0, 10)?.map(([screen, stats]) => ({
                  screen: screen?.split('/')?.pop() || screen,
                  total: stats?.count,
                  recovered: stats?.recovered,
                  failed: stats?.failed
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="screen" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="recovered" fill="#10B981" name="Recovered" />
                  <Bar dataKey="failed" fill="#EF4444" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Critical Errors */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} color="#EF4444" />
                Recent Critical Errors (Unrecovered)
              </h3>
              <div className="space-y-3">
                {errorStats?.criticalErrors?.length > 0 ? (
                  errorStats?.criticalErrors?.map((error, index) => (
                    <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-red-900">{error?.errorType}</p>
                          <p className="text-sm text-red-700 mt-1">{error?.errorMessage}</p>
                        </div>
                        <span className="text-xs text-red-600 font-medium">
                          {new Date(error?.createdAt)?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-red-600">
                        <span>Screen: {error?.screenName}</span>
                        <span>Component: {error?.componentName}</span>
                        <span>Retries: {error?.retryAttempts}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500">
                    <Icon name="CheckCircle" size={48} color="#10B981" className="mx-auto mb-2" />
                    <p>No critical errors found!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {selectedTab === 'performance' && performanceData && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(performanceData?.metricsByType || {})?.map(([type, stats]) => (
                <div key={type} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-neutral-600 mb-3">{type?.replace(/_/g, ' ')?.toUpperCase()}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">Average:</span>
                      <span className="text-sm font-bold text-neutral-900">{stats?.avgValue?.toFixed(2)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">P95:</span>
                      <span className="text-sm font-bold text-neutral-900">{stats?.p95?.toFixed(2)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">Count:</span>
                      <span className="text-sm font-bold text-neutral-900">{stats?.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Screen Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="Activity" size={20} color="#3B82F6" />
                Screen Performance Overview
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Screen</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Avg Load Time</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Total Metrics</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Interactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(performanceData?.screenStats || {})?.slice(0, 15)?.map(([screen, stats]) => (
                      <tr key={screen} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-4 text-sm text-neutral-900">{screen}</td>
                        <td className="py-3 px-4 text-sm text-right font-medium text-neutral-900">
                          {stats?.avgLoadTime}ms
                        </td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-600">{stats?.totalMetrics}</td>
                        <td className="py-3 px-4 text-sm text-right text-neutral-600">{stats?.interactionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bottlenecks Tab */}
        {selectedTab === 'bottlenecks' && performanceData && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Icon name="TrendingDown" size={20} color="#EF4444" />
                Slowest Screens (Bottlenecks)
              </h3>
              <p className="text-sm text-neutral-600 mb-6">
                These screens have the highest average load times and may need optimization
              </p>
              <div className="space-y-4">
                {performanceData?.bottleneckScreens?.map((screen, index) => (
                  <div key={index} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{screen?.screenName}</p>
                          <p className="text-xs text-neutral-600">Needs optimization</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">{screen?.avgLoadTime}ms</p>
                        <p className="text-xs text-neutral-600">Avg load time</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-neutral-600 mt-3">
                      <span>Total Loads: {screen?.totalMetrics}</span>
                      <span>Interactions: {screen?.interactionCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} color="#3B82F6" />
                Optimization Recommendations
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={18} color="#3B82F6" className="mt-0.5" />
                  <span className="text-sm text-blue-900">
                    Implement code splitting and lazy loading for screens with load times &gt; 3000ms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={18} color="#3B82F6" className="mt-0.5" />
                  <span className="text-sm text-blue-900">
                    Optimize images and assets for screens with high interaction counts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={18} color="#3B82F6" className="mt-0.5" />
                  <span className="text-sm text-blue-900">
                    Consider implementing server-side rendering (SSR) for critical screens
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={18} color="#3B82F6" className="mt-0.5" />
                  <span className="text-sm text-blue-900">
                    Review and optimize API calls for screens with high error rates
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorRecoveryDashboard;