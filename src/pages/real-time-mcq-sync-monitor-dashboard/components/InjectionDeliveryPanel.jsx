import React from 'react';
import { Send, Users, CheckCircle, TrendingUp, Radio } from 'lucide-react';

const InjectionDeliveryPanel = ({ deliveryData = null, loading = false }) => {
  const broadcasts = deliveryData?.recentBroadcasts || [];
  const overallDeliveryRate = deliveryData?.overallDeliveryRate || 0;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Live Injection Delivery</h3>
          <p className="text-gray-400 text-sm">Broadcast delivery metrics & engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <p className="text-gray-400 text-sm">Total Broadcasts</p>
          </div>
          <p className="text-white text-2xl font-bold">{deliveryData?.totalBroadcasts || 0}</p>
        </div>
        <div className="p-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-gray-400 text-sm">Delivery Rate</p>
          </div>
          <p className={`text-2xl font-bold ${overallDeliveryRate >= 95 ? 'text-green-400' : overallDeliveryRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
            {Math.round(overallDeliveryRate)}%
          </p>
        </div>
        <div className="p-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <p className="text-gray-400 text-sm">Total Recipients</p>
          </div>
          <p className="text-white text-2xl font-bold">{deliveryData?.totalRecipients?.toLocaleString() || 0}</p>
        </div>
        <div className="p-4 bg-gray-700/50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <p className="text-gray-400 text-sm">Engagement Rate</p>
          </div>
          <p className="text-white text-2xl font-bold">{Math.round(deliveryData?.engagementRate || 0)}%</p>
        </div>
      </div>

      <div>
        <p className="text-gray-400 text-sm font-medium mb-3">Recent Broadcasts</p>
        {broadcasts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Radio className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No recent broadcasts</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {broadcasts?.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-white text-sm font-medium truncate">{b?.questionText || `Broadcast ${i + 1}`}</p>
                  <p className="text-gray-400 text-xs">{b?.recipients || 0} recipients • {new Date(b?.broadcastAt || Date.now())?.toLocaleTimeString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-600 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${(b?.deliveryRate || 0) >= 95 ? 'bg-green-400' : (b?.deliveryRate || 0) >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${b?.deliveryRate || 0}%` }}></div>
                  </div>
                  <span className="text-white text-xs font-bold w-10 text-right">{Math.round(b?.deliveryRate || 0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InjectionDeliveryPanel;
