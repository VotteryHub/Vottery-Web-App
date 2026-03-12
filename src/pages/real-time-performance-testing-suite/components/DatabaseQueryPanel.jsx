import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const SLOW_QUERIES = [
  { query: 'SELECT * FROM elections WHERE status = $1 ORDER BY created_at DESC', duration: 342, table: 'elections', issue: 'Missing index on status+created_at', suggestion: 'CREATE INDEX idx_elections_status_created ON elections(status, created_at DESC)', severity: 'high' },
  { query: 'SELECT u.*, vt.* FROM user_profiles u JOIN user_vp_transactions vt ON u.id = vt.user_id', duration: 218, table: 'user_vp_transactions', issue: 'N+1 query pattern detected', suggestion: 'Use JOIN with pagination or batch loading', severity: 'medium' },
  { query: 'SELECT COUNT(*) FROM votes WHERE election_id = $1', duration: 156, table: 'votes', issue: 'Full table scan on large table', suggestion: 'CREATE INDEX idx_votes_election_id ON votes(election_id)', severity: 'medium' },
];

const OPTIMIZED_QUERIES = [
  { query: 'SELECT id, title, status FROM elections WHERE id = $1', duration: 12, table: 'elections', status: 'optimized' },
  { query: 'SELECT * FROM user_profiles WHERE id = $1', duration: 8, table: 'user_profiles', status: 'optimized' },
  { query: 'INSERT INTO votes (election_id, user_id, choice) VALUES ($1, $2, $3)', duration: 18, table: 'votes', status: 'optimized' },
];

const DatabaseQueryPanel = ({ isRunning }) => {
  const [slowQueries, setSlowQueries] = useState(SLOW_QUERIES);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSlowQueries(prev => prev?.map(q => ({ ...q, duration: Math.max(50, q?.duration + (Math.random() - 0.5) * 40) })));
    }, 1500);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-red-400">{slowQueries?.length}</p>
          <p className="text-gray-400 text-xs">Slow Queries (&gt;100ms)</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-green-400">{OPTIMIZED_QUERIES?.length}</p>
          <p className="text-gray-400 text-xs">Optimized Queries</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-blue-400">94%</p>
          <p className="text-gray-400 text-xs">Index Hit Rate</p>
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h4 className="text-white font-medium text-sm mb-3">Slow Query Analysis & Optimization Suggestions</h4>
        <div className="space-y-4">
          {slowQueries?.map((q, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${q?.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{q?.severity} severity</span>
                <span className="text-red-400 font-bold text-sm">{Math.round(q?.duration)}ms</span>
              </div>
              <p className="text-gray-300 text-xs font-mono bg-gray-800 p-2 rounded mb-2 truncate">{q?.query}</p>
              <p className="text-yellow-400 text-xs mb-1">⚠ {q?.issue}</p>
              <p className="text-green-400 text-xs font-mono">✓ {q?.suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatabaseQueryPanel;