import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { commentsService } from '../../../services/commentsService';
import { useAuth } from '../../../contexts/AuthContext';

const CommentsSection = ({ contentType, contentId, creatorId }) => {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const isCreator = user?.id === creatorId;

  useEffect(() => {
    loadComments();
    loadCommentsSettings();

    const unsubscribe = commentsService?.subscribeToComments(contentType, contentId, () => {
      loadComments();
    });

    return () => unsubscribe?.();
  }, [contentType, contentId]);

  const loadComments = async () => {
    try {
      const { data, error } = await commentsService?.getComments(contentType, contentId);
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentsSettings = async () => {
    try {
      const { data } = await commentsService?.getCommentsSettings(contentType, contentId);
      setCommentsEnabled(data?.commentsEnabled ?? true);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment?.trim()) return;

    try {
      const { error } = await commentsService?.createComment({
        contentType,
        contentId,
        content: newComment
      });

      if (error) throw error;
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText?.trim()) return;

    try {
      const { error } = await commentsService?.updateComment(commentId, { content: editText });
      if (error) throw error;
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to edit comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const { error } = await commentsService?.deleteComment(commentId);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const toggleCommentsEnabled = async () => {
    try {
      const { error } = await commentsService?.toggleComments(contentType, contentId, !commentsEnabled);
      if (error) throw error;
      setCommentsEnabled(!commentsEnabled);
    } catch (err) {
      console.error('Failed to toggle comments:', err);
    }
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

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
          <Icon name="MessageSquare" size={28} className="text-primary" />
          Comments ({comments?.length})
        </h2>
        {isCreator && (
          <button
            onClick={toggleCommentsEnabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              commentsEnabled
                ? 'bg-success/10 text-success hover:bg-success/20' :'bg-destructive/10 text-destructive hover:bg-destructive/20'
            }`}
          >
            <Icon name={commentsEnabled ? 'MessageSquare' : 'MessageSquareOff'} size={16} className="inline mr-2" />
            {commentsEnabled ? 'Comments Enabled' : 'Comments Disabled'}
          </button>
        )}
      </div>

      {!commentsEnabled && (
        <div className="text-center py-8 bg-muted rounded-lg">
          <Icon name="MessageSquareOff" size={48} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Comments are disabled for this content</p>
        </div>
      )}

      {commentsEnabled && (
        <>
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <img
                src={userProfile?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                alt={`${userProfile?.name} avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e?.target?.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={handlePostComment}
                    disabled={!newComment?.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icon name="Loader" size={32} className="animate-spin text-primary" />
              </div>
            ) : comments?.length === 0 ? (
              <div className="text-center py-8 bg-muted rounded-lg">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments?.map((comment) => (
                <div key={comment?.id} className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-all">
                  <img
                    src={comment?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                    alt={`${comment?.userProfiles?.name} avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{comment?.userProfiles?.name}</h4>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(comment?.createdAt)}</span>
                    </div>
                    
                    {editingCommentId === comment?.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e?.target?.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={2}
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleEditComment(comment?.id)}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditText('');
                            }}
                            className="px-3 py-1 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground text-sm">{comment?.content}</p>
                    )}

                    {(user?.id === comment?.userId || isCreator) && editingCommentId !== comment?.id && (
                      <div className="flex items-center gap-3 mt-2">
                        {user?.id === comment?.userId && (
                          <button
                            onClick={() => {
                              setEditingCommentId(comment?.id);
                              setEditText(comment?.content);
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment?.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentsSection;