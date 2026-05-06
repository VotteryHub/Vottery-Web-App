import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users2, Search, Plus, BarChart2, Calendar, Shield, CheckSquare } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import HubCard from './components/HubCard';
import PostApprovalWorkflow from './components/PostApprovalWorkflow';
import HubAnalyticsPanel from './components/HubAnalyticsPanel';
import EventSchedulingPanel from './components/EventSchedulingPanel';
import ModeratorRolePanel from './components/ModeratorRolePanel';
import { hubsService } from '../../services/hubsService';

const TOPICS = ['all', 'politics', 'sports', 'entertainment', 'technology', 'business', 'lifestyle'];

const TABS = [
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'my-groups', label: 'My Hubs', icon: Users2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'moderation', label: 'Post Approval', icon: CheckSquare },
  { id: 'roles', label: 'Moderator Roles', icon: Shield },
];

const MOCK_GROUPS = [
  { id: '1', name: 'Political Discourse Hub', description: 'Engage in thoughtful political discussions and elections', topic: 'politics', is_private: false, member_count: 1247, emoji: '🏛️' },
  { id: '2', name: 'Sports Prediction League', description: 'Predict sports outcomes and compete with fellow fans', topic: 'sports', is_private: false, member_count: 892, emoji: '⚽' },
  { id: '3', name: 'Tech Innovators Circle', description: 'Discuss emerging technologies and vote on future trends', topic: 'technology', is_private: false, member_count: 2341, emoji: '💻' },
  { id: '4', name: 'Entertainment Votes', description: 'Vote on your favorite movies, shows, and celebrities', topic: 'entertainment', is_private: false, member_count: 3102, emoji: '🎬' },
  { id: '5', name: 'Business Strategy Forum', description: 'Strategic business discussions and market predictions', topic: 'business', is_private: true, member_count: 456, emoji: '📊' },
  { id: '6', name: 'Lifestyle & Wellness', description: 'Health, wellness, and lifestyle voting community', topic: 'lifestyle', is_private: false, member_count: 789, emoji: '🌿' },
];

