import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Community Hub" showSidebar={true}>
      <Helmet>
        <title>Social Features & Community Engagement Hub - Vottery</title>
        <meta name="description" content="Comprehensive friend/follower systems with social proof indicators and community building tools for enhanced platform engagement." />
      </Helmet>

      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              The Commons
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Connect with fellow citizens, build your reputation, and monitor the health of the Vottery ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="premium-glass px-5 py-3 rounded-2xl flex items-center gap-3 border border-white/10">
              <Icon name="Clock" size={14} className="text-primary" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Last Sync: {lastUpdated?.toLocaleTimeString()}
              </span>
            </div>

            <Button
              onClick={refreshData}
              disabled={refreshing}
              className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-6 py-4 flex items-center gap-2"
            >
              <Icon 
                name="RefreshCw" 
                size={14} 
                className={refreshing ? 'animate-spin' : ''} 
              />
              Refresh Network
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-blue-500/5 group hover:bg-blue-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Users" size={16} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Size</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{socialData?.friends?.length || 0}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-green-500/5 group hover:bg-green-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="UserPlus" size={16} className="text-green-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Followers</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{socialData?.followers?.length || 0}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-purple-500/5 group hover:bg-purple-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="UserCheck" size={16} className="text-purple-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Following</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{socialData?.following?.length || 0}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-orange-500/5 group hover:bg-orange-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Activity" size={16} className="text-orange-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Pulse</span>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">{socialData?.activities?.length || 0}</p>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon name={tab?.icon} size={14} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-b-primary animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syncing Community Mesh...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
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
      </div>
    </GeneralPageLayout>
  );
};

export default SocialFeaturesCommunityEngagementHub;