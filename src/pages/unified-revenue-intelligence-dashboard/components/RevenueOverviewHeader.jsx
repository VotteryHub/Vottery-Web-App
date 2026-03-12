import React from 'react';
import { DollarSign, TrendingUp, Activity, BarChart2, RefreshCw } from 'lucide-react';

const RevenueOverviewHeader = ({ streams, totalRevenue, timeRange, setTimeRange, onRefresh, isLoading }) => {
  const avgGrowth = streams?.length > 0
    ? (streams?.reduce((sum, s) => sum + (s?.growth || 0), 0) / streams?.length)?.toFixed(1)
    : 0;

  const topStream = streams?.reduce((max, s) => (s?.total > (max?.total || 0) ? s : max), {});
  const totalTransactions = streams?.reduce((sum, s) => sum + (s?.transactions || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Unified Revenue Intelligence Dashboard</h1>
          <p className="text-gray-400 mt-1">Consolidated revenue streams with AI-powered predictive modeling and zone optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {['7d', '30d', '90d']?.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white' :'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-white">${totalRevenue?.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">Across all 6 streams</p>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Avg Growth Rate</p>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-400">+{avgGrowth}%</p>
              <p className="text-gray-500 text-xs mt-1">MoM across streams</p>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Top Revenue Stream</p>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <p className="text-lg font-bold text-white">{topStream?.source}</p>
              <p className="text-yellow-400 text-xs mt-1">${topStream?.total?.toLocaleString()} ({topStream?.percentage}%)</p>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm">Total Transactions</p>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <>
              <p className="text-2xl font-bold text-white">{totalTransactions?.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">Across all channels</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueOverviewHeader;