const EnhancedHubsDiscoveryManagementHub = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupForManage, setSelectedGroupForManage] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', topic: 'technology', is_private: false });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroups();
    if (user) loadMyGroups();
  }, [user, selectedTopic, searchQuery]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      let query = supabase
        ?.from('groups')
        ?.select('*, group_members(count)')
        ?.eq('is_private', false)
        ?.order('member_count', { ascending: false });

      if (selectedTopic !== 'all') query = query?.eq('topic', selectedTopic);
      if (searchQuery) query = query?.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

      const { data, error } = await query;
      if (error) throw error;
      setGroups(data?.length > 0 ? data : MOCK_GROUPS?.filter(g =>
        (selectedTopic === 'all' || g?.topic === selectedTopic) &&
        (!searchQuery || g?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      ));
    } catch (err) {
      setGroups(MOCK_GROUPS?.filter(g =>
        (selectedTopic === 'all' || g?.topic === selectedTopic) &&
        (!searchQuery || g?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      ));
    } finally {
      setLoading(false);
    }
  };

  const loadMyGroups = async () => {
    try {
      const { data } = await supabase
        ?.from('group_members')
        ?.select('*, groups(*)')
        ?.eq('user_id', user?.id);
      setMyGroups(data?.map(m => m?.groups)?.filter(Boolean) || MOCK_GROUPS?.slice(0, 2));
    } catch (err) {
      setMyGroups(MOCK_GROUPS?.slice(0, 2));
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!user) return;
    
    // Optimistic Update
    const joinedGroup = groups?.find(g => g?.id === groupId) || MOCK_GROUPS?.find(g => g?.id === groupId);
    if (joinedGroup) {
      setMyGroups(prev => [...prev, joinedGroup]);
    }

    try {
      const { error } = await hubsService?.joinHub(groupId);
      if (error) throw error;
      // Refresh to ensure server sync
      loadGroups();
      loadMyGroups();
    } catch (err) {
      console.error('Join error:', err);
      // Revert optimistic update
      setMyGroups(prev => prev?.filter(g => g?.id !== groupId));
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!user) return;

    // Optimistic Update
    setMyGroups(prev => prev?.filter(g => g?.id !== groupId));

    try {
      const { error } = await hubsService?.leaveHub(groupId);
      if (error) throw error;
      loadGroups();
      loadMyGroups();
    } catch (err) {
      console.error('Leave error:', err);
      // Revert optimistic update
      const leftGroup = groups?.find(g => g?.id === groupId);
      if (leftGroup) setMyGroups(prev => [...prev, leftGroup]);
    }
  };

  const handleCreateGroup = async (e) => {
    e?.preventDefault();
    if (!newGroup?.name || !user) return;
    setCreating(true);
    try {
      const { data, error } = await hubsService?.createHub(newGroup);

      if (!error && data) {
        await hubsService?.joinHub(data?.id); // Admin automatically joins
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '', topic: 'technology', is_public: true });
        loadGroups();
        loadMyGroups();
      }
    } catch (err) {
      console.error('Create error:', err);
    } finally {
      setCreating(false);
    }
  };

  const activeGroupId = selectedGroupForManage?.id || (myGroups?.[0]?.id) || 'demo';

  const displayGroups = activeTab === 'my-groups' ? myGroups : groups;

  return (
    <GeneralPageLayout 
      title="Enhanced Groups Discovery & Management Hub"
      showSidebar={true}
    >
      <div className="w-full py-0">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Users2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">Hubs Discovery</h1>
                <p className="text-slate-400 font-medium text-sm">Advanced community governance and discovery engine</p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 backdrop-blur-xl transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]"
              >
                <Plus className="w-4 h-4" />
                Create Group
              </button>
            )}
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Discovery', value: groups?.length, color: 'text-purple-400', icon: Search, bg: 'bg-purple-500/5' },
              { label: 'Joined Hubs', value: myGroups?.length, color: 'text-blue-400', icon: Users2, bg: 'bg-blue-500/5' },
              { label: 'Pending Posts', value: 3, color: 'text-orange-400', icon: CheckSquare, bg: 'bg-orange-500/5' },
              { label: 'Active Events', value: 2, color: 'text-green-400', icon: Calendar, bg: 'bg-green-500/5' },
            ]?.map((stat, i) => (
              <div key={i} className={`${stat?.bg} backdrop-blur-xl border border-white/5 rounded-2xl p-5 relative overflow-hidden group`}>
                <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={64} />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat?.label}</p>
                <p className={`text-3xl font-black ${stat?.color} tracking-tight`}>{stat?.value}</p>
              </div>
            ))}
          </div>

          {/* Modern Navigation Tabs */}
          <div className="flex gap-2 bg-black/20 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 shadow-inner overflow-x-auto no-scrollbar">
            {TABS?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab?.id
                    ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Rendering Layer */}
        <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {(activeTab === 'discover' || activeTab === 'my-groups') && (
            <div className="space-y-8">
              {/* Intelligent Discovery Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e?.target?.value)}
                    placeholder="Search high-fidelity hubs..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                  />
                </div>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e?.target?.value)}
                  className="px-6 py-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer min-w-[180px] font-black text-[10px] uppercase tracking-widest"
                >
                  {TOPICS?.map(t => (
                    <option key={t} value={t} className="bg-slate-900">{t === 'all' ? 'All Topics' : t?.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-purple-500/20" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Network Hubs...</p>
                </div>
              ) : displayGroups?.length === 0 ? (
                <div className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 border-dashed">
                  <Users2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No synchronization detected in this sector</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {displayGroups?.map((group, idx) => (
                    <div key={group?.id || idx} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                      <HubCard
                        hub={group}
                        isMember={myGroups?.some(g => g?.id === group?.id)}
                        isAdmin={myGroups?.some(g => g?.id === group?.id && (g?.role === 'admin' || g?.role === 'moderator'))}
                        onJoin={() => handleJoinGroup(group?.id)}
                        onLeave={() => handleLeaveGroup(group?.id)}
                        onManage={() => { setSelectedGroupForManage(group); setActiveTab('analytics'); }}
                        onClick={() => setSelectedGroupForManage(group)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {selectedGroupForManage && (
                <div className="flex items-center gap-4 mb-8 p-6 bg-purple-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20">
                  <span className="text-3xl">{selectedGroupForManage?.emoji || '👥'}</span>
                  <div>
                    <span className="font-black text-white uppercase tracking-tight">{selectedGroupForManage?.name}</span>
                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Active Intelligence Target</p>
                  </div>
                  <button 
                    onClick={() => setSelectedGroupForManage(null)} 
                    className="ml-auto px-4 py-2 text-[10px] font-black text-purple-400 uppercase tracking-widest hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    Reset Context
                  </button>
                </div>
              )}
              <HubAnalyticsPanel groupId={activeGroupId} />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <EventSchedulingPanel groupId={activeGroupId} isModerator={true} />
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <PostApprovalWorkflow groupId={activeGroupId} isModerator={true} />
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ModeratorRolePanel groupId={activeGroupId} isAdmin={true} />
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Plus size={80} />
              </div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Create Hub</h2>
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hub Identity</label>
                  <input
                    type="text"
                    placeholder="Enter Hub name..."
                    value={newGroup?.name}
                    onChange={e => setNewGroup(p => ({ ...p, name: e?.target?.value }))}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Communication Strategy</label>
                  <textarea
                    placeholder="Describe the hub's mission..."
                    value={newGroup?.description}
                    onChange={e => setNewGroup(p => ({ ...p, description: e?.target?.value }))}
                    rows={3}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500 resize-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sector</label>
                    <select
                      value={newGroup?.topic}
                      onChange={e => setNewGroup(p => ({ ...p, topic: e?.target?.value }))}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500 transition-all font-bold text-sm uppercase"
                    >
                      {TOPICS?.filter(t => t !== 'all')?.map(t => (
                        <option key={t} value={t} className="bg-slate-900">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security</label>
                    <label className="flex items-center justify-between px-5 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer group hover:border-purple-500/50 transition-all">
                      <span className="text-xs font-bold text-slate-300">Public Net</span>
                      <input
                        type="checkbox"
                        checked={newGroup?.is_public}
                        onChange={e => setNewGroup(p => ({ ...p, is_public: e?.target?.checked }))}
                        className="hidden"
                      />
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${newGroup?.is_public ? 'bg-purple-600' : 'bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${newGroup?.is_public ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={creating} 
                    className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-purple-500/20"
                  >
                    {creating ? 'Synchronizing...' : 'Initialize Hub'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateModal(false)} 
                    className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedHubsDiscoveryManagementHub;
