import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const ENDPOINTS = [
  { name: 'Supabase Auth', url: '/auth/v1/token', p50: 45, p95: 120, p99: 280, status: 'healthy' },
  { name: 'Elections API', url: '/rest/v1/elections', p50: 62, p95: 145, p99: 320, status: 'healthy' },
  { name: 'Votes API', url: '/rest/v1/votes', p50: 38, p95: 98, p99: 210, status: 'healthy' },
  { name: 'AI Proxy (Lambda)', url: '/lambda/chat', p50: 890, p95: 2100, p99: 4500, status: 'warning' },
  { name: 'Stripe Webhooks', url: '/stripe/webhook', p50: 120, p95: 340, p99: 780, status: 'healthy' },
  { name: 'CDN Assets', url: '/assets/*', p50: 18, p95: 45, p99: 120, status: 'healthy' },
];

const ZONES = [
  { zone: 'North America', latency: 42, users: '38%' },
  { zone: 'Europe', latency: 78, users: '28%' },
  { zone: 'Asia Pacific', latency: 145, users: '22%' },
  { zone: 'Latin America', latency: 112, users: '8%' },
  { zone: 'Africa', latency: 198, users: '3%' },
  { zone: 'Middle East', latency: 165, users: '1%' },
];

const NetworkLatencyPanel = ({ isRunning }) => {
  const [endpoints, setEndpoints] = useState(ENDPOINTS);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setEndpoints(prev => prev?.map(e => ({
        ...e,
        p50: Math.max(10, e?.p50 + (Math.random() - 0.5) * 20),
        p95: Math.max(50, e?.p95 + (Math.random() - 0.5) * 40),
      })));
    }, 1200);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-white font-medium text-sm mb-3">Endpoint Response Times</h4>
        <div className="space-y-3">
          {endpoints?.map((ep, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm truncate">{ep?.name}</span>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-gray-500 text-xs">P50: <span className="text-white">{Math.round(ep?.p50)}ms</span></span>
                    <span className="text-gray-500 text-xs">P95: <span className={ep?.p95 > 1000 ? 'text-red-400' : ep?.p95 > 500 ? 'text-yellow-400' : 'text-green-400'}>{Math.round(ep?.p95)}ms</span></span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${ep?.p95 > 1000 ? 'bg-red-500' : ep?.p95 > 500 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min((ep?.p95 / 5000) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-white font-medium text-sm mb-3">Geographic Performance (8 Purchasing Power Zones)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ZONES?.map((z, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-gray-300 text-xs font-medium">{z?.zone}</span>
              </div>
              <p className={`text-lg font-bold ${z?.latency < 100 ? 'text-green-400' : z?.latency < 150 ? 'text-yellow-400' : 'text-red-400'}`}>{z?.latency}ms</p>
              <p className="text-gray-500 text-xs">{z?.users} of traffic</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkLatencyPanel;