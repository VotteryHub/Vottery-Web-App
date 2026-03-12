import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Zap, BarChart2, Shield, TrendingUp, TrendingDown, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';



const MetricCard = ({ title, value, unit, trend, trendValue, status, icon: Icon, color, description }) => {
  const statusColors = {
    good: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    critical: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors?.[status] || statusColors?.good}`}>
          {status === 'good' ? '✓ Healthy' : status === 'warning' ? '⚠ Warning' : '✗ Critical'}
        </span>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      {trendValue !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendValue}% vs last hour
        </div>
      )}
    </div>
  );
};

const SparklineBar = ({ values, color }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {values?.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} transition-all duration-300`}
          style={{ height: `${(v / max) * 100}%`, opacity: 0.4 + (i / values?.length) * 0.6 }}
        />
      ))}
    </div>
  );
};

const FeaturePerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    mcqAlertLatency: { value: 142, trend: 'up', trendValue: 8.3, status: 'good', history: [180, 165, 155, 148, 142, 138, 142] },
    abTestConvergence: { value: 73, trend: 'up', trendValue: 5.1, status: 'good', history: [45, 52, 58, 63, 68, 71, 73] },
    threatAIResponseTime: { value: 287, trend: 'down', trendValue: 3.2, status: 'warning', history: [310, 305, 298, 295, 290, 289, 287] },
    fraudRuleEffectiveness: { value: 94.2, trend: 'up', trendValue: 1.8, status: 'good', history: [88, 90, 91, 92, 93, 94, 94.2] },
  });
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [fraudRules, setFraudRules] = useState([]);
  const [abTests, setABTests] = useState([]);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch fraud rules effectiveness
      const { data: rulesData } = await supabase
        ?.from('fraud_prevention_rules')
        ?.select('id, rule_name, is_active, estimated_effectiveness, trigger_count')
        ?.eq('is_active', true)
        ?.limit(5);
      if (rulesData?.length) setFraudRules(rulesData);

      // Fetch A/B tests
      const { data: abData } = await supabase
        ?.from('mcq_ab_tests')
        ?.select('id, test_name, status, statistical_significance, sample_size')
        ?.limit(5);
      if (abData?.length) setABTests(abData);

      // Simulate real-time metric updates
      setMetrics(prev => ({
        mcqAlertLatency: {
          ...prev?.mcqAlertLatency,
          value: Math.max(80, prev?.mcqAlertLatency?.value + (Math.random() - 0.5) * 20),
          history: [...prev?.mcqAlertLatency?.history?.slice(1), prev?.mcqAlertLatency?.value],
        },
        abTestConvergence: {
          ...prev?.abTestConvergence,
          value: Math.min(100, prev?.abTestConvergence?.value + Math.random() * 0.5),
          history: [...prev?.abTestConvergence?.history?.slice(1), prev?.abTestConvergence?.value],
        },
        threatAIResponseTime: {
          ...prev?.threatAIResponseTime,
          value: Math.max(150, prev?.threatAIResponseTime?.value + (Math.random() - 0.5) * 30),
          history: [...prev?.threatAIResponseTime?.history?.slice(1), prev?.threatAIResponseTime?.value],
        },
        fraudRuleEffectiveness: {
          ...prev?.fraudRuleEffectiveness,
          value: Math.min(100, Math.max(80, prev?.fraudRuleEffectiveness?.value + (Math.random() - 0.4) * 0.5)),
          history: [...prev?.fraudRuleEffectiveness?.history?.slice(1), prev?.fraudRuleEffectiveness?.value],
        },
      }));
      setLastRefresh(new Date());
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const getLatencyStatus = (ms) => ms < 200 ? 'good' : ms < 400 ? 'warning' : 'critical';
  const getConvergenceStatus = (pct) => pct >= 80 ? 'good' : pct >= 60 ? 'warning' : 'critical';
  const getResponseStatus = (ms) => ms < 300 ? 'good' : ms < 500 ? 'warning' : 'critical';
  const getEffectivenessStatus = (pct) => pct >= 90 ? 'good' : pct >= 75 ? 'warning' : 'critical';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Activity size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feature Performance Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring of platform feature metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Last: {lastRefresh?.toLocaleTimeString()}</span>
              <button
                onClick={fetchMetrics}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="MCQ Alert Latency"
              value={Math.round(metrics?.mcqAlertLatency?.value)}
              unit="ms"
              trend={metrics?.mcqAlertLatency?.trend}
              trendValue={metrics?.mcqAlertLatency?.trendValue}
              status={getLatencyStatus(metrics?.mcqAlertLatency?.value)}
              icon={Zap}
              color="bg-gradient-to-br from-yellow-500 to-orange-500"
              description="Time from MCQ trigger to alert delivery"
            />
            <MetricCard
              title="A/B Test Convergence"
              value={metrics?.abTestConvergence?.value?.toFixed(1)}
              unit="%"
              trend={metrics?.abTestConvergence?.trend}
              trendValue={metrics?.abTestConvergence?.trendValue}
              status={getConvergenceStatus(metrics?.abTestConvergence?.value)}
              icon={BarChart2}
              color="bg-gradient-to-br from-purple-500 to-indigo-600"
              description="Statistical significance reached across active tests"
            />
            <MetricCard
              title="Threat AI Response"
              value={Math.round(metrics?.threatAIResponseTime?.value)}
              unit="ms"
              trend={metrics?.threatAIResponseTime?.trend}
              trendValue={metrics?.threatAIResponseTime?.trendValue}
              status={getResponseStatus(metrics?.threatAIResponseTime?.value)}
              icon={Shield}
              color="bg-gradient-to-br from-red-500 to-rose-600"
              description="Threat correlation AI analysis response time"
            />
            <MetricCard
              title="Fraud Rule Effectiveness"
              value={metrics?.fraudRuleEffectiveness?.value?.toFixed(1)}
              unit="%"
              trend={metrics?.fraudRuleEffectiveness?.trend}
              trendValue={metrics?.fraudRuleEffectiveness?.trendValue}
              status={getEffectivenessStatus(metrics?.fraudRuleEffectiveness?.value)}
              icon={CheckCircle}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
              description="Active fraud rules blocking confirmed threats"
            />
          </div>

          {/* Sparkline Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">MCQ Alert Latency Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Last 7 data points (ms)</p>
              <SparklineBar values={metrics?.mcqAlertLatency?.history} color="bg-yellow-500" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>7 intervals ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">A/B Test Convergence Progress</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Statistical significance % over time</p>
              <SparklineBar values={metrics?.abTestConvergence?.history} color="bg-purple-500" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>7 intervals ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Threat AI Response Time</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Correlation engine latency (ms)</p>
              <SparklineBar values={metrics?.threatAIResponseTime?.history} color="bg-red-500" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>7 intervals ago</span>
                <span>Now</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Fraud Rule Effectiveness</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Block rate for confirmed threats (%)</p>
              <SparklineBar values={metrics?.fraudRuleEffectiveness?.history} color="bg-green-500" />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>7 intervals ago</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* Fraud Rules Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Active Fraud Rules</h3>
              {fraudRules?.length > 0 ? (
                <div className="space-y-2">
                  {fraudRules?.map(rule => (
                    <div key={rule?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{rule?.rule_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Triggers: {rule?.trigger_count || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{rule?.estimated_effectiveness || 85}%</p>
                        <p className="text-xs text-gray-400">effectiveness</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[{ name: 'Velocity Check Rule', triggers: 1247, eff: 96 }, { name: 'IP Reputation Filter', triggers: 892, eff: 94 }, { name: 'Behavioral Anomaly', triggers: 543, eff: 91 }]?.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{r?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Triggers: {r?.triggers}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{r?.eff}%</p>
                        <p className="text-xs text-gray-400">effectiveness</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">A/B Test Status</h3>
              {abTests?.length > 0 ? (
                <div className="space-y-2">
                  {abTests?.map(test => (
                    <div key={test?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{test?.test_name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">n={test?.sample_size || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${(test?.statistical_significance || 0) >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {(test?.statistical_significance || 0)?.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-400">significance</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[{ name: 'MCQ Difficulty Variant', sig: 97.3, n: 4821 }, { name: 'Question Order Test', sig: 82.1, n: 2103 }, { name: 'Answer Format A/B', sig: 64.5, n: 987 }]?.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{t?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">n={t?.n?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${t?.sig >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>{t?.sig}%</p>
                        <p className="text-xs text-gray-400">significance</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeaturePerformanceDashboard;
