import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <HeaderNavigation />
      <div className="flex relative">
        <LeftSidebar />
        <main className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72 relative z-10 min-w-0">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 relative z-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Friends Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your connections, friend requests, and discover new people
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-0">
              <div className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name="UserPlus" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.pendingRequests}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
              <div className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Icon name="Users" size={24} className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.totalFriends}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Friends</p>
                  </div>
                </div>
              </div>
              <div className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Icon name="Heart" size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.followers}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                </div>
              </div>
              <div className="card p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Icon name="UserCheck" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats?.following}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card mb-6 relative z-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      <Icon name={tab?.icon} size={20} />
                      <span>{tab?.label}</span>
                      {tab?.badge > 0 && (
                        <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                          {tab?.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 relative z-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon name="Loader" size={48} className="animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {activeTab === 'requests' && <FriendRequestsTab onUpdate={loadStats} />}
                    {activeTab === 'friends' && <FriendsListTab onUpdate={loadStats} />}
                    {activeTab === 'followers' && <FollowersTab onUpdate={loadStats} />}
                    {activeTab === 'suggestions' && <SuggestionsTab onUpdate={loadStats} />}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FriendsManagementHub;