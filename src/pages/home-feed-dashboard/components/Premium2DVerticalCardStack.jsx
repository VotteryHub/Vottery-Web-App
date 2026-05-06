import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const Premium2DVerticalCardStack = ({
  suggestedConnections = [],
  recommendedHubs = [],
  recommendedElections = [],
  creatorServices = [],
  onConnect,
  onSkip,
  onJoinHub,
  onSkipHub,
  onVoteElection,
  onSkipElection,
  onShortlistService,
  onSkipService
}) => {
  const [activeTab, setActiveTab] = useState('connections');
  const [cards, setCards] = useState([]);
  const [swipedCards, setSwipedCards] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'connections': return suggestedConnections;
      case 'hubs': return recommendedHubs;
      case 'elections': return recommendedElections;
      case 'services': return creatorServices;
      default: return suggestedConnections;
    }
  };

  React.useEffect(() => {
    setCards(getActiveContent());
    setSwipedCards([]);
  }, [activeTab]);

  const triggerHaptic = (intensity = 'medium') => {
    if (navigator?.vibrate) {
      const patterns = { light: [10], medium: [20], heavy: [30, 10, 30] };
      navigator.vibrate(patterns?.[intensity] || patterns?.medium);
    }
  };

  const handleSwipe = (direction, card) => {
    triggerHaptic('heavy');
    setSwipeDirection(direction);
    setSwipedCards([...swipedCards, card?.id]);

    setTimeout(() => {
      setCards(cards?.filter(c => c?.id !== card?.id));
      setSwipeDirection(null);

      if (activeTab === 'connections') {
        direction === 'right' ? onConnect?.(card) : onSkip?.(card);
      } else if (activeTab === 'hubs') {
        direction === 'right' ? onJoinHub?.(card) : onSkipHub?.(card);
      } else if (activeTab === 'elections') {
        direction === 'right' ? onVoteElection?.(card) : onSkipElection?.(card);
      } else if (activeTab === 'services') {
        direction === 'right' ? onShortlistService?.(card) : onSkipService?.(card);
      }
    }, 300);
  };

  const handleDragEnd = (event, info, card) => {
    const threshold = 150;
    if (info?.offset?.x > threshold) {
      handleSwipe('right', card);
    } else if (info?.offset?.x < -threshold) {
      handleSwipe('left', card);
    }
  };

  // Suggested Connection Card
  const ConnectionCard = ({ connection, index }) => {
    const [dragX, setDragX] = useState(0);

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={(e, info) => setDragX(info?.offset?.x)}
        onDragEnd={(e, info) => {
          setDragX(0);
          handleDragEnd(e, info, connection);
        }}
        initial={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        animate={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        exit={{ x: dragX > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
        className="absolute top-0 left-0 right-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: cards?.length - index }}
      >
        <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-8 ring-white dark:ring-gray-800 shadow-2xl">
                <Image
                  src={connection?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${connection?.name} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-white">{connection?.name}</h3>
                {connection?.verified && (
                  <Icon name="BadgeCheck" size={24} className="text-blue-500" />
                )}
              </div>
              <p className="text-white/80 mb-1">@{connection?.username}</p>
              <p className="text-white/90 text-sm mb-4 line-clamp-2">{connection?.bio}</p>

              <div className="flex items-center justify-center gap-6 text-white/90 text-sm mb-6">
                <div className="text-center">
                  <p className="font-bold text-lg">{connection?.mutualFriends || 0}</p>
                  <p className="text-xs">Mutual Friends</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{connection?.followers?.toLocaleString() || 0}</p>
                  <p className="text-xs">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{connection?.posts || 0}</p>
                  <p className="text-xs">Posts</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSwipe('left', connection)}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
                >
                  <Icon name="X" size={28} className="text-white" />
                </button>
                <button
                  onClick={() => handleSwipe('right', connection)}
                  className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
                >
                  <Icon name="UserPlus" size={28} className="text-white" />
                </button>
              </div>
            </div>

            {/* Swipe Indicators */}
            {dragX !== 0 && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                dragX > 0 ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  dragX > 0 ? 'bg-green-500' : 'bg-red-500'
                } shadow-2xl`}>
                  <Icon name={dragX > 0 ? 'Check' : 'X'} size={64} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Recommended Hub Card
  const HubCard = ({ hub, index }) => {
    const [dragX, setDragX] = useState(0);

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={(e, info) => setDragX(info?.offset?.x)}
        onDragEnd={(e, info) => {
          setDragX(0);
          handleDragEnd(e, info, hub);
        }}
        initial={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        animate={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        exit={{ x: dragX > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
        className="absolute top-0 left-0 right-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: cards?.length - index }}
      >
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px]">
            <div className="relative h-[240px]">
              <Image
                src={hub?.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400'}
                alt={hub?.name || 'Hub cover'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {hub?.trending && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  <Icon name="TrendingUp" size={14} />
                  <span>TRENDING</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{hub?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{hub?.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={16} />
                  <span>{hub?.memberCount?.toLocaleString() || 0} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Activity" size={16} />
                  <span>{hub?.activityStatus || 'Active'}</span>
                </div>
              </div>

              {hub?.mutualMembers > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4">
                  <Icon name="UserCheck" size={16} />
                  <span>{hub?.mutualMembers} mutual members</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-4">
                <Icon name="Vote" size={16} />
                <span>{hub?.activeElections || 0} active elections</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {hub?.topTopics?.slice(0, 3)?.map((topic, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSwipe('left', hub)}
                  className="w-14 h-14 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                >
                  <Icon name="X" size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleSwipe('right', hub)}
                  className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                >
                  <Icon name="UserPlus" size={24} className="text-white" />
                </button>
              </div>
            </div>

            {dragX !== 0 && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                dragX > 0 ? 'bg-blue-500/30' : 'bg-gray-500/30'
              }`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  dragX > 0 ? 'bg-blue-500' : 'bg-gray-500'
                } shadow-2xl`}>
                  <Icon name={dragX > 0 ? 'Check' : 'X'} size={64} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Recommended Election Card
  const ElectionCard = ({ election, index }) => {
    const [dragX, setDragX] = useState(0);

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={(e, info) => setDragX(info?.offset?.x)}
        onDragEnd={(e, info) => {
          setDragX(0);
          handleDragEnd(e, info, election);
        }}
        initial={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        animate={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        exit={{ x: dragX > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
        className="absolute top-0 left-0 right-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: cards?.length - index }}
      >
        <div className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px]">
            <div className="relative h-[200px]">
              <Image
                src={election?.coverImage || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'}
                alt={election?.title || 'Election'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold">
                {election?.category || 'General'}
              </div>

              {election?.matchScore && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-bold">
                  {election?.matchScore}% Match
                </div>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{election?.title}</h3>

              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs font-semibold text-yellow-900 mb-1">PRIZE POOL</p>
                <p className="text-2xl font-bold text-white">
                  ${election?.prizePool?.toLocaleString() || '0'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Icon name="Users" size={16} />
                  <span>{election?.participantCount?.toLocaleString() || 0} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={16} />
                  <span>{election?.timeRemaining || '2d 5h'}</span>
                </div>
              </div>

              {election?.whyRecommended && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">WHY RECOMMENDED</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{election?.whyRecommended}</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSwipe('left', election)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe('right', election)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Vote Now
                </button>
              </div>
            </div>

            {dragX !== 0 && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                dragX > 0 ? 'bg-purple-500/30' : 'bg-gray-500/30'
              }`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  dragX > 0 ? 'bg-purple-500' : 'bg-gray-500'
                } shadow-2xl`}>
                  <Icon name={dragX > 0 ? 'Vote' : 'X'} size={64} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Creator Service Card
  const ServiceCard = ({ service, index }) => {
    const [dragX, setDragX] = useState(0);

    return (
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDrag={(e, info) => setDragX(info?.offset?.x)}
        onDragEnd={(e, info) => {
          setDragX(0);
          handleDragEnd(e, info, service);
        }}
        initial={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        animate={{ scale: 1 - index * 0.05, y: index * 20, opacity: 1 - index * 0.2 }}
        exit={{ x: dragX > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
        className="absolute top-0 left-0 right-0 cursor-grab active:cursor-grabbing"
        style={{ zIndex: cards?.length - index }}
      >
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative h-[500px]">
            <div className="relative h-[180px]">
              <Image
                src={service?.portfolioImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                alt={service?.title || 'Service'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold">
                {service?.serviceType || 'Service'}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500">
                  <Image
                    src={service?.creator?.avatar || 'https://randomuser.me/api/portraits/women/3.jpg'}
                    alt={`${service?.creator?.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{service?.creator?.name}</h4>
                    {service?.creator?.verified && (
                      <Icon name="BadgeCheck" size={16} className="text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{service?.creator?.username}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service?.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{service?.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Icon name="Star" size={16} className="fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {service?.rating || 4.8}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">({service?.reviews || 0})</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {service?.completedProjects || 0} completed
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs font-semibold text-green-900 mb-1">PRICE RANGE</p>
                <p className="text-xl font-bold text-white">
                  ${service?.priceMin || 0} - ${service?.priceMax || 0}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSwipe('left', service)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleSwipe('right', service)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                >
                  Shortlist
                </button>
              </div>
            </div>

            {dragX !== 0 && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                dragX > 0 ? 'bg-blue-500/30' : 'bg-gray-500/30'
              }`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  dragX > 0 ? 'bg-blue-500' : 'bg-gray-500'
                } shadow-2xl`}>
                  <Icon name={dragX > 0 ? 'Bookmark' : 'X'} size={64} className="text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 rounded-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="Layers" size={24} className="text-purple-500" />
            Discover & Connect
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'connections', label: 'People', icon: 'Users', count: suggestedConnections?.length },
            { id: 'hubs', label: 'Hubs', icon: 'UsersRound', count: recommendedHubs?.length },
            { id: 'elections', label: 'Elections', icon: 'Vote', count: recommendedElections?.length },
            { id: 'services', label: 'Services', icon: 'Briefcase', count: creatorServices?.length }
          ]?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => {
                setActiveTab(tab?.id);
                triggerHaptic('light');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">{tab?.count || 0}</span>
            </button>
          ))}
        </div>

        <div className="relative h-[520px] max-w-md mx-auto">
          <AnimatePresence>
            {cards?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <Icon name="CheckCircle" size={48} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
                <p className="text-gray-600 dark:text-gray-400">You've reviewed all {activeTab}. Check back later for more.</p>
              </motion.div>
            ) : (
              cards?.slice(0, 3)?.map((card, index) => (
                <div key={card?.id}>
                  {activeTab === 'connections' && <ConnectionCard connection={card} index={index} />}
                  {activeTab === 'hubs' && <HubCard hub={card} index={index} />}
                  {activeTab === 'elections' && <ElectionCard election={card} index={index} />}
                  {activeTab === 'services' && <ServiceCard service={card} index={index} />}
                </div>
              ))
            )}
          </AnimatePresence>

          {cards?.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-gray-600 dark:text-gray-400">
              {cards?.length} {activeTab} remaining
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium2DVerticalCardStack;