import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import SocialShareMenu from './SocialShareMenu';
import { reactionsService } from '../../../services/reactionsService';

const PostCard = ({ post, currentUser, onInteraction }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [userReactions, setUserReactions] = useState([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const commonEmojis = ['❤️', '👍', '😂', '😢', '😮', '🔥', '🎉', '👏'];

  useEffect(() => {
    loadReactions();
  }, [post?.id]);

  const loadReactions = async () => {
    const { data: reactionsData } = await reactionsService?.getReactions('post', post?.id);
    const { data: userReactionsData } = await reactionsService?.getUserReactions('post', post?.id);
    setReactions(reactionsData || []);
    setUserReactions(userReactionsData || []);
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
    onInteraction?.('comment');
  };

  const handleShare = () => {
    onInteraction?.('share');
    setShowShareMenu(!showShareMenu);
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
    <div className="card p-4 md:p-6 transition-all duration-500 ease-in-out hover:shadow-lg hover:scale-[1.01] hover:border-primary/20 w-full max-w-[545.67px] mx-auto sm:max-w-full md:max-w-[545.67px] lg:max-w-[545.67px] mr-[-34px] -ml-1 px-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="relative group">
          <Image
            src={post?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
            alt={`${post?.userProfiles?.name || 'User'} profile picture`}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300" />

        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-semibold text-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
              {post?.userProfiles?.name || 'Anonymous'}
            </h3>
            {post?.userProfiles?.verified &&
            <Icon name="BadgeCheck" size={20} strokeWidth={2.5} className="text-primary" />
            }
            <span className="text-sm text-muted-foreground">@{post?.userProfiles?.username || 'user'}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{formatTimeAgo(post?.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post?.content}</p>
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

            <Icon name="Heart" size={22} strokeWidth={2.5} className="group-hover:fill-red-500" />
            <span className="text-sm font-medium">
              {reactions?.reduce((sum, r) => sum + r?.count, 0) || 0}
            </span>
          </button>

          {/* Reaction Picker */}
          {showReactionPicker &&
          <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
              <div className="flex gap-1">
                {commonEmojis?.map((emoji) =>
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`p-2 hover:bg-muted rounded transition-colors text-xl ${
                userReactions?.includes(emoji) ? 'bg-primary/10' : ''}`
                }>

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
    </div>);

};

export default PostCard;