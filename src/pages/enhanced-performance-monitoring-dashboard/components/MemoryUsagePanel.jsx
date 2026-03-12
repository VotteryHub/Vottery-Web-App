import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const THRESHOLD_BYTES = 524288000; // 500MB
const THRESHOLD_MB = 500;

const MemoryUsagePanel = ({ onThresholdBreached }) => {
  const [memHistory, setMemHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const measure = () => {
      try {
        const mem = performance?.memory;
        if (!mem) {
          setSupported(false);
          return;
        }

        const usedMB = Math.round(mem?.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(mem?.totalJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(mem?.jsHeapSizeLimit / 1024 / 1024);
        const usagePercent = Math.round((mem?.usedJSHeapSize / mem?.jsHeapSizeLimit) * 100);

        const entry = {
          time: new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          usedMB,
          totalMB,
          limitMB,
          usagePercent,
          status: mem?.usedJSHeapSize > THRESHOLD_BYTES ? 'breach' : 'ok',
        };

        setCurrent(entry);
        setMemHistory(prev => [...prev?.slice(-29), entry]);

        if (mem?.usedJSHeapSize > THRESHOLD_BYTES) {
          onThresholdBreached?.({
            metric: 'Memory Usage',
            value: usedMB,
            threshold: THRESHOLD_MB,
            unit: 'MB',
            severity: usedMB > 700 ? 'critical' : 'warning',
          });
        }
      } catch (e) {
        setSupported(false);
      }
    };

    measure();
    const interval = setInterval(measure, 15000);
    return () => clearInterval(interval);
  }, [onThresholdBreached]);

  if (!supported) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-semibold text-gray-900">Memory Usage</h3>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">⚠️ <strong>performance.memory</strong> API is only available in Chromium-based browsers (Chrome, Edge). Use Chrome DevTools for memory profiling in other browsers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-semibold text-gray-900">Memory Usage (JS Heap)</h3>
        </div>
        {current?.status === 'breach' ? (
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" /> &gt;500MB Threshold
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Within 500MB
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${
          (current?.usedMB || 0) > THRESHOLD_MB ? 'bg-red-50 border border-red-200' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className="text-xs text-gray-600">Used Heap</p>
          <p className={`text-xl font-bold ${
            (current?.usedMB || 0) > THRESHOLD_MB ? 'text-red-600' : 'text-purple-600'
          }`}>{current?.usedMB || 0} MB</p>
          <p className="text-xs text-gray-500">Limit: 500MB</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-xs text-gray-600">Total Heap</p>
          <p className="text-xl font-bold text-blue-600">{current?.totalMB || 0} MB</p>
          <p className="text-xs text-gray-500">Allocated</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-xs text-gray-600">Usage %</p>
          <p className="text-xl font-bold text-gray-700">{current?.usagePercent || 0}%</p>
          <p className="text-xs text-gray-500">Of heap limit</p>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={memHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={4} />
            <YAxis tick={{ fontSize: 10 }} unit="MB" />
            <Tooltip formatter={(v) => [`${v} MB`, 'Used Heap']} />
            <ReferenceLine y={THRESHOLD_MB} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '500MB', fontSize: 10, fill: '#ef4444' }} />
            <Area type="monotone" dataKey="usedMB" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MemoryUsagePanel;
