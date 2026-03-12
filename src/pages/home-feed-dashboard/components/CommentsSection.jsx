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
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="CornerDownRight" size={16} />
                  <span>Replying to comment</span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-primary hover:text-primary/80"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment?.trim() || submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={32} className="animate-spin text-primary" />
        </div>
      ) : comments?.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="MessageCircle" size={48} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment) => (
            <div key={comment?.id} className="flex items-start gap-3">
              <Image
                src={comment?.user?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                alt={`${comment?.user?.name} profile picture`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-semibold text-foreground">
                      {comment?.user?.name}
                    </span>
                    {comment?.user?.verified && (
                      <Icon name="BadgeCheck" size={14} className="text-primary" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment?.createdAt)}
                    </span>
                    {comment?.isEdited && (
                      <span className="text-xs text-muted-foreground">(edited)</span>
                    )}
                  </div>
                  {editingComment === comment?.id ? (
                    <div>
                      <textarea
                        defaultValue={comment?.content}
                        className="w-full px-3 py-2 rounded border border-border bg-background text-foreground resize-none"
                        rows={2}
                        id={`edit-${comment?.id}`}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            const textarea = document.getElementById(`edit-${comment?.id}`);
                            handleEditComment(comment?.id, textarea?.value);
                          }}
                          className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="px-3 py-1 rounded bg-muted text-foreground text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-foreground">{comment?.content}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLikeComment(comment?.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Icon name="Heart" size={14} />
                    <span>{comment?.likesCount || 0}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(comment?.id)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Reply
                  </button>
                  {comment?.userId === user?.id && (
                    <>
                      <button
                        onClick={() => setEditingComment(comment?.id)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment?.id)}
                        className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {comment?.repliesCount > 0 && (
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      View {comment?.repliesCount} {comment?.repliesCount === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;