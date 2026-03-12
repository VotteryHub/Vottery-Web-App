import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const REGRESSION_TESTS = [
  { name: 'Authentication Flow', baseline: 245, current: 238, change: -2.9, status: 'pass' },
  { name: 'Election Creation', baseline: 380, current: 392, change: 3.2, status: 'pass' },
  { name: 'Vote Submission', baseline: 120, current: 118, change: -1.7, status: 'pass' },
  { name: 'Feed Loading', baseline: 890, current: 1050, change: 18.0, status: 'warning' },
  { name: 'Payment Processing', baseline: 1200, current: 1180, change: -1.7, status: 'pass' },
  { name: 'AI Quest Generation', baseline: 3200, current: 3450, change: 7.8, status: 'pass' },
  { name: 'Blockchain Verification', baseline: 450, current: 448, change: -0.4, status: 'pass' },
  { name: 'Notification Delivery', baseline: 280, current: 295, change: 5.4, status: 'pass' },
];

const RegressionTestingPanel = ({ isRunning }) => {
  const [tests, setTests] = useState(REGRESSION_TESTS);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTests(prev => prev?.map(t => {
        const newCurrent = Math.max(50, t?.current + (Math.random() - 0.5) * 30);
        const change = ((newCurrent - t?.baseline) / t?.baseline) * 100;
        return { ...t, current: newCurrent, change, status: Math.abs(change) > 15 ? 'fail' : Math.abs(change) > 10 ? 'warning' : 'pass' };
      }));
    }, 1800);
    return () => clearInterval(interval);
  }, [isRunning]);

  const passing = tests?.filter(t => t?.status === 'pass')?.length;
  const warnings = tests?.filter(t => t?.status === 'warning')?.length;
  const failing = tests?.filter(t => t?.status === 'fail')?.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-green-400">{passing}</p>
          <p className="text-gray-400 text-xs">Passing</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-yellow-400">{warnings}</p>
          <p className="text-gray-400 text-xs">Warnings</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <Shield className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-red-400">{failing}</p>
          <p className="text-gray-400 text-xs">Failing (&gt;15%)</p>
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium text-sm">Performance Baseline Comparison</h4>
          <span className="text-gray-500 text-xs">Alert threshold: &gt;15% degradation</span>
        </div>
        <div className="space-y-2">
          {tests?.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{t?.name}</span>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-gray-500 text-xs">Baseline: {t?.baseline}ms</span>
                    <span className="text-gray-300 text-xs">Current: {Math.round(t?.current)}ms</span>
                    <span className={`text-xs font-medium ${t?.change > 0 ? 'text-red-400' : 'text-green-400'}`}>{t?.change > 0 ? '+' : ''}{t?.change?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t?.status === 'pass' ? 'bg-green-400' : t?.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegressionTestingPanel;