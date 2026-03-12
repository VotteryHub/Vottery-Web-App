import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FriendFollowerManagementPanel from './components/FriendFollowerManagementPanel';
import SocialProofIntegrationPanel from './components/SocialProofIntegrationPanel';
import CommunityBuildingToolsPanel from './components/CommunityBuildingToolsPanel';
import SocialInfluenceScoringPanel from './components/SocialInfluenceScoringPanel';
import CommunityHealthMonitoringPanel from './components/CommunityHealthMonitoringPanel';
import SocialDiscoveryPanel from './components/SocialDiscoveryPanel';
import { friendsService } from '../../services/friendsService';
import { activityService } from '../../services/activityService';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const SocialFeaturesCommunityEngagementHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [socialData, setSocialData] = useState({
    friends: [],
    followers: [],
    following: [],
    activities: [],
    unreadCount: 0
  });

  useEffect(() => {
    loadSocialData();
  }, []);

  useRealtimeMonitoring({
    tables: ['system_alerts', 'activity_feed'],
    onRefresh: loadSocialData,
    enabled: true,
  });

  useEffect(() => {
    analytics?.trackEvent('social_features_viewed', {
      tab: activeTab,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadSocialData = async () => {
    try {
      setLoading(true);
      const [friendsResult, followersResult, followingResult, activitiesResult, unreadResult] = await Promise.all([
        friendsService?.getFriends(),
        friendsService?.getFollowers(),
        friendsService?.getFollowing(),
        activityService?.getActivities({ limit: 50 }),
        activityService?.getUnreadCount()
      ]);

      setSocialData({
        friends: friendsResult?.data || [],
        followers: followersResult?.data || [],
        following: followingResult?.data || [],
        activities: activitiesResult?.data || [],
        unreadCount: unreadResult?.data || 0
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadSocialData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'friends', label: 'Friend/Follower Management', icon: 'Users' },
    { id: 'socialproof', label: 'Social Proof Integration', icon: 'Award' },
    { id: 'community', label: 'Community Building Tools', icon: 'Globe' },
    { id: 'influence', label: 'Social Influence Scoring', icon: 'TrendingUp' },
    { id: 'health', label: 'Community Health', icon: 'Heart' },
    { id: 'discovery', label: 'Social Discovery', icon: 'Compass' }
  ];

  return (
    <>
      <Helmet>
        <title>Social Features & Community Engagement Hub - Vottery</title>
        <meta name="description" content="Comprehensive friend/follower systems with social proof indicators and community building tools for enhanced platform engagement." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Social Features & Community Engagement Hub
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive friend/follower systems with social proof indicators and community building tools
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
                  </span>
                </div>

                {socialData?.unreadCount > 0 && (
                  <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <Icon name="Bell" size={16} className="text-red-600 dark:text-red-400" />
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">
                      {socialData?.unreadCount} new
                    </span>
                  </div>
                )}

                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={refreshing ? 'animate-spin' : ''} 
                  />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Users" size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-muted-foreground">Friends</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {socialData?.friends?.length || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="UserPlus" size={20} className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-muted-foreground">Followers</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {socialData?.followers?.length || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="UserCheck" size={20} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-muted-foreground">Following</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {socialData?.following?.length || 0}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Activity" size={20} className="text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-muted-foreground">Activities</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {socialData?.activities?.length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white' :'bg-card border border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={40} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading social features...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'friends' && (
                <FriendFollowerManagementPanel 
                  socialData={socialData}
                  onRefresh={loadSocialData}
                />
              )}

              {activeTab === 'socialproof' && (
                <SocialProofIntegrationPanel 
                  socialData={socialData}
                />
              )}

              {activeTab === 'community' && (
                <CommunityBuildingToolsPanel />
              )}

              {activeTab === 'influence' && (
                <SocialInfluenceScoringPanel 
                  socialData={socialData}
                />
              )}

              {activeTab === 'health' && (
                <CommunityHealthMonitoringPanel />
              )}

              {activeTab === 'discovery' && (
                <SocialDiscoveryPanel 
                  socialData={socialData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SocialFeaturesCommunityEngagementHub;