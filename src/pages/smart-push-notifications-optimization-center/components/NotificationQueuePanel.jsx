import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const NotificationQueuePanel = ({ userId }) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, [userId]);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const { data } = await supabase?.from('notifications')?.select('*')?.eq('user_id', userId)?.eq('is_read', false)?.order('created_at', { ascending: false })?.limit(20);
      setQueue(data || []);
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const mockScheduled = [
    { id: 1, type: 'votes', title: 'Election ending soon', scheduledAt: new Date(Date.now() + 3600000)?.toISOString(), status: 'scheduled', confidence: 87 },
    { id: 2, type: 'achievements', title: 'New badge unlocked!', scheduledAt: new Date(Date.now() + 7200000)?.toISOString(), status: 'scheduled', confidence: 92 },
    { id: 3, type: 'messages', title: 'New message from creator', scheduledAt: new Date(Date.now() + 1800000)?.toISOString(), status: 'pending', confidence: 74 }
  ];

  return (
    <div className="space-y-6">
      {/* Scheduled Queue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Clock" size={20} className="text-blue-500" />
            Scheduled Notifications
          </h3>
          <span className="text-sm text-muted-foreground">{mockScheduled?.length} pending</span>
        </div>
        <div className="space-y-3">
          {mockScheduled?.map(item => (
            <div key={item?.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item?.type === 'votes' ? 'bg-purple-100 text-purple-600' :
                item?.type === 'achievements'? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
              }`}>
                <Icon name={item?.type === 'votes' ? 'Vote' : item?.type === 'achievements' ? 'Award' : 'MessageCircle'} size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item?.title}</p>
                <p className="text-xs text-muted-foreground">
                  Scheduled: {new Date(item.scheduledAt)?.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item?.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{item?.status}</span>
                <p className="text-xs text-muted-foreground mt-1">{item?.confidence}% confidence</p>
              </div>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Unread Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-orange-500" />
            Unread Notifications
          </h3>
          <button onClick={loadQueue} className="text-sm text-primary hover:underline">Refresh</button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader" size={32} className="animate-spin text-primary" />
          </div>
        ) : queue?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={40} className="mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">All caught up! No unread notifications.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue?.slice(0, 10)?.map(notif => (
              <div key={notif?.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{notif?.title || notif?.message}</p>
                  <p className="text-xs text-muted-foreground">{new Date(notif.created_at)?.toLocaleString()}</p>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{notif?.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationQueuePanel;
