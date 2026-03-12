import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { casinoTheme } from '../../utils/casinoTheme';


const PremiumHorizontalSnap = ({
  items = [],
  renderCard,
  onCardClick,
  cardWidth = 320,
  cardGap = 16,
  enableParallax = true,
  enableHaptic = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const scrollX = useMotionValue(0);
  const containerRef = useRef(null);
  const { triggerSnap } = useHapticFeedback();
  const lastTouchTime = useRef(Date.now());
  const touchStartX = useRef(0);

  // Mobile-optimized velocity detection
  const handleTouchStart = (e) => {
    touchStartX.current = e?.touches?.[0]?.clientX;
    lastTouchTime.current = Date.now();
  };

  const handleTouchMove = (e) => {
    const currentX = e?.touches?.[0]?.clientX;
    const deltaX = currentX - touchStartX?.current;
    const deltaTime = Date.now() - lastTouchTime?.current;
    const currentVelocity = deltaX / deltaTime;
    setVelocity(currentVelocity);
  };

  const snapToCard = (index) => {
    const targetScroll = index * (cardWidth + cardGap);
    animate(scrollX, targetScroll, {
      type: 'spring',
      ...casinoTheme?.physics?.snap,
      onComplete: () => {
        setCurrentIndex(index);
        if (enableHaptic) triggerSnap();
      }
    });
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const dragVelocity = info?.velocity?.x;
    const offset = info?.offset?.x;
    
    let newIndex = currentIndex;
    
    // Mobile-optimized velocity threshold (300px/s for better responsiveness)
    if (Math.abs(dragVelocity) > 300) {
      newIndex = dragVelocity > 0 ? Math.max(0, currentIndex - 1) : Math.min(items?.length - 1, currentIndex + 1);
    } else if (Math.abs(offset) > cardWidth / 3) {
      newIndex = offset > 0 ? Math.max(0, currentIndex - 1) : Math.min(items?.length - 1, currentIndex + 1);
    }
    
    snapToCard(newIndex);
  };

  const createCardTransforms = (index) => {
    const cardX = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (cardWidth + cardGap));
      return relativePos * (cardWidth + cardGap);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (cardWidth + cardGap)));
      return Math.max(0.92, 1 - relativePos * 0.08);
    });
    
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / (cardWidth + cardGap)));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });

    const parallaxY = enableParallax ? useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / (cardWidth + cardGap));
      return relativePos * -15;
    }) : useMotionValue(0);

    return { cardX, scale, opacity, parallaxY };
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        drag="x"
        dragConstraints={{ left: -(items?.length - 1) * (cardWidth + cardGap), right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x: scrollX }}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
      >
        {items?.map((item, index) => {
          const transforms = createCardTransforms(index);
          const isCentered = index === currentIndex;
          
          return (
            <motion.div
              key={item?.id || index}
              style={transforms}
              className="flex-shrink-0"
              onClick={() => {
                if (!isDragging && isCentered) {
                  onCardClick?.(item, index);
                } else if (!isDragging) {
                  snapToCard(index);
                }
              }}
            >
              {renderCard(item, index, isCentered, transforms)}
            </motion.div>
          );
        })}
      </motion.div>
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items?.map((_, index) => (
          <button
            key={index}
            onClick={() => snapToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-yellow-400 w-6' :'bg-gray-400 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumHorizontalSnap;