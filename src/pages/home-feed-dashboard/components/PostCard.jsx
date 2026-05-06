import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import SocialShareMenu from './SocialShareMenu';
import CommentsSection from './CommentsSection';
import { reactionsService } from '../../../services/reactionsService';
import { USER_PROFILE_HUB_ROUTE } from '../../../constants/navigationHubRoutes';

const PostCard = ({ post, currentUser, onInteraction }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [userReactions, setUserReactions] = useState([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const commonEmojis = ['❤️', '👍', '😂', '😢', '😮', '🔥', '🎉', '👏'];

  useEffect(() => {
    loadReactions();
  }, [post?.id]);

  const loadReactions = async () => {
    try {
      const { data: reactionsData } = await reactionsService?.getReactions('post', post?.id) || {};
      const { data: userReactionsData } = await reactionsService?.getUserReactions('post', post?.id) || {};
      setReactions(reactionsData || []);
      setUserReactions(userReactionsData || []);
    } catch (err) {
      // Non-critical — reactions unavailable (e.g. no Supabase connection)
      console.warn('Failed to load reactions:', err?.message);
    }
  };

  const handleReaction = async (emoji) => {
    if (userReactions?.includes(emoji)) {
      await reactionsService?.removeReaction('post', post?.id, emoji);
      onInteraction?.('unreact');
    } else {
      await reactionsService?.addReaction('post', post?.id, emoji);
      onInteraction?.('react');
    }
    loadReactions();
    setShowReactionPicker(false);
  };

  const handleComment = () => {
    setShowComments(!showComments);
    onInteraction?.('comment');
  };

  const handleShare = () => {
    onInteraction?.('share');
    setShowShareMenu(!showShareMenu);
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const profileUrl = `${USER_PROFILE_HUB_ROUTE}?id=${post?.userId}`;

  return (
    <div className="premium-glass premium-card hover-lift w-full max-w-xl mx-auto mb-6 md:mb-8 relative z-0 group/card p-4 md:p-6 transition-all duration-500">
      <div className="flex items-start gap-3 mb-4">
        <Link to={profileUrl} className="relative group flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg premium-avatar transition-all duration-500 hover:ring-4 hover:ring-primary/20 uppercase shadow-lg">
            {(post?.userProfiles?.name || post?.userProfiles?.full_name || post?.userProfiles?.username || 'V').charAt(0)}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to={profileUrl} className="hover:underline">
              <h3 className="font-heading font-black text-foreground hover:text-primary transition-colors duration-300 cursor-pointer text-base md:text-[17px] tracking-tight truncate">
                {post?.userProfiles?.name || 'Anonymous'}
              </h3>
            </Link>
            {post?.userProfiles?.verified && (
              <Icon name="BadgeCheck" size={18} strokeWidth={2.5} className="text-primary flex-shrink-0" />
            )}
            <Link to={profileUrl} className="text-xs md:text-[14px] text-blue-500 font-black tracking-tight truncate hover:underline">
              @{post?.userProfiles?.username || 'user'}
            </Link>
            <span className="text-sm text-muted-foreground font-bold hidden sm:inline">·</span>
            <span className="text-xs md:text-[14px] text-muted-foreground font-bold tracking-tight">{formatTimeAgo(post?.createdAt)}</span>
          </div>
          {post?.isSponsored && (
            <div className="flex items-center gap-1.5 mt-1 text-[9px] md:text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 uppercase tracking-[0.15em] animate-pulse-soft">
              <Icon name="Target" size={10} className="text-blue-600" />
              <span>Sponsored • {post?.elections?.title || 'Featured Election'}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-6">
        <p className="text-foreground text-base md:text-[18px] whitespace-pre-wrap leading-relaxed md:leading-[1.6] font-semibold tracking-tight">{post?.content}</p>
      </div>
      {post?.image &&
      <div className="mb-4 rounded-xl overflow-hidden group">
          <Image
          src={post?.image}
          alt={post?.imageAlt || 'Post image'}
          className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />

        </div>
      }
      <div className="flex items-center gap-6 pt-4 border-t border-border">
        {/* Reactions */}
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-all duration-300 ease-in-out transform hover:scale-110 group">

            <Icon name="Heart" size={24} strokeWidth={3} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
            <span className="text-base font-black group-hover:text-red-500 text-foreground">
              {reactions?.reduce((sum, r) => sum + r?.count, 0) || 0}
            </span>
          </button>

          {/* Reaction Picker */}
          {showReactionPicker &&
            <div className="absolute bottom-full left-0 mb-2 bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-2 z-10 backdrop-blur-xl">
              <div className="flex gap-1">
                {commonEmojis?.map((emoji) =>
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className={`p-2 hover:bg-white/10 rounded-xl transition-colors text-xl ${
                      userReactions?.includes(emoji) ? 'bg-primary/20' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                )}
              </div>
            </div>
          }

          {/* Reaction Display */}
          {reactions?.length > 0 &&
          <div className="absolute -bottom-2 left-0 flex gap-1 mt-1">
              {reactions?.slice(0, 3)?.map((reaction, index) =>
            <span
              key={index}
              className="text-xs bg-card border border-border rounded-full px-1.5 py-0.5">

                  {reaction?.emoji} {reaction?.count}
                </span>
            )}
            </div>
          }
        </div>

        <button
          onClick={handleComment}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 ease-in-out transform hover:scale-110">

          <Icon name="MessageCircle" size={18} />
          <span className="text-sm font-medium">{post?.comments || 0}</span>
        </button>

        {/* Share with Menu */}
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-all duration-300 ease-in-out transform hover:scale-110">

            <Icon name="Share2" size={18} />
            <span className="text-sm font-medium">{post?.shares || 0}</span>
          </button>

          {showShareMenu &&
          <SocialShareMenu
            contentType="post"
            contentId={post?.id}
            title={post?.content?.substring(0, 100)}
            onClose={() => setShowShareMenu(false)} />

          }
        </div>
      </div>

      {/* Expanded Comments Section */}
      {showComments && (
        <div className="mt-6 pt-6 border-t-2 border-primary/5 animate-in slide-in-from-top duration-300">
          <CommentsSection
            contentType="post"
            contentId={post?.id}
            commentsEnabled={true}
            isCreator={currentUser?.id === post?.userId}
          />
        </div>
      )}
    </div>);

};

export default PostCard;