import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { commentsService } from '../../../services/commentsService';
import { useAuth } from '../../../contexts/AuthContext';

const CommentsSection = ({ contentType, contentId, commentsEnabled = true, isCreator = false, onToggleComments }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (commentsEnabled) {
      loadComments();
      const unsubscribe = commentsService?.subscribeToComments(contentType, contentId, () => {
        loadComments();
      });
      return () => unsubscribe?.();
    }
  }, [contentType, contentId, commentsEnabled]);

  async function loadComments() {
    setLoading(true);
    const { data, error } = await commentsService?.getComments(contentType, contentId);
    if (!error && data) {
      setComments(data);
    }
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment?.trim() || submitting) return;

    setSubmitting(true);
    const { error } = await commentsService?.createComment(
      contentType,
      contentId,
      newComment,
      replyingTo
    );

    if (!error) {
      setNewComment('');
      setReplyingTo(null);
      loadComments();
    }
    setSubmitting(false);
  };

  const handleEditComment = async (commentId, newContent) => {
    const { error } = await commentsService?.updateComment(commentId, newContent);
    if (!error) {
      setEditingComment(null);
      loadComments();
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window?.confirm('Are you sure you want to delete this comment?')) {
      const { error } = await commentsService?.deleteComment(commentId);
      if (!error) {
        loadComments();
      }
    }
  };

  const handleLikeComment = async (commentId) => {
    await commentsService?.toggleLike(commentId);
    loadComments();
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!commentsEnabled) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Icon name="MessageCircleOff" size={48} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Comments are disabled for this content</p>
          {isCreator && (
            <button
              onClick={onToggleComments}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Enable Comments
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="MessageCircle" size={24} />
          Comments ({comments?.length || 0})
        </h3>
        {isCreator && (
          <button
            onClick={onToggleComments}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="Settings" size={18} />
          </button>
        )}
      </div>

      {/* New Comment Input */}
      {user && (
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <Image
              src={user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt="Your profile picture"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              {replyingTo && (
                <div className="mb-2 flex items-center gap-2 text-sm text-primary bg-primary/5 p-2 rounded-lg">
                  <Icon name="CornerDownRight" size={16} />
                  <span>Replying to <strong>{comments?.find(c => c.id === replyingTo)?.user?.name || 'comment'}</strong></span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="ml-auto p-1 hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                rows={3}
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                {replyingTo && (
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment?.trim() || submitting}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                >
                  {submitting ? 'Posting...' : replyingTo ? 'Post Reply' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={32} className="animate-spin text-slate-400" />
        </div>
      ) : comments?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No comments yet. Be the first to reply!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(() => {
            const buildTree = (parentId = null, level = 0) => {
              return comments
                .filter(c => c.parentId === parentId)
                .map(comment => (
                  <div key={comment.id} className={`${level > 0 ? 'ml-9 mt-2' : 'mt-4'}`}>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {comment?.user?.avatar_url ? (
                          <Image src={comment.user.avatar_url} alt={comment.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-xs">{(comment?.user?.name || 'V').charAt(0)}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Gray Bubble */}
                        <div className="inline-block bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 max-w-[95%]">
                           <div className="flex items-center gap-1.5">
                             <span className="text-[13px] font-bold dark:text-white hover:underline cursor-pointer">
                               {comment?.user?.name}
                             </span>
                             {comment?.user?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-500" />}
                           </div>
                           <p className="text-[14px] dark:text-slate-200 leading-tight">{comment?.content}</p>
                        </div>
                        
                        {/* Action Links */}
                        <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] font-bold text-slate-500 dark:text-slate-400">
                           <button 
                             onClick={() => handleLikeComment(comment.id)}
                             className={`hover:underline ${comment.isLiked ? 'text-primary' : ''}`}
                           >
                             Like
                           </button>
                           <button 
                             onClick={() => setReplyingTo(comment.id)}
                             className="hover:underline"
                           >
                             Reply
                           </button>
                           <span className="font-normal">{formatTimeAgo(comment.createdAt)}</span>
                           
                           {comment.likesCount > 0 && (
                             <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-full px-1 py-0.5 shadow-sm border border-slate-100 dark:border-white/5 ml-1">
                                <span className="text-[10px]">👍</span>
                                <span className="text-[10px] font-normal">{comment.likesCount}</span>
                             </div>
                           )}
                        </div>

                        {/* Recursive Replies */}
                        {buildTree(comment.id, level + 1)}
                      </div>
                    </div>
                  </div>
                ));
            };
            return buildTree(null);
          })()}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;