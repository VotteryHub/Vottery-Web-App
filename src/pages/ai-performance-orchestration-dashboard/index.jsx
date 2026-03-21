import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { RefreshCw, Activity, AlertCircle } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import GeminiMonitoringService from '../../services/geminiMonitoringService';
import { supabase } from '../../lib/supabase';

const PROVIDERS = ['openai', 'anthropic', 'perplexity', 'gemini'];

export default function AIPerformanceOrchestrationDashboard() {
  const [rows, setRows] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const providerMetrics = await Promise.all(
        PROVIDERS.map(async (name) => {
          const m = await GeminiMonitoringService.getServiceMetrics(
            name === 'gemini' ? 'gemini' : name
          );
          return {
            provider: name,
            avgResponseTime: m?.avgResponseTime ?? 0,
            errorRate: m?.errorRate ?? 0,
            costPerQuery: m?.costPerQuery ?? 0,
            availability: m?.availabilityPercentage ?? 0,
            totalRequests: m?.totalRequests ?? 0,
          };
        })
      );
      setRows(providerMetrics);

      const { data: mon, error: e2 } = await supabase
        .from('ai_service_monitoring')
        .select('*')
        .order('monitored_at', { ascending: false })
        .limit(40);
      if (e2) throw e2;
      setRecent(mon || []);
    } catch (e) {
      setError(e?.message || 'Failed to load AI performance data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <>
      <Helmet>
        <title>AI Performance Orchestration | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-7 h-7 text-violet-400" />
              AI Performance Orchestration
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Per-provider latency, error rate, and cost from{' '}
              <code className="text-gray-300">ai_service_monitoring</code>
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-amber-300 bg-amber-950/50 border border-amber-800 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {rows.map((r) => (
                <div
                  key={r.provider}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs uppercase text-gray-500 mb-1">{r.provider}</p>
                  <p className="text-lg font-semibold">
                    {r.avgResponseTime}ms <span className="text-gray-500 text-sm">p50-ish</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Err {r.errorRate}% · ${r.costPerQuery}/q · {r.availability?.toFixed?.(1) ?? r.availability}% avail · {r.totalRequests} samples
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold mb-3">Recent monitoring rows</h2>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-gray-500">
                    <th className="p-3">Time</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">RT (ms)</th>
                    <th className="p-3">Err %</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-gray-500">
                        No rows in ai_service_monitoring yet. Run “Monitor” from AI Dependency Risk or
                        Gemini tools to populate.
                      </td>
                    </tr>
                  ) : (
                    recent.map((row) => (
                      <tr key={row.id || row.monitored_at + row.service_name} className="border-b border-white/5">
                        <td className="p-3 text-gray-400">
                          {row.monitored_at
                            ? new Date(row.monitored_at).toLocaleString()
                            : '—'}
                        </td>
                        <td className="p-3">{row.service_name}</td>
                        <td className="p-3">{row.response_time}</td>
                        <td className="p-3">{row.error_rate}</td>
                        <td className="p-3">{row.performance_status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
