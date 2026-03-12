import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useNavigate, Link } from 'react-router-dom';

const NotificationCard = ({
  notification,
  isSelected,
  onSelect,
  onMarkRead,
  onArchive,
  onDelete
}) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    const iconMap = {
      vote: { icon: 'Vote', color: 'text-blue-500' },
      message_received: { icon: 'MessageCircle', color: 'text-green-500' },
      achievement_unlocked: { icon: 'Award', color: 'text-yellow-500' },
      election_created: { icon: 'Plus', color: 'text-purple-500' },
      election_completed: { icon: 'CheckCircle', color: 'text-indigo-500' },
      post_liked: { icon: 'Heart', color: 'text-red-500' },
      post_commented: { icon: 'MessageSquare', color: 'text-orange-500' },
      post_shared: { icon: 'Share2', color: 'text-teal-500' },
      new_follower: { icon: 'UserPlus', color: 'text-pink-500' },
      friend_request_accepted: { icon: 'Users', color: 'text-cyan-500' },
      content_removed: { icon: 'ShieldAlert', color: 'text-amber-500' }
    };

    return iconMap?.[type] || { icon: 'Bell', color: 'text-gray-500' };
  };

  const handleNavigate = () => {
    const type = notification?.activityType ?? notification?.type;
    const refId = notification?.referenceId;

    if (type === 'content_removed') {
      navigate('/content-removed-appeal');
    } else if (type === 'message_received') {
      navigate('/direct-messaging-center');
    } else if (type === 'vote' || type?.includes('election')) {
      navigate('/elections-dashboard');
    } else if (type === 'achievement_unlocked') {
      navigate('/user-profile-hub');
    } else if (type?.includes('post')) {
      navigate('/home-feed-dashboard');
    }

    if (!notification?.isRead) {
      onMarkRead();
    }
  };

  const iconConfig = getNotificationIcon(notification?.activityType);
  const timeAgo = getTimeAgo(notification?.createdAt);

  return (
    <div
      className={`bg-card rounded-lg border transition-all duration-200 ${
        notification?.isRead
          ? 'border-border' :'border-primary/30 bg-primary/5'
      } ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onChange={() => onSelect(notification?.id)}
          />

          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              notification?.isRead ? 'bg-muted' : 'bg-primary/10'
            }`}
          >
            <Icon name={iconConfig?.icon} size={20} className={iconConfig?.color} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4
                className={`font-semibold text-sm cursor-pointer hover:text-primary transition-colors ${
                  notification?.isRead ? 'text-foreground' : 'text-foreground'
                }`}
                onClick={handleNavigate}
              >
                {notification?.title}
              </h4>
              {!notification?.isRead && (
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></span>
              )}
            </div>

            {notification?.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {notification?.description}
              </p>
            )}

            {notification?.actor && (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                  {notification?.actor?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">
                  {notification?.actor?.name}
                  {notification?.actor?.verified && (
                    <Icon name="BadgeCheck" size={12} className="inline ml-1 text-primary" />
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <Icon name="Clock" size={12} />
              <span>{timeAgo}</span>
              {(notification?.activityType === 'content_removed' || notification?.type === 'content_removed') && (
                <Link
                  to="/content-removed-appeal"
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Appeal
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!notification?.isRead && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Check"
                onClick={onMarkRead}
                title="Mark as read"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName="Archive"
              onClick={onArchive}
              title="Archive"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={onDelete}
              title="Delete"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date?.toLocaleDateString();
}

export default NotificationCard;
