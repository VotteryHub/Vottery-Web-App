import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const Premium2DSmoothGradientFlow = ({
  recentWinners = [],
  trendingTopics = [],
  topEarners = [],
  accuracyChampions = [],
  onWinnerClick,
  onTopicClick,
  onEarnerClick,
  onChampionClick
}) => {
  const [activeTab, setActiveTab] = useState('winners');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollX = useMotionValue(0);
  const containerRef = useRef(null);

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

  const triggerHaptic = () => {
    if (navigator?.vibrate) {
      navigator.vibrate([12]);
    }
  };

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
      triggerHaptic();
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

  React.useEffect(() => {
    setActiveIndex(0);
    scrollX?.set(0);
  }, [activeTab]);

  // Recent Winner Item
  const WinnerItem = ({ winner, index }) => {
    const isFocused = index === activeIndex;
    const x = useTransform(scrollX, (latest) => latest + index * 120);
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (-latest / 120));
      return Math.max(0.85, 1 - relativePos * 0.15);
    });

    return (
      <motion.div
        style={{ x, scale }}
        className="flex-shrink-0 flex flex-col items-center cursor-pointer"
        onClick={() => {
          if (!isDragging) {
            triggerHaptic();
            onWinnerClick?.(winner);
          }
        }}
      >
        <div className="relative">
          <div className={`w-20 h-20 rounded-full overflow-hidden ring-4 ${
            isFocused ? 'ring-yellow-400' : 'ring-white/50'
          } transition-all duration-300`}>
            <Image
              src={winner?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={`${winner?.userProfiles?.name} avatar`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="Trophy" size={14} className="text-yellow-900" />
          </div>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <p className="text-sm font-bold text-gray-900 dark:text-white mt-2 text-center max-w-[100px] truncate">
          {winner?.userProfiles?.name?.split(' ')?.[0]}
        </p>
        <p className="text-xs font-semibold text-yellow-500 mt-1">
          ${winner?.prizeAmount?.toLocaleString() || 0}
        </p>
      </motion.div>
    );
  };

  // Trending Topic Item
  const TopicItem = ({ topic, index }) => {
    const isFocused = index === activeIndex;
    const x = useTransform(scrollX, (latest) => latest + index * 200);
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (-latest / 200));
      return Math.max(0.9, 1 - relativePos * 0.1);
    });

    return (
      <motion.div
        style={{ x, scale }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging) {
            triggerHaptic();
            onTopicClick?.(topic);
          }
        }}
      >
        <div className={`w-[280px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 shadow-xl transition-all duration-300 ${
          isFocused ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Hash" size={24} className="text-white" />
            <h3 className="text-2xl font-bold text-white">{topic?.hashtag}</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-white/90">
              <Icon name="Flame" size={16} />
              <span className="text-sm font-semibold">Trend Score: {topic?.trendScore || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <Icon name="MessageCircle" size={16} />
              <span className="text-sm">{topic?.postCount?.toLocaleString() || 0} posts</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {topic?.growthDirection === 'up' ? (
              <Icon name="TrendingUp" size={20} className="text-green-300" />
            ) : (
              <Icon name="TrendingDown" size={20} className="text-red-300" />
            )}
            <span className={`text-lg font-bold ${
              topic?.growthDirection === 'up' ? 'text-green-300' : 'text-red-300'
            }`}>
              {topic?.growthPercentage || 0}%
            </span>
          </div>

          {topic?.featuredElection && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-white/80 mb-1">TOP ELECTION</p>
              <p className="text-sm font-medium text-white line-clamp-2">{topic?.featuredElection}</p>
            </div>
          )}

          {topic?.relatedTopics?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {topic?.relatedTopics?.slice(0, 3)?.map((related, i) => (
                <span key={i} className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                  #{related}
                </span>
              ))}
            </div>
          )}

          <button className="w-full py-2 bg-white/90 hover:bg-white rounded-lg font-semibold text-purple-600 transition-colors">
            Explore
          </button>
        </div>
      </motion.div>
    );
  };

  // Top Earner Item
  const EarnerItem = ({ earner, index }) => {
    const isFocused = index === activeIndex;
    const x = useTransform(scrollX, (latest) => latest + index * 160);
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (-latest / 160));
      return Math.max(0.9, 1 - relativePos * 0.1);
    });

    const rankColors = {
      1: 'from-yellow-400 to-yellow-600',
      2: 'from-gray-300 to-gray-500',
      3: 'from-orange-400 to-orange-600'
    };

    return (
      <motion.div
        style={{ x, scale }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging) {
            triggerHaptic();
            onEarnerClick?.(earner);
          }
        }}
      >
        <div className={`w-[240px] bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl transition-all duration-300 ${
          isFocused ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                <Image
                  src={earner?.avatar || 'https://randomuser.me/api/portraits/women/1.jpg'}
                  alt={`${earner?.name} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br ${rankColors?.[earner?.rank] || 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-xs font-bold text-white">#{earner?.rank}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{earner?.name}</h4>
                {earner?.verified && (
                  <Icon name="BadgeCheck" size={14} className="text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">@{earner?.username}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-3 mb-3 text-center">
            <p className="text-xs font-semibold text-green-900 mb-1">EARNINGS THIS MONTH</p>
            <p className="text-2xl font-bold text-white">
              ${earner?.earnings?.toLocaleString() || 0}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {earner?.growthPercentage >= 0 ? (
              <Icon name="TrendingUp" size={16} className="text-green-500" />
            ) : (
              <Icon name="TrendingDown" size={16} className="text-red-500" />
            )}
            <span className={`text-sm font-semibold ${
              earner?.growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {earner?.growthPercentage >= 0 ? '+' : ''}{earner?.growthPercentage || 0}%
            </span>
          </div>

          {earner?.topContent && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">TOP CONTENT</p>
              <p className="text-xs text-gray-900 dark:text-white line-clamp-2">{earner?.topContent}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Icon name="Users" size={12} />
              <span>{earner?.followers?.toLocaleString() || 0}</span>
            </div>
            <button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Follow
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Accuracy Champion Item
  const ChampionItem = ({ champion, index }) => {
    const isFocused = index === activeIndex;
    const x = useTransform(scrollX, (latest) => latest + index * 180);
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (-latest / 180));
      return Math.max(0.9, 1 - relativePos * 0.1);
    });

    return (
      <motion.div
        style={{ x, scale }}
        className="flex-shrink-0 cursor-pointer"
        onClick={() => {
          if (!isDragging) {
            triggerHaptic();
            onChampionClick?.(champion);
          }
        }}
      >
        <div className={`w-[260px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 shadow-xl transition-all duration-300 ${
          isFocused ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.4)]' : ''
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50">
              <Image
                src={champion?.avatar || 'https://randomuser.me/api/portraits/men/2.jpg'}
                alt={`${champion?.name} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-white">{champion?.name}</h4>
                {champion?.verified && (
                  <Icon name="BadgeCheck" size={16} className="text-blue-400" />
                )}
              </div>
              <p className="text-sm text-white/80">@{champion?.username}</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mb-3 text-center">
            <p className="text-xs font-semibold text-white/80 mb-1">ACCURACY SCORE</p>
            <p className="text-3xl font-bold text-white">
              {champion?.accuracyScore || 0}%
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-white/70 mb-1">Predictions</p>
              <p className="text-lg font-bold text-white">{champion?.totalPredictions || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-white/70 mb-1">Streak</p>
              <p className="text-lg font-bold text-white">{champion?.winningStreak || 0}</p>
            </div>
          </div>

          {champion?.specialization && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-3">
              <p className="text-xs font-semibold text-white/80 mb-1">SPECIALIZATION</p>
              <p className="text-sm font-medium text-white">{champion?.specialization}</p>
            </div>
          )}

          {champion?.avgBrierScore && (
            <div className="flex items-center justify-between text-xs text-white/80 mb-3">
              <span>Brier Score:</span>
              <span className="font-bold">{champion?.avgBrierScore}</span>
            </div>
          )}

          <button className="w-full py-2 bg-white/90 hover:bg-white rounded-lg font-semibold text-purple-600 transition-colors">
            View Profile
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-900/40 via-indigo-900/50 to-blue-900/40 backdrop-blur-xl py-6 px-4 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Icon name="Award" size={24} className="text-yellow-400" />
            Leaderboards
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'winners', label: 'Recent Winners', icon: 'Trophy', count: recentWinners?.length },
            { id: 'topics', label: 'Trending Topics', icon: 'TrendingUp', count: trendingTopics?.length },
            { id: 'earners', label: 'Top Earners', icon: 'DollarSign', count: topEarners?.length },
            { id: 'champions', label: 'Accuracy Champions', icon: 'Target', count: accuracyChampions?.length }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => {
                setActiveTab(tab?.id);
                triggerHaptic();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{tab?.count || 0}</span>
            </button>
          ))}
        </div>

        <div className="relative h-[200px]" ref={containerRef}>
          <div className="overflow-hidden h-full">
            <motion.div
              drag="x"
              dragConstraints={{ left: -(activeContent?.length - 1) * 120, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="flex gap-4 items-center h-full cursor-grab active:cursor-grabbing"
            >
              {activeTab === 'winners' && recentWinners?.map((winner, index) => (
                <WinnerItem key={winner?.id || index} winner={winner} index={index} />
              ))}
              {activeTab === 'topics' && trendingTopics?.map((topic, index) => (
                <TopicItem key={topic?.id || index} topic={topic} index={index} />
              ))}
              {activeTab === 'earners' && topEarners?.map((earner, index) => (
                <EarnerItem key={earner?.id || index} earner={earner} index={index} />
              ))}
              {activeTab === 'champions' && accuracyChampions?.map((champion, index) => (
                <ChampionItem key={champion?.id || index} champion={champion} index={index} />
              ))}
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
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
                triggerHaptic();
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-gradient-to-r from-yellow-400 to-orange-500' :'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium2DSmoothGradientFlow;