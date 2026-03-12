import React, { useState, useEffect } from 'react';
import { RefreshCw, Settings, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const RetryLogicEngine = () => {
  const [retryConfig, setRetryConfig] = useState({
    initialDelay: 1000,
    maxDelay: 60000,
    multiplier: 2,
    maxAttempts: 6,
    enabled: true
  });
  const [retryStats, setRetryStats] = useState(null);
  const [recentRetries, setRecentRetries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRetryData();
  }, []);

  const loadRetryData = async () => {
    try {
      const { data } = await supabase
        ?.from('sms_retry_log')
        ?.select('*')
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (data) {
        setRecentRetries(data);
        const stats = {
          totalRetries: data?.length,
          successRate: data?.length > 0 ? Math.round((data?.filter(r => r?.status === 'success')?.length / data?.length) * 100) : 0,
          avgAttempts: data?.length > 0 ? (data?.reduce((sum, r) => sum + (r?.attempt_number || 1), 0) / data?.length)?.toFixed(1) : 0,
          failedRetries: data?.filter(r => r?.status === 'max_retries_exceeded')?.length
        };
        setRetryStats(stats);
      }
    } catch (err) {
      console.error('Error loading retry data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBackoffSchedule = () => {
    const schedule = [];
    let delay = retryConfig?.initialDelay;
    for (let i = 1; i <= retryConfig?.maxAttempts; i++) {
      schedule?.push({ attempt: i, delay: Math.min(delay, retryConfig?.maxDelay) });
      delay *= retryConfig?.multiplier;
    }
    return schedule;
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      max_retries_exceeded: 'bg-red-100 text-red-800'
    };
    return styles?.[status] || 'bg-gray-100 text-gray-700';
  };

  const backoffSchedule = calculateBackoffSchedule();

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Retries', value: retryStats?.totalRetries ?? 0, icon: RefreshCw, color: 'blue' },
          { label: 'Success Rate', value: `${retryStats?.successRate ?? 0}%`, icon: CheckCircle, color: 'green' },
          { label: 'Avg Attempts', value: retryStats?.avgAttempts ?? 0, icon: TrendingUp, color: 'purple' },
          { label: 'Max Retries Hit', value: retryStats?.failedRetries ?? 0, icon: AlertCircle, color: 'red' }
        ]?.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat?.label}</span>
              <stat.icon className={`w-4 h-4 text-${stat?.color}-500`} />
            </div>
            <div className={`text-2xl font-bold text-${stat?.color}-600`}>{stat?.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Exponential Backoff Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Delay (ms)</label>
              <input
                type="number"
                value={retryConfig?.initialDelay}
                onChange={e => setRetryConfig(prev => ({ ...prev, initialDelay: parseInt(e?.target?.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Current: {retryConfig?.initialDelay / 1000}s</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Delay (ms)</label>
              <input
                type="number"
                value={retryConfig?.maxDelay}
                onChange={e => setRetryConfig(prev => ({ ...prev, maxDelay: parseInt(e?.target?.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Current: {retryConfig?.maxDelay / 1000}s</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backoff Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={retryConfig?.multiplier}
                onChange={e => setRetryConfig(prev => ({ ...prev, multiplier: parseFloat(e?.target?.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Retry Attempts</label>
              <input
                type="number"
                value={retryConfig?.maxAttempts}
                onChange={e => setRetryConfig(prev => ({ ...prev, maxAttempts: parseInt(e?.target?.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable Auto-Retry</span>
              <button
                onClick={() => setRetryConfig(prev => ({ ...prev, enabled: !prev?.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  retryConfig?.enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  retryConfig?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        {/* Backoff Schedule Visualization */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-800">Backoff Schedule Preview</h3>
          </div>
          <div className="space-y-2">
            {backoffSchedule?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-20">Attempt {item?.attempt}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((item?.delay / retryConfig?.maxDelay) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-16 text-right">
                  {item?.delay >= 1000 ? `${item?.delay / 1000}s` : `${item?.delay}ms`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              Total max wait time: {backoffSchedule?.reduce((sum, item) => sum + item?.delay, 0) / 1000}s across {retryConfig?.maxAttempts} attempts
            </p>
          </div>
        </div>
      </div>
      {/* Recent Retry Log */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Retry Activity</h3>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading retry logs...</div>
        ) : recentRetries?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No retry activity recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Provider</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Attempt</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Backoff</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Carrier</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentRetries?.map((retry, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 capitalize">{retry?.provider}</td>
                    <td className="py-2">{retry?.attempt_number}</td>
                    <td className="py-2">{retry?.backoff_delay_ms ? `${retry?.backoff_delay_ms}ms` : '-'}</td>
                    <td className="py-2">{retry?.carrier || '-'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(retry?.status)}`}>
                        {retry?.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2 text-gray-400">{new Date(retry?.created_at)?.toLocaleTimeString()}</td>
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

export default RetryLogicEngine;
