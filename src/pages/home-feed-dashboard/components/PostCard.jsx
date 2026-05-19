import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import SocialShareMenu from './SocialShareMenu';
import CommentsSection from './CommentsSection';
import { reactionsService } from '../../../services/reactionsService';
import { friendsService } from '../../../services/friendsService';
import { USER_PROFILE_HUB_ROUTE } from '../../../constants/navigationHubRoutes';
import toast from 'react-hot-toast';

const PostCard = ({ post, currentUser, onInteraction }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [socialStates, setSocialStates] = useState({
    following: false,
    friendRequestSent: false
  });

  const reactionOptions = [
    { emoji: '👍', label: 'Like', color: 'text-blue-500' },
    { emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { emoji: '🥰', label: 'Care', color: 'text-yellow-500' },
    { emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
    { emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
    { emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
    { emoji: '😡', label: 'Angry', color: 'text-orange-500' },
  ];

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
      console.warn('Failed to load reactions:', err?.message);
    }
  };

  const handleReaction = async (emoji) => {
    if (userReactions?.includes(emoji)) {
      await reactionsService?.removeReaction('post', post?.id, emoji);
      onInteraction?.('unreact');
    } else {
      // Facebook logic: if reacting with a different emoji, remove old ones first (usually only one reaction allowed)
      if (userReactions.length > 0) {
        for (const oldEmoji of userReactions) {
          await reactionsService?.removeReaction('post', post?.id, oldEmoji);
        }
      }
      await reactionsService?.addReaction('post', post?.id, emoji);
      onInteraction?.('react');
    }
    loadReactions();
    setShowReactionPicker(false);
  };

  const activeReaction = reactionOptions.find(r => userReactions.includes(r.emoji));

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
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-white/10 w-full max-w-2xl mx-auto mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={profileUrl} className="relative group">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary overflow-hidden">
              {post?.userProfiles?.avatar_url ? (
                <Image src={post.userProfiles.avatar_url} alt={post.userProfiles.name} className="w-full h-full object-cover" />
              ) : (
                (post?.userProfiles?.name || 'V').charAt(0).toUpperCase()
              )}
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-1">
              <Link to={profileUrl} className="font-bold text-[15px] hover:underline dark:text-white">
                {post?.userProfiles?.name || 'Anonymous'}
              </Link>
              {post?.userProfiles?.verified && <Icon name="BadgeCheck" size={16} className="text-blue-500" />}
            </div>
            <div className="flex items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400">
               <span>{formatTimeAgo(post?.createdAt)}</span>
               <span>·</span>
               <Icon name="Globe" size={12} />
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500">
          <Icon name="MoreHorizontal" size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] dark:text-white leading-normal whitespace-pre-wrap">{post?.content}</p>
      </div>

      {post?.image && (
        <div className="border-y border-slate-100 dark:border-white/5">
           <Image src={post.image} alt="Post content" className="w-full h-auto max-h-[600px] object-contain bg-slate-50 dark:bg-black" />
        </div>
      )}

      {/* Stats Summary */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5 mx-4">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {reactions.slice(0, 3).map((r, i) => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] shadow-sm">
                {r.emoji}
              </div>
            ))}
          </div>
          <span className="text-[14px] text-slate-500 dark:text-slate-400">
            {reactions.reduce((sum, r) => sum + r.count, 0) || 0}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[14px] text-slate-500 dark:text-slate-400">
           <span>{post?.comments || 0} comments</span>
           <span>{post?.shares || 0} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-1 flex items-center justify-between relative">
        <div 
          className="flex-1 relative"
          onMouseEnter={() => setShowReactionPicker(true)}
          onMouseLeave={() => setShowReactionPicker(false)}
        >
          <button
            onClick={() => handleReaction('👍')}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
              activeReaction ? activeReaction.color : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {activeReaction ? (
              <span className="text-xl animate-in zoom-in duration-200">{activeReaction.emoji}</span>
            ) : (
              <Icon name="ThumbsUp" size={20} />
            )}
            <span className="font-bold text-[14px]">{activeReaction ? activeReaction.label : 'Like'}</span>
          </button>

          {/* Reaction Picker Popover */}
          {showReactionPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full shadow-2xl p-1.5 flex gap-1 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
               {reactionOptions.map((opt) => (
                 <button
                   key={opt.emoji}
                   onClick={() => handleReaction(opt.emoji)}
                   className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-125 transition-all duration-200 text-2xl"
                   title={opt.label}
                 >
                   {opt.emoji}
                 </button>
               ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <Icon name="MessageSquare" size={20} />
          <span className="font-bold text-[14px]">Comment</span>
        </button>

        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <Icon name="Share2" size={20} />
          <span className="font-bold text-[14px]">Share</span>
        </button>

        {showShareMenu && (
          <div className="absolute bottom-full right-4 mb-2 z-50">
             <SocialShareMenu
                contentType="post"
                contentId={post?.id}
                onClose={() => setShowShareMenu(false)}
             />
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-white/5 animate-in slide-in-from-top-2 duration-300">
          <CommentsSection
            contentType="post"
            contentId={post?.id}
            isCreator={currentUser?.id === post?.userId}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;