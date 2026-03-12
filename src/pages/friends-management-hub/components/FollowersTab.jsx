import React, { useState, useEffect } from 'react';
import { friendsService } from '../../../services/friendsService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FollowersTab = ({ onUpdate }) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('followers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [followersData, followingData] = await Promise.all([
        friendsService?.getFollowers(),
        friendsService?.getFollowing()
      ]);
      setFollowers(followersData?.data || []);
      setFollowing(followingData?.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await friendsService?.unfollowUser(userId);
      await loadData();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to unfollow:', err);
    }
  };

  const displayList = activeView === 'followers' ? followers : following;

  return (
    <div>
      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView('followers')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'followers' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Followers ({followers?.length})
        </button>
        <button
          onClick={() => setActiveView('following')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeView === 'following' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Following ({following?.length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={48} className="animate-spin text-primary" />
        </div>
      ) : displayList?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Heart" size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No {activeView} yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList?.map((item) => {
            const displayUser = activeView === 'followers' ? item?.follower : item?.following;
            return (
              <div
                key={item?.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {displayUser?.avatar ? (
                    <img
                      src={displayUser?.avatar}
                      alt={`${displayUser?.name} profile picture`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={24} className="text-primary" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {displayUser?.name || 'Unknown'}
                    </h3>
                    {displayUser?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    @{displayUser?.username || 'user'}
                  </p>
                </div>

                {/* Actions */}
                {activeView === 'following' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnfollow(displayUser?.id)}
                  >
                    Unfollow
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FollowersTab;