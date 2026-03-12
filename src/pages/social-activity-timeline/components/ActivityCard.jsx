import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useNavigate } from 'react-router-dom';

const ActivityCard = ({ activity, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date?.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      vote: 'Vote',
      election_created: 'Plus',
      election_completed: 'CheckCircle',
      achievement_unlocked: 'Trophy',
      friend_request_accepted: 'UserPlus',
      post_liked: 'Heart',
      post_commented: 'MessageCircle',
      post_shared: 'Share2',
      new_follower: 'Users',
      message_received: 'Mail'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      vote: 'text-blue-500 bg-blue-500/10',
      election_created: 'text-purple-500 bg-purple-500/10',
      election_completed: 'text-green-500 bg-green-500/10',
      achievement_unlocked: 'text-yellow-500 bg-yellow-500/10',
      friend_request_accepted: 'text-primary bg-primary/10',
      post_liked: 'text-red-500 bg-red-500/10',
      post_commented: 'text-blue-500 bg-blue-500/10',
      post_shared: 'text-green-500 bg-green-500/10',
      new_follower: 'text-indigo-500 bg-indigo-500/10',
      message_received: 'text-pink-500 bg-pink-500/10'
    };
    return colorMap?.[type] || 'text-gray-500 bg-gray-500/10';
  };

  const handleCardClick = () => {
    if (!activity?.isRead) {
      onMarkAsRead(activity?.id);
    }

    // Navigate based on reference type
    if (activity?.referenceType === 'election' && activity?.referenceId) {
      navigate(`/secure-voting-interface?election=${activity?.referenceId}`);
    } else if (activity?.referenceType === 'post' && activity?.referenceId) {
      navigate('/home-feed-dashboard');
    } else if (activity?.referenceType === 'friend_request') {
      navigate('/friends-management-hub');
    }
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    onDelete(activity?.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card p-4 md:p-6 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.01] ${
        !activity?.isRead ? 'bg-primary/5 border-primary/20' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Activity Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            getActivityColor(activity?.activityType)
          }`}
        >
          <Icon name={getActivityIcon(activity?.activityType)} size={24} />
        </div>

        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              {/* Actor Info */}
              {activity?.actor && (
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={activity?.actor?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                    alt={`${activity?.actor?.name || 'User'} profile picture`}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm text-foreground">
                    {activity?.actor?.name || 'Someone'}
                  </span>
                  {activity?.actor?.verified && (
                    <Icon name="BadgeCheck" size={14} className="text-primary" />
                  )}
                </div>
              )}

              {/* Activity Title */}
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {activity?.title}
              </h3>

              {/* Activity Description */}
              {activity?.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity?.description}
                </p>
              )}

              {/* Metadata */}
              {activity?.metadata && Object.keys(activity?.metadata)?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {activity?.metadata?.category && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md text-muted-foreground">
                      {activity?.metadata?.category}
                    </span>
                  )}
                  {activity?.metadata?.prizePool && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-xs rounded-md text-green-600 dark:text-green-400 font-semibold">
                      {activity?.metadata?.prizePool}
                    </span>
                  )}
                  {activity?.metadata?.rarity && (
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-xs rounded-md text-yellow-600 dark:text-yellow-400 font-semibold capitalize">
                      {activity?.metadata?.rarity}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!activity?.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Delete activity"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Icon name="Clock" size={12} />
            <span>{formatTimeAgo(activity?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;