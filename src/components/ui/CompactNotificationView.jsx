import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { notificationService } from '../../services/notificationService';
import NotificationCard from '../../pages/notification-center-hub/components/NotificationCard';
import { NOTIFICATION_CENTER_HUB_ROUTE } from '../../constants/navigationHubRoutes';

const CompactNotificationView = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data, error: notifError } = await notificationService?.getNotifications({
        category: 'all',
        readStatus: 'all',
        sortBy: 'newest',
        limit: 10
      });

      if (notifError) throw new Error(notifError.message);
      setNotifications(data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsubscribe = notificationService?.subscribeToNotifications(() => {
      loadNotifications();
    });
    return () => unsubscribe?.();
  }, []);

  const handleViewAll = () => {
    navigate(NOTIFICATION_CENTER_HUB_ROUTE);
    onClose();
  };

  const MOCK_NOTIFICATIONS = [
    {
      id: 'mock-1',
      activityType: 'message_received',
      title: 'New Message from Vottery Support',
      description: 'Welcome to Vottery! Let us know if you have any questions about the platform.',
      createdAt: new Date().toISOString(),
      isRead: false,
      actor: { name: 'Vottery Support', avatar: null, verified: true }
    },
    {
      id: 'mock-2',
      activityType: 'achievement_unlocked',
      title: 'Achievement Unlocked: First Vote!',
      description: 'You just earned 50 VP for participating in your first election.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      actor: { name: 'System', avatar: null, verified: true }
    },
    {
      id: 'mock-3',
      activityType: 'vote',
      title: 'Live Election Update',
      description: 'The "Best AI Tech of 2026" election is closing in 2 hours. Cast your vote!',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      isRead: false,
      actor: { name: 'Elections Bot', avatar: null, verified: true }
    }
  ];

  const displayedNotifications = notifications?.length > 0 ? notifications : MOCK_NOTIFICATIONS;

  if (loading && notifications?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-1 space-y-3">
        {(error || notifications?.length === 0) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="Info" size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-blue-900 dark:text-blue-100 text-xs font-semibold mb-0.5">
                {error ? "Live notifications temporarily limited" : "No recent activity"}
              </p>
              <p className="text-blue-700/70 dark:text-blue-400/70 text-[11px] leading-relaxed">
                Showing preview alerts for display purposes. Live status will restore automatically.
              </p>
            </div>
          </div>
        )}

        {displayedNotifications?.map((notification) => (
          <NotificationCard
            key={notification?.id}
            notification={notification}
            onMarkRead={() => loadNotifications()}
            onArchive={() => loadNotifications()}
            onDelete={() => loadNotifications()}
            onSelect={() => {}} 
            isSelected={false}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 sticky bottom-0">
        <Button
          variant="outline"
          className="w-full justify-center text-primary border-primary/20 hover:bg-primary/5"
          onClick={handleViewAll}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default CompactNotificationView;
