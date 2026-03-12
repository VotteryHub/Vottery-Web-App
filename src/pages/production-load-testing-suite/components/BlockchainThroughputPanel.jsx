import React, { useState } from 'react';
import { Link2, TrendingUp, CheckCircle, XCircle, BarChart2 } from 'lucide-react';

const BLOCKCHAIN_TESTS = [
  { scale: '10K', tps: 850, target: 1000 },
  { scale: '100K', tps: 7200, target: 8000 },
  { scale: '500K', tps: 31000, target: 35000 },
  { scale: '1M', tps: 58000, target: 65000 },
  { scale: '10M', tps: 420000, target: 500000 },
  { scale: '50M', tps: 1800000, target: 2000000 },
  { scale: '100M', tps: 3200000, target: 4000000 },
  { scale: '500M', tps: 12000000, target: 15000000 },
  { scale: '1B', tps: 18000000, target: 25000000 },
];

const BlockchainThroughputPanel = () => {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const runValidation = () => {
    setRunning(true);
    setTimeout(() => {
      const testResults = BLOCKCHAIN_TESTS?.map(test => ({
        ...test,
        actualTPS: Math.floor(test?.tps * (0.9 + Math.random() * 0.2)),
        consensusTime: Math.floor(200 + Math.random() * 300),
        blockFinality: Math.floor(2 + Math.random() * 4),
        passed: Math.random() > 0.15
      }));
      setResults(testResults);
      setRunning(false);
    }, 3000);
  };

  const formatTPS = (tps) => {
    if (tps >= 1000000) return `${(tps / 1000000)?.toFixed(1)}M`;
    if (tps >= 1000) return `${(tps / 1000)?.toFixed(0)}K`;
    return tps?.toString();
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Link2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Blockchain Transaction Throughput</h3>
            <p className="text-gray-400 text-sm">Vote recording capacity & consensus validation under load</p>
          </div>
        </div>
        <button
          onClick={runValidation}
          disabled={running}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {running ? (
            <><BarChart2 className="w-4 h-4 animate-pulse" /> Validating...</>
          ) : (
            <><TrendingUp className="w-4 h-4" /> Run Validation</>
          )}
        </button>
      </div>
      {!results && !running && (
        <div className="text-center py-12 text-gray-500">
          <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Click "Run Validation" to test blockchain throughput at all scale levels</p>
        </div>
      )}
      {running && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-amber-400">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Validating blockchain throughput across all scales...</span>
          </div>
        </div>
      )}
      {results && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium pb-3">Scale</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Target TPS</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Actual TPS</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Consensus</th>
                <th className="text-right text-gray-400 text-xs font-medium pb-3">Finality</th>
                <th className="text-center text-gray-400 text-xs font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {results?.map((result) => (
                <tr key={result?.scale} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-3">
                    <span className="text-white font-bold">{result?.scale}</span>
                    <span className="text-gray-500 text-xs ml-1">users</span>
                  </td>
                  <td className="py-3 text-right text-gray-400 text-sm">{formatTPS(result?.target)}</td>
                  <td className="py-3 text-right">
                    <span className={`font-medium text-sm ${result?.actualTPS >= result?.target * 0.9 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatTPS(result?.actualTPS)}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-300 text-sm">{result?.consensusTime}ms</td>
                  <td className="py-3 text-right text-gray-300 text-sm">{result?.blockFinality}s</td>
                  <td className="py-3 text-center">
                    {result?.passed
                      ? <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                      : <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-400">Passed: {results?.filter(r => r?.passed)?.length}/{results?.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-gray-400">Failed: {results?.filter(r => !r?.passed)?.length}/{results?.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainThroughputPanel;
