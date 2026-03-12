import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Link2 } from 'lucide-react';

const BlockchainHealthIndicators = () => {
  const [metrics, setMetrics] = useState({
    totalVerifications: 9847293,
    verificationRate: 99.7,
    failedVerifications: 29541,
    consensusStatus: 'healthy',
    blockHeight: 4829341,
    avgBlockTime: 2.3,
    pendingVerifications: 1247,
    lastBlock: new Date()?.toLocaleTimeString()
  });
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVerifications: prev?.totalVerifications + Math.floor(Math.random() * 500),
        verificationRate: parseFloat((99.5 + Math.random() * 0.4)?.toFixed(2)),
        failedVerifications: prev?.failedVerifications + Math.floor(Math.random() * 3),
        blockHeight: prev?.blockHeight + 1,
        pendingVerifications: Math.floor(Math.random() * 2000 + 500),
        lastBlock: new Date()?.toLocaleTimeString()
      }));

      if (Math.random() > 0.85) {
        setAlerts(prev => [{
          type: metrics?.verificationRate < 99 ? 'warning' : 'info',
          message: `Block #${metrics?.blockHeight} verified — ${Math.floor(Math.random() * 1000 + 100)} transactions`,
          time: new Date()?.toLocaleTimeString()
        }, ...prev]?.slice(0, 5));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [metrics?.blockHeight, metrics?.verificationRate]);

  const getConsensusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'degraded': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Blockchain Health Indicators</h3>
            <p className="text-gray-400 text-sm">blockchain_vote_verifications table — live consensus monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Total Verifications</p>
          <p className="text-white font-bold text-xl">{(metrics?.totalVerifications / 1000000)?.toFixed(2)}M</p>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">All time</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Verification Rate</p>
          <p className={`font-bold text-xl ${metrics?.verificationRate >= 99.5 ? 'text-green-400' : 'text-yellow-400'}`}>
            {metrics?.verificationRate}%
          </p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${metrics?.verificationRate}%` }} />
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Failed Verifications</p>
          <p className="text-red-400 font-bold text-xl">{metrics?.failedVerifications?.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1">
            <XCircle className="w-3 h-3 text-red-400" />
            <span className="text-red-400 text-xs">{((metrics?.failedVerifications / metrics?.totalVerifications) * 100)?.toFixed(3)}% rate</span>
          </div>
        </div>
        <div className={`rounded-lg p-4 border ${getConsensusColor(metrics?.consensusStatus)}`}>
          <p className="text-gray-400 text-xs mb-1">Consensus Status</p>
          <p className="font-bold text-xl capitalize">{metrics?.consensusStatus}</p>
          <p className="text-gray-500 text-xs mt-1">Block #{metrics?.blockHeight?.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">Avg Block Time</p>
          <p className="text-white font-bold">{metrics?.avgBlockTime}s</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">Pending Verifications</p>
          <p className="text-yellow-400 font-bold">{metrics?.pendingVerifications?.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs">Last Block</p>
          <p className="text-white font-bold">{metrics?.lastBlock}</p>
        </div>
      </div>
      {alerts?.length > 0 && (
        <div>
          <h4 className="text-gray-400 text-xs font-medium mb-2">Recent Activity</h4>
          <div className="space-y-1.5">
            {alerts?.map((alert, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <Link2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">{alert?.message}</span>
                <span className="text-gray-600 ml-auto">{alert?.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainHealthIndicators;
