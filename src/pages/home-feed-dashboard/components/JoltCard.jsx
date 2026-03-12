import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const JoltCard = ({ jolt }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(jolt?.isLiked);
  const [likesCount, setLikesCount] = useState(jolt?.likes);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef?.current) {
      if (isPlaying) {
        videoRef?.current?.pause();
      } else {
        videoRef?.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000)?.toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000)?.toFixed(1)}K`;
    return count?.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl w-full h-full">
      {/* Video Content */}
      <div className="relative bg-black rounded-t-xl overflow-hidden">
        <div className="aspect-[9/16] h-[420px]">
          <video
            ref={videoRef}
            src={jolt?.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline />

        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-all duration-200 mt-0 p-[18px]">

          {!isPlaying &&
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-xl">
              <Icon name="Play" size={24} strokeWidth={2.5} className="text-gray-900 ml-1" />
            </div>
          }
        </button>

        {/* Three Dots Menu - Top Right */}
        <button className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10">
          <Icon name="MoreVertical" size={20} strokeWidth={2.5} className="text-white" />
        </button>

        {/* Author Info & Caption Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0 shadow-md">
              {jolt?.author?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-white hover:underline cursor-pointer truncate">
                {jolt?.author?.name}
              </h3>
            </div>
          </div>
          <p className="text-sm font-normal text-white line-clamp-2">
            {jolt?.caption}
          </p>
        </div>
      </div>

      {/* Engagement Stats & Actions */}
      <div className="p-3 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Icon name="Eye" size={14} />
            <span>{formatCount(jolt?.views)} views</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{formatCount(likesCount)} likes</span>
            <span>{formatCount(jolt?.comments)} comments</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`
            }>

            <Icon
              name="Heart"
              size={18}
              fill={isLiked ? 'currentColor' : 'none'}
              strokeWidth={isLiked ? 0 : 2} />

            <span className="font-medium text-xs">Like</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <Icon name="MessageCircle" size={18} strokeWidth={2} />
            <span className="font-medium text-xs">Comment</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <Icon name="Share2" size={18} strokeWidth={2} />
            <span className="font-medium text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>);

};

export default JoltCard;