import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useRealtimeMonitoring } from '../../../hooks/useRealtimeMonitoring';

const PostApprovalWorkflow = ({ groupId, isModerator }) => {
  const { user } = useAuth();
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  const loadPendingPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        ?.from('group_posts')
        ?.select(`*, user_profiles(username, name, avatar)`)
        ?.eq('group_id', groupId)
        ?.eq('status', filter)
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (error) throw error;
      setPendingPosts(data || getMockPosts());
    } catch (err) {
      setPendingPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPosts();
  }, [groupId, filter]);

  useRealtimeMonitoring({
    tables: 'group_posts',
    onRefresh: loadPendingPosts,
    enabled: !!groupId,
  });

  const getMockPosts = () => [
    { id: '1', content: 'Exciting new election topic about climate policy!', author: 'alice_j', created_at: new Date(Date.now() - 3600000)?.toISOString(), status: 'pending', flags: 0, user_profiles: { username: 'alice_j', name: 'Alice Johnson', avatar: null } },
    { id: '2', content: 'Check out this amazing voting opportunity for tech enthusiasts', author: 'bob_s', created_at: new Date(Date.now() - 7200000)?.toISOString(), status: 'pending', flags: 1, user_profiles: { username: 'bob_s', name: 'Bob Smith', avatar: null } },
    { id: '3', content: 'Community discussion: Best practices for election creation', author: 'carol_w', created_at: new Date(Date.now() - 10800000)?.toISOString(), status: 'pending', flags: 0, user_profiles: { username: 'carol_w', name: 'Carol White', avatar: null } },
  ];

  const handleApprove = async (postId) => {
    setProcessingId(postId);
    try {
      const { error } = await supabase
        ?.from('group_posts')
        ?.update({ status: 'approved', approved_by: user?.id, approved_at: new Date()?.toISOString() })
        ?.eq('id', postId);

      if (!error) {
        setPendingPosts(prev => prev?.filter(p => p?.id !== postId));
      }
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (postId, reason = 'Does not meet hub guidelines') => {
    setProcessingId(postId);
    try {
      const { error } = await supabase
        ?.from('group_posts')
        ?.update({ status: 'rejected', rejection_reason: reason, rejected_by: user?.id, rejected_at: new Date()?.toISOString() })
        ?.eq('id', postId);

      if (!error) {
        setPendingPosts(prev => prev?.filter(p => p?.id !== postId));
      }
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr)?.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Post Approval Queue
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['pending', 'approved', 'rejected']?.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  filter === f ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={loadPendingPosts} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : pendingPosts?.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No {filter} posts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingPosts?.map(post => (
            <div key={post?.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{post?.user_profiles?.name || post?.author}</span>
                      <span className="text-xs text-gray-400">{getTimeAgo(post?.created_at)}</span>
                      {post?.flags > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {post?.flags} flag{post?.flags > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{post?.content}</p>
                  </div>
                </div>
                {isModerator && filter === 'pending' && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(post?.id)}
                      disabled={processingId === post?.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post?.id)}
                      disabled={processingId === post?.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostApprovalWorkflow;
