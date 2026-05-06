import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { googleAnalyticsService } from '../../services/googleAnalyticsService';
import HubManagementPanel from './components/HubManagementPanel';
import ModerationToolsPanel from './components/ModerationToolsPanel';
import HubAnalyticsPanel from './components/HubAnalyticsPanel';
import ElectionCollaborationPanel from './components/ElectionCollaborationPanel';

const TopicBasedHubElectionsHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showManagementPanel, setShowManagementPanel] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    topicCategory: '',
    isPublic: true,
    moderationEnabled: true
  });

  const topicCategories = [
    'Politics', 'Technology', 'Sports', 'Entertainment', 
    'Business', 'Social Issues', 'Education', 'Health',
    'Environment', 'Science', 'Arts', 'Gaming'
  ];

  useEffect(() => {
    loadCommunities();
    
    // Track page view
    googleAnalyticsService?.trackUserFlow('community_hub', 'page_view', {
      tab: activeTab
    });
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
      } else if (activeTab === 'trending') {
        const { data, error } = await supabase
          ?.from('community_spaces')
          ?.select(`
            *,
            user_profiles!community_spaces_created_by_fkey(name, username, avatar)
          `)
          ?.eq('is_public', true)
          ?.order('election_count', { ascending: false })
          ?.limit(20);

        if (!error) setCommunities(data || []);
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

        // Track community creation
        googleAnalyticsService?.trackSocialInteraction('community_created', data?.id, {
          topic_category: newCommunity?.topicCategory,
          is_public: newCommunity?.isPublic,
          moderation_enabled: newCommunity?.moderationEnabled
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

      // Track community join
      googleAnalyticsService?.trackSocialInteraction('community_joined', communityId, {
        user_id: user?.id
      });

      loadCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleManageCommunity = (community) => {
    setSelectedCommunity(community);
    setShowManagementPanel(true);
    
    // Track management panel open
    googleAnalyticsService?.trackUserFlow('community_management', 'panel_opened', {
      community_id: community?.id
    });
  };

  const filteredCommunities = communities?.filter(community => 
    community?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    community?.topic_category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const tabs = [
    { id: 'discover', label: 'Discover', icon: 'Compass' },
    { id: 'my-communities', label: 'My Hubs', icon: 'Users' },
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' }
  ];

  return (
    <GeneralPageLayout title="Topic-Based Hub Elections" showSidebar={true}>
      <Helmet>
        <title>Topic-Based Hub Elections Hub - Vottery</title>
      </Helmet>

      <div className="w-full py-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              Hub Elections Hub
            </h1>
            <p className="text-muted-foreground">
              Topic-based hub spaces for collaborative elections with moderation and member roles
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Icon name="Plus" size={18} />
            Create Hub
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
                      ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-muted/80'
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
            {(activeTab === 'my-communities' ? myCommunities : filteredCommunities)?.map(item => {
              const community = activeTab === 'my-communities' ? item?.community_spaces : item;
              const memberRole = activeTab === 'my-communities' ? item?.role : null;
              
              return (
                <div key={community?.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-250">
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-heading font-semibold text-foreground">
                        {community?.name}
                      </h3>
                      {memberRole && (
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                          memberRole === 'admin' ? 'bg-primary/10 text-primary' :
                          memberRole === 'moderator'? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {memberRole}
                        </span>
                      )}
                    </div>
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
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium">
                        {community?.topic_category}
                      </span>
                      {community?.moderation_enabled && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-md font-medium">
                          Moderated
                        </span>
                      )}
                    </div>
                    {memberRole && (memberRole === 'admin' || memberRole === 'moderator') ? (
                      <Button
                        onClick={() => handleManageCommunity(community)}
                        className="w-full"
                        variant="secondary"
                      >
                        <Icon name="Settings" size={16} />
                        Manage Hub
                      </Button>
                    ) : memberRole ? (
                      <Button
                        onClick={() => navigate(`/community/${community?.id}`)}
                        className="w-full"
                      >
                        View Hub
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJoinCommunity(community?.id)}
                        className="w-full"
                      >
                        Join Hub
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Hub Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Create Hub
                </h2>
                <button onClick={() => setShowCreateModal(false)}>
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hub Name
                  </label>
                  <input
                    type="text"
                    value={newCommunity?.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e?.target?.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter hub name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCommunity?.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e?.target?.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe your hub"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Topic Category
                  </label>
                  <select
                    value={newCommunity?.topicCategory}
                    onChange={(e) => setNewCommunity({ ...newCommunity, topicCategory: e?.target?.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    {topicCategories?.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCommunity?.isPublic}
                      onChange={(e) => setNewCommunity({ ...newCommunity, isPublic: e?.target?.checked })}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Public Hub</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCommunity?.moderationEnabled}
                      onChange={(e) => setNewCommunity({ ...newCommunity, moderationEnabled: e?.target?.checked })}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Enable Moderation</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCommunity}
                    className="flex-1"
                    disabled={!newCommunity?.name || !newCommunity?.topicCategory}
                  >
                    Create Hub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hub Detail Modal */}
        {selectedCommunity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl border border-border w-full max-w-5xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedCommunity?.name}</h2>
                    <p className="text-sm text-muted-foreground">Manage and monitor hub activity</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommunity(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <HubManagementPanel communityId={selectedCommunity?.id} />
                <ModerationToolsPanel communityId={selectedCommunity?.id} />
                <ElectionCollaborationPanel communityId={selectedCommunity?.id} />
                <HubAnalyticsPanel communityId={selectedCommunity?.id} />
              </div>
            </div>
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default TopicBasedHubElectionsHub;