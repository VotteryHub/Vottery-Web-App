import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { hapticFeedbackService } from '../../../services/hapticFeedbackService';

const Premium2DHorizontalSnapCarousel = ({ 
  liveElections = [], 
  jolts = [], 
  liveMoments = [], 
  creatorSpotlights = [],
  carouselFilters,
  onFilterChange,
  onElectionClick,
  onJoltClick,
  onMomentClick,
  onCreatorClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('elections');
  const scrollX = useMotionValue(0);
  const containerRef = useRef(null);
  const CARD_WIDTH = 320;
  const CARD_GAP = 16;
  const [hoveredCard, setHoveredCard] = useState(null);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'elections': return liveElections;
      case 'jolts': return jolts;
      case 'moments': return liveMoments;
      case 'creators': return creatorSpotlights;
      default: return liveElections;
    }
  };

  const activeContent = getActiveContent();

  const snapToCard = (index) => {
    const targetScroll = index * (CARD_WIDTH + CARD_GAP);
    animate(scrollX, targetScroll, {
      type: 'spring',
      stiffness: 400,
      damping: 35,
      onComplete: () => {
        setCurrentIndex(index);
        hapticFeedbackService?.triggerSnap();
      }
    });
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const velocity = info?.velocity?.x;
    const offset = info?.offset?.x;
    
    let newIndex = currentIndex;
    
    if (Math.abs(velocity) > 500) {
      newIndex = velocity > 0 ? Math.max(0, currentIndex - 1) : Math.min(activeContent?.length - 1, currentIndex + 1);
    } else if (Math.abs(offset) > CARD_WIDTH / 3) {
      newIndex = offset > 0 ? Math.max(0, currentIndex - 1) : Math.min(activeContent?.length - 1, currentIndex + 1);
    }
    
    snapToCard(newIndex);
  };

  useEffect(() => {
    setCurrentIndex(0);
    scrollX?.set(0);
  }, [activeTab]);

  // Live Election Card
  const LiveElectionCard = ({ election, index }) => {
    const isCentered = index === currentIndex;
    
    const cardX = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * (CARD_WIDTH + CARD_GAP);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.92, 1 - relativePos * 0.08);
    });
    
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });

    const parallaxY = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * -15;
    });

    return (
      <motion.div
        style={{ x: cardX, scale, opacity }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging && isCentered) {
            hapticFeedbackService?.trigger('heavy');
            onElectionClick?.(election);
          } else if (!isDragging) {
            snapToCard(index);
          }
        }}
      >
        <div className={`w-[320px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
          isCentered ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''
        }`}>
          <motion.div style={{ y: parallaxY }} className="relative h-[240px]">
            <Image
              src={election?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400'}
              alt={election?.coverImageAlt || 'Live election'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="text-xs font-bold">LIVE</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                {election?.title}
              </h3>
              <div className="flex items-center gap-4 text-white/90 text-xs">
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={14} />
                  <span>{election?.totalVoters || 0} voters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="TrendingUp" size={14} />
                  <span>{election?.participationRate || 0}%</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 text-center">
            <p className="text-xs font-semibold text-yellow-900 mb-0.5">JACKPOT POOL</p>
            <p className="text-xl font-bold text-white">
              ${election?.prizePool?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Jolts Video Card
  const JoltCard = ({ jolt, index }) => {
    const isCentered = index === currentIndex;
    const isHovering = hoveredCard === `jolt-${index}`;
    
    const cardX = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * (CARD_WIDTH + CARD_GAP);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.92, 1 - relativePos * 0.08);
    });
    
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });

    const parallaxY = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * -12;
    });

    return (
      <motion.div
        style={{ x: cardX, scale, opacity }}
        className="flex-shrink-0 cursor-pointer"
        onMouseEnter={() => setHoveredCard(`jolt-${index}`)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => {
          if (!isDragging && isCentered) {
            hapticFeedbackService?.trigger('heavy');
            onJoltClick?.(jolt);
          } else if (!isDragging) {
            snapToCard(index);
          }
        }}
      >
        <div className={`w-[320px] bg-gray-900 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
          isCentered ? 'ring-4 ring-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)]' : ''
        }`}>
          <motion.div style={{ y: parallaxY }} className="relative h-[400px]">
            <Image
              src={jolt?.thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'}
              alt={jolt?.title || 'Jolt video'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={isHovering ? { scale: 1.2 } : { scale: 1 }}
                className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Icon name="Play" size={28} className="text-gray-900 ml-1" />
              </motion.div>
            </div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
                <Image
                  src={jolt?.creator?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${jolt?.creator?.username} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              {jolt?.creator?.verified && (
                <Icon name="BadgeCheck" size={16} className="text-blue-500" />
              )}
            </div>
            
            {jolt?.trending && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                <Icon name="Flame" size={12} />
                <span>TRENDING</span>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                {jolt?.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {jolt?.hashtags?.slice(0, 3)?.map((tag, i) => (
                  <span key={i} className="text-xs text-blue-400 font-medium">#{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-white/80 text-xs">
                <div className="flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  <span>{jolt?.views?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Heart" size={14} />
                  <span>{jolt?.likes?.toLocaleString() || 0}</span>
                </div>
              </div>
              {isCentered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg shadow-lg"
                >
                  Watch Now
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Live Moments Card
  const MomentCard = ({ moment, index }) => {
    const isCentered = index === currentIndex;
    
    const cardX = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * (CARD_WIDTH + CARD_GAP);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.92, 1 - relativePos * 0.08);
    });
    
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });

    const isViewed = moment?.viewed;
    const borderGradient = isViewed 
      ? 'from-gray-400 to-gray-500' :'from-purple-500 via-pink-500 to-orange-500';

    return (
      <motion.div
        style={{ x: cardX, scale, opacity }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging && isCentered) {
            hapticFeedbackService?.trigger('heavy');
            onMomentClick?.(moment);
          } else if (!isDragging) {
            snapToCard(index);
          }
        }}
      >
        <div className="flex flex-col items-center">
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${borderGradient} p-1 ${
            isCentered ? 'shadow-[0_0_25px_rgba(236,72,153,0.5)]' : ''
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
              <Image
                src={moment?.creator?.avatar || 'https://randomuser.me/api/portraits/women/3.jpg'}
                alt={`${moment?.creator?.username} moment`}
                className="w-full h-full object-cover"
              />
            </div>
            {moment?.hasInteractive && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <Icon name="MessageCircle" size={12} className="text-white" />
              </div>
            )}
          </div>
          
          <p className="text-sm font-medium text-gray-900 dark:text-white mt-2 text-center">
            {moment?.creator?.username}
          </p>
          
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
            <Icon name="Clock" size={12} />
            <span>{moment?.expiryHours || 18}h left</span>
          </div>
          
          {moment?.storyCount && (
            <div className="mt-1 px-2 py-0.5 bg-primary/20 rounded-full">
              <p className="text-xs font-bold text-primary">
                {moment?.storyCount} frames
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Featured Creator Spotlight Card
  const CreatorSpotlightCard = ({ creator, index }) => {
    const isCentered = index === currentIndex;
    
    const cardX = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * (CARD_WIDTH + CARD_GAP);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.92, 1 - relativePos * 0.08);
    });
    
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (CARD_WIDTH + CARD_GAP)));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });

    const parallaxY = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (CARD_WIDTH + CARD_GAP));
      return relativePos * -10;
    });

    return (
      <motion.div
        style={{ x: cardX, scale, opacity }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging && isCentered) {
            hapticFeedbackService?.trigger('heavy');
            onCreatorClick?.(creator);
          } else if (!isDragging) {
            snapToCard(index);
          }
        }}
      >
        <div className={`w-[320px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
          isCentered ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''
        }`}>
          <motion.div style={{ y: parallaxY }} className="relative h-[280px]">
            <Image
              src={creator?.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
              alt={`${creator?.name} spotlight`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <Icon name="Star" size={12} />
              <span>SPOTLIGHT</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-yellow-400">
                  <Image
                    src={creator?.avatar || 'https://randomuser.me/api/portraits/women/5.jpg'}
                    alt={`${creator?.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{creator?.name}</h3>
                    {creator?.verified && (
                      <Icon name="BadgeCheck" size={18} className="text-blue-400" />
                    )}
                  </div>
                  <p className="text-sm text-white/80">@{creator?.username}</p>
                </div>
              </div>
              
              <div className="bg-yellow-400/20 backdrop-blur-sm rounded-lg p-2 mb-2">
                <p className="text-xs font-semibold text-yellow-300 mb-1">SPOTLIGHT REASON</p>
                <p className="text-sm text-white">{creator?.spotlightReason || 'Top Earner This Week'}</p>
              </div>
              
              <div className="flex items-center gap-4 text-white/90 text-xs">
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={14} />
                  <span>{creator?.followers?.toLocaleString() || 0} followers</span>
                </div>
                {(creator?.earnings ?? creator?.earningsThisMonth) != null && (
                  <div className="flex items-center gap-1">
                    <Icon name="DollarSign" size={14} />
                    <span>${(creator?.earnings ?? creator?.earningsThisMonth)?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Icon name="TrendingUp" size={14} />
                  <span>{creator?.engagement || 0}% engagement</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex gap-2 p-3 bg-gradient-to-r from-yellow-400 to-orange-500">
            <button
              type="button"
              onClick={(e) => { e?.stopPropagation(); onCreatorClick?.(creator); }}
              className="flex-1 py-2 rounded-lg text-sm font-bold text-gray-900 bg-white/90 hover:bg-white transition-colors"
            >
              Follow
            </button>
            <button
              type="button"
              onClick={(e) => { e?.stopPropagation(); onCreatorClick?.(creator); }}
              className="flex-1 py-2 rounded-lg text-sm font-bold text-gray-900 bg-white/90 hover:bg-white transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full py-6 bg-background">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
          <button
            onClick={() => {
              setActiveTab('elections');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'elections' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Vote" size={16} />
              <span>Live Elections</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('jolts');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'jolts' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} />
              <span>Jolts</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('moments');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'moments' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              <span>Moments</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('creators');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'creators' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Star" size={16} />
              <span>Spotlights</span>
            </div>
          </button>
          {onFilterChange && carouselFilters && (() => {
            const key = activeTab === 'moments' ? 'moments' : activeTab;
            const f = carouselFilters[key] || {};
            return (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => onFilterChange({
                    ...carouselFilters,
                    [key]: { ...f, trending: !f.trending }
                  })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    f.trending ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Trending
                </button>
              </div>
            );
          })()}
        </div>
      </div>
      {/* Carousel Container */}
      <div className="relative overflow-hidden" ref={containerRef}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="flex gap-4 px-4 cursor-grab active:cursor-grabbing"
          style={{ x: scrollX }}
        >
          {activeTab === 'elections' && activeContent?.map((election, index) => (
            <LiveElectionCard key={election?.id || index} election={election} index={index} />
          ))}
          {activeTab === 'jolts' && activeContent?.map((jolt, index) => (
            <JoltCard key={jolt?.id || index} jolt={jolt} index={index} />
          ))}
          {activeTab === 'moments' && activeContent?.map((moment, index) => (
            <MomentCard key={moment?.id || index} moment={moment} index={index} />
          ))}
          {activeTab === 'creators' && activeContent?.map((creator, index) => (
            <CreatorSpotlightCard key={creator?.id || index} creator={creator} index={index} />
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        {activeContent?.length > 1 && (
          <>
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  snapToCard(currentIndex - 1);
                }
              }}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform z-10"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={() => {
                if (currentIndex < activeContent?.length - 1) {
                  snapToCard(currentIndex + 1);
                }
              }}
              disabled={currentIndex === activeContent?.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform z-10"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </>
        )}
      </div>
      {/* Indicator Dots */}
      {activeContent?.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {activeContent?.map((_, index) => (
            <button
              key={index}
              onClick={() => snapToCard(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary' :'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Premium2DHorizontalSnapCarousel;