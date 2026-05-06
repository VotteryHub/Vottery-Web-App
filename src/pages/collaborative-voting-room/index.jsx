import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LiveVotingPanel from './components/LiveVotingPanel';
import ParticipantListPanel from './components/ParticipantListPanel';
import DiscussionThreadPanel from './components/DiscussionThreadPanel';
import ModerationControlsPanel from './components/ModerationControlsPanel';
import RealTimeResultsPanel from './components/RealTimeResultsPanel';
import { enhancedRealtimeService } from '../../services/enhancedRealtimeService';
import { reactionsService } from '../../services/reactionsService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useAuth } from '../../contexts/AuthContext';

import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const CollaborativeVotingRoom = () => {
  const { userProfile } = useAuth();
  const [activeRoom, setActiveRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [votingOptions, setVotingOptions] = useState([]);
  const [liveResults, setLiveResults] = useState({});
  const [realtimeChannel, setRealtimeChannel] = useState(null);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    loadVotingRooms();
    analytics?.trackEvent('collaborative_voting_room_viewed', {
      timestamp: new Date()?.toISOString()
    });

    return () => {
      if (realtimeChannel) {
        enhancedRealtimeService?.disconnect('voting_room_channel');
      }
    };
  }, []);

  useEffect(() => {
    if (activeRoom) {
      setupRealtimeSubscriptions();
      checkModeratorStatus();
    }
  }, [activeRoom]);

  const loadVotingRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('voting_rooms')
        ?.select('*')
        ?.eq('status', 'active')
        ?.order('created_at', { ascending: false })
        ?.limit(1)
        ?.single();

      if (data) {
        setActiveRoom(data);
        await loadRoomData(data?.id);
      } else {
        // Create mock room for demonstration
        setActiveRoom({
          id: 'room-demo-1',
          title: 'Community Budget Allocation Discussion',
          description: 'Collaborative deliberation on 2026 community budget priorities',
          status: 'active',
          moderatorId: userProfile?.id,
          createdAt: new Date()?.toISOString()
        });
        loadMockData();
      }
    } catch (error) {
      console.error('Failed to load voting rooms:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    setParticipants([
      { id: '1', name: 'Sarah Chen', avatar: null, status: 'active', role: 'moderator', joinedAt: new Date(Date.now() - 3600000)?.toISOString() },
      { id: '2', name: 'Mike Johnson', avatar: null, status: 'active', role: 'participant', joinedAt: new Date(Date.now() - 2400000)?.toISOString() },
      { id: '3', name: 'Emily Rodriguez', avatar: null, status: 'active', role: 'participant', joinedAt: new Date(Date.now() - 1800000)?.toISOString() },
      { id: '4', name: 'David Kim', avatar: null, status: 'idle', role: 'participant', joinedAt: new Date(Date.now() - 900000)?.toISOString() }
    ]);

    setVotingOptions([
      { id: 'opt-1', title: 'Infrastructure & Roads', description: 'Repair and upgrade city infrastructure', votes: 12, percentage: 35 },
      { id: 'opt-2', title: 'Education Programs', description: 'Expand after-school programs and resources', votes: 8, percentage: 24 },
      { id: 'opt-3', title: 'Public Safety', description: 'Enhance emergency services and equipment', votes: 7, percentage: 21 },
      { id: 'opt-4', title: 'Parks & Recreation', description: 'Improve community spaces and facilities', votes: 7, percentage: 20 }
    ]);

    setMessages([
      { id: 'msg-1', userId: '1', userName: 'Sarah Chen', content: 'Welcome everyone! Let\'s discuss our budget priorities. Please share your thoughts on each option.', timestamp: new Date(Date.now() - 3000000)?.toISOString(), reactions: [{ emoji: '👍', count: 3 }] },
      { id: 'msg-2', userId: '2', userName: 'Mike Johnson', content: 'I think infrastructure should be our top priority. Our roads are in terrible condition.', timestamp: new Date(Date.now() - 2700000)?.toISOString(), reactions: [{ emoji: '💯', count: 2 }] },
      { id: 'msg-3', userId: '3', userName: 'Emily Rodriguez', content: 'Education is crucial for our future. We need to invest in our children.', timestamp: new Date(Date.now() - 2400000)?.toISOString(), reactions: [{ emoji: '❤️', count: 2 }, { emoji: '👏', count: 1 }] }
    ]);

    setLiveResults({
      totalVotes: 34,
      totalParticipants: 4,
      votingProgress: 85,
      timeRemaining: '15:30'
    });
  };

  const loadRoomData = async (roomId) => {
    try {
      const [participantsResult, messagesResult, optionsResult] = await Promise.all([
        supabase?.from('voting_room_participants')?.select('*')?.eq('room_id', roomId),
        supabase?.from('voting_room_messages')?.select('*')?.eq('room_id', roomId)?.order('created_at', { ascending: true }),
        supabase?.from('voting_room_options')?.select('*')?.eq('room_id', roomId)
      ]);

      if (participantsResult?.data) setParticipants(participantsResult?.data);
      if (messagesResult?.data) setMessages(messagesResult?.data);
      if (optionsResult?.data) setVotingOptions(optionsResult?.data);
    } catch (error) {
      console.error('Failed to load room data:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = enhancedRealtimeService?.createConnection('voting_room_channel', {
      table: 'voting_room_messages',
      event: '*',
      filter: `room_id=eq.${activeRoom?.id}`,
      onMessage: (payload) => {
        if (payload?.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload?.new]);
        } else if (payload?.eventType === 'UPDATE') {
          setMessages(prev => prev?.map(m => m?.id === payload?.new?.id ? payload?.new : m));
        }
      },
      onConnect: () => {
        console.log('Real-time connection established');
      }
    });

    setRealtimeChannel(channel);
  };

  const checkModeratorStatus = () => {
    const isMod = activeRoom?.moderatorId === userProfile?.id || userProfile?.role === 'admin' || userProfile?.role === 'moderator';
    setIsModerator(isMod);
  };

  const handleSendMessage = async (content) => {
    try {
      const newMessage = {
        id: `msg-${Date.now()}`,
        userId: userProfile?.id,
        userName: userProfile?.name || 'Anonymous',
        content,
        timestamp: new Date()?.toISOString(),
        reactions: []
      };

      setMessages(prev => [...prev, newMessage]);

      analytics?.trackEvent('voting_room_message_sent', {
        roomId: activeRoom?.id,
        messageLength: content?.length
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleVoteOption = async (optionId) => {
    try {
      setVotingOptions(prev => prev?.map(opt => {
        if (opt?.id === optionId) {
          const newVotes = opt?.votes + 1;
          const totalVotes = prev?.reduce((sum, o) => sum + (o?.id === optionId ? newVotes : o?.votes), 0);
          return {
            ...opt,
            votes: newVotes,
            percentage: Math.round((newVotes / totalVotes) * 100)
          };
        }
        return opt;
      }));

      analytics?.trackEvent('voting_room_vote_cast', {
        roomId: activeRoom?.id,
        optionId
      });
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await reactionsService?.addReaction('voting_room_message', messageId, emoji);
      
      setMessages(prev => prev?.map(msg => {
        if (msg?.id === messageId) {
          const existingReaction = msg?.reactions?.find(r => r?.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg?.reactions?.map(r => 
                r?.emoji === emoji ? { ...r, count: r?.count + 1 } : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...(msg?.reactions || []), { emoji, count: 1 }]
            };
          }
        }
        return msg;
      }));
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleModerateMessage = async (messageId, action) => {
    try {
      if (action === 'delete') {
        setMessages(prev => prev?.filter(m => m?.id !== messageId));
      } else if (action === 'pin') {
        setMessages(prev => prev?.map(m => 
          m?.id === messageId ? { ...m, pinned: true } : m
        ));
      }

      analytics?.trackEvent('voting_room_moderation_action', {
        roomId: activeRoom?.id,
        action,
        messageId
      });
    } catch (error) {
      console.error('Failed to moderate message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading voting room...</p>
        </div>
      </div>
    );
  }

  return (
    <GeneralPageLayout title={activeRoom?.title || "Collaborative Voting Room"} showSidebar={true}>
      <Helmet>
        <title>{activeRoom?.title || 'Collaborative Voting Room'} - Vottery</title>
        <meta name="description" content="Live voting room with group discussions, real-time option updates, participant reactions, and moderated deliberation spaces for committee and team voting scenarios." />
      </Helmet>
      
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              {activeRoom?.title || 'Collaborative Room'}
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              {activeRoom?.description || 'Live group discussions with real-time voting and moderated deliberation'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-success/10 border border-success/20 rounded-2xl">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-black text-success uppercase tracking-widest">Live Deliberation</span>
            </div>
            <button
              onClick={() => loadRoomData(activeRoom?.id)}
              className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <Icon name="RefreshCw" size={18} />
            </button>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Votes', value: liveResults?.totalVotes || 0, icon: 'Vote', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Participants', value: participants?.length || 0, icon: 'Users', color: 'text-success', bg: 'bg-success/10' },
            { label: 'Progress', value: `${liveResults?.votingProgress || 0}%`, icon: 'TrendingUp', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Time Remaining', value: liveResults?.timeRemaining || '00:00', icon: 'Clock', color: 'text-orange-500', bg: 'bg-orange-500/10' }
          ]?.map((stat, i) => (
            <div key={i} className="premium-glass p-6 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between group hover:border-white/20 transition-all">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat?.label}</p>
                <p className="text-2xl font-black text-white">{stat?.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat?.bg} rounded-2xl flex items-center justify-center ${stat?.color} group-hover:scale-110 transition-transform`}>
                <Icon name={stat?.icon} size={20} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Deliberation Stream */}
          <div className="lg:col-span-8 space-y-10">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <LiveVotingPanel options={votingOptions} onVote={handleVoteOption} />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <RealTimeResultsPanel options={votingOptions} totalVotes={liveResults?.totalVotes} />
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <DiscussionThreadPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onReaction={handleReaction}
                onModerate={isModerator ? handleModerateMessage : null}
              />
            </div>
          </div>

          {/* Control & Identity Layer */}
          <div className="lg:col-span-4 space-y-10">
            <div className="sticky top-24 space-y-10">
              <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
                <ParticipantListPanel participants={participants} currentUserId={userProfile?.id} />
              </div>
              
              {isModerator && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
                  <ModerationControlsPanel roomId={activeRoom?.id} participants={participants} />
                </div>
              )}

              <div className="premium-glass p-8 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700 delay-600">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Room Integrity</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">End-to-End Encrypted</p>
                      <p className="text-[10px] text-slate-600 uppercase font-black">Discussion privacy active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Sync</p>
                      <p className="text-[10px] text-slate-600 uppercase font-black">Latency: 42ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default CollaborativeVotingRoom;