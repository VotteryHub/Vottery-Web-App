import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { teamCollaborationService } from '../../../services/teamCollaborationService';

const ThreadedDiscussionsPanel = ({ discussions, onRefresh }) => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleThreadSelect = async (thread) => {
    setSelectedThread(thread);
    setLoading(true);
    const result = await teamCollaborationService?.getThreadMessages(thread?.id);
    setMessages(result?.data || []);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage?.trim() || !selectedThread) return;

    const result = await teamCollaborationService?.postThreadMessage(selectedThread?.id, newMessage);
    if (result?.data) {
      setMessages([...messages, result?.data]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      resolved: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      archived: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    };
    return colors?.[status] || colors?.active;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-blue-600'
    };
    return colors?.[priority] || colors?.medium;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">Strategy Threads</h3>
            <Button size="sm" iconName="Plus">
              New Thread
            </Button>
          </div>

          <div className="space-y-2">
            {discussions?.map((thread) => (
              <button
                key={thread?.id}
                onClick={() => handleThreadSelect(thread)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedThread?.id === thread?.id
                    ? 'border-primary bg-primary/5' :'border-muted hover:border-primary/50 bg-card'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-2 flex-1">{thread?.title}</h4>
                  <Icon name="Flag" size={14} className={`${getPriorityColor(thread?.priority)} ml-2 flex-shrink-0`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(thread?.status)}`}>
                    {thread?.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {thread?.messageCount} messages
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>{thread?.author}</span>
                  <span>•</span>
                  <span>{new Date(thread?.lastActivity)?.toLocaleDateString()}</span>
                </div>
                {thread?.tags && thread?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {thread?.tags?.slice(0, 3)?.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        {selectedThread ? (
          <div className="card h-full flex flex-col">
            <div className="border-b border-muted pb-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{selectedThread?.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="User" size={14} />
                    <span>{selectedThread?.author}</span>
                    <span>•</span>
                    <span>{new Date(selectedThread?.createdAt)?.toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(selectedThread?.status)}`}>
                  {selectedThread?.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Icon name="Users" size={14} className="text-muted-foreground" />
                <div className="flex -space-x-2">
                  {selectedThread?.participants?.map((participant, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold border-2 border-background"
                      title={participant}
                    >
                      {participant?.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Icon name="Loader" size={32} className="text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages?.map((message) => (
                    <div key={message?.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {message?.author?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{message?.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message?.createdAt)?.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2">{message?.content}</p>
                        {message?.attachments && message?.attachments?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {message?.attachments?.map((attachment, index) => (
                              <a
                                key={index}
                                href={attachment?.url}
                                className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg text-xs hover:bg-muted transition-colors"
                              >
                                <Icon name="Paperclip" size={14} className="text-primary" />
                                <span className="text-foreground">{attachment?.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                        {message?.reactions && message?.reactions?.length > 0 && (
                          <div className="flex gap-2">
                            {message?.reactions?.map((reaction, index) => (
                              <button
                                key={index}
                                className="px-2 py-1 bg-muted/50 rounded-full text-xs hover:bg-muted transition-colors"
                              >
                                {reaction?.emoji} {reaction?.count}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-muted pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e?.target?.value)}
                      onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-muted/30 border border-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage} iconName="Send" disabled={!newMessage?.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="card h-full flex items-center justify-center">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a thread to view discussion</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadedDiscussionsPanel;