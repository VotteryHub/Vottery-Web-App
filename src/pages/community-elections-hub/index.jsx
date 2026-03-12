import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CommunityElectionsHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    topicCategory: '',
    isPublic: true,
    moderationEnabled: true
  });

  useEffect(() => {
    loadCommunities();
  }, [activeTab]);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      if (activeTab === 'discover') {
        const { data, error } = await supabase
          ?.from('community_spaces')
          ?.select(`
            *,
            user_profiles!community_spaces_created_by_fkey(name, username, avatar)
          `)
          ?.eq('is_public', true)
          ?.order('member_count', { ascending: false });

        if (!error) setCommunities(data || []);
      } else if (activeTab === 'my-communities') {
        const { data, error } = await supabase
          ?.from('community_members')
          ?.select(`
            *,
            community_spaces(*)
          `)
          ?.eq('user_id', user?.id);

        if (!error) setMyCommunities(data || []);
      }
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const { data, error } = await supabase
        ?.from('community_spaces')
        ?.insert({
          name: newCommunity?.name,
          description: newCommunity?.description,
          topic_category: newCommunity?.topicCategory,
          is_public: newCommunity?.isPublic,
          moderation_enabled: newCommunity?.moderationEnabled,
          created_by: user?.id
        })
        ?.select()
        ?.single();

      if (!error) {
        // Auto-join as admin
        await supabase
          ?.from('community_members')
          ?.insert({
            community_id: data?.id,
            user_id: user?.id,
            role: 'admin'
          });

        setShowCreateModal(false);
        setNewCommunity({
          name: '',
          description: '',
          topicCategory: '',
          isPublic: true,
          moderationEnabled: true
        });
        loadCommunities();
      }
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await supabase
        ?.from('community_members')
        ?.insert({
          community_id: communityId,
          user_id: user?.id,
          role: 'member'
        });

      loadCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const filteredCommunities = communities?.filter(community => 
    community?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    community?.topic_category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const tabs = [
    { id: 'discover', label: 'Discover', icon: 'Compass' },
    { id: 'my-communities', label: 'My Communities', icon: 'Users' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Community Elections Hub - Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <LeftSidebar />

      <main className="lg:ml-64 xl:ml-72 pt-14">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                Community Elections Hub
              </h1>
              <p className="text-muted-foreground">
                Topic-based community spaces for collaborative elections
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Icon name="Plus" size={18} />
              Create Community
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
                      activeTab === tab?.id
                        ? 'bg-primary text-white' :'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    {tab?.label}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-auto">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader" size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities?.map(community => (
                <div key={community?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-250">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      {community?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {community?.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {community?.member_count || 0} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Vote" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {community?.election_count || 0} elections
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                        {community?.topic_category}
                      </span>
                      {community?.moderation_enabled && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-md font-medium">
                          Moderated
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleJoinCommunity(community?.id)}
                      className="w-full mt-4"
                    >
                      Join Community
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Create Community
              </h2>
              <button onClick={() => setShowCreateModal(false)}>
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity?.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e?.target?.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter community name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={newCommunity?.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e?.target?.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Describe your community"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Topic Category
                </label>
                <input
                  type="text"
                  value={newCommunity?.topicCategory}
                  onChange={(e) => setNewCommunity({ ...newCommunity, topicCategory: e?.target?.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Politics, Technology, Sports"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCommunity?.isPublic}
                    onChange={(e) => setNewCommunity({ ...newCommunity, isPublic: e?.target?.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Public Community</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newCommunity?.moderationEnabled}
                    onChange={(e) => setNewCommunity({ ...newCommunity, moderationEnabled: e?.target?.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Enable Moderation</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => setShowCreateModal(false)} className="flex-1 bg-muted text-foreground">
                  Cancel
                </Button>
                <Button onClick={handleCreateCommunity} className="flex-1">
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityElectionsHub;