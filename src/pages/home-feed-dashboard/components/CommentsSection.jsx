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

  const loadComments = async () => {
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
        <div className="flex items-center justify-center py-12">
          <Icon name="Loader" size={40} className="animate-spin text-primary opacity-50" />
        </div>
      ) : comments?.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
          <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground font-medium">No conversation yet.</p>
          <p className="text-sm text-muted-foreground/60">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            // Build comment tree
            const buildTree = (parentId = null, level = 0) => {
              return comments
                .filter(c => c.parentId === parentId)
                .map(comment => (
                  <div key={comment.id} className={`${level > 0 ? 'ml-8 mt-4 border-l-2 border-primary/20 pl-4' : ''}`}>
                    <div className="flex items-start gap-3 group">
                      <Image
                        src={comment?.user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                        alt={`${comment?.user?.name} profile picture`}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/50 dark:bg-gray-800/50 rounded-2xl p-4 shadow-sm group-hover:bg-muted dark:group-hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-foreground hover:text-primary cursor-pointer transition-colors">
                                {comment?.user?.name}
                              </span>
                              {comment?.user?.verified && (
                                <Icon name="BadgeCheck" size={16} className="text-primary" />
                              )}
                              <span className="text-[10px] md:text-xs text-muted-foreground opacity-70">
                                {formatTimeAgo(comment?.createdAt)}
                              </span>
                            </div>
                            
                            {/* Actions Dropdown could go here */}
                          </div>
                          
                          {editingComment === comment?.id ? (
                            <div className="space-y-3">
                              <textarea
                                defaultValue={comment?.content}
                                className="w-full px-4 py-2 rounded-xl border border-primary bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/20"
                                rows={2}
                                id={`edit-${comment?.id}`}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const textarea = document.getElementById(`edit-${comment?.id}`);
                                    handleEditComment(comment?.id, textarea?.value);
                                  }}
                                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => setEditingComment(null)}
                                  className="px-4 py-1.5 rounded-lg bg-muted text-foreground text-xs font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm md:text-base text-foreground leading-relaxed">
                              {comment?.content}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-6 mt-2 px-2">
                          <button
                            onClick={() => handleLikeComment(comment?.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 ${
                              comment?.isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            <Icon name="Heart" size={14} className={comment?.isLiked ? 'fill-primary' : ''} />
                            <span>{comment?.likesCount || 0}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setReplyingTo(comment?.id);
                              // Smooth scroll to top input
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Icon name="Reply" size={14} />
                            Reply
                          </button>

                          {comment?.userId === user?.id && (
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setEditingComment(comment?.id)}
                                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment?.id)}
                                className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        {/* Render Replies */}
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