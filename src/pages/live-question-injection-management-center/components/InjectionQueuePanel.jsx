import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  broadcasted: 'bg-green-100 text-green-700 border-green-200',
  failed: 'bg-red-100 text-red-700 border-red-200'
};

const STATUS_ICONS = {
  pending: 'Clock',
  scheduled: 'Calendar',
  broadcasted: 'Radio',
  failed: 'AlertCircle'
};

const InjectionQueuePanel = ({ queue = [], onBroadcast, onRefresh, loading }) => {
  const [broadcastingId, setBroadcastingId] = useState(null);

  const handleBroadcast = async (item) => {
    setBroadcastingId(item?.id);
    try {
      await onBroadcast?.(item);
    } finally {
      setBroadcastingId(null);
    }
  };

  const grouped = {
    pending: queue?.filter(q => q?.status === 'pending') || [],
    scheduled: queue?.filter(q => q?.status === 'scheduled') || [],
    broadcasted: queue?.filter(q => q?.status === 'broadcasted') || []
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Icon name="List" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Injection Queue</h3>
            <p className="text-xs text-muted-foreground">{queue?.length || 0} total questions</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="RefreshCw" size={16} className={`text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Object.entries(grouped)?.map(([status, items]) => (
          <div key={status} className={`rounded-lg p-3 border ${STATUS_COLORS?.[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name={STATUS_ICONS?.[status] || 'Circle'} size={14} />
              <span className="text-xs font-medium capitalize">{status}</span>
            </div>
            <p className="text-2xl font-bold">{items?.length}</p>
          </div>
        ))}
      </div>
      {/* Queue Items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {queue?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-muted-foreground text-sm">No questions in queue</p>
          </div>
        ) : (
          queue?.map(item => (
            <div key={item?.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item?.questionText || 'Untitled Question'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS?.[item?.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {item?.status}
                    </span>
                    {item?.scheduledFor && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(item?.scheduledFor)?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {item?.status === 'pending' && (
                  <button
                    onClick={() => handleBroadcast(item)}
                    disabled={broadcastingId === item?.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {broadcastingId === item?.id ? (
                      <Icon name="Loader" size={12} className="animate-spin" />
                    ) : (
                      <Icon name="Radio" size={12} />
                    )}
                    Broadcast
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InjectionQueuePanel;
