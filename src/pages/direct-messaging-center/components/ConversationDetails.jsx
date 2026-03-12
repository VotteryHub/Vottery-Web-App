import React from 'react';
import Icon from '../../../components/AppIcon';

const ConversationDetails = ({ thread, otherParticipant, onClose }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Conversation Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Participant Profile */}
        <div className="text-center">
          {otherParticipant?.avatar ? (
            <img
              src={otherParticipant?.avatar}
              alt={otherParticipant?.name || 'User avatar'}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Icon name="User" size={32} className="text-primary" />
            </div>
          )}
          <div className="flex items-center justify-center gap-1 mb-1">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {otherParticipant?.name || 'Unknown User'}
            </h4>
            {otherParticipant?.verified && (
              <Icon name="BadgeCheck" size={18} className="text-blue-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">@{otherParticipant?.username || 'username'}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Profile</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Bell" size={20} className="text-primary" />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Mute</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Search" size={20} className="text-primary" />
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">Search</span>
          </button>
        </div>

        {/* Shared Media */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Shared Media</h4>
            <button className="text-sm text-primary hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6]?.map((item) => (
              <div
                key={item}
                className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
              >
                <Icon name="Image" size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Settings</h4>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
            <Icon name="Lock" size={20} className="text-gray-600 dark:text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Encryption</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">End-to-end encrypted</p>
            </div>
            <Icon name="Check" size={20} className="text-green-500" />
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
            <Icon name="Archive" size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Archive Chat</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left">
            <Icon name="Trash2" size={20} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">Delete Conversation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetails;