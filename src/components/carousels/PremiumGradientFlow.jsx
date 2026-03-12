import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { casinoTheme } from '../../utils/casinoTheme';

const PremiumGradientFlow = ({
  items = [],
  renderBlob,
  onBlobClick,
  blobWidth = 120,
  enableMetaballs = true,
  enableHaptic = true,
  className = ''
}) => {
  const scrollX = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const { trigger } = useHapticFeedback();

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const velocity = info?.velocity?.x;
    const offset = info?.offset?.x;
    
    let newIndex = activeIndex;
    
    // Mobile-optimized: Lower velocity threshold (200px/s) for better responsiveness
    const velocityThreshold = isMobile ? 200 : 300;
    
    if (Math.abs(velocity) > velocityThreshold) {
      newIndex = velocity > 0 ? Math.max(0, activeIndex - 1) : Math.min(items?.length - 1, activeIndex + 1);
    } else if (Math.abs(offset) > 60) {
      newIndex = offset > 0 ? Math.max(0, activeIndex - 1) : Math.min(items?.length - 1, activeIndex + 1);
    }
    
    if (newIndex !== activeIndex) {
      if (enableHaptic) trigger('light');
      setActiveIndex(newIndex);
      animate(scrollX, -newIndex * blobWidth, {
        type: 'spring',
        ...casinoTheme?.physics?.viscous,
        // Mobile: Reduce animation complexity
        ...(isMobile && { damping: 50, stiffness: 100 })
      });
    } else {
      animate(scrollX, -activeIndex * blobWidth, {
        type: 'spring',
        ...casinoTheme?.physics?.viscous
      });
    }
  };

  const createBlobTransforms = (index) => {
    const blobScale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / blobWidth));
      return Math.max(0.5, 1 - relativePos * 0.25);
    });
    
    const blobOpacity = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index + (latest / blobWidth));
      return Math.max(0.3, 1 - relativePos * 0.35);
    });

    return { blobScale, blobOpacity };
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Glassmorphism Background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: casinoTheme?.glassmorphism?.dark?.background,
          backdropFilter: casinoTheme?.glassmorphism?.dark?.backdropFilter,
          border: casinoTheme?.glassmorphism?.dark?.border
        }}
      />
      {/* Metaball Blobs (Animated Background) */}
      {enableMetaballs && (
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
          {[...Array(3)]?.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                background: `rgba(${147 - i * 30}, ${51 + i * 20}, ${234 - i * 40}, 0.2)`,
                filter: 'url(#gooey)'
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
      {/* Blob Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -(items?.length - 1) * blobWidth, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x: scrollX }}
        className="relative flex items-center py-8 px-4 cursor-grab active:cursor-grabbing"
      >
        {items?.map((item, index) => {
          const transforms = createBlobTransforms(index);
          const isFocused = index === activeIndex;
          
          return (
            <motion.div
              key={item?.id || index}
              style={transforms}
              className="flex-shrink-0 flex flex-col items-center justify-center px-3 cursor-pointer"
              onClick={() => {
                if (!isDragging) {
                  if (enableHaptic) trigger('medium');
                  onBlobClick?.(item, index);
                }
              }}
            >
              {renderBlob(item, index, isFocused, transforms)}
            </motion.div>
          );
        })}
      </motion.div>
      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-2">
        {items?.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              animate(scrollX, -index * blobWidth, {
                type: 'spring',
                ...casinoTheme?.physics?.viscous
              });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 w-6' :'bg-white/30'
            }`}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumGradientFlow;