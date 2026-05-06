import React, { useState, useEffect, useRef } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
  const [optimisticIds, setOptimisticIds] = useState(new Set());

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
            const newMessage = payload?.new;
            setMessages((prev) => {
              // De-duplicate if this is a confirmation of an optimistic message
              // We check if a message with similar content and sender exists in "sending" status
              const duplicateIndex = prev?.findIndex(m => 
                m?.status === 'sending' && 
                m?.content === newMessage?.content && 
                m?.senderId === newMessage?.sender_id
              );

              if (duplicateIndex !== -1) {
                const updated = [...prev];
                updated[duplicateIndex] = { ...newMessage, senderId: newMessage?.sender_id }; // Replace with real data
                return updated;
              }

              return [...prev, { ...newMessage, senderId: newMessage?.sender_id }];
            });
          } else if (payload?.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev?.map((m) => (m?.id === payload?.new?.id ? { ...payload?.new, senderId: payload?.new?.sender_id } : m))
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

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      threadId: selectedThread?.id,
      senderId: user?.id,
      content: content?.trim(),
      createdAt: new Date()?.toISOString(),
      status: 'sending',
      sender: {
        id: user?.id,
        name: userProfile?.name,
        avatar: userProfile?.avatar
      }
    };

    // Add optimistic message to UI immediately
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const { data, error: sendError } = await messagingService?.sendMessage(
        selectedThread?.id,
        content?.trim()
      );
      
      if (sendError) throw new Error(sendError?.message);

      // We don't remove the optimistic message here; the Realtime callback handles the swap
      // But we can update the ID to the real one to avoid double-processing if Realtime is fast
      if (data?.id) {
        setMessages((prev) => 
          prev?.map(m => m.id === tempId ? { ...data, senderId: data?.senderId } : m)
        );
      }
    } catch (err) {
      // Revert optimistic update on failure
      setMessages((prev) => prev?.filter(m => m.id !== tempId));
      setError(`Failed to send message: ${err?.message}`);
    }
  };

  const getOtherParticipant = (thread) => {
    if (!thread || !user) return null;
    return thread?.participantOne?.id === user?.id
      ? thread?.participantTwo
      : thread?.participantOne;
  };

  return (
    <GeneralPageLayout title="Direct Messages" showSidebar={true}>
      <div className="h-[calc(100vh-10rem)] flex gap-6 py-0 animate-in fade-in duration-700">
        {/* Left Panel - Thread List */}
        <div className={`w-full md:w-80 lg:w-96 premium-glass border border-white/10 rounded-3xl overflow-hidden flex flex-col relative z-0 shadow-2xl ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              Inboxes
            </h1>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Icon name="MessageSquare" size={14} className="text-primary" />
            </div>
          </div>
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-b-primary animate-spin" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Threads...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <Icon name="AlertCircle" size={40} className="mx-auto mb-4 text-destructive opacity-50" />
                <p className="text-xs font-bold text-destructive-foreground">{error}</p>
              </div>
            </div>
          ) : threads?.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Icon name="MessageCircle" size={32} className="text-slate-600" />
              </div>
              <p className="text-lg font-black text-white uppercase tracking-tight mb-2">Silence is golden</p>
              <p className="text-xs font-medium text-slate-500 max-w-[200px]">Start a conversation with other verified Vottery citizens.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <ThreadList
                threads={threads}
                selectedThread={selectedThread}
                onThreadSelect={handleThreadSelect}
                currentUserId={user?.id}
                getOtherParticipant={getOtherParticipant}
              />
            </div>
          )}
        </div>

        {/* Center Panel - Conversation */}
        <div className={`flex-1 flex flex-col premium-glass border border-white/10 rounded-3xl overflow-hidden relative z-0 shadow-2xl ${selectedThread ? 'flex' : 'hidden md:flex'}`}>
          {selectedThread ? (
            <ConversationPanel
              thread={selectedThread}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id}
              otherParticipant={getOtherParticipant(selectedThread)}
              onToggleDetails={() => setShowDetails(!showDetails)}
              onBack={() => setSelectedThread(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-32 h-32 bg-slate-900/50 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                <Icon name="MessageSquare" size={48} className="text-slate-700" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                Secure Transmission
              </h2>
              <p className="text-slate-500 font-medium max-w-md">
                Select a channel from the left to begin encrypted communication with the Vottery network.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Conversation Details */}
        {showDetails && selectedThread && (
          <div className="w-80 lg:w-96 premium-glass border border-white/10 rounded-3xl overflow-hidden hidden lg:block relative z-0 shadow-2xl animate-in slide-in-from-right-8 duration-500">
            <ConversationDetails
              thread={selectedThread}
              otherParticipant={getOtherParticipant(selectedThread)}
              onClose={() => setShowDetails(false)}
            />
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default DirectMessagingCenter;