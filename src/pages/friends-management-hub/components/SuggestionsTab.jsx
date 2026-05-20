import React, { useState, useEffect } from 'react';
import { friendsService } from '../../../services/friendsService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuggestionsTab = ({ onUpdate }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      const { data, error } = await friendsService?.getSuggestedFriends();
      if (error) throw new Error(error?.message);
      setSuggestions(data || []);
    } catch (err) {
      console.error('Failed to load suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendsService?.sendFriendRequest(userId, 'Hi! Let\'s connect on Vottery!');
      setSuggestions(prev => prev?.filter(s => s?.id !== userId));
      onUpdate?.();
    } catch (err) {
      console.error('Failed to send request:', err);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await friendsService?.followUser(userId);
      onUpdate?.();
    } catch (err) {
      console.error('Failed to follow:', err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          People you may know
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Based on mutual connections and shared interests
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={48} className="animate-spin text-primary" />
        </div>
      ) : suggestions?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Sparkles" size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No suggestions available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions?.map((suggestedUser) => (
            <div
              key={suggestedUser?.id}
              className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 p-4 hover:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-3">
                  {suggestedUser?.avatar ? (
                    <img
                      src={suggestedUser?.avatar}
                      alt={`${suggestedUser?.name} profile picture`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={40} className="text-primary" />
                    </div>
                  )}
                  {suggestedUser?.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                      <Icon name="BadgeCheck" size={20} className="text-blue-500" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-black dark:text-white mb-1">
                    {suggestedUser?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    @{suggestedUser?.username || 'user'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-black dark:text-white">
                    {suggestedUser?.stats?.votes || 0}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">Votes</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-black dark:text-white">
                    {suggestedUser?.stats?.friends || 0}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">Friends</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  iconName="UserPlus"
                  onClick={() => handleSendRequest(suggestedUser?.id)}
                >
                  Add Friend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Heart"
                  onClick={() => handleFollow(suggestedUser?.id)}
                >
                  Follow
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsTab;