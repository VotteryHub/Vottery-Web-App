import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { historicalPerformanceService } from '../../../services/historicalPerformanceService';

const HistoricalTrendingPanel = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadHistoricalData();
  }, [timeRange]);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : 30;
      const result = await historicalPerformanceService?.getHistoricalData('api_latency', days);

      if (result && result?.length > 0) {
        setData(result?.map(d => ({ date: d?.date, latency: Math.round(d?.avg), min: Math.round(d?.min), max: Math.round(d?.max) })));
      } else {
        // Generate mock data
        const mockData = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(Date.now() - i * 86400000);
          const base = 200 + Math.random() * 300;
          mockData?.push({
            date: date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            latency: Math.round(base),
            min: Math.round(base * 0.7),
            max: Math.round(base * 1.4),
            cacheHit: Math.round(75 + Math.random() * 20),
            errorRate: parseFloat((Math.random() * 0.05)?.toFixed(3))
          });
        }
        setData(mockData);
      }

      // Check for predictive alerts
      const recentData = data?.slice(-3);
      const avgLatency = recentData?.reduce((s, d) => s + (d?.latency || 0), 0) / (recentData?.length || 1);
      if (avgLatency > 600) {
        setAlerts([{ type: 'warning', message: `Latency trending high: ${Math.round(avgLatency)}ms avg over last 3 days` }]);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Avg Latency (ms)', 'Min (ms)', 'Max (ms)', 'Cache Hit %', 'Error Rate'];
    const rows = data?.map(d => [d?.date, d?.latency, d?.min, d?.max, d?.cacheHit, d?.errorRate]);
    const csv = [headers, ...rows]?.map(r => r?.join(','))?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${timeRange}-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">Historical Performance Trending</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['7d', '30d']?.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeRange === range ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'
                }`}
              >
                {range === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs hover:bg-gray-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={loadHistoricalData} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {/* Predictive Alerts */}
      {alerts?.map((alert, i) => (
        <div key={i} className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg mb-4 border border-amber-200 dark:border-amber-700">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">{alert?.message}</span>
        </div>
      ))}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2">API Latency (ms)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={timeRange === '7d' ? 0 : 4} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <ReferenceLine y={500} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Warning', fontSize: 10 }} />
                  <ReferenceLine y={1000} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Critical', fontSize: 10 }} />
                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} name="Avg Latency" />
                  <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Max" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Cache Hit Rate (%)</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={timeRange === '7d' ? 0 : 6} />
                    <YAxis tick={{ fontSize: 9 }} domain={[60, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cacheHit" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Error Rate</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={timeRange === '7d' ? 0 : 6} />
                    <YAxis tick={{ fontSize: 9 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="errorRate" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalTrendingPanel;
