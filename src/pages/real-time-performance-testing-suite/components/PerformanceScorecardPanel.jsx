import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const SCREEN_SCORES = [
  { screen: 'home-feed-dashboard', memory: 95, latency: 88, db: 92, overall: 92 },
  { screen: 'authentication-portal', memory: 98, latency: 95, db: 97, overall: 97 },
  { screen: 'elections-dashboard', memory: 91, latency: 85, db: 88, overall: 88 },
  { screen: 'secure-voting-interface', memory: 94, latency: 90, db: 93, overall: 92 },
  { screen: 'admin-control-center', memory: 87, latency: 82, db: 85, overall: 85 },
  { screen: 'production-load-testing-suite', memory: 89, latency: 78, db: 84, overall: 84 },
  { screen: 'creator-monetization-studio', memory: 93, latency: 88, db: 90, overall: 90 },
  { screen: 'digital-wallet-hub', memory: 96, latency: 92, db: 94, overall: 94 },
  { screen: 'direct-messaging-center', memory: 88, latency: 75, db: 82, overall: 82 },
  { screen: 'compliance-dashboard', memory: 92, latency: 87, db: 89, overall: 89 },
];

const ScoreCell = ({ value }) => {
  const color = value >= 90 ? 'text-green-400' : value >= 75 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-medium ${color}`}>{value}</span>;
};

const PerformanceScorecardPanel = ({ isRunning }) => {
  const [scores, setScores] = useState(SCREEN_SCORES);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setScores(prev => prev?.map(s => ({
        ...s,
        memory: Math.max(70, Math.min(100, s?.memory + (Math.random() - 0.5) * 4)),
        latency: Math.max(60, Math.min(100, s?.latency + (Math.random() - 0.5) * 6)),
        db: Math.max(65, Math.min(100, s?.db + (Math.random() - 0.5) * 4)),
        overall: Math.max(65, Math.min(100, s?.overall + (Math.random() - 0.5) * 3)),
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const passing = scores?.filter(s => s?.overall >= 75)?.length;
  const failing = scores?.filter(s => s?.overall < 75)?.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-400">{passing}</p>
          <p className="text-gray-400 text-xs">Passing</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-400">{failing}</p>
          <p className="text-gray-400 text-xs">Failing</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-400">{scores?.length}</p>
          <p className="text-gray-400 text-xs">Total Screens</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Screen</th>
                <th className="text-center text-gray-400 text-xs font-medium px-3 py-3">Memory</th>
                <th className="text-center text-gray-400 text-xs font-medium px-3 py-3">Latency</th>
                <th className="text-center text-gray-400 text-xs font-medium px-3 py-3">DB</th>
                <th className="text-center text-gray-400 text-xs font-medium px-3 py-3">Overall</th>
              </tr>
            </thead>
            <tbody>
              {scores?.map((s, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-300 text-sm font-mono">{s?.screen}</td>
                  <td className="px-3 py-3 text-center text-sm"><ScoreCell value={Math.round(s?.memory)} /></td>
                  <td className="px-3 py-3 text-center text-sm"><ScoreCell value={Math.round(s?.latency)} /></td>
                  <td className="px-3 py-3 text-center text-sm"><ScoreCell value={Math.round(s?.db)} /></td>
                  <td className="px-3 py-3 text-center text-sm"><ScoreCell value={Math.round(s?.overall)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceScorecardPanel;