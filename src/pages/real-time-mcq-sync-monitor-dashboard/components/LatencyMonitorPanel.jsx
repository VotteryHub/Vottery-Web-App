import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const LatencyMonitorPanel = ({ latencyData = [], loading = false }) => {
  const avgLatency = latencyData?.length > 0 ? Math.round(latencyData?.reduce((sum, d) => sum + (d?.latency || 0), 0) / latencyData?.length) : 0;
  const maxLatency = latencyData?.length > 0 ? Math.max(...latencyData?.map(d => d?.latency || 0)) : 0;
  const reconnections = latencyData?.filter(d => d?.reconnected)?.length || 0;

  const getLatencyColor = (latency) => {
    if (latency < 100) return '#10b981';
    if (latency < 300) return '#f59e0b';
    return '#ef4444';
  };

  const getLatencyStatus = (latency) => {
    if (latency < 100) return { label: 'Excellent', color: 'text-green-400' };
    if (latency < 300) return { label: 'Good', color: 'text-yellow-400' };
    return { label: 'Poor', color: 'text-red-400' };
  };

  const status = getLatencyStatus(avgLatency);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Connection Latency</h3>
          <p className="text-gray-400 text-sm">Real-time subscription ping times</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-700/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className={`text-xl font-bold ${status?.color}`}>{avgLatency}ms</p>
          <p className="text-gray-400 text-xs">Avg Latency</p>
          <p className={`text-xs mt-0.5 ${status?.color}`}>{status?.label}</p>
        </div>
        <div className="p-3 bg-gray-700/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
          </div>
          <p className="text-xl font-bold text-white">{maxLatency}ms</p>
          <p className="text-gray-400 text-xs">Peak Latency</p>
        </div>
        <div className="p-3 bg-gray-700/50 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <p className="text-xl font-bold text-white">{reconnections}</p>
          <p className="text-gray-400 text-xs">Reconnections</p>
        </div>
      </div>

      {latencyData?.length > 0 ? (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData?.slice(-20)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [`${value}ms`, 'Latency']}
              />
              <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <Zap className="w-10 h-10 mb-2 opacity-50" />
          <p className="text-sm">Collecting latency data...</p>
        </div>
      )}
    </div>
  );
};

export default LatencyMonitorPanel;
