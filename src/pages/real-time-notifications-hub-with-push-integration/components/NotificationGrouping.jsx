import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const NotificationGrouping = ({ notifications }) => {
  const [groupedNotifications, setGroupedNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notifications?.length > 0) {
      groupNotifications();
    }
  }, [notifications]);

  const groupNotifications = async () => {
    setLoading(true);
    try {
      // Group by activity type and time window
      const groups = {};
      const now = new Date();
      
      notifications?.forEach((notification) => {
        const notifTime = new Date(notification?.createdAt);
        const hoursDiff = (now - notifTime) / (1000 * 60 * 60);
        
        // Group notifications within 1 hour window
        if (hoursDiff <= 1) {
          const key = notification?.activityType;
          if (!groups?.[key]) {
            groups[key] = [];
          }
          groups?.[key]?.push(notification);
        }
      });

      // Convert to array and sort by count
      const groupedArray = Object.entries(groups)?.map(([type, items]) => ({
          type,
          count: items?.length,
          notifications: items,
          urgency: calculateUrgency(type, items?.length)
        }))?.sort((a, b) => b?.urgency - a?.urgency);

      setGroupedNotifications(groupedArray);
    } catch (error) {
      console.error('Failed to group notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUrgency = (type, count) => {
    const urgencyMap = {
      vote: 3,
      message_received: 5,
      achievement_unlocked: 2,
      election_created: 4,
      election_completed: 4,
      post_liked: 1,
      post_commented: 2,
      post_shared: 1
    };
    return (urgencyMap?.[type] || 1) * Math.log(count + 1);
  };

  const getGroupIcon = (type) => {
    const iconMap = {
      vote: { icon: 'Vote', color: 'text-blue-500' },
      message_received: { icon: 'MessageCircle', color: 'text-green-500' },
      achievement_unlocked: { icon: 'Award', color: 'text-yellow-500' },
      election_created: { icon: 'Plus', color: 'text-purple-500' },
      election_completed: { icon: 'CheckCircle', color: 'text-indigo-500' },
      post_liked: { icon: 'Heart', color: 'text-red-500' },
      post_commented: { icon: 'MessageSquare', color: 'text-orange-500' },
      post_shared: { icon: 'Share2', color: 'text-teal-500' }
    };
    return iconMap?.[type] || { icon: 'Bell', color: 'text-gray-500' };
  };

  const getGroupLabel = (type) => {
    const labelMap = {
      vote: 'Votes',
      message_received: 'Messages',
      achievement_unlocked: 'Achievements',
      election_created: 'New Elections',
      election_completed: 'Completed Elections',
      post_liked: 'Post Likes',
      post_commented: 'Comments',
      post_shared: 'Shares'
    };
    return labelMap?.[type] || type;
  };

  const getUrgencyLabel = (urgency) => {
    if (urgency >= 10) return { label: 'High Priority', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (urgency >= 5) return { label: 'Medium Priority', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    return { label: 'Low Priority', color: 'text-blue-500', bg: 'bg-blue-500/10' };
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Layers" size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Intelligent Grouping</h3>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : groupedNotifications?.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No recent activity to group
        </p>
      ) : (
        <div className="space-y-3">
          {groupedNotifications?.map((group) => {
            const iconConfig = getGroupIcon(group?.type);
            const urgencyConfig = getUrgencyLabel(group?.urgency);
            
            return (
              <div
                key={group?.type}
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                    <Icon name={iconConfig?.icon} size={20} className={iconConfig?.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {getGroupLabel(group?.type)}
                      </span>
                      <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                        {group?.count}
                      </span>
                    </div>
                    <div className={`text-xs ${urgencyConfig?.color}`}>
                      {urgencyConfig?.label}
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Sparkles" size={16} className="text-blue-500 mt-0.5" />
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <span className="font-semibold">AI-Powered Grouping:</span> Notifications are automatically categorized by urgency and user context
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationGrouping;