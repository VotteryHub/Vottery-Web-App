import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import HubCard from './components/HubCard';
import PostCard from '../home-feed-dashboard/components/PostCard';
// Direct Supabase is used here for reliability & timeout control
import CreateHubModal from './components/CreateHubModal';
import { hubsService } from '../../services/hubsService';
import toast from 'react-hot-toast';

const CommunityHubsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [hubs, setHubs] = useState([]);
  const [myHubs, setMyHubs] = useState([]);
  const [managedHubs, setManagedHubs] = useState([]);
  const [hubPosts, setHubPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingHub, setIsCreatingHub] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase not initialized');

      // Load all public hubs
      const { data: allHubs, error: hubsError } = await supabase
        .from('groups')
        .select('id, name, description, created_by, member_count, is_private, created_at')
        .eq('is_private', false)
        .order('member_count', { ascending: false })
        .limit(30);
      if (!hubsError) setHubs(allHubs || []);

      if (user?.id) {
        // Load hubs I've joined
        const { data: joinedRows } = await supabase
          .from('group_members')
          .select('groups(id, name, description, member_count, created_by)')
          .eq('user_id', user.id);
        setMyHubs((joinedRows || []).map(r => r.groups).filter(Boolean));

        // Load hubs I manage (created_by = me)
        const { data: managedRows } = await supabase
          .from('groups')
          .select('id, name, description, member_count, created_by')
          .eq('created_by', user.id);
        setManagedHubs(managedRows || []);

        // Load recent posts from joined hubs (best-effort)
        try {
          const joinedHubIds = (joinedRows || []).map(r => r.groups?.id).filter(Boolean);
          if (joinedHubIds.length > 0) {
            const { data: posts } = await supabase
              .from('posts')
              .select('*, user_profiles(name, username, avatar)')
              .in('community_id', joinedHubIds)
              .order('created_at', { ascending: false })
              .limit(20);
            setHubPosts(posts || []);
          }
        } catch (_) { /* hub posts are non-critical */ }
      }
    } catch (err) {
      console.error('Failed to load hubs data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHub = async (hubData) => {
    if (!user?.id) {
      toast.error('You must be signed in to create a hub');
      return;
    }
    
    if (!hubData?.name?.trim()) {
      toast.error('Hub name is required');
      alert('Hub name is required');
      return;
    }

    setIsCreatingHub(true);
    try {
      // Create via the standardized service to guarantee schema parity
      const { data, error } = await hubsService.createHub(hubData);

      if (error) {
        throw new Error(error.message || 'Failed to create hub via service');
      }

      if (!data?.id) {
        throw new Error('Hub created but no ID was returned from the database');
      }

      // Auto-join creator as admin if it's a public hub
      if (!hubData.is_private) {
        const { error: joinError } = await hubsService.joinHub(data.id);
        if (joinError) {
          console.warn('Auto-join admin failed:', joinError.message);
          // Non-blocking error, so we continue
        }
      }

      toast.success(`Hub "${data.name}" created successfully!`);
      setShowCreateModal(false);
      loadDashboardData();
    } catch (err) {
      console.error('Create hub error:', err);
      toast.error(err.message || 'Failed to create hub. Please try again.');
      alert(`Creation Failed: ${err.message || 'Unknown database error'}`);
    } finally {
      setIsCreatingHub(false);
    }
  };

  const tabs = [
    { id: 'feed', label: 'Your Feed', icon: 'Layout' },
    { id: 'discover', label: 'Discover', icon: 'Compass' },
    { id: 'yours', label: 'Your Hubs', icon: 'Users' }
  ];

  return (
    <GeneralPageLayout title="Community Hubs" showSidebar={false} maxWidth="max-w-[1440px]">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] min-h-screen">
        
        {/* Left Sidebar - Facebook Groups Style */}
        <aside className="hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-92px)] sticky top-[92px] overflow-hidden">
          <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Community Hubs</h1>
              <button className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Icon name="Settings" size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Hubs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-[15px] focus:outline-none text-gray-900 dark:text-white"
              />
            </div>

            {/* Main Menu Links */}
            <div className="space-y-1">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-[15px] transition-all ${activeTab === tab.id ? 'bg-vottery-blue/10 text-vottery-blue' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${activeTab === tab.id ? 'bg-vottery-blue text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon name={tab.icon} size={20} />
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowCreateModal(true)}
              className="w-full py-2 bg-vottery-blue/10 text-vottery-blue rounded-lg font-bold text-[15px] flex items-center justify-center gap-2 mt-4 hover:bg-vottery-blue/20 transition-all"
            >
              <Icon name="Plus" size={20} /> Create New Hub
            </button>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
               <h3 className="text-lg font-black mb-4">Hubs you manage</h3>
               <div className="space-y-3">
                  {managedHubs.length > 0 ? managedHubs.map(hub => (
                    <button key={hub.id} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left group">
                       <img src={hub.avatar || `https://picsum.photos/seed/${hub.id}/100/100`} className="w-12 h-12 rounded-lg" alt="" />
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-[15px] truncate text-gray-900 dark:text-white">{hub.name}</p>
                          <p className="text-[12px] text-gray-600 dark:text-gray-400">Last active 2h ago</p>
                       </div>
                    </button>
                  )) : (
                    <p className="text-sm text-gray-500">You don't manage any hubs yet.</p>
                  )}
               </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
               <h3 className="text-lg font-black mb-4">Hubs you've joined</h3>
               <div className="space-y-3">
                  {myHubs.map(hub => (
                    <button key={hub.id} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left group">
                       <img src={hub.avatar || `https://picsum.photos/seed/${hub.id+10}/100/100`} className="w-12 h-12 rounded-lg" alt="" />
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-[15px] truncate text-gray-900 dark:text-white">{hub.name}</p>
                          <p className="text-[12px] text-gray-600 dark:text-gray-400">Recently active</p>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 lg:p-8">
          <div className="max-w-[700px] mx-auto space-y-6">
            
            {/* Mobile Header Tabs & Create Button */}
            <div className="lg:hidden flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-vottery-blue text-white shadow-md' : 'text-gray-500'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full py-3 bg-vottery-blue text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md hover:bg-blue-600 transition-all"
              >
                <Icon name="Plus" size={20} /> Create New Hub
              </button>
            </div>

            {activeTab === 'feed' && (
              <div className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Recent Activity</h2>
                {hubPosts.map(post => (
                  <PostCard key={post.id} post={post} currentUser={user} />
                ))}
                {hubPosts.length === 0 && !loading && (
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
                    <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-bold text-gray-400">Join hubs to see posts here</h3>
                    <button onClick={() => setActiveTab('discover')} className="mt-4 px-6 py-2 bg-vottery-blue text-white rounded-xl font-bold">Discover Hubs</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discover' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Suggested for you</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hubs.map(hub => (
                      <HubCard 
                        key={hub.id} 
                        hub={hub} 
                        isMember={myHubs.some(mh => mh.id === hub.id)}
                        onJoin={() => {}} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Categories</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Politics', 'Science', 'Sports', 'Education', 'Technology', 'Entertainment'].map(cat => (
                      <button key={cat} className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        <div className="w-12 h-12 bg-vottery-blue/10 rounded-full flex items-center justify-center text-vottery-blue">
                          <Icon name="Tag" size={24} />
                        </div>
                        <span className="font-bold text-[14px]">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'yours' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">All Hubs you've joined</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {myHubs.map(hub => (
                      <div key={hub.id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={hub.avatar || `https://picsum.photos/seed/${hub.id+20}/100/100`} className="w-16 h-16 rounded-xl" alt="" />
                          <div>
                            <p className="font-black text-lg">{hub.name}</p>
                            <p className="text-sm text-gray-500">{hub.memberCount || 100} members • 2 posts today</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold">Visit Hub</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreateModal && (
        <CreateHubModal 
          onClose={() => setShowCreateModal(false)} 
          onCreate={handleCreateHub} 
          loading={isCreatingHub}
        />
      )}
    </GeneralPageLayout>
  );
};

export default CommunityHubsDashboard;
