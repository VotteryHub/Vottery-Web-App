import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { hapticFeedbackService } from '../../../services/hapticFeedbackService';

// Particle dust component for swipe exit
const SwipeParticles = ({ x, active }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {[...Array(12)]?.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFA500' : '#FFFACD',
            left: '50%',
            top: '50%',
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 200 + (x > 0 ? 80 : -80),
            y: (Math.random() - 0.5) * 300,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6 + Math.random() * 0.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

const Premium2DVerticalCardStackCarousel = ({ 
  suggestedConnections = [],
  recommendedHubs = [],
  recommendedElections = [],
  creatorServices = [],
  onConnect,
  onSkip,
  onJoinHub,
  onVoteElection,
  onViewService
}) => {
  const [activeTab, setActiveTab] = useState('connections'); // connections, hubs, elections, services
  const [cards, setCards] = useState([]);
  const [swipedCards, setSwipedCards] = useState([]);
  const [particleSwipe, setParticleSwipe] = useState({ active: false, x: 0 });

  const getActiveContent = () => {
    switch (activeTab) {
      case 'connections': return suggestedConnections;
      case 'hubs': return recommendedHubs;
      case 'elections': return recommendedElections;
      case 'services': return creatorServices;
      default: return suggestedConnections;
    }
  };

  useEffect(() => {
    setCards(getActiveContent());
    setSwipedCards([]);
  }, [activeTab, suggestedConnections, recommendedHubs, recommendedElections, creatorServices]);

  const handleSwipe = (direction, card) => {
    hapticFeedbackService?.triggerSwipe();
    setSwipedCards([...swipedCards, card?.id]);
    setParticleSwipe({ active: true, x: direction === 'right' ? 1 : -1 });
    
    setTimeout(() => {
      setCards(prev => prev?.filter(c => c?.id !== card?.id));
      setParticleSwipe({ active: false, x: 0 });
      
      if (direction === 'right') {
        // Handle right swipe based on content type
        switch (activeTab) {
          case 'connections':
            onConnect?.(card);
            break;
          case 'hubs':
            onJoinHub?.(card);
            break;
          case 'elections':
            onVoteElection?.(card);
            break;
          case 'services':
            onViewService?.(card);
            break;
        }
      } else {
        onSkip?.(card);
      }
    }, 300);
  };

  const handleAction = (action, card) => {
    if (action === 'accept') {
      handleSwipe('right', card);
    } else {
      handleSwipe('left', card);
    }
  };

  // Suggested Connection Card
  const ConnectionCard = ({ card, index, isTop }) => {
    const offset = (cards?.length - 1 - index) * 15;
    const rotation = (cards?.length - 1 - index) * 3;
    const scale = 1 - (cards?.length - 1 - index) * 0.05;
    
    return (
      <motion.div
        key={card?.id}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (Math.abs(info?.offset?.x) > 150) {
            handleSwipe(info?.offset?.x > 0 ? 'right' : 'left', card);
          }
        }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
        animate={{ x: offset, y: offset - 20, rotate: rotation, scale: scale, opacity: 1, zIndex: index }}
        exit={{
          x: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 500 : -500) : 0,
          rotate: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 w-full"
        style={{
          transformStyle: 'preserve-3d',
          cursor: isTop ? 'grab' : 'default',
          pointerEvents: isTop ? 'auto' : 'none'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
          <div className="relative">
            <div className="h-[160px] bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <div className="absolute top-[110px] left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden shadow-xl">
                <Image
                  src={card?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={`${card?.name} profile picture`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="pt-16 pb-5 px-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground">{card?.name}</h3>
              {card?.verified && <Icon name="BadgeCheck" size={18} className="text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground mb-3">@{card?.username}</p>
            {card?.bio && <p className="text-sm text-foreground mb-3 line-clamp-2">{card?.bio}</p>}
            <div className="flex items-center justify-center gap-6 mb-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-foreground">{card?.mutualFriends || 0}</p>
                <p className="text-muted-foreground">Mutual</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">{card?.followers || 0}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">{card?.posts || 0}</p>
                <p className="text-muted-foreground">Posts</p>
              </div>
            </div>
            {isTop && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction('skip', card)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="X" size={20} />
                  <span>Pass</span>
                </button>
                <button
                  onClick={() => handleAction('accept', card)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Icon name="UserPlus" size={20} />
                  <span>Connect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Recommended Hub Card
  const HubCard = ({ card, index, isTop }) => {
    const offset = (cards?.length - 1 - index) * 15;
    const rotation = (cards?.length - 1 - index) * 3;
    const scale = 1 - (cards?.length - 1 - index) * 0.05;
    
    return (
      <motion.div
        key={card?.id}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (Math.abs(info?.offset?.x) > 150) {
            handleSwipe(info?.offset?.x > 0 ? 'right' : 'left', card);
          }
        }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
        animate={{ x: offset, y: offset - 20, rotate: rotation, scale: scale, opacity: 1, zIndex: index }}
        exit={{
          x: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 500 : -500) : 0,
          rotate: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 w-full"
        style={{
          transformStyle: 'preserve-3d',
          cursor: isTop ? 'grab' : 'default',
          pointerEvents: isTop ? 'auto' : 'none'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
          <div className="relative h-[180px]">
            <Image
              src={card?.coverImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400'}
              alt={`${card?.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {card?.trending && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                <Icon name="TrendingUp" size={12} />
                <span>TRENDING</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                {card?.name}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2">
                {card?.description}
              </p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1 text-foreground">
                <Icon name="Users" size={14} />
                <span className="font-semibold">{card?.memberCount?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Icon name="Activity" size={14} />
                <span className="text-xs">{card?.activityStatus || 'Active'}</span>
              </div>
            </div>
            
            {card?.mutualMembers > 0 && (
              <div className="flex items-center gap-1 text-xs text-primary mb-3">
                <Icon name="UserCheck" size={12} />
                <span>{card?.mutualMembers} mutual members</span>
              </div>
            )}
            
            {card?.activeElections > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Icon name="Vote" size={12} />
                <span>{card?.activeElections} active elections</span>
              </div>
            )}
            
            {card?.topTopics && card?.topTopics?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {card?.topTopics?.slice(0, 3)?.map((topic, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            )}
            
            {isTop && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction('skip', card)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="X" size={20} />
                  <span>Skip</span>
                </button>
                <button
                  onClick={() => handleAction('accept', card)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Icon name="UserPlus" size={20} />
                  <span>Join</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Recommended Election Card
  const ElectionCard = ({ card, index, isTop }) => {
    const offset = (cards?.length - 1 - index) * 15;
    const rotation = (cards?.length - 1 - index) * 3;
    const scale = 1 - (cards?.length - 1 - index) * 0.05;
    
    return (
      <motion.div
        key={card?.id}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (Math.abs(info?.offset?.x) > 150) {
            handleSwipe(info?.offset?.x > 0 ? 'right' : 'left', card);
          }
        }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
        animate={{ x: offset, y: offset - 20, rotate: rotation, scale: scale, opacity: 1, zIndex: index }}
        exit={{
          x: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 500 : -500) : 0,
          rotate: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 w-full"
        style={{
          transformStyle: 'preserve-3d',
          cursor: isTop ? 'grab' : 'default',
          pointerEvents: isTop ? 'auto' : 'none'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
          <div className="relative h-[200px]">
            <Image
              src={card?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400'}
              alt={`${card?.title} election`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                {card?.category || 'General'}
              </span>
            </div>
            {card?.matchScore && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                <Icon name="Target" size={12} />
                <span>{card?.matchScore}% match</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                {card?.title}
              </h3>
            </div>
          </div>
          
          <div className="p-4">
            {card?.prizePool && (
              <div className="mb-3 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-center">
                <p className="text-xs font-semibold text-yellow-900 mb-0.5">PRIZE POOL</p>
                <p className="text-xl font-bold text-white">
                  ${card?.prizePool?.toLocaleString()}
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-4 mb-3 text-sm">
              <div className="flex items-center gap-1 text-foreground">
                <Icon name="Users" size={14} />
                <span className="font-semibold">{card?.participantCount?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span className="text-xs">{card?.timeRemaining || '2d left'}</span>
              </div>
            </div>
            
            {card?.recommendationReason && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <Icon name="Sparkles" size={12} className="inline mr-1" />
                  {card?.recommendationReason}
                </p>
              </div>
            )}
            
            {isTop && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction('skip', card)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="X" size={20} />
                  <span>Skip</span>
                </button>
                <button
                  onClick={() => handleAction('accept', card)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Icon name="Vote" size={20} />
                  <span>Vote</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Creator Service Card
  const ServiceCard = ({ card, index, isTop }) => {
    const offset = (cards?.length - 1 - index) * 15;
    const rotation = (cards?.length - 1 - index) * 3;
    const scale = 1 - (cards?.length - 1 - index) * 0.05;
    
    return (
      <motion.div
        key={card?.id}
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, info) => {
          if (Math.abs(info?.offset?.x) > 150) {
            handleSwipe(info?.offset?.x > 0 ? 'right' : 'left', card);
          }
        }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
        animate={{ x: offset, y: offset - 20, rotate: rotation, scale: scale, opacity: 1, zIndex: index }}
        exit={{
          x: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 500 : -500) : 0,
          rotate: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
          opacity: 0,
          transition: { duration: 0.3 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 w-full"
        style={{
          transformStyle: 'preserve-3d',
          cursor: isTop ? 'grab' : 'default',
          pointerEvents: isTop ? 'auto' : 'none'
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
          <div className="relative h-[180px]">
            <Image
              src={card?.portfolioImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
              alt={`${card?.serviceName} portfolio`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
                <Image
                  src={card?.creator?.avatar || 'https://randomuser.me/api/portraits/women/4.jpg'}
                  alt={`${card?.creator?.username} avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              {card?.creator?.verified && <Icon name="BadgeCheck" size={16} className="text-blue-400" />}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
              {card?.serviceName}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">by @{card?.creator?.username}</p>
            <p className="text-sm text-foreground mb-3 line-clamp-2">
              {card?.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className="text-yellow-500" />
                <span className="text-sm font-bold text-foreground">{card?.rating || 5.0}</span>
                <span className="text-xs text-muted-foreground">({card?.reviewCount || 0})</span>
              </div>
              <div className="text-lg font-bold text-primary">
                ${card?.price?.toLocaleString() || 0}
              </div>
            </div>
            
            {isTop && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction('skip', card)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icon name="X" size={20} />
                  <span>Skip</span>
                </button>
                <button
                  onClick={() => handleAction('accept', card)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Icon name="Eye" size={20} />
                  <span>View</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full py-6 bg-background">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-4 px-4 overflow-hidden">
        <div className="flex items-center gap-2 bg-muted rounded-xl p-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <button
            onClick={() => {
              setActiveTab('connections');
              hapticFeedbackService?.trigger('light');
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 snap-start ${
              activeTab === 'connections' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} />
              <span>Connections</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('hubs');
              hapticFeedbackService?.trigger('light');
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 snap-start ${
              activeTab === 'hubs' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="UsersRound" size={16} />
              <span>Hubs</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('elections');
              hapticFeedbackService?.trigger('light');
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 snap-start ${
              activeTab === 'elections' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Vote" size={16} />
              <span>Elections</span>
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('services');
              hapticFeedbackService?.trigger('light');
            }}
            className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 snap-start ${
              activeTab === 'services' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Briefcase" size={16} />
              <span>Services</span>
            </div>
          </button>
        </div>
      </div>
      {/* Card Stack Container */}
      <div className="relative h-[600px] max-w-md mx-auto px-4">
        <AnimatePresence>
          {cards?.length > 0 ? (
            cards?.slice(0, 3)?.map((card, index) => {
              const isTop = index === cards?.length - 1;
              
              switch (activeTab) {
                case 'connections':
                  return <ConnectionCard key={card?.id} card={card} index={index} isTop={isTop} />;
                case 'hubs':
                  return <HubCard key={card?.id} card={card} index={index} isTop={isTop} />;
                case 'elections':
                  return <ElectionCard key={card?.id} card={card} index={index} isTop={isTop} />;
                case 'services':
                  return <ServiceCard key={card?.id} card={card} index={index} isTop={isTop} />;
                default:
                  return null;
              }
            })
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Icon name="CheckCircle" size={48} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground">No more suggestions at the moment.</p>
            </div>
          )}
        </AnimatePresence>
        
        {/* Swipe Particles */}
        <SwipeParticles x={particleSwipe?.x} active={particleSwipe?.active} />
        
        {/* Swipe Indicators */}
        {cards?.length > 0 && (
          <>
            <motion.div
              className="absolute left-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center opacity-0 pointer-events-none"
              animate={{ opacity: 0 }}
            >
              <Icon name="X" size={40} className="text-white" />
            </motion.div>
            <motion.div
              className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center opacity-0 pointer-events-none"
              animate={{ opacity: 0 }}
            >
              <Icon name="Check" size={40} className="text-white" />
            </motion.div>
          </>
        )}
      </div>
      {/* Card Counter */}
      {cards?.length > 0 && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {cards?.length} {activeTab} remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default Premium2DVerticalCardStackCarousel;