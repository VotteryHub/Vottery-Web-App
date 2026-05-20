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

  async function loadData() {
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
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
            activeView === 'followers' ?'bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30' :'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white'
          }`}
        >
          Followers ({followers?.length})
        </button>
        <button
          onClick={() => setActiveView('following')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
            activeView === 'following' ?'bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 dark:border-primary/30' :'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white'
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
          <Icon name="Heart" size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 text-lg">
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
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 hover:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
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
                    <h3 className="font-semibold text-black dark:text-white truncate">
                      {displayUser?.name || 'Unknown'}
                    </h3>
                    {displayUser?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
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