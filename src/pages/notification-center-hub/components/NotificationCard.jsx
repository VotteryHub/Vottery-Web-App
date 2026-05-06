import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useNavigate, Link } from 'react-router-dom';
import { DIRECT_MESSAGING_CENTER_ROUTE } from '../../../constants/navigationHubRoutes';

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
      navigate(DIRECT_MESSAGING_CENTER_ROUTE);
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
      <div className="p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="pt-1">
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect(notification?.id)}
            />
          </div>

          <div
            className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              notification?.isRead ? 'bg-muted' : 'bg-primary/10'
            }`}
          >
            <Icon name={iconConfig?.icon} size={18} className={`${iconConfig?.color} md:size-20`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1 mb-0.5">
              <h4
                className={`font-semibold text-sm md:text-base cursor-pointer hover:text-primary transition-colors leading-tight ${
                  notification?.isRead ? 'text-foreground/80' : 'text-foreground'
                }`}
                onClick={handleNavigate}
              >
                {notification?.title}
              </h4>
              {!notification?.isRead && (
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5"></span>
              )}
            </div>

            {notification?.description && (
              <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2 md:line-clamp-none">
                {notification?.description}
              </p>
            )}

            {notification?.actor && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] md:text-xs font-bold">
                  {notification?.actor?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-[11px] md:text-xs text-muted-foreground font-medium">
                  {notification?.actor?.name}
                  {notification?.actor?.verified && (
                    <Icon name="BadgeCheck" size={12} className="inline ml-0.5 text-blue-500" />
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                <span>{timeAgo}</span>
              </div>
              {(notification?.activityType === 'content_removed' || notification?.type === 'content_removed') && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <Link
                    to="/content-removed-appeal"
                    className="text-primary hover:underline font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Appeal Record
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-0.5 md:gap-1">
            {!notification?.isRead && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Check"
                onClick={onMarkRead}
                title="Mark as read"
                className="hover:text-primary hover:bg-primary/10"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName="Archive"
              onClick={onArchive}
              title="Archive"
              className="hover:text-amber-500 hover:bg-amber-500/10"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              onClick={onDelete}
              title="Delete"
              className="hover:text-red-500 hover:bg-red-500/10"
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
