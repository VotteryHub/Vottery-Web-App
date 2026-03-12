import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { friendsService } from '../../../services/friendsService';
import { useAuth } from '../../../contexts/AuthContext';

const FriendFollowerManagementPanel = ({ socialData, onRefresh }) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('friends');
  const [loading, setLoading] = useState(false);

  const handleFollow = async (userId) => {
    try {
      setLoading(true);
      await friendsService?.followUser(userId);
      await onRefresh();
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setLoading(true);
      await friendsService?.unfollowUser(userId);
      await onRefresh();
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setLoading(true);
      await friendsService?.acceptFriendRequest(requestId);
      await onRefresh();
    } catch (error) {
      console.error('Failed to accept request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setLoading(true);
      await friendsService?.rejectFriendRequest(requestId);
      await onRefresh();
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async (friendshipId) => {
    try {
      setLoading(true);
      const { error } = await friendsService?.unfriend(friendshipId);
      if (error) throw new Error(error?.message);
      await onRefresh();
    } catch (error) {
      console.error('Failed to unfriend:', error);
    } finally {
      setLoading(false);
    }
  };

  const subTabs = [
    { id: 'friends', label: 'Friends', count: socialData?.friends?.length || 0 },
    { id: 'followers', label: 'Followers', count: socialData?.followers?.length || 0 },
    { id: 'following', label: 'Following', count: socialData?.following?.length || 0 },
    { id: 'requests', label: 'Requests', count: 0 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Users" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Friend/Follower Management System
          </h2>
        </div>

        <div className="flex gap-2 mb-6">
          {subTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveSubTab(tab?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeSubTab === tab?.id
                  ? 'bg-primary text-white' :'bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab?.label} ({tab?.count})
            </button>
          ))}
        </div>

        {activeSubTab === 'friends' && (
          <div className="space-y-3">
            {socialData?.friends?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No friends yet. Start connecting with other users!</p>
              </div>
            ) : (
              socialData?.friends?.map((friendship) => {
                const friend = friendship?.userOne?.id !== user?.id ? friendship?.userOne : friendship?.userTwo;
                return (
                  <div key={friendship?.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {friend?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{friend?.name}</span>
                          {friend?.verified && (
                            <Icon name="CheckCircle" size={16} className="text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">@{friend?.username}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/direct-messaging-center?user=${friend?.id}`}
                      >
                        <Icon name="MessageCircle" size={16} className="mr-2" />
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfriend(friendship?.id)}
                        disabled={loading}
                      >
                        <Icon name="UserMinus" size={16} className="mr-2" />
                        Unfriend
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeSubTab === 'followers' && (
          <div className="space-y-3">
            {socialData?.followers?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="UserPlus" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No followers yet. Keep creating great content!</p>
              </div>
            ) : (
              socialData?.followers?.map((follower) => (
                <div key={follower?.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {follower?.follower?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{follower?.follower?.name}</span>
                        {follower?.follower?.verified && (
                          <Icon name="CheckCircle" size={16} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">@{follower?.follower?.username}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleFollow(follower?.follower?.id)} disabled={loading}>
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Follow Back
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'following' && (
          <div className="space-y-3">
            {socialData?.following?.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="UserCheck" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Not following anyone yet. Discover users to follow!</p>
              </div>
            ) : (
              socialData?.following?.map((following) => (
                <div key={following?.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {following?.following?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{following?.following?.name}</span>
                        {following?.following?.verified && (
                          <Icon name="CheckCircle" size={16} className="text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">@{following?.following?.username}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleUnfollow(following?.following?.id)} 
                    disabled={loading}
                  >
                    <Icon name="UserMinus" size={16} className="mr-2" />
                    Unfollow
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'requests' && (
          <div className="text-center py-12">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending friend requests</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Privacy-Preserving Interaction Tracking</h3>
            <p className="text-blue-100 mb-4">
              All social interactions are tracked with privacy controls and transparent engagement amplification
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={20} />
                <span className="text-sm">End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Eye" size={20} />
                <span className="text-sm">Transparent algorithms</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Lock" size={20} />
                <span className="text-sm">Privacy-first design</span>
              </div>
            </div>
          </div>
          <Icon name="Users" size={48} className="text-white/30" />
        </div>
      </div>
    </div>
  );
};

export default FriendFollowerManagementPanel;