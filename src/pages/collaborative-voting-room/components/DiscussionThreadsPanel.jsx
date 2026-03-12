import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DiscussionThreadsPanel = ({ discussions, participants, onRefresh }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);

  const handlePostMessage = async () => {
    if (!newMessage?.trim()) return;
    
    try {
      // Simulate message posting
      await new Promise(resolve => setTimeout(resolve, 300));
      onRefresh?.();
      setNewMessage('');
    } catch (error) {
      console.error('Failed to post message:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name="MessageSquare" size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Discussion Threads</h2>
                <p className="text-sm text-muted-foreground">
                  {discussions?.length} active conversations
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {discussions?.map((discussion) => (
              <div key={discussion?.id} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{discussion?.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(discussion?.timestamp)?.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{discussion?.content}</p>
                    <div className="flex items-center gap-3">
                      {discussion?.reactions?.map((reaction, idx) => (
                        <button
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-card rounded-full hover:bg-primary/10 transition-colors"
                        >
                          <span>{reaction?.emoji}</span>
                          <span className="text-xs font-medium text-muted-foreground">
                            {reaction?.count}
                          </span>
                        </button>
                      ))}
                      <button className="text-xs text-primary hover:underline">
                        {discussion?.replies} replies
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handlePostMessage()}
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handlePostMessage}
              disabled={!newMessage?.trim()}
              iconName="Send"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Active Participants</h3>
          <div className="space-y-3">
            {participants?.filter(p => p?.status === 'online')?.map((participant) => (
              <div key={participant?.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{participant?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{participant?.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThreadsPanel;