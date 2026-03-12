import React, { useState, useEffect, useRef } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import ThreadList from './components/ThreadList';
import ConversationPanel from './components/ConversationPanel';
import ConversationDetails from './components/ConversationDetails';
import { messagingService } from '../../services/messagingService';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const DirectMessagingCenter = () => {
  const { user, userProfile } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadThreads();

    const unsubscribeThreads = messagingService?.subscribeToThreads((payload) => {
      if (payload?.eventType === 'INSERT') {
        setThreads((prev) => [payload?.new, ...prev]);
      } else if (payload?.eventType === 'UPDATE') {
        setThreads((prev) =>
          prev?.map((t) => (t?.id === payload?.new?.id ? payload?.new : t))
        );
      } else if (payload?.eventType === 'DELETE') {
        setThreads((prev) => prev?.filter((t) => t?.id !== payload?.old?.id));
      }
    });

    return () => {
      unsubscribeThreads();
    };
  }, []);

  useEffect(() => {
    if (selectedThread?.id) {
      loadMessages(selectedThread?.id);

      const unsubscribeMessages = messagingService?.subscribeToMessages(
        selectedThread?.id,
        (payload) => {
          if (payload?.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload?.new]);
          } else if (payload?.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev?.map((m) => (m?.id === payload?.new?.id ? payload?.new : m))
            );
          } else if (payload?.eventType === 'DELETE') {
            setMessages((prev) => prev?.filter((m) => m?.id !== payload?.old?.id));
          }
        }
      );

      return () => {
        unsubscribeMessages();
      };
    }
  }, [selectedThread?.id]);

  const loadThreads = async () => {
    try {
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

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setShowDetails(false);
  };

  const handleSendMessage = async (content) => {
    if (!selectedThread?.id || !content?.trim()) return;

    try {
      const { error: sendError } = await messagingService?.sendMessage(
        selectedThread?.id,
        content?.trim()
      );
      if (sendError) throw new Error(sendError?.message);
    } catch (err) {
      setError(err?.message);
    }
  };

  const getOtherParticipant = (thread) => {
    if (!thread || !user) return null;
    return thread?.participantOne?.id === user?.id
      ? thread?.participantTwo
      : thread?.participantOne;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <HeaderNavigation />
      <div className="flex relative">
        <LeftSidebar />
        <main className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72 relative z-10 min-w-0">
          <div className="h-[calc(100vh-4rem)] flex gap-4 px-4 md:px-6">
            {/* Left Panel - Thread List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col relative z-0">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative z-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Messages
                </h1>
              </div>
              {loading ? (
                <div className="flex-1 flex items-center justify-center relative z-0">
                  <div className="text-center">
                    <Icon name="Loader" size={48} className="animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-gray-500 dark:text-gray-400">Loading conversations...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center p-4 relative z-0">
                  <div className="text-center">
                    <Icon name="AlertCircle" size={48} className="mx-auto mb-3 text-red-500" />
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                  </div>
                </div>
              ) : threads?.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4 relative z-0">
                  <div className="text-center">
                    <Icon name="MessageCircle" size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                      No conversations yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                      Start a conversation with other Vottery users
                    </p>
                  </div>
                </div>
              ) : (
                <ThreadList
                  threads={threads}
                  selectedThread={selectedThread}
                  onThreadSelect={handleThreadSelect}
                  currentUserId={user?.id}
                  getOtherParticipant={getOtherParticipant}
                />
              )}
            </div>

            {/* Center Panel - Conversation */}
            <div className="flex-1 hidden md:flex flex-col bg-gray-50 dark:bg-gray-900 relative z-0">
              {selectedThread ? (
                <ConversationPanel
                  thread={selectedThread}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={user?.id}
                  otherParticipant={getOtherParticipant(selectedThread)}
                  onToggleDetails={() => setShowDetails(!showDetails)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center relative z-0">
                  <div className="text-center">
                    <Icon name="MessageSquare" size={80} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Select a conversation
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Conversation Details */}
            {showDetails && selectedThread && (
              <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hidden lg:block relative z-0">
                <ConversationDetails
                  thread={selectedThread}
                  otherParticipant={getOtherParticipant(selectedThread)}
                  onClose={() => setShowDetails(false)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DirectMessagingCenter;