import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { messagingService } from '../../services/messagingService';
import { useAuth } from '../../contexts/AuthContext';
import ThreadList from '../../pages/direct-messaging-center/components/ThreadList';
import ConversationPanel from '../../pages/direct-messaging-center/components/ConversationPanel';
import { DIRECT_MESSAGING_CENTER_ROUTE } from '../../constants/navigationHubRoutes';

const CompactMessagingView = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('threads'); // 'threads' or 'conversation'
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadThreads();
    const unsubscribeThreads = messagingService?.subscribeToThreads(() => loadThreads());
    return () => unsubscribeThreads?.();
  }, []);

  useEffect(() => {
    if (selectedThread?.id) {
      loadMessages(selectedThread?.id);
      const unsubscribeMessages = messagingService?.subscribeToMessages(selectedThread?.id, (payload) => {
        if (payload?.eventType === 'INSERT') {
          setMessages((prev) => [...prev, payload?.new]);
        }
      });
      return () => unsubscribeMessages?.();
    }
  }, [selectedThread?.id]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      const { data, error: threadsError } = await messagingService?.getThreads();
      if (threadsError) throw new Error(threadsError?.message);
      setThreads(data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId) => {
    try {
      const { data, error: messagesError } = await messagingService?.getMessages(threadId);
      if (messagesError) throw new Error(messagesError?.message);
      setMessages(data || []);
    } catch (err) {
      setError(err?.message);
    }
  };

  const MOCK_THREADS = [
    {
      id: 'mock-thread-1',
      lastMessageContent: 'Welcome to Vottery! Let us know if you have any questions.',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 1,
      participantOne: { id: 'system', name: 'Vottery Support', username: 'support', avatar: null },
      participantTwo: { id: user?.id, name: 'You' }
    },
    {
      id: 'mock-thread-2',
      lastMessageContent: 'Hey, that latest election was intense! 🗳️',
      lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 0,
      participantOne: { id: 'mock-user-1', name: 'Sarah Johnson', username: 'sarahj', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      participantTwo: { id: user?.id, name: 'You' }
    }
  ];

  const displayedThreads = threads?.length > 0 ? threads : MOCK_THREADS;

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setView('conversation');
    if (thread.id.startsWith('mock-')) {
      setMessages([
        { id: 'm1', content: 'Hi there!', senderId: thread.participantOne.id, createdAt: thread.lastMessageAt, sender: thread.participantOne },
        { id: 'm2', content: thread.lastMessageContent, senderId: thread.participantOne.id, createdAt: thread.lastMessageAt, sender: thread.participantOne }
      ]);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedThread?.id || !content?.trim()) return;
    if (selectedThread.id.startsWith('mock-')) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), content: content?.trim(), senderId: user?.id, createdAt: new Date().toISOString(), sender: { name: 'You' } }
      ]);
      return;
    }
    try {
      const { error: sendError } = await messagingService?.sendMessage(selectedThread?.id, content?.trim());
      if (sendError) throw new Error(sendError?.message);
    } catch (err) {
      setError(err?.message);
    }
  };

  const getOtherParticipant = (thread) => {
    if (!thread || !user) return null;
    if (thread.id.startsWith('mock-')) return thread.participantOne.id === user?.id ? thread.participantTwo : thread.participantOne;
    return thread?.participantOne?.id === user?.id
      ? thread?.participantTwo
      : thread?.participantOne;
  };

  const handleViewFullCenter = () => {
    navigate(DIRECT_MESSAGING_CENTER_ROUTE);
    onClose();
  };

  if (loading && threads?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {view === 'threads' ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {(error || threads?.length === 0) && (
              <div className="m-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Info" size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-blue-900 dark:text-blue-100 text-xs font-semibold mb-0.5">
                    {error ? "Live sync temporarily unavailable" : "No messages yet"}
                  </p>
                  <p className="text-blue-700/70 dark:text-blue-400/70 text-[11px] leading-relaxed">
                    Showing preview conversations for display purposes. You can still browse the interface.
                  </p>
                </div>
              </div>
            )}
            <ThreadList
              threads={displayedThreads}
              selectedThread={selectedThread}
              onThreadSelect={handleThreadSelect}
              currentUserId={user?.id}
              getOtherParticipant={getOtherParticipant}
            />
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <Button
              variant="outline"
              className="w-full justify-center text-primary border-primary/20 hover:bg-primary/5"
              onClick={handleViewFullCenter}
            >
              Go to Messaging Center
            </Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col h-full relative">
          <div className="absolute top-0 left-0 right-0 z-20 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <button
               onClick={() => setView('threads')}
               className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={16} className="text-primary" />
               </div>
               <span className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
                  {getOtherParticipant(selectedThread)?.name || 'Conversation'}
               </span>
            </div>
          </div>
          <div className="flex-1 pt-12 overflow-hidden flex flex-col">
            <ConversationPanel
              thread={selectedThread}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id}
              otherParticipant={getOtherParticipant(selectedThread)}
              compact={true}
              onBack={() => setView('threads')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactMessagingView;
