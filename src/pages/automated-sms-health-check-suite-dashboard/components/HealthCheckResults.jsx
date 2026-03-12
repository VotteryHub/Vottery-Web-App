import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../../../lib/supabase';

const HealthCheckResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadResults();
    const sub = supabase
      ?.channel('health_check_results')
      ?.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sms_health_check_results' }, payload => {
        setResults(prev => [payload?.new, ...prev?.slice(0, 49)]);
      })
      ?.subscribe();
    return () => supabase?.removeChannel(sub);
  }, []);

  const loadResults = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_health_check_results')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(50);

      if (data) {
        setResults(data);
        buildChartData(data);
      }
    } catch (err) {
      console.error('Error loading health check results:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildChartData = (data) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date?.setDate(date?.getDate() - (6 - i));
      const dateStr = date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayData = data?.filter(r => new Date(r?.created_at)?.toDateString() === date?.toDateString());
      return {
        date: dateStr,
        telnyx_pass: dayData?.filter(r => r?.provider === 'telnyx' && r?.status === 'pass')?.length,
        telnyx_fail: dayData?.filter(r => r?.provider === 'telnyx' && r?.status === 'fail')?.length,
        twilio_pass: dayData?.filter(r => r?.provider === 'twilio' && r?.status === 'pass')?.length,
        twilio_fail: dayData?.filter(r => r?.provider === 'twilio' && r?.status === 'fail')?.length
      };
    });
    setChartData(last7Days);
  };

  const filteredResults = results?.filter(r => {
    if (filterProvider !== 'all' && r?.provider !== filterProvider) return false;
    if (filterStatus !== 'all' && r?.status !== filterStatus) return false;
    return true;
  });

  const telnyxResults = results?.filter(r => r?.provider === 'telnyx');
  const twilioResults = results?.filter(r => r?.provider === 'twilio');
  const telnyxAvgLatency = telnyxResults?.length > 0
    ? Math.round(telnyxResults?.reduce((sum, r) => sum + (r?.latency_ms || 0), 0) / telnyxResults?.length)
    : 0;
  const twilioAvgLatency = twilioResults?.length > 0
    ? Math.round(twilioResults?.reduce((sum, r) => sum + (r?.latency_ms || 0), 0) / twilioResults?.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tests', value: results?.length, icon: Activity, color: 'blue' },
          { label: 'Passed', value: results?.filter(r => r?.status === 'pass')?.length, icon: CheckCircle, color: 'green' },
          { label: 'Failed', value: results?.filter(r => r?.status === 'fail')?.length, icon: XCircle, color: 'red' },
          { label: 'Avg Latency', value: `${Math.round((telnyxAvgLatency + twilioAvgLatency) / 2)}ms`, icon: TrendingUp, color: 'purple' }
        ]?.map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{card?.label}</span>
              <card.icon className={`w-4 h-4 text-${card?.color}-500`} />
            </div>
            <div className={`text-2xl font-bold text-${card?.color}-600`}>{card?.value}</div>
          </div>
        ))}
      </div>
      {/* Provider Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { provider: 'telnyx', results: telnyxResults, avgLatency: telnyxAvgLatency, color: 'blue' },
          { provider: 'twilio', results: twilioResults, avgLatency: twilioAvgLatency, color: 'purple' }
        ]?.map(({ provider, results: pResults, avgLatency, color }) => {
          const passRate = pResults?.length > 0 ? Math.round((pResults?.filter(r => r?.status === 'pass')?.length / pResults?.length) * 100) : 0;
          return (
            <div key={provider} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold text-${color}-700 capitalize`}>{provider}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  passRate >= 90 ? 'bg-green-100 text-green-700' : passRate >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>{passRate}% pass rate</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Tests Run</p>
                  <p className="font-bold text-gray-800">{pResults?.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Latency</p>
                  <p className="font-bold text-gray-800">{avgLatency}ms</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Failovers</p>
                  <p className="font-bold text-gray-800">{pResults?.filter(r => r?.failover_triggered)?.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* 7-Day Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">7-Day Health Check History</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="telnyx_pass" fill="#3b82f6" name="Telnyx Pass" radius={[2, 2, 0, 0]} />
            <Bar dataKey="twilio_pass" fill="#8b5cf6" name="Twilio Pass" radius={[2, 2, 0, 0]} />
            <Bar dataKey="telnyx_fail" fill="#ef4444" name="Telnyx Fail" radius={[2, 2, 0, 0]} />
            <Bar dataKey="twilio_fail" fill="#f97316" name="Twilio Fail" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Filters + Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Test Results Log</h3>
          <div className="flex gap-2">
            <select
              value={filterProvider}
              onChange={e => setFilterProvider(e?.target?.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <option value="all">All Providers</option>
              <option value="telnyx">Telnyx</option>
              <option value="twilio">Twilio</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e?.target?.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <option value="all">All Status</option>
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="degraded">Degraded</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading results...</div>
        ) : filteredResults?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No results match the current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Provider</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Test Type</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Latency</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Failover</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults?.slice(0, 20)?.map((result, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        result?.provider === 'telnyx' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>{result?.provider}</span>
                    </td>
                    <td className="py-2.5 text-gray-600 capitalize">{result?.test_type?.replace(/_/g, ' ')}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        {result?.status === 'pass' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                         result?.status === 'fail' ? <XCircle className="w-4 h-4 text-red-500" /> :
                         <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        <span className="capitalize">{result?.status}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-gray-600">{result?.latency_ms ? `${result?.latency_ms}ms` : '-'}</td>
                    <td className="py-2.5">
                      {result?.failover_triggered
                        ? <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Triggered</span>
                        : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs">{new Date(result?.created_at)?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckResults;
