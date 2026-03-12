import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { hapticFeedbackService } from '../../../services/hapticFeedbackService';

const Premium2DSmoothGradientFlowCarousel = ({ 
  recentWinners = [],
  trendingTopics = [],
  topEarners = [],
  accuracyChampions = [],
  onWinnerClick,
  onTopicClick,
  onEarnerClick,
  onChampionClick
}) => {
  const scrollX = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('winners');
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'winners': return recentWinners;
      case 'topics': return trendingTopics;
      case 'earners': return topEarners;
      case 'champions': return accuracyChampions;
      default: return recentWinners;
    }
  };

  const activeContent = getActiveContent();

  useEffect(() => {
    setActiveIndex(0);
    scrollX?.set(0);
  }, [activeTab]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const velocity = info?.velocity?.x;
    const offset = info?.offset?.x;
    
    let newIndex = activeIndex;
    
    if (Math.abs(velocity) > 300) {
      newIndex = velocity > 0 ? Math.max(0, activeIndex - 1) : Math.min(activeContent?.length - 1, activeIndex + 1);
    } else if (Math.abs(offset) > 60) {
      newIndex = offset > 0 ? Math.max(0, activeIndex - 1) : Math.min(activeContent?.length - 1, activeIndex + 1);
    }
    
    if (newIndex !== activeIndex) {
      hapticFeedbackService?.trigger('light');
      setActiveIndex(newIndex);
      animate(scrollX, -newIndex * 120, {
        type: 'spring',
        stiffness: 80,
        damping: 40,
        mass: 2,
      });
    } else {
      animate(scrollX, -activeIndex * 120, {
        type: 'spring',
        stiffness: 80,
        damping: 40,
        mass: 2,
      });
    }
  };

  // Winner Blob Component
  const WinnerBlob = ({ winner, index }) => {
    const isFocused = index === activeIndex;
    
    const blobScale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });
    
    const blobOpacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.3, 1 - relativePos * 0.35);
    });

    return (
      <motion.div
        className="flex-shrink-0 flex flex-col items-center justify-center px-3 cursor-pointer"
        style={{ scale: blobScale, opacity: blobOpacity, minWidth: '120px' }}
        onClick={() => {
          if (!isDragging) {
            hapticFeedbackService?.trigger('medium');
            onWinnerClick?.(winner);
          }
        }}
      >
        <motion.div
          className="relative"
          animate={isFocused ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl scale-150" />
          )}
          <div className={`relative w-16 h-16 rounded-full overflow-hidden ring-2 ${
            isFocused ? 'ring-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'ring-white/20'
          }`}>
            <Image
              src={winner?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={`${winner?.userProfiles?.name} profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
            <Icon name="Trophy" size={10} className="text-yellow-900" />
          </div>
        </motion.div>
        <p className="text-xs font-semibold text-white mt-2 text-center truncate max-w-[100px]">
          {winner?.userProfiles?.name?.split(' ')?.[0]}
        </p>
        <p className="text-[10px] font-bold text-yellow-300">
          ${winner?.prizeAmount?.toLocaleString() || '0'}
        </p>
      </motion.div>
    );
  };

  // Trending Topic Blob Component
  const TopicBlob = ({ topic, index }) => {
    const isFocused = index === activeIndex;
    
    const blobScale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });
    
    const blobOpacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.3, 1 - relativePos * 0.35);
    });

    return (
      <motion.div
        className="flex-shrink-0 flex flex-col items-center justify-center px-3 cursor-pointer"
        style={{ scale: blobScale, opacity: blobOpacity, minWidth: '140px' }}
        onClick={() => {
          if (!isDragging) {
            hapticFeedbackService?.trigger('medium');
            onTopicClick?.(topic);
          }
        }}
      >
        <motion.div
          className="relative"
          animate={isFocused ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isFocused && (
            <div className="absolute inset-0 rounded-2xl bg-blue-400/40 blur-xl scale-150" />
          )}
          <div className={`relative px-4 py-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 ${
            isFocused ? 'ring-4 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'ring-2 ring-white/20'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Hash" size={16} className="text-white" />
              <p className="text-sm font-bold text-white truncate max-w-[80px]">
                {topic?.hashtag?.replace('#', '') || 'trending'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <Icon name="TrendingUp" size={12} />
              <span>{topic?.postCount?.toLocaleString() || 0} posts</span>
            </div>
            {topic?.growthRate && (
              <div className="mt-1 flex items-center gap-1">
                <Icon name={topic?.growthRate?.startsWith('+') ? 'ArrowUp' : 'ArrowDown'} size={10} className="text-green-300" />
                <span className="text-[10px] font-bold text-green-300">{topic?.growthRate}</span>
              </div>
            )}
          </div>
        </motion.div>
        {topic?.trendScore && (
          <div className="mt-2 flex items-center gap-1">
            <Icon name="Flame" size={12} className="text-orange-400" />
            <p className="text-xs font-semibold text-white">{topic?.trendScore}/100</p>
          </div>
        )}
      </motion.div>
    );
  };

  // Top Earner Blob Component
  const EarnerBlob = ({ earner, index }) => {
    const isFocused = index === activeIndex;
    
    const blobScale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });
    
    const blobOpacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.3, 1 - relativePos * 0.35);
    });

    const getRankBadge = (rank) => {
      if (rank === 1) return { color: 'bg-yellow-400', icon: 'Crown', text: 'text-yellow-900' };
      if (rank === 2) return { color: 'bg-gray-300', icon: 'Medal', text: 'text-gray-700' };
      if (rank === 3) return { color: 'bg-orange-400', icon: 'Award', text: 'text-orange-900' };
      return { color: 'bg-blue-400', icon: 'Star', text: 'text-blue-900' };
    };

    const badge = getRankBadge(earner?.rank);

    return (
      <motion.div
        className="flex-shrink-0 flex flex-col items-center justify-center px-3 cursor-pointer"
        style={{ scale: blobScale, opacity: blobOpacity, minWidth: '120px' }}
        onClick={() => {
          if (!isDragging) {
            hapticFeedbackService?.trigger('medium');
            onEarnerClick?.(earner);
          }
        }}
      >
        <motion.div
          className="relative"
          animate={isFocused ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-green-400/40 blur-xl scale-150" />
          )}
          <div className={`relative w-16 h-16 rounded-full overflow-hidden ring-2 ${
            isFocused ? 'ring-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'ring-white/20'
          }`}>
            <Image
              src={earner?.user?.avatar || 'https://randomuser.me/api/portraits/women/2.jpg'}
              alt={`${earner?.user?.name} profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -top-1 -right-1 w-6 h-6 ${badge?.color} rounded-full flex items-center justify-center shadow-md`}>
            <Icon name={badge?.icon} size={12} className={badge?.text} />
          </div>
        </motion.div>
        <p className="text-xs font-semibold text-white mt-2 text-center truncate max-w-[100px]">
          {earner?.user?.name?.split(' ')?.[0]}
        </p>
        <motion.p 
          className="text-[10px] font-bold text-green-300"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ${earner?.earnings?.toLocaleString() || '0'}
        </motion.p>
        {earner?.growthPercentage && (
          <div className="flex items-center gap-1 mt-0.5">
            <Icon name={earner?.growthPercentage > 0 ? 'TrendingUp' : 'TrendingDown'} size={10} className={earner?.growthPercentage > 0 ? 'text-green-400' : 'text-red-400'} />
            <span className={`text-[9px] font-bold ${earner?.growthPercentage > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {earner?.growthPercentage > 0 ? '+' : ''}{earner?.growthPercentage}%
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  // Accuracy Champion Blob Component
  const ChampionBlob = ({ champion, index }) => {
    const isFocused = index === activeIndex;
    
    const blobScale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });
    
    const blobOpacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / 120));
      return Math.max(0.3, 1 - relativePos * 0.35);
    });

    return (
      <motion.div
        className="flex-shrink-0 flex flex-col items-center justify-center px-3 cursor-pointer"
        style={{ scale: blobScale, opacity: blobOpacity, minWidth: '130px' }}
        onClick={() => {
          if (!isDragging) {
            hapticFeedbackService?.trigger('medium');
            onChampionClick?.(champion);
          }
        }}
      >
        <motion.div
          className="relative"
          animate={isFocused ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-purple-400/40 blur-xl scale-150" />
          )}
          <div className={`relative w-16 h-16 rounded-full overflow-hidden ring-2 ${
            isFocused ? 'ring-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'ring-white/20'
          }`}>
            <Image
              src={champion?.user?.avatar || 'https://randomuser.me/api/portraits/men/3.jpg'}
              alt={`${champion?.user?.name} profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
            <Icon name="Target" size={12} className="text-white" />
          </div>
        </motion.div>
        <p className="text-xs font-semibold text-white mt-2 text-center truncate max-w-[110px]">
          {champion?.user?.name?.split(' ')?.[0]}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Icon name="Zap" size={10} className="text-purple-400" />
          <p className="text-[10px] font-bold text-purple-300">
            {champion?.accuracyScore}% accurate
          </p>
        </div>
        {champion?.winningStreak && (
          <div className="flex items-center gap-1 mt-0.5">
            <Icon name="Flame" size={10} className="text-orange-400" />
            <span className="text-[9px] font-bold text-orange-300">
              {champion?.winningStreak} streak
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  // Animated Background Blobs
  const AnimatedBlobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute w-full h-full" style={{ filter: 'url(#gooey)' }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
        {[...Array(5)]?.map((_, i) => (
          <motion.circle
            key={i}
            r={Math.random() * 40 + 60}
            fill={`rgba(${i % 2 === 0 ? '147, 51, 234' : '59, 130, 246'}, 0.2)`}
            initial={{ cx: `${Math.random() * 100}%`, cy: `${Math.random() * 100}%` }}
            animate={{
              cx: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
              cy: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </svg>
    </div>
  );

  return (
    <div className="w-full py-6 bg-background">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
          <button
            onClick={() => {
              setActiveTab('winners');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'winners' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Trophy" size={16} />
              <span>Winners</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('topics');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'topics' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Hash" size={16} />
              <span>Topics</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('earners');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'earners' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} />
              <span>Earners</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('champions');
              hapticFeedbackService?.trigger('light');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'champions' ?'bg-primary text-primary-foreground shadow-md' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Target" size={16} />
              <span>Champions</span>
            </div>
          </button>
        </div>
      </div>
      {/* Carousel Container with Glassmorphism */}
      <div className="relative h-[180px] overflow-hidden border-y border-white/10" ref={containerRef}>
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-indigo-900/50 to-purple-900/40 backdrop-blur-[40px]" />
        
        {/* Animated Background Blobs */}
        <AnimatedBlobs />
        
        {/* Scrollable Content */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="relative z-10 flex items-center h-full cursor-grab active:cursor-grabbing"
          style={{ x: scrollX }}
        >
          {activeTab === 'winners' && activeContent?.map((winner, index) => (
            <WinnerBlob key={winner?.id || index} winner={winner} index={index} />
          ))}
          {activeTab === 'topics' && activeContent?.map((topic, index) => (
            <TopicBlob key={topic?.id || index} topic={topic} index={index} />
          ))}
          {activeTab === 'earners' && activeContent?.map((earner, index) => (
            <EarnerBlob key={earner?.id || index} earner={earner} index={index} />
          ))}
          {activeTab === 'champions' && activeContent?.map((champion, index) => (
            <ChampionBlob key={champion?.id || index} champion={champion} index={index} />
          ))}
        </motion.div>

        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>
      {/* Navigation Dots */}
      {activeContent?.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {activeContent?.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                animate(scrollX, -index * 120, {
                  type: 'spring',
                  stiffness: 80,
                  damping: 40,
                  mass: 2,
                });
                hapticFeedbackService?.trigger('light');
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'w-8 bg-gradient-to-r from-yellow-400 to-orange-500' :'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Premium2DSmoothGradientFlowCarousel;