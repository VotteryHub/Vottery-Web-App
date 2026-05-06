import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const PostApprovalWorkflow = ({ groupId, isModerator }) => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingPosts();
  }, [groupId]);

  const loadPendingPosts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        ?.from('group_posts')
        ?.select('*, user_profiles(name, username, avatar)')
        ?.eq('group_id', groupId)
        ?.eq('status', 'pending')
        ?.order('created_at', { ascending: false });

      setPendingPosts(data || [
        { id: '1', content: 'Check out this amazing election about climate change!', user_profiles: { name: 'Alice Johnson', username: 'alicej' }, created_at: new Date(Date.now() - 3600000)?.toISOString() },
        { id: '2', content: 'Who should be the next group moderator?', user_profiles: { name: 'Bob Smith', username: 'bobsmith' }, created_at: new Date(Date.now() - 7200000)?.toISOString() },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    try {
      await supabase?.from('group_posts')?.update({ status: 'approved', approved_at: new Date()?.toISOString() })?.eq('id', postId);
      setPendingPosts(prev => prev?.filter(p => p?.id !== postId));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (postId) => {
    try {
      await supabase?.from('group_posts')?.update({ status: 'rejected' })?.eq('id', postId);
      setPendingPosts(prev => prev?.filter(p => p?.id !== postId));
    } catch (err) { console.error(err); }
  };

  if (!isModerator) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900 dark:text-white">Post Approval Queue</h3>
        {pendingPosts?.length > 0 && (
          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{pendingPosts?.length} pending</span>
        )}
      </div>
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2]?.map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
        </div>
      ) : pendingPosts?.length === 0 ? (
        <div className="text-center py-6">
          <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No pending posts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingPosts?.map(post => (
            <div key={post?.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post?.user_profiles?.name}</span>
                <span className="text-xs text-gray-400">{new Date(post.created_at)?.toLocaleTimeString()}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">{post?.content}</p>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(post?.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-3 h-3" /> Approve
                </button>
                <button onClick={() => handleReject(post?.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">
                  <XCircle className="w-3 h-3" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostApprovalWorkflow;
