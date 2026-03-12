import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationToast = ({ notification, onDismiss, onMarkRead }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getNotificationIcon = (type) => {
    const iconMap = {
      vote: { icon: 'Vote', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      message_received: { icon: 'MessageCircle', color: 'text-green-500', bg: 'bg-green-500/10' },
      achievement_unlocked: { icon: 'Award', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
      election_created: { icon: 'Plus', color: 'text-purple-500', bg: 'bg-purple-500/10' },
      election_completed: { icon: 'CheckCircle', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      post_liked: { icon: 'Heart', color: 'text-red-500', bg: 'bg-red-500/10' },
      post_commented: { icon: 'MessageSquare', color: 'text-orange-500', bg: 'bg-orange-500/10' },
      post_shared: { icon: 'Share2', color: 'text-teal-500', bg: 'bg-teal-500/10' }
    };
    return iconMap?.[type] || { icon: 'Bell', color: 'text-gray-500', bg: 'bg-gray-500/10' };
  };

  const iconConfig = getNotificationIcon(notification?.activityType);

  return (
    <div
      className={`bg-card border border-border rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px] transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconConfig?.bg}`}>
          <Icon name={iconConfig?.icon} size={20} className={iconConfig?.color} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">
            {notification?.title}
          </h4>
          {notification?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification?.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            iconName="Check"
            onClick={() => {
              onMarkRead();
              onDismiss();
            }}
            title="Mark as read"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onDismiss}
            title="Dismiss"
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;