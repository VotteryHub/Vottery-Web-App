import React from 'react';
import Icon from '../../../components/AppIcon';
import { formatDistanceToNow } from 'date-fns';

const ThreadList = ({ threads, selectedThread, onThreadSelect, currentUserId, getOtherParticipant }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {threads?.map((thread) => {
        const otherUser = getOtherParticipant(thread);
        const isSelected = selectedThread?.id === thread?.id;

        return (
          <div
            key={thread?.id}
            onClick={() => onThreadSelect(thread)}
            className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
              isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar with online status */}
              <div className="relative flex-shrink-0">
                {otherUser?.avatar ? (
                  <img
                    src={otherUser?.avatar}
                    alt={otherUser?.name || 'User avatar'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                )}
                {/* Online status indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              {/* Thread info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {otherUser?.name || 'Unknown User'}
                    </h3>
                    {otherUser?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {formatTime(thread?.lastMessageAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {thread?.lastMessageContent || 'No messages yet'}
                </p>
              </div>

              {/* Unread badge */}
              {thread?.unreadCount > 0 && (
                <div className="flex-shrink-0 ml-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                    {thread?.unreadCount > 9 ? '9+' : thread?.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ThreadList;