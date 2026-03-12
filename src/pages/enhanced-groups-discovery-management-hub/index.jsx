import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users2, Search, Plus, BarChart2, Calendar, Shield, CheckSquare } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import GroupCard from './components/GroupCard';
import PostApprovalWorkflow from './components/PostApprovalWorkflow';
import GroupAnalyticsPanel from './components/GroupAnalyticsPanel';
import EventSchedulingPanel from './components/EventSchedulingPanel';
import ModeratorRolePanel from './components/ModeratorRolePanel';

const TOPICS = ['all', 'politics', 'sports', 'entertainment', 'technology', 'business', 'lifestyle'];

const TABS = [
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'my-groups', label: 'My Groups', icon: Users2 },
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

const EnhancedGroupsDiscoveryManagementHub = () => {
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
    try {
      await supabase?.from('group_members')?.insert({ group_id: groupId, user_id: user?.id, role: 'member' });
      loadGroups();
      loadMyGroups();
    } catch (err) {
      console.error('Join error:', err);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      await supabase?.from('group_members')?.delete()?.eq('group_id', groupId)?.eq('user_id', user?.id);
      loadGroups();
      loadMyGroups();
    } catch (err) {
      console.error('Leave error:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e?.preventDefault();
    if (!newGroup?.name || !user) return;
    setCreating(true);
    try {
      const { data, error } = await supabase
        ?.from('groups')
        ?.insert({ ...newGroup, created_by: user?.id })
        ?.select()
        ?.single();

      if (!error && data) {
        await supabase?.from('group_members')?.insert({ group_id: data?.id, user_id: user?.id, role: 'admin' });
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '', topic: 'technology', is_private: false });
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
  const isAdminOfSelected = myGroups?.some(g => g?.id === activeGroupId);

  const displayGroups = activeTab === 'my-groups' ? myGroups : groups;

  return (
    <>
      <Helmet>
        <title>Enhanced Groups Discovery & Management Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
        <LeftSidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Groups Discovery & Management Hub</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Advanced community governance with post approval, analytics, events & moderator management</p>
                </div>
              </div>
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Group
                </button>
              )}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Groups', value: groups?.length, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                { label: 'My Groups', value: myGroups?.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Pending Posts', value: 3, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                { label: 'Active Events', value: 2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              ]?.map((stat, i) => (
                <div key={i} className={`${stat?.bg} rounded-xl p-3`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat?.label}</p>
                  <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {TABS?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {(activeTab === 'discover' || activeTab === 'my-groups') && (
            <div>
              {/* Search & Filter */}
              <div className="flex gap-3 mb-5">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e?.target?.value)}
                    placeholder="Search groups..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <select
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e?.target?.value)}
                  className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-sm"
                >
                  {TOPICS?.map(t => (
                    <option key={t} value={t}>{t === 'all' ? 'All Topics' : t?.charAt(0)?.toUpperCase() + t?.slice(1)}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
                </div>
              ) : displayGroups?.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Users2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No groups found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {displayGroups?.map(group => (
                    <GroupCard
                      key={group?.id}
                      group={group}
                      isMember={myGroups?.some(g => g?.id === group?.id)}
                      isAdmin={myGroups?.some(g => g?.id === group?.id)}
                      onJoin={() => handleJoinGroup(group?.id)}
                      onLeave={() => handleLeaveGroup(group?.id)}
                      onManage={() => { setSelectedGroupForManage(group); setActiveTab('analytics'); }}
                      onClick={() => setSelectedGroupForManage(group)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              {selectedGroupForManage && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <span className="text-lg">{selectedGroupForManage?.emoji || '👥'}</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-300">{selectedGroupForManage?.name}</span>
                  <button onClick={() => setSelectedGroupForManage(null)} className="ml-auto text-xs text-purple-600 hover:underline">Clear</button>
                </div>
              )}
              <GroupAnalyticsPanel groupId={activeGroupId} />
            </div>
          )}

          {activeTab === 'events' && (
            <EventSchedulingPanel groupId={activeGroupId} isModerator={true} />
          )}

          {activeTab === 'moderation' && (
            <PostApprovalWorkflow groupId={activeGroupId} isModerator={true} />
          )}

          {activeTab === 'roles' && (
            <ModeratorRolePanel groupId={activeGroupId} isAdmin={true} />
          )}
        </main>
      </div>
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <input
                type="text"
                placeholder="Group name *"
                value={newGroup?.name}
                onChange={e => setNewGroup(p => ({ ...p, name: e?.target?.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                required
              />
              <textarea
                placeholder="Description"
                value={newGroup?.description}
                onChange={e => setNewGroup(p => ({ ...p, description: e?.target?.value }))}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newGroup?.topic}
                  onChange={e => setNewGroup(p => ({ ...p, topic: e?.target?.value }))}
                  className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                >
                  {TOPICS?.filter(t => t !== 'all')?.map(t => (
                    <option key={t} value={t}>{t?.charAt(0)?.toUpperCase() + t?.slice(1)}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newGroup?.is_private}
                    onChange={e => setNewGroup(p => ({ ...p, is_private: e?.target?.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Private Group</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creating} className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedGroupsDiscoveryManagementHub;
