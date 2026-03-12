import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageReactions = ({ message, currentUserId, onAddReaction, onRemoveReaction }) => {
  const [showPicker, setShowPicker] = useState(false);
  const commonEmojis = ['❤️', '👍', '😂', '😢', '😮', '🔥', '🎉', '👏'];

  const reactions = message?.reactions || [];
  const reactionCounts = reactions?.reduce((acc, r) => {
    acc[r?.reactionEmoji] = (acc?.[r?.reactionEmoji] || 0) + 1;
    return acc;
  }, {});

  const userReactions = reactions?.filter(r => r?.userId === currentUserId)?.map(r => r?.reactionEmoji) || [];

  const handleReactionClick = (emoji) => {
    if (userReactions?.includes(emoji)) {
      onRemoveReaction(message?.id, emoji);
    } else {
      onAddReaction(message?.id, emoji);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {/* Existing Reactions */}
      {Object.keys(reactionCounts)?.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mt-1">
          {Object.entries(reactionCounts)?.map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-all duration-200 ${
                userReactions?.includes(emoji)
                  ? 'bg-primary/20 border border-primary text-primary' :'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{emoji}</span>
              <span className="font-medium">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Add Reaction Button */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Icon name="Smile" size={16} className="text-gray-500 dark:text-gray-400" />
        </button>

        {/* Emoji Picker */}
        {showPicker && (
          <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
            <div className="flex gap-1">
              {commonEmojis?.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;