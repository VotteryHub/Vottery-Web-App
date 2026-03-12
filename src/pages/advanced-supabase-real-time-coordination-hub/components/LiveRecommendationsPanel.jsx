import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap, CheckCircle } from 'lucide-react';

const LiveRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState([
    { id: 1, screen: 'Home Feed', type: 'Content', status: 'propagated', confidence: 95, time: '2s ago' },
    { id: 2, screen: 'Elections Hub', type: 'Voting', status: 'propagating', confidence: 92, time: '5s ago' },
    { id: 3, screen: 'Admin Dashboard', type: 'Fraud Alert', status: 'propagated', confidence: 98, time: '8s ago' },
    { id: 4, screen: 'User Profile', type: 'Personalization', status: 'propagated', confidence: 89, time: '12s ago' }
  ]);

  const [streamStats] = useState({
    totalStreamed: 2847,
    activeStreams: 117,
    avgLatency: '0.3s',
    consistencyScore: 99.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRecommendations(prev => [
        {
          id: Date.now(),
          screen: ['Home Feed', 'Elections Hub', 'Admin Dashboard']?.[Math.floor(Math.random() * 3)],
          type: ['Content', 'Voting', 'Fraud Alert', 'Personalization']?.[Math.floor(Math.random() * 4)],
          status: 'propagating',
          confidence: Math.floor(Math.random() * 10 + 88),
          time: 'Just now'
        },
        ...prev?.slice(0, 5)
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    return status === 'propagated' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Sparkles className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Live Recommendation Updates</h2>
            <p className="text-sm text-gray-600">Real-time AI streaming across all 117 screens</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
          <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-sm font-medium text-blue-700">Live Stream</span>
        </div>
      </div>

      {/* Stream Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{streamStats?.totalStreamed?.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Streamed</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{streamStats?.activeStreams}</div>
          <div className="text-xs text-gray-600">Active Streams</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{streamStats?.avgLatency}</div>
          <div className="text-xs text-gray-600">Avg Latency</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
          <div className="text-2xl font-bold text-teal-600">{streamStats?.consistencyScore}%</div>
          <div className="text-xs text-gray-600">Consistency</div>
        </div>
      </div>

      {/* Live Recommendations Feed */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {recommendations?.map((rec) => (
          <div
            key={rec?.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all animate-fadeIn"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-lg ${
                rec?.status === 'propagated' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                {rec?.status === 'propagated' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{rec?.screen}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{rec?.type}</span>
                </div>
                <div className="text-xs text-gray-500">{rec?.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">{rec?.confidence}%</div>
                <div className="text-xs text-gray-600">Confidence</div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(rec?.status)}`}>
                {rec?.status === 'propagated' ? '✓ SENT' : '⟳ SENDING'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Propagation Metrics */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">Instant propagation with consistency validation</span>
          </div>
          <span className="text-sm font-medium text-green-600">99.2% Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default LiveRecommendationsPanel;