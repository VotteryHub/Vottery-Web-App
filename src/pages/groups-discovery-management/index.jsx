import React, { useState, useEffect } from 'react';
import { Users2, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import GroupCard from './components/GroupCard';
import CreateGroupModal from './components/CreateGroupModal';
import GroupDetailsModal from './components/GroupDetailsModal';
import PostApprovalWorkflow from './components/PostApprovalWorkflow';
import GroupAnalyticsPanel from './components/GroupAnalyticsPanel';
import EventSchedulingPanel from './components/EventSchedulingPanel';
import ModeratorRolePanel from './components/ModeratorRolePanel';

const GroupsDiscoveryManagement = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedGroupForManage, setSelectedGroupForManage] = useState(null);

  const topics = ['all', 'politics', 'sports', 'entertainment', 'technology', 'business', 'lifestyle'];
  const tabs = ['discover', 'my-groups', 'analytics', 'events', 'moderation'];

  useEffect(() => {
    loadGroups();
    if (user) {
      loadMyGroups();
    }
  }, [user, selectedTopic, searchQuery]);

  const loadGroups = async () => {
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
      setGroups(data || []);
    } catch (error) {
      console.error('Load groups error:', error);
      toast?.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const loadMyGroups = async () => {
    try {
      const { data, error } = await supabase?.from('group_members')?.select(`
          *,
          groups(
            *,
            group_members(count)
          )
        `)?.eq('user_id', user?.id);

      if (error) throw error;
      setMyGroups(data?.map(m => m?.groups) || []);
    } catch (error) {
      console.error('Load my groups error:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!user) {
      toast?.error('Please sign in to join groups');
      return;
    }

    try {
      const { error } = await supabase?.from('group_members')?.insert({
          group_id: groupId,
          user_id: user?.id,
          role: 'member'
        });

      if (error) throw error;

      toast?.success('Successfully joined group!');
      loadGroups();
      loadMyGroups();
    } catch (error) {
      console.error('Join group error:', error);
      toast?.error('Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const { error } = await supabase?.from('group_members')?.delete()?.eq('group_id', groupId)?.eq('user_id', user?.id);

      if (error) throw error;

      toast?.success('Left group successfully');
      loadGroups();
      loadMyGroups();
    } catch (error) {
      console.error('Leave group error:', error);
      toast?.error('Failed to leave group');
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const { data, error } = await supabase?.from('groups')?.insert({
          ...groupData,
          created_by: user?.id
        })?.select()?.single();

      if (error) throw error;

      // Automatically join as admin
      await supabase?.from('group_members')?.insert({
          group_id: data?.id,
          user_id: user?.id,
          role: 'admin'
        });

      toast?.success('Group created successfully!');
      setShowCreateModal(false);
      loadGroups();
      loadMyGroups();
    } catch (error) {
      console.error('Create group error:', error);
      toast?.error('Failed to create group');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users2 className="w-10 h-10 text-purple-600" />
              Groups Discovery & Management
            </h1>
            <p className="text-gray-600 mt-2">
              Join topic-based communities and collaborate on elections
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all flex items-center gap-2 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          )}
        </div>

        {/* Enhanced Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { id: 'discover', label: 'Discover' },
            { id: 'my-groups', label: 'My Groups' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'events', label: 'Events' },
            { id: 'moderation', label: 'Moderation' },
          ]?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {activeTab === 'analytics' && (
          <GroupAnalyticsPanel groupId={selectedGroupForManage?.id || 'demo'} />
        )}
        {activeTab === 'events' && (
          <EventSchedulingPanel groupId={selectedGroupForManage?.id || 'demo'} isModerator={true} />
        )}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <PostApprovalWorkflow groupId={selectedGroupForManage?.id || 'demo'} isModerator={true} />
            <ModeratorRolePanel groupId={selectedGroupForManage?.id || 'demo'} isAdmin={true} />
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search groups..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e?.target?.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
          >
            {topics?.map(topic => (
              <option key={topic} value={topic}>
                {topic === 'all' ? 'All Topics' : topic?.charAt(0)?.toUpperCase() + topic?.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Groups Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading groups...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === 'discover' ? groups : myGroups)?.map(group => (
              <GroupCard
                key={group?.id}
                group={group}
                isMember={myGroups?.some(g => g?.id === group?.id)}
                onJoin={() => handleJoinGroup(group?.id)}
                onLeave={() => handleLeaveGroup(group?.id)}
                onClick={() => setSelectedGroup(group)}
              />
            ))}
          </div>
        )}

        {!loading && (activeTab === 'discover' ? groups : myGroups)?.length === 0 && (
          <div className="text-center py-12">
            <Users2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'discover' ? 'No groups found' : 'You haven\'t joined any groups yet'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'discover' ?'Try adjusting your search or filters' :'Discover and join groups to get started'}
            </p>
          </div>
        )}
      </div>
      {/* Modals */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateGroup}
        />
      )}
      {selectedGroup && (
        <GroupDetailsModal
          group={selectedGroup}
          isMember={myGroups?.some(g => g?.id === selectedGroup?.id)}
          onClose={() => setSelectedGroup(null)}
          onJoin={() => handleJoinGroup(selectedGroup?.id)}
          onLeave={() => handleLeaveGroup(selectedGroup?.id)}
        />
      )}
    </div>
  );
};

export default GroupsDiscoveryManagement;