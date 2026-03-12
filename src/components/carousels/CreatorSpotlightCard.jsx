import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const CreatorSpotlightCard = ({ creator, isCenter = false, onFollow }) => {
  const [
    following, setFollowing
  ] = useState(false);

  const handleFollow = (e) => {
    e?.stopPropagation();
    setFollowing(prev => !prev);
    onFollow?.(creator?.id);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
      isCenter ? 'shadow-2xl scale-100' : 'shadow-md scale-95 opacity-80'
    }`} style={{ width: 280, height: 360 }}>
      {/* Background Image */}
      <Image
        src={creator?.coverImage || creator?.avatar || 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400'}
        alt={`${creator?.name || 'Creator'} spotlight cover`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      {/* Spotlight Badge */}
      <div className="absolute top-3 left-3">
        <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full">
          <Icon name="Star" size={10} />
          SPOTLIGHT
        </div>
      </div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Avatar + Verification */}
        <div className="flex items-end justify-between mb-3">
          <div className="relative">
            <Image
              src={creator?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={`${creator?.name || 'Creator'} profile picture`}
              className="w-14 h-14 rounded-full border-2 border-white object-cover"
            />
            {creator?.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <Icon name="BadgeCheck" size={14} className="text-white" />
              </div>
            )}
          </div>
          <button
            onClick={handleFollow}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              following
                ? 'bg-white/20 text-white border border-white/40' :'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Creator Info */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-white font-bold text-base leading-tight">{creator?.name || 'Creator'}</h3>
            {creator?.verified && <Icon name="BadgeCheck" size={14} className="text-blue-400 flex-shrink-0" />}
          </div>
          <p className="text-gray-300 text-xs mb-2">@{creator?.username || 'creator'}</p>

          {/* Stats Row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Icon name="Users" size={12} className="text-gray-400" />
              <span className="text-xs text-gray-300">{creator?.followersCount ? `${(creator?.followersCount / 1000)?.toFixed(1)}K` : '0'}</span>
            </div>
            {creator?.earnings !== undefined && (
              <div className="flex items-center gap-1">
                <Icon name="DollarSign" size={12} className="text-yellow-400" />
                <span className="text-xs text-yellow-300 font-semibold">
                  ${typeof creator?.earnings === 'number' ? creator?.earnings?.toLocaleString() : creator?.earnings}
                </span>
              </div>
            )}
            {creator?.spotlightReason && (
              <span className="text-xs text-gray-400 truncate">{creator?.spotlightReason}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSpotlightCard;
