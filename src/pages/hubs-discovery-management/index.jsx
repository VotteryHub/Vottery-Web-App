import React, { useState, useEffect } from 'react';
import { Users2, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HubCard from './components/HubCard';
import CreateHubModal from './components/CreateHubModal';
import HubDetailsModal from './components/HubDetailsModal';
import PostApprovalWorkflow from './components/PostApprovalWorkflow';
import HubAnalyticsPanel from './components/HubAnalyticsPanel';
import EventSchedulingPanel from './components/EventSchedulingPanel';
import ModeratorRolePanel from './components/ModeratorRolePanel';

const HubsDiscoveryManagement = () => {
  const { user } = useAuth();
  const [hubs, setHubs] = useState([]);
  const [myHubs, setMyHubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHub, setSelectedHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedHubForManage, setSelectedHubForManage] = useState(null);

  const topics = ['all', 'politics', 'sports', 'entertainment', 'technology', 'business', 'lifestyle'];
  const tabs = ['discover', 'my-hubs', 'analytics', 'events', 'moderation'];

  useEffect(() => {
    loadHubs();
    if (user) {
      loadMyHubs();
    }
  }, [user, selectedTopic, searchQuery]);

  const loadHubs = async () => {
    try {
      setLoading(true);
      let query = supabase?.from('groups')?.select(`
          *,
          group_members(count),
          user_profiles!groups_created_by_fkey(id, username, name, avatar)
        `)?.eq('is_private', false)?.order('member_count', { ascending: false });

      if (selectedTopic !== 'all') {
        query = query?.eq('topic', selectedTopic);
      }

      if (searchQuery) {
        query = query?.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHubs(data || []);
    } catch (error) {
      console.error('Load hubs error:', error);
      toast?.error('Failed to load hubs');
    } finally {
      setLoading(false);
    }
  };

  const loadMyHubs = async () => {
    try {
      const { data, error } = await supabase?.from('group_members')?.select(`
          *,
          groups(
            *,
            group_members(count)
          )
        `)?.eq('user_id', user?.id);

      if (error) throw error;
      setMyHubs(data?.map(m => m?.groups) || []);
    } catch (error) {
      console.error('Load my hubs error:', error);
    }
  };

  const handleJoinHub = async (hubId) => {
    if (!user) {
      toast?.error('Please sign in to join hubs');
      return;
    }

    try {
      const { error } = await supabase?.from('group_members')?.insert({
          group_id: hubId,
          user_id: user?.id,
          role: 'member'
        });

      if (error) throw error;

      toast?.success('Successfully joined hub!');
      loadHubs();
      loadMyHubs();
    } catch (error) {
      console.error('Join hub error:', error);
      toast?.error('Failed to join hub');
    }
  };

  const handleLeaveHub = async (hubId) => {
    try {
      const { error } = await supabase?.from('group_members')?.delete()?.eq('group_id', hubId)?.eq('user_id', user?.id);

      if (error) throw error;

      toast?.success('Left hub successfully');
      loadHubs();
      loadMyHubs();
    } catch (error) {
      console.error('Leave hub error:', error);
      toast?.error('Failed to leave hub');
    }
  };

  const handleCreateHub = async (hubData) => {
    try {
      const { data, error } = await supabase?.from('groups')?.insert({
          ...hubData,
          created_by: user?.id
        })?.select()?.single();

      if (error) throw error;

      // Automatically join as admin
      await supabase?.from('group_members')?.insert({
          group_id: data?.id,
          user_id: user?.id,
          role: 'admin'
        });

      toast?.success('Hub created successfully!');
      setShowCreateModal(false);
      loadHubs();
      loadMyHubs();
    } catch (error) {
      console.error('Create hub error:', error);
      toast?.error('Failed to create hub');
    }
  };

  return (
    <GeneralPageLayout 
      title="Hubs Discovery & Management"
      showSidebar={true}
    >
      <div className="w-full py-0">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 font-medium text-sm">
              Advanced community governance and discovery engine
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
            >
              <Plus className="w-4 h-4" />
              Create Hub
            </button>
          )}
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'my-hubs', label: 'My Hubs' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'events', label: 'Events' },
            { id: 'moderation', label: 'Moderation' },
          ]?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {activeTab === 'analytics' && (
          <HubAnalyticsPanel groupId={selectedHubForManage?.id || 'demo'} />
        )}
        {activeTab === 'events' && (
          <EventSchedulingPanel groupId={selectedHubForManage?.id || 'demo'} isModerator={true} />
        )}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <PostApprovalWorkflow groupId={selectedHubForManage?.id || 'demo'} isModerator={true} />
            <ModeratorRolePanel groupId={selectedHubForManage?.id || 'demo'} isAdmin={true} />
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search high-fidelity hubs..."
              className="w-full pl-12 pr-4 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            />
          </div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e?.target?.value)}
            className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer min-w-[180px] font-black text-[10px] uppercase tracking-widest"
          >
            {topics?.map(topic => (
              <option key={topic} value={topic} className="bg-slate-900">
                {topic === 'all' ? 'All Topics' : topic?.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Hubs Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Network Hubs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'discover' ? hubs : myHubs)?.map(hub => (
              <HubCard
                key={hub?.id}
                group={hub}
                isMember={myHubs?.some(g => g?.id === hub?.id)}
                onJoin={() => handleJoinHub(hub?.id)}
                onLeave={() => handleLeaveHub(hub?.id)}
                onClick={() => setSelectedHub(hub)}
              />
            ))}
          </div>
        )}

        {!loading && (activeTab === 'discover' ? hubs : myHubs)?.length === 0 && (
          <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed">
            <Users2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              {activeTab === 'discover' ? 'No synchronization detected in this sector' : 'No personal hub affiliations found'}
            </p>
          </div>
        )}
      </div>
      {/* Modals */}
      {showCreateModal && (
        <CreateHubModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateHub}
        />
      )}
      {selectedHub && (
        <HubDetailsModal
          group={selectedHub}
          isMember={myHubs?.some(g => g?.id === selectedHub?.id)}
          onClose={() => setSelectedHub(null)}
          onJoin={() => handleJoinHub(selectedHub?.id)}
          onLeave={() => handleLeaveHub(selectedHub?.id)}
        />
      )}
      </div>
    </GeneralPageLayout>
  );
};

export default HubsDiscoveryManagement;