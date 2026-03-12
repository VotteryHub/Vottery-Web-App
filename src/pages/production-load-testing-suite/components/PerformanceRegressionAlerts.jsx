import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, TrendingDown, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

const BASELINE_METRICS = [
  { metric: 'Response Time (p95)', baseline: 250, unit: 'ms', threshold: 20 },
  { metric: 'Error Rate', baseline: 0.5, unit: '%', threshold: 20 },
  { metric: 'Throughput (RPS)', baseline: 45000, unit: 'rps', threshold: 20 },
  { metric: 'WebSocket Latency', baseline: 35, unit: 'ms', threshold: 20 },
  { metric: 'Blockchain TPS', baseline: 8500, unit: 'tps', threshold: 20 },
];

const PerformanceRegressionAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [smsConfig, setSmsConfig] = useState({ enabled: true, phone: '+1 (555) 000-0000', threshold: 20 });
  const [showConfig, setShowConfig] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState({});

  useEffect(() => {
    // Simulate live metric updates
    const interval = setInterval(() => {
      const newMetrics = {};
      BASELINE_METRICS?.forEach(m => {
        const variance = (Math.random() - 0.4) * 0.4; // Slight positive bias
        newMetrics[m.metric] = {
          current: m?.metric === 'Throughput (RPS)' || m?.metric === 'Blockchain TPS'
            ? m?.baseline * (1 + variance)
            : m?.baseline * (1 - variance),
          baseline: m?.baseline,
          unit: m?.unit,
          regression: variance < -0.2 // 20% degradation
        };
      });
      setCurrentMetrics(newMetrics);

      // Generate alerts for regressions
      const newAlerts = Object.entries(newMetrics)?.filter(([_, v]) => v?.regression)?.map(([metric, v]) => ({
          id: `alert_${Date.now()}_${metric}`,
          metric,
          baseline: v?.baseline,
          current: v?.current,
          unit: v?.unit,
          regression: Math.abs(((v?.current - v?.baseline) / v?.baseline) * 100)?.toFixed(1),
          time: new Date()?.toLocaleTimeString(),
          smsSent: smsConfig?.enabled
        }));

      if (newAlerts?.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]?.slice(0, 10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [smsConfig?.enabled]);

  const getRegressionColor = (pct) => {
    const val = parseFloat(pct);
    if (val > 40) return 'text-red-400';
    if (val > 20) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Bell className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Performance Regression Alerts</h3>
            <p className="text-gray-400 text-sm">Automated comparison vs baseline — Telnyx SMS on &gt;20% regression</p>
          </div>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-sm transition-colors"
        >
          <Settings className="w-4 h-4" /> Configure
        </button>
      </div>
      {showConfig && (
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Telnyx SMS Alert Configuration</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Alert Phone Number</label>
              <input
                value={smsConfig?.phone}
                onChange={(e) => setSmsConfig(prev => ({ ...prev, phone: e?.target?.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Regression Threshold (%)</label>
              <input
                type="number"
                value={smsConfig?.threshold}
                onChange={(e) => setSmsConfig(prev => ({ ...prev, threshold: parseInt(e?.target?.value) }))}
                className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setSmsConfig(prev => ({ ...prev, enabled: !prev?.enabled }))}
                  className={`w-10 h-5 rounded-full transition-colors ${smsConfig?.enabled ? 'bg-blue-500' : 'bg-gray-600'} relative cursor-pointer`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${smsConfig?.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-gray-300 text-sm">SMS Alerts {smsConfig?.enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {BASELINE_METRICS?.map((m) => {
          const current = currentMetrics?.[m?.metric];
          const isRegression = current?.regression;
          return (
            <div key={m?.metric} className={`bg-gray-800 rounded-lg p-3 border ${isRegression ? 'border-red-500/50' : 'border-gray-700'}`}>
              <p className="text-gray-400 text-xs mb-2 leading-tight">{m?.metric}</p>
              <p className="text-white font-bold text-sm">
                {current ? (
                  m?.metric === 'Throughput (RPS)' || m?.metric === 'Blockchain TPS'
                    ? `${(current?.current / 1000)?.toFixed(0)}K`
                    : `${current?.current?.toFixed(1)}`
                ) : m?.baseline}
                <span className="text-gray-500 text-xs ml-1">{m?.unit}</span>
              </p>
              <p className="text-gray-500 text-xs">Baseline: {m?.baseline}{m?.unit}</p>
              {isRegression && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span className="text-red-400 text-xs">Regression</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <h4 className="text-gray-300 font-medium text-sm mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          Recent Regression Alerts
        </h4>
        {alerts?.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-sm">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
            No regressions detected — all metrics within baseline thresholds
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alerts?.map((alert) => (
              <div key={alert?.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-white text-sm">{alert?.metric}</span>
                    <span className={`ml-2 text-xs font-medium ${getRegressionColor(alert?.regression)}`}>
                      -{alert?.regression}% regression
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {alert?.smsSent && (
                    <div className="flex items-center gap-1 text-blue-400 text-xs">
                      <MessageSquare className="w-3 h-3" /> SMS Sent
                    </div>
                  )}
                  <span className="text-gray-500 text-xs">{alert?.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceRegressionAlerts;
