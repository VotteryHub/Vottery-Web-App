import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Settings, Activity, AlertTriangle, CheckCircle, RefreshCw, Save, Play, Square } from 'lucide-react';
import mcqAlertAutomationService from '../../services/mcqAlertAutomationService';




const MCQAlertAutomationConfigurationCenter = () => {
  const [thresholds, setThresholds] = useState(mcqAlertAutomationService?.getThresholds());
  const [checkResults, setCheckResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const runManualCheck = useCallback(async () => {
    setLoading(true);
    try {
      const results = await mcqAlertAutomationService?.runCheck();
      setCheckResults(results);
      setLastCheck(new Date()?.toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveThresholds = () => {
    mcqAlertAutomationService?.setThresholds(thresholds);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePolling = () => {
    if (polling) {
      mcqAlertAutomationService?.stopPolling();
      setPolling(false);
    } else {
      mcqAlertAutomationService?.startPolling(5 * 60 * 1000);
      setPolling(true);
    }
  };

  useEffect(() => { return () => mcqAlertAutomationService?.stopPolling(); }, []);

  const MetricCard = ({ title, value, threshold, unit = '%', color, icon: IconComponent, triggered }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 border-2 ${
      triggered ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'
    } shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color}`}>
            <IconComponent size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        </div>
        {triggered !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            triggered ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>{triggered ? 'ALERT' : 'OK'}</span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value !== undefined ? `${typeof value === 'number' ? value?.toFixed(1) : value}${unit}` : '—'}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Threshold: {threshold}{unit}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Bell size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MCQ Alert Automation</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure thresholds and monitor automated alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={togglePolling}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  polling ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {polling ? <><Square size={14} />Stop Polling</> : <><Play size={14} />Start Polling (5min)</>}
              </button>
              <button
                onClick={runManualCheck}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Run Check
              </button>
            </div>
          </div>
          {lastCheck && <p className="text-xs text-gray-400 mt-3">Last check: {lastCheck}</p>}
          {polling && <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400"><Activity size={12} className="animate-pulse" />Auto-polling every 5 minutes</div>}
        </div>

        {/* Threshold Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alert Thresholds</h2>
            </div>
            <button
              onClick={handleSaveThresholds}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                saved ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {saved ? <><CheckCircle size={14} />Saved!</> : <><Save size={14} />Save Thresholds</>}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'syncFailurePercent', label: 'Sync Failure Rate', desc: 'Alert when sync failures exceed this %', icon: AlertTriangle, color: 'text-red-600' },
              { key: 'accuracyDropPercent', label: 'Accuracy Drop', desc: 'Alert when accuracy drops by more than this %', icon: Activity, color: 'text-orange-600' },
              { key: 'sentimentNegativityPercent', label: 'Sentiment Negativity', desc: 'Alert when negative sentiment exceeds this %', icon: Bell, color: 'text-purple-600' },
            ]?.map(({ key, label, desc, icon: IconComp, color }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                <div className="flex items-center gap-2">
                  <IconComp size={16} className={color} />
                  <input
                    type="number"
                    min="1" max="100" step="1"
                    value={thresholds?.[key]}
                    onChange={e => setThresholds(prev => ({ ...prev, [key]: Number(e?.target?.value) }))}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <input
                  type="range" min="1" max="100"
                  value={thresholds?.[key]}
                  onChange={e => setThresholds(prev => ({ ...prev, [key]: Number(e?.target?.value) }))}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Metrics */}
        {checkResults && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={18} />Live Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="Sync Failure Rate"
                value={checkResults?.syncFailure?.rate}
                threshold={thresholds?.syncFailurePercent}
                color="bg-red-500"
                icon={AlertTriangle}
                triggered={checkResults?.syncFailure?.triggered}
              />
              <MetricCard
                title="Accuracy Drop"
                value={checkResults?.accuracyDrop?.drop}
                threshold={thresholds?.accuracyDropPercent}
                color="bg-orange-500"
                icon={Activity}
                triggered={checkResults?.accuracyDrop?.triggered}
              />
              <MetricCard
                title="Sentiment Negativity"
                value={checkResults?.sentimentNegativity?.negativityPercent}
                threshold={thresholds?.sentimentNegativityPercent}
                color="bg-purple-500"
                icon={Bell}
                triggered={checkResults?.sentimentNegativity?.triggered}
              />
            </div>

            {/* Alerts Triggered */}
            {checkResults?.alerts?.length > 0 ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                <h3 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} />{checkResults?.alerts?.length} Alert(s) Triggered
                </h3>
                <div className="space-y-2">
                  {checkResults?.alerts?.map((alert, i) => (
                    <div key={i} className="text-sm text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-2">
                      <strong>{alert?.type}</strong>: SMS + Email escalation sent
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-green-800 dark:text-green-300 font-medium">All metrics within thresholds — no alerts triggered</span>
              </div>
            )}
          </div>
        )}

        {/* Alert Channels Info */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Alert Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="p-2 bg-blue-600 rounded-lg"><Bell size={16} className="text-white" /></div>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-300">Telnyx SMS</div>
                <div className="text-xs text-blue-700 dark:text-blue-400">Immediate SMS to admin phone</div>
              </div>
              <CheckCircle size={16} className="ml-auto text-green-500" />
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="p-2 bg-purple-600 rounded-lg"><Bell size={16} className="text-white" /></div>
              <div>
                <div className="font-semibold text-purple-900 dark:text-purple-300">Resend Email</div>
                <div className="text-xs text-purple-700 dark:text-purple-400">Email escalation to admin team</div>
              </div>
              <CheckCircle size={16} className="ml-auto text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQAlertAutomationConfigurationCenter;
