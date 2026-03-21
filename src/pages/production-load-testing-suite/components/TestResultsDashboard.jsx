import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CheckCircle, XCircle, Clock, TrendingUp, Download } from 'lucide-react';

const TestResultsDashboard = ({ loadTests = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const hasLiveTests = Array.isArray(loadTests) && loadTests?.length > 0;

  const results = hasLiveTests
    ? loadTests?.map((test) => {
        const errorRate = Number(test?.metrics?.errors || 0);
        const latency = Number(test?.metrics?.latency || 0);
        const throughput = Number(test?.metrics?.throughput || 0);
        return {
          scale: test?.scale,
          responseTime: latency,
          errorRate,
          throughput,
          status: test?.status === 'running' || test?.status === 'stopped'
            ? 'warning'
            : test?.status || (errorRate > 5 ? 'failed' : 'passed')
        };
      })
    : [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'passed': return 'bg-green-500/10 border-green-500/30';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'failed': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-800 border-gray-700';
    }
  };

  const passed = results?.filter(r => r?.status === 'passed')?.length;
  const warnings = results?.filter(r => r?.status === 'warning')?.length;
  const failed = results?.filter(r => r?.status === 'failed')?.length;

  const exportResultsCsv = () => {
    if (!results?.length) return;
    const headers = ['Scale', 'Response Time (ms)', 'Error Rate (%)', 'Throughput', 'Status'];
    const rows = results?.map((r) => [r?.scale, r?.responseTime, r?.errorRate, r?.throughput, r?.status]);
    const csv = [headers, ...rows]?.map((row) => row?.join(','))?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `load-testing-results-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Test Results Dashboard</h3>
            <p className="text-gray-400 text-sm">
              {hasLiveTests ? 'Live results from the current run' : 'Run load tests to populate results'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-4 text-sm">
            <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {passed} Passed</span>
            <span className="text-yellow-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {warnings} Warning</span>
            <span className="text-red-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> {failed} Failed</span>
          </div>
          <button
            onClick={exportResultsCsv}
            disabled={!results?.length}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
      {!results?.length && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/40 px-4 py-8 text-center text-gray-400 text-sm">
          No load test results available yet.
        </div>
      )}
      <div className="flex gap-2 mb-6">
        {['overview', 'response-times', 'throughput']?.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white' :'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab?.replace('-', ' ')}
          </button>
        ))}
      </div>
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-3">
          {results?.map((result) => (
            <div key={result?.scale} className={`rounded-lg p-4 border ${getStatusBg(result?.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-xl">{result?.scale}</span>
                {getStatusIcon(result?.status)}
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">{result?.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Error Rate</span>
                  <span className={result?.errorRate > 5 ? 'text-red-400' : result?.errorRate > 2 ? 'text-yellow-400' : 'text-green-400'}>
                    {result?.errorRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Throughput</span>
                  <span className="text-white">
                    {result?.throughput >= 1000000
                      ? `${(result?.throughput / 1000000)?.toFixed(0)}M`
                      : `${(result?.throughput / 1000)?.toFixed(0)}K`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'response-times' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="scale" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Bar dataKey="responseTime" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Response Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {activeTab === 'throughput' && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="scale" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000)?.toFixed(0)}M` : `${(v / 1000)?.toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F9FAFB' }}
                formatter={(v) => [v >= 1000000 ? `${(v / 1000000)?.toFixed(0)}M` : `${(v / 1000)?.toFixed(0)}K`, 'Throughput']}
              />
              <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TestResultsDashboard;
