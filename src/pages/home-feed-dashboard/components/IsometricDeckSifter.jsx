import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

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

const IsometricDeckSifter = ({ connections = [], onConnect, onRemove }) => {
  const [cards, setCards] = useState(connections);
  const [swipedCards, setSwipedCards] = useState([]);
  const [particleSwipe, setParticleSwipe] = useState({ active: false, x: 0 });

  const triggerHaptic = () => {
    if (navigator?.vibrate) {
      navigator.vibrate([15]);
    }
  };

  const handleSwipe = (direction, card) => {
    triggerHaptic();
    setSwipedCards([...swipedCards, card?.id]);
    setParticleSwipe({ active: true, x: direction === 'right' ? 1 : -1 });
    
    setTimeout(() => {
      setCards(prev => prev?.filter(c => c?.id !== card?.id));
      setParticleSwipe({ active: false, x: 0 });
      
      if (direction === 'right') {
        onConnect?.(card);
      } else {
        onRemove?.(card);
      }
    }, 300);
  };

  const handleAction = (action, card) => {
    if (action === 'connect') {
      handleSwipe('right', card);
    } else {
      handleSwipe('left', card);
    }
  };

  return (
    <div className="relative py-6 md:py-8 my-10 md:my-[80px]" data-section-type="isometric-deck-sifter">
      {/* Header */}
      <div className="max-w-[680px] mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon name="Users" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground line-clamp-1">Suggested Connections</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Swipe to connect or pass</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0">
            See All →
          </button>
        </div>
      </div>
      {/* Deck Container - Responsive width, floating cards */}
      <div className="relative h-[400px] w-full max-w-[400px] mx-auto px-4">
        <SwipeParticles x={particleSwipe?.x} active={particleSwipe?.active} />
        
        {cards?.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Icon name="CheckCircle" size={64} className="text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">Check back later for more suggestions</p>
          </div>
        ) : (
          <AnimatePresence>
            {cards?.map((card, index) => {
              const isTop = index === cards?.length - 1;
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
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    opacity: 0
                  }}
                  animate={{
                    x: offset,
                    y: offset - 20, // Float 20px above
                    rotate: rotation,
                    scale: scale,
                    opacity: 1,
                    zIndex: index
                  }}
                  exit={{
                    x: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 500 : -500) : 0,
                    rotate: swipedCards?.includes(card?.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
                    opacity: 0,
                    transition: { duration: 0.3 }
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transformStyle: 'preserve-3d',
                    cursor: isTop ? 'grab' : 'default',
                    pointerEvents: isTop ? 'auto' : 'none'
                  }}
                >
                  {/* No border, long soft drop shadow */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_20px_30px_rgba(0,0,0,0.15)]">
                    {/* Card Content */}
                    <div className="relative">
                      {/* Cover Image */}
                      <div className="h-[160px] bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative">
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                      
                      {/* Profile Picture */}
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
                    
                    {/* User Info */}
                    <div className="pt-16 pb-5 px-5 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{card?.name}</h3>
                        {card?.verified && <Icon name="BadgeCheck" size={18} className="text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">@{card?.username}</p>
                      
                      {card?.bio && (
                        <p className="text-sm text-foreground mb-3 line-clamp-2">{card?.bio}</p>
                      )}
                      
                      {/* Stats */}
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
                      
                      {/* Action Buttons */}
                      {isTop && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAction('remove', card)}
                            className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <Icon name="X" size={20} />
                            <span>Pass</span>
                          </button>
                          <button
                            onClick={() => handleAction('connect', card)}
                            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                          >
                            <Icon name="UserPlus" size={20} />
                            <span>Connect</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Gold Shimmer Trail Effect */}
                  {isTop && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent transform -skew-x-12" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        
        {/* Swipe Indicators */}
        {cards?.length > 0 && (
          <>
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center pointer-events-none">
              <Icon name="X" size={32} className="text-red-500" />
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center pointer-events-none">
              <Icon name="Check" size={32} className="text-green-500" />
            </div>
          </>
        )}
      </div>
      {/* Card Counter */}
      {cards?.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {cards?.length} {cards?.length === 1 ? 'suggestion' : 'suggestions'} remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default IsometricDeckSifter;
