import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import FriendRequestsTab from './components/FriendRequestsTab';
import FriendsListTab from './components/FriendsListTab';
import FollowersTab from './components/FollowersTab';
import SuggestionsTab from './components/SuggestionsTab';
import { friendsService } from '../../services/friendsService';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';

const FriendsManagementHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [stats, setStats] = useState({
    pendingRequests: 0,
    totalFriends: 0,
    followers: 0,
    following: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [requests, friends, followers, following] = await Promise.all([
        friendsService?.getFriendRequests('pending'),
        friendsService?.getFriends(),
        friendsService?.getFollowers(),
        friendsService?.getFollowing()
      ]);

      const receivedRequests = requests?.data?.filter(r => r?.receiverId === user?.id) || [];

      setStats({
        pendingRequests: receivedRequests?.length || 0,
        totalFriends: friends?.data?.length || 0,
        followers: followers?.data?.length || 0,
        following: following?.data?.length || 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'requests', label: 'Friend Requests', icon: 'UserPlus', badge: stats?.pendingRequests },
    { id: 'friends', label: 'Friends', icon: 'Users', badge: stats?.totalFriends },
    { id: 'followers', label: 'Followers', icon: 'Heart', badge: stats?.followers },
    { id: 'suggestions', label: 'Suggestions', icon: 'Sparkles', badge: 0 }
  ];

  return (
    <GeneralPageLayout title="Friends Management">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">
          Friends Management
        </h1>
        <p className="text-slate-400 font-medium">
          Manage your connections, friend requests, and discover new people
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all">
              <Icon name="UserPlus" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats?.pendingRequests}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:shadow-2xl hover:shadow-success/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-success/10 rounded-2xl group-hover:bg-success/20 transition-all">
              <Icon name="Users" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats?.totalFriends}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Friends</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:shadow-2xl hover:shadow-accent/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-all">
              <Icon name="Heart" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats?.followers}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Followers</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:shadow-2xl hover:shadow-secondary/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-secondary/10 rounded-2xl group-hover:bg-secondary/20 transition-all">
              <Icon name="UserCheck" size={24} className="text-secondary" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{stats?.following}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl mb-8">
        <div className="border-b border-white/5 bg-black/20">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-3 px-8 py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 border-b-4 whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary bg-primary/5 shadow-inner' : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.badge > 0 && (
                  <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                    {tab?.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Connections...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'requests' && <FriendRequestsTab onUpdate={loadStats} />}
              {activeTab === 'friends' && <FriendsListTab onUpdate={loadStats} />}
              {activeTab === 'followers' && <FollowersTab onUpdate={loadStats} />}
              {activeTab === 'suggestions' && <SuggestionsTab onUpdate={loadStats} />}
            </div>
          )}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default FriendsManagementHub;