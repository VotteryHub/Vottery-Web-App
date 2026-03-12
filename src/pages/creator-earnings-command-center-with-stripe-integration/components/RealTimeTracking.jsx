import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, DollarSign, Zap } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const RealTimeTracking = () => {
  const [realtimeData, setRealtimeData] = useState({
    currentEarnings: 0,
    transactionsPerSecond: 0,
    activePayouts: 0,
    processingQueue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        currentEarnings: prev?.currentEarnings + Math.random() * 50,
        transactionsPerSecond: Math.floor(Math.random() * 10),
        activePayouts: Math.floor(Math.random() * 5) + 3,
        processingQueue: Math.floor(Math.random() * 15) + 5
      }));

      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        type: ['winning', 'bonus', 'referral']?.[Math.floor(Math.random() * 3)],
        amount: (Math.random() * 100 + 10)?.toFixed(2),
        timestamp: new Date()?.toISOString()
      };

      setRecentTransactions(prev => [newTransaction, ...prev?.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    {
      label: 'Current Earnings',
      value: `$${realtimeData?.currentEarnings?.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Transactions/Second',
      value: realtimeData?.transactionsPerSecond,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Payouts',
      value: realtimeData?.activePayouts,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Processing Queue',
      value: realtimeData?.processingQueue,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics?.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric?.bgColor}`}>
                <Icon icon={metric?.icon} className={`w-5 h-5 ${metric?.color}`} />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric?.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric?.value}</p>
          </div>
        ))}
      </div>

      {/* Live Transaction Feed */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Live Transaction Feed</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time updates</span>
          </div>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {recentTransactions?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Icon icon={Activity} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Waiting for transactions...</p>
            </div>
          ) : (
            recentTransactions?.map((transaction) => (
              <div key={transaction?.id} className="px-6 py-3 hover:bg-gray-50 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{transaction?.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction?.timestamp)?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-600">+${transaction?.amount}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Earnings Accumulation Chart */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Accumulation (Last 15 seconds)</h3>
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-end justify-between h-32">
            {[...Array(15)]?.map((_, i) => (
              <div
                key={i}
                className="bg-green-500 rounded-t w-4"
                style={{ height: `${Math.random() * 100}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTracking;
