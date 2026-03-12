import React, { useState, useEffect } from 'react';
import { friendsService } from '../../../services/friendsService';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FriendsListTab = ({ onUpdate }) => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const { data, error } = await friendsService?.getFriends();
      if (error) throw new Error(error?.message);
      setFriends(data || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfriend = async (friendshipId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    try {
      await friendsService?.unfriend(friendshipId);
      await loadFriends();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to unfriend:', err);
    }
  };

  const getFriendUser = (friendship) => {
    return friendship?.userOneId === user?.id ? friendship?.userTwo : friendship?.userOne;
  };

  const filteredFriends = friends?.filter(f => {
    const friendUser = getFriendUser(f);
    return friendUser?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
           friendUser?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Icon
            name="Search"
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Friends Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={48} className="animate-spin text-primary" />
        </div>
      ) : filteredFriends?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Users" size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery ? 'No friends found' : 'No friends yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends?.map((friendship) => {
            const friendUser = getFriendUser(friendship);
            return (
              <div
                key={friendship?.id}
                className="card p-4 hover:shadow-lg transition-all duration-300"
              >
                {/* Avatar */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    {friendUser?.avatar ? (
                      <img
                        src={friendUser?.avatar}
                        alt={`${friendUser?.name} profile picture`}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="User" size={28} className="text-primary" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {friendUser?.name || 'Unknown'}
                      </h3>
                      {friendUser?.verified && (
                        <Icon name="BadgeCheck" size={16} className="text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      @{friendUser?.username || 'user'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {friendUser?.stats?.votes || 0}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">Votes</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {friendUser?.stats?.friends || 0}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">Friends</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="default" size="sm" fullWidth iconName="MessageCircle">
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="UserMinus"
                    onClick={() => handleUnfriend(friendship?.id)}
                  >
                    Unfriend
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendsListTab;