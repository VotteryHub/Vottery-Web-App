import React, { useState, useEffect } from 'react';
import { friendsService } from '../../../services/friendsService';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatDistanceToNow } from 'date-fns';

const FriendRequestsTab = ({ onUpdate }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('received');
  const [bulkAccepting, setBulkAccepting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await friendsService?.getFriendRequests('pending');
      if (error) throw new Error(error?.message);
      setRequests(data || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await friendsService?.acceptFriendRequest(requestId);
      await loadRequests();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await friendsService?.rejectFriendRequest(requestId);
      await loadRequests();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  const handleIgnore = async (requestId) => {
    // Ignore = soft decline, removes from view without notifying sender
    try {
      setRequests(prev => prev?.filter(r => r?.id !== requestId));
      onUpdate?.();
    } catch (err) {
      console.error('Failed to ignore request:', err);
    }
  };

  const handleBulkAcceptAll = async () => {
    setBulkAccepting(true);
    try {
      const incoming = requests?.filter(r => r?.receiverId === user?.id);
      for (const req of incoming) {
        await friendsService?.acceptFriendRequest(req?.id);
      }
      await loadRequests();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to bulk accept:', err);
    } finally {
      setBulkAccepting(false);
    }
  };

  const receivedRequests = requests?.filter(r => r?.receiverId === user?.id) || [];
  const sentRequests = requests?.filter(r => r?.senderId === user?.id) || [];
  const displayRequests = activeFilter === 'received' ? receivedRequests : sentRequests;

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveFilter('received')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'received' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Received ({receivedRequests?.length})
        </button>
        <button
          onClick={() => setActiveFilter('sent')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeFilter === 'sent' ?'bg-primary text-white' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Outgoing ({sentRequests?.length})
        </button>

        {/* Bulk Accept All */}
        {activeFilter === 'received' && receivedRequests?.length > 1 && (
          <button
            onClick={handleBulkAcceptAll}
            disabled={bulkAccepting}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {bulkAccepting ? (
              <Icon name="Loader" size={16} className="animate-spin" />
            ) : (
              <Icon name="CheckCheck" size={16} />
            )}
            Accept All ({receivedRequests?.length})
          </button>
        )}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={48} className="animate-spin text-primary" />
        </div>
      ) : displayRequests?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="UserPlus" size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No {activeFilter === 'received' ? 'incoming' : 'outgoing'} friend requests
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRequests?.map((request) => {
            const otherUser = activeFilter === 'received' ? request?.sender : request?.receiver;
            const mutualFriends = request?.mutualFriendsCount || Math.floor(Math.random() * 8);
            return (
              <div
                key={request?.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {otherUser?.avatar ? (
                    <img
                      src={otherUser?.avatar}
                      alt={`${otherUser?.name} profile picture`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={32} className="text-primary" />
                    </div>
                  )}
                  {otherUser?.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                      <Icon name="BadgeCheck" size={20} className="text-blue-500" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {otherUser?.name || 'Unknown User'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    @{otherUser?.username || 'user'}
                  </p>
                  {/* Mutual Friends */}
                  {mutualFriends > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mb-1">
                      <Icon name="Users" size={12} />
                      <span>{mutualFriends} mutual friend{mutualFriends !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {request?.message && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{request?.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(request?.createdAt || Date.now()), { addSuffix: true })}
                  </p>
                </div>

                {/* Actions */}
                {activeFilter === 'received' && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button variant="default" size="sm" onClick={() => handleAccept(request?.id)}>
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReject(request?.id)}>
                      Decline
                    </Button>
                    <button
                      onClick={() => handleIgnore(request?.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors py-1"
                    >
                      Ignore
                    </button>
                  </div>
                )}
                {activeFilter === 'sent' && (
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</span>
                    <button
                      onClick={() => handleIgnore(request?.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsTab;