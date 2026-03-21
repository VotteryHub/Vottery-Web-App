import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const generateMemoryData = () => Array.from({ length: 20 }, (_, i) => ({
  time: `${i * 3}s`,
  heap: 45 + (i % 6) * 2.5,
  external: 8 + (i % 4) * 1.1,
  gc: i % 6 === 0 ? 1 : 0,
}));

const LEAK_CANDIDATES = [
  { component: 'HomeFeedDashboard', type: 'Event Listener', severity: 'low', description: 'Unremoved scroll listener on unmount', status: 'warning' },
  { component: 'DirectMessagingCenter', type: 'WebSocket', severity: 'medium', description: 'WebSocket connection not closed on navigation', status: 'warning' },
  { component: 'RealTimeAnalyticsDashboard', type: 'Interval', severity: 'low', description: 'setInterval not cleared in cleanup', status: 'fixed' },
  { component: 'ProductionLoadTestingSuite', type: 'Subscription', severity: 'low', description: 'Supabase channel subscription leak', status: 'fixed' },
];

const MemoryLeakDetectionPanel = ({ isRunning }) => {
  const [memoryData, setMemoryData] = useState(() => generateMemoryData());
  const [heapUsage, setHeapUsage] = useState(58.3);

  const maxHeap = Math.max(...memoryData?.map(d => d?.heap));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Heap Usage</p>
          <p className="text-2xl font-bold text-blue-400">{heapUsage?.toFixed(1)}MB</p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${(heapUsage / 100) * 100}%` }} />
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">GC Collections</p>
          <p className="text-2xl font-bold text-green-400">{memoryData?.filter(d => d?.gc)?.length}</p>
          <p className="text-gray-500 text-xs mt-1">Last 60 seconds</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Leak Candidates</p>
          <p className="text-2xl font-bold text-yellow-400">{LEAK_CANDIDATES?.filter(l => l?.status === 'warning')?.length}</p>
          <p className="text-gray-500 text-xs mt-1">Needs review</p>
        </div>
      </div>
      {/* Memory Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-white font-medium text-sm mb-3">Heap Memory Over Time</h4>
        <div className="flex items-end gap-1 h-24">
          {memoryData?.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-blue-500/60 rounded-sm transition-all" style={{ height: `${(d?.heap / maxHeap) * 80}px` }} />
              {d?.gc === 1 && <div className="w-1 h-1 rounded-full bg-green-400" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-600 text-xs">0s</span>
          <span className="text-gray-600 text-xs">60s</span>
        </div>
      </div>
      {/* Leak Candidates */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-white font-medium text-sm mb-3">Leak Candidates & Remediation</h4>
        <div className="space-y-2">
          {LEAK_CANDIDATES?.map((leak, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              {leak?.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium">{leak?.component}</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">{leak?.type}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${leak?.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{leak?.severity}</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">{leak?.description}</p>
              </div>
              <span className={`text-xs font-medium flex-shrink-0 ${leak?.status === 'fixed' ? 'text-green-400' : 'text-yellow-400'}`}>{leak?.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemoryLeakDetectionPanel;