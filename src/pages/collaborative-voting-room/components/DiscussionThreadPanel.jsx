import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DiscussionThreadPanel = ({ messages = [], onSendMessage, onReaction, onModerate }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const messagesEndRef = useRef(null);

  const emojis = ['👍', '❤️', '😂', '😮', '👏', '💯', '🔥', '🎉'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (newMessage?.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">Group Discussion</h2>
        <p className="text-sm text-muted-foreground">Share your thoughts and deliberate with the group</p>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div key={message?.id} className="group">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {message?.userName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground text-sm">{message?.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message?.timestamp)?.toLocaleTimeString()}
                  </span>
                  {message?.pinned && (
                    <Icon name="Pin" className="w-3 h-3 text-primary" />
                  )}
                </div>
                <p className="text-sm text-foreground mb-2">{message?.content}</p>
                
                {/* Reactions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {message?.reactions?.map((reaction, idx) => (
                    <button
                      key={idx}
                      className="px-2 py-1 bg-accent hover:bg-accent/80 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
                      onClick={() => onReaction?.(message?.id, reaction?.emoji)}
                    >
                      <span>{reaction?.emoji}</span>
                      <span className="text-muted-foreground">{reaction?.count}</span>
                    </button>
                  ))}
                  <button
                    className="px-2 py-1 hover:bg-accent rounded-full transition-colors"
                    onClick={() => setShowEmojiPicker(showEmojiPicker === message?.id ? null : message?.id)}
                  >
                    <Icon name="Smile" className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {onModerate && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        className="p-1 hover:bg-accent rounded transition-colors"
                        onClick={() => onModerate?.(message?.id, 'pin')}
                        title="Pin message"
                      >
                        <Icon name="Pin" className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                        onClick={() => onModerate?.(message?.id, 'delete')}
                        title="Delete message"
                      >
                        <Icon name="Trash2" className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker === message?.id && (
                  <div className="mt-2 p-2 bg-background border border-border rounded-lg shadow-lg flex gap-1">
                    {emojis?.map((emoji) => (
                      <button
                        key={emoji}
                        className="p-2 hover:bg-accent rounded transition-colors text-lg"
                        onClick={() => {
                          onReaction?.(message?.id, emoji);
                          setShowEmojiPicker(null);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage?.trim()}
            className="self-end"
          >
            <Icon name="Send" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThreadPanel;