import React, { useState, useEffect } from 'react';
import { Monitor, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const THRESHOLD_MS = 2000;

const ScreenLoadPanel = ({ onThresholdBreached }) => {
  const [loadMetrics, setLoadMetrics] = useState([]);
  const [currentLoad, setCurrentLoad] = useState(null);
  const [breachCount, setBreachCount] = useState(0);

  useEffect(() => {
    const measure = () => {
      try {
        const navEntries = performance?.getEntriesByType?.('navigation') || [];
        const nav = navEntries?.[0];
        if (nav) {
          const loadTime = Math.round(nav?.loadEventEnd - nav?.startTime);
          const domContentLoaded = Math.round(nav?.domContentLoadedEventEnd - nav?.startTime);
          const ttfb = Math.round(nav?.responseStart - nav?.requestStart);
          const fcp = Math.round(nav?.domInteractive - nav?.startTime);

          const entry = {
            time: new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            loadTime,
            domContentLoaded,
            ttfb,
            fcp,
            status: loadTime > THRESHOLD_MS ? 'breach' : 'ok',
          };

          setCurrentLoad(entry);
          setLoadMetrics(prev => {
            const updated = [...prev?.slice(-14), entry];
            return updated;
          });

          if (loadTime > THRESHOLD_MS) {
            setBreachCount(c => c + 1);
            onThresholdBreached?.({
              metric: 'Screen Load Time',
              value: loadTime,
              threshold: THRESHOLD_MS,
              unit: 'ms',
              severity: loadTime > 4000 ? 'critical' : 'warning',
            });
          }
        }

        // Also check paint entries
        const paintEntries = performance?.getEntriesByType?.('paint') || [];
        paintEntries?.forEach(p => {
          if (p?.name === 'first-contentful-paint') {
            setCurrentLoad(prev => prev ? { ...prev, fcp: Math.round(p?.startTime) } : prev);
          }
        });
      } catch (e) {
        console.warn('Performance API not available:', e?.message);
      }
    };

    measure();
    const interval = setInterval(measure, 15000);
    return () => clearInterval(interval);
  }, [onThresholdBreached]);

  const avgLoad = loadMetrics?.length > 0
    ? Math.round(loadMetrics?.reduce((s, m) => s + m?.loadTime, 0) / loadMetrics?.length)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Screen Load Times</h3>
        </div>
        <div className="flex items-center gap-2">
          {currentLoad?.status === 'breach' ? (
            <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              <AlertTriangle className="w-3 h-3" /> Threshold Breached
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Within Threshold
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Page Load', value: currentLoad?.loadTime, threshold: 2000 },
          { label: 'DOM Ready', value: currentLoad?.domContentLoaded, threshold: 1500 },
          { label: 'TTFB', value: currentLoad?.ttfb, threshold: 800 },
          { label: 'FCP', value: currentLoad?.fcp, threshold: 1800 },
        ]?.map(m => (
          <div key={m?.label} className={`p-3 rounded-lg ${
            (m?.value || 0) > m?.threshold ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
          }`}>
            <p className="text-xs text-gray-600">{m?.label}</p>
            <p className={`text-xl font-bold ${
              (m?.value || 0) > m?.threshold ? 'text-red-600' : 'text-green-600'
            }`}>{m?.value ? `${m?.value}ms` : '—'}</p>
            <p className="text-xs text-gray-500">Target: &lt;{m?.threshold}ms</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          Avg Load: <span className={`font-bold ml-1 ${avgLoad > THRESHOLD_MS ? 'text-red-600' : 'text-green-600'}`}>{avgLoad}ms</span>
        </div>
        {breachCount > 0 && (
          <span className="text-sm text-red-600 font-medium">{breachCount} threshold breach{breachCount > 1 ? 'es' : ''} detected</span>
        )}
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={loadMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={2} />
            <YAxis tick={{ fontSize: 10 }} unit="ms" />
            <Tooltip formatter={(v) => [`${v}ms`, 'Load Time']} />
            <ReferenceLine y={THRESHOLD_MS} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '2s limit', fontSize: 10, fill: '#ef4444' }} />
            <Bar dataKey="loadTime" fill="#3b82f6" radius={[2, 2, 0, 0]}
              label={false}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScreenLoadPanel;
