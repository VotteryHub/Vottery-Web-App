import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';

const SubscriptionHealthPanel = () => {
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, screen: 'Home Feed Dashboard', status: 'healthy', latency: '12ms', messages: 1247 },
    { id: 2, screen: 'Elections Dashboard', status: 'healthy', latency: '15ms', messages: 892 },
    { id: 3, screen: 'Admin Control Center', status: 'healthy', latency: '18ms', messages: 634 },
    { id: 4, screen: 'Fraud Detection Center', status: 'warning', latency: '45ms', messages: 423 },
    { id: 5, screen: 'Real-Time Analytics', status: 'healthy', latency: '14ms', messages: 1089 },
    { id: 6, screen: 'User Profile Hub', status: 'healthy', latency: '11ms', messages: 756 }
  ]);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick += 1;
      setSubscriptions((prev) =>
        prev?.map((sub, idx) => {
          const offset = (tick + idx) % 7;
          const latencyMs = 10 + offset * 4;
          return {
            ...sub,
            latency: `${latencyMs}ms`,
            messages: sub?.messages + ((tick + idx) % 3),
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Subscription Health</h2>
            <p className="text-sm text-gray-600">Real-time connection monitoring across all screens</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">98.3% Uptime</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {subscriptions?.map((sub) => (
          <div
            key={sub?.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(sub?.status)}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{sub?.screen}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {sub?.messages?.toLocaleString()} messages processed
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{sub?.latency}</div>
                <div className="text-xs text-gray-600">Latency</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sub?.status)}`}>
                {sub?.status?.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">115</div>
            <div className="text-xs text-gray-600">Healthy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-xs text-gray-600">Warning</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-xs text-gray-600">Error</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHealthPanel;