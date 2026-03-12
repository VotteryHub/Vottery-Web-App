import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { casinoTheme } from '../../utils/casinoTheme';

const SwipeParticles = ({ x, active }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {[...Array(12)]?.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 3 === 0 ? casinoTheme?.colors?.gold?.[300] : i % 3 === 1 ? casinoTheme?.colors?.gold?.[600] : casinoTheme?.colors?.gold?.[50],
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

const PremiumVerticalStack = ({
  items = [],
  renderCard,
  onSwipeRight,
  onSwipeLeft,
  enableParticles = true,
  enableHaptic = true,
  swipeThreshold = 150,
  className = ''
}) => {
  const [cards, setCards] = useState(items);
  const [swipedCards, setSwipedCards] = useState([]);
  const [particleSwipe, setParticleSwipe] = useState({ active: false, x: 0 });
  const [touchVelocity, setTouchVelocity] = useState(0);
  const { triggerSwipe } = useHapticFeedback();
  const lastTouchTime = useRef(Date.now());
  const lastTouchX = useRef(0);

  // Mobile-optimized velocity tracking
  const handleTouchMove = (e, info) => {
    const currentTime = Date.now();
    const currentX = info?.point?.x;
    const deltaTime = currentTime - lastTouchTime?.current;
    const deltaX = currentX - lastTouchX?.current;
    
    if (deltaTime > 0) {
      const velocity = Math.abs(deltaX / deltaTime);
      setTouchVelocity(velocity);
    }
    
    lastTouchTime.current = currentTime;
    lastTouchX.current = currentX;
  };

  const handleSwipe = (direction, card) => {
    if (enableHaptic) triggerSwipe();
    setSwipedCards([...swipedCards, card?.id]);
    if (enableParticles) {
      setParticleSwipe({ active: true, x: direction === 'right' ? 1 : -1 });
    }
    
    setTimeout(() => {
      setCards(prev => prev?.filter(c => c?.id !== card?.id));
      setParticleSwipe({ active: false, x: 0 });
      
      if (direction === 'right') {
        onSwipeRight?.(card);
      } else {
        onSwipeLeft?.(card);
      }
    }, 300);
  };

  const handleDragEnd = (e, info, card) => {
    // Mobile-optimized: Lower threshold for faster swipes (velocity > 0.5)
    if (touchVelocity > 0.5 || Math.abs(info?.offset?.x) > swipeThreshold) {
      handleSwipe(info?.offset?.x > 0 ? 'right' : 'left', card);
    }
  };

  const handleAction = (action, card) => {
    if (action === 'accept') {
      handleSwipe('right', card);
    } else {
      handleSwipe('left', card);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {enableParticles && <SwipeParticles x={particleSwipe?.x} active={particleSwipe?.active} />}
      <div className="relative h-[600px]">
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
                  handleDragEnd(e, info, card);
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
                {renderCard(card, index, isTop, handleAction)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {cards?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[600px] text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            ✓
          </motion.div>
          <h3 className="text-2xl font-bold text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground">No more cards to review</p>
        </div>
      )}
      {/* Card Counter */}
      {cards?.length > 0 && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          {cards?.length} {cards?.length === 1 ? 'card' : 'cards'} remaining
        </div>
      )}
    </div>
  );
};

export default PremiumVerticalStack;