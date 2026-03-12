import React from 'react';
import { Activity, Wifi, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const MonitoringStatusPanel = ({ checkResults, isPolling, lastChecked, onRunChecks, loading }) => {
  const metrics = [
    {
      label: 'Sync Failure Rate',
      value: checkResults?.syncFailure?.metric !== undefined ? `${parseFloat(checkResults?.syncFailure?.metric)?.toFixed(1)}%` : '—',
      triggered: checkResults?.syncFailure?.triggered,
      threshold: checkResults?.syncFailure?.threshold,
      color: checkResults?.syncFailure?.triggered ? 'text-red-600' : 'text-green-600',
      bg: checkResults?.syncFailure?.triggered ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
    {
      label: 'Accuracy Drop',
      value: checkResults?.accuracyDrop?.metric !== undefined ? `${parseFloat(checkResults?.accuracyDrop?.metric)?.toFixed(1)}%` : '—',
      triggered: checkResults?.accuracyDrop?.triggered,
      threshold: checkResults?.accuracyDrop?.threshold,
      color: checkResults?.accuracyDrop?.triggered ? 'text-orange-600' : 'text-green-600',
      bg: checkResults?.accuracyDrop?.triggered ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
    {
      label: 'Sentiment Negativity',
      value: checkResults?.sentimentNegativity?.metric !== undefined ? `${parseFloat(checkResults?.sentimentNegativity?.metric)?.toFixed(1)}%` : '—',
      triggered: checkResults?.sentimentNegativity?.triggered,
      threshold: checkResults?.sentimentNegativity?.threshold,
      color: checkResults?.sentimentNegativity?.triggered ? 'text-yellow-600' : 'text-green-600',
      bg: checkResults?.sentimentNegativity?.triggered ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Activity size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Live Monitoring Status</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time threshold tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isPolling ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            <Wifi size={12} className={isPolling ? 'animate-pulse' : ''} />
            {isPolling ? 'Polling Active' : 'Polling Stopped'}
          </div>
          <button
            onClick={onRunChecks}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Zap size={14} />
            {loading ? 'Checking...' : 'Run Checks Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {metrics?.map((metric, i) => (
          <div key={i} className={`${metric?.bg} border rounded-xl p-4`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{metric?.label}</p>
            <p className={`text-2xl font-bold ${metric?.color}`}>{metric?.value}</p>
            <div className="flex items-center gap-2 mt-2">
              {metric?.triggered ? (
                <><AlertCircle size={14} className="text-red-500" /><span className="text-xs text-red-600 font-semibold">ALERT TRIGGERED</span></>
              ) : (
                <><CheckCircle size={14} className="text-green-500" /><span className="text-xs text-green-600">Within threshold</span></>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
        <Clock size={16} className="text-gray-400 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Last Check</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {lastChecked ? new Date(lastChecked)?.toLocaleString() : 'Not yet checked'}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Next Check</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Every 5 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default MonitoringStatusPanel;
