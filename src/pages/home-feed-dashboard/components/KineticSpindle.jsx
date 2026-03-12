import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const KineticSpindle = ({ elections = [], onElectionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollX = useMotionValue(0);
  const containerRef = useRef(null);
  const RADIUS = 300;
  const CARD_WIDTH = 280;
  const PERSPECTIVE = 1000;

  // Haptic feedback simulation
  const triggerHaptic = (intensity = 'light') => {
    if (navigator?.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns?.[intensity] || patterns?.light);
    }
  };

  // Snap to center with magnetic pull
  const snapToCenter = (index) => {
    const targetScroll = index * CARD_WIDTH;
    animate(scrollX, targetScroll, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      onComplete: () => {
        setCurrentIndex(index);
        triggerHaptic('medium');
      }
    });
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const velocity = info?.velocity?.x;
    const offset = info?.offset?.x;
    
    let newIndex = currentIndex;
    
    if (Math.abs(velocity) > 500) {
      newIndex = velocity > 0 ? Math.max(0, currentIndex - 1) : Math.min(elections?.length - 1, currentIndex + 1);
    } else if (Math.abs(offset) > CARD_WIDTH / 3) {
      newIndex = offset > 0 ? Math.max(0, currentIndex - 1) : Math.min(elections?.length - 1, currentIndex + 1);
    }
    
    snapToCenter(newIndex);
  };

  const ElectionCard = ({ election, index }) => {
    const position = index - currentIndex;
    const theta = (position * Math.PI) / 6;
    
    const x = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / CARD_WIDTH);
      const angle = (relativePos * Math.PI) / 6;
      return RADIUS * Math.sin(angle);
    });
    
    const z = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / CARD_WIDTH);
      const angle = (relativePos * Math.PI) / 6;
      return RADIUS * Math.cos(angle) - RADIUS;
    });
    
    const rotateY = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / CARD_WIDTH);
      const angle = (relativePos * Math.PI) / 6;
      return (angle * 180) / Math.PI;
    });
    
    // Cards past 90° get hidden
    const opacity = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / CARD_WIDTH);
      const angle = Math.abs((relativePos * Math.PI) / 6);
      if (angle > Math.PI / 2) return 0;
      return Math.max(0.3, 1 - Math.abs(relativePos) * 0.3);
    });
    
    const scale = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / CARD_WIDTH));
      return Math.max(0.85, 1 - relativePos * 0.15);
    });

    // Gaussian blur on non-center cards
    const filterBlur = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / CARD_WIDTH));
      if (relativePos < 0.3) return 'blur(0px)';
      return `blur(${Math.min(relativePos * 2, 4)}px)`;
    });

    // Shadow scaling based on Z-depth
    const boxShadow = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / CARD_WIDTH));
      const blur = 20 + relativePos * 15;
      const spread = 5 + relativePos * 5;
      return `0 ${blur}px ${blur * 1.5}px rgba(0,0,0,${0.3 + relativePos * 0.15})`;
    });

    // Pointer events none when past 90°
    const pointerEvents = useTransform(scrollX, (latest) => {
      const relativePos = index - (latest / CARD_WIDTH);
      const angle = Math.abs((relativePos * Math.PI) / 6);
      return angle > Math.PI / 2 ? 'none' : 'auto';
    });

    // Rim light for center card
    const rimBorder = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / CARD_WIDTH));
      if (relativePos < 0.3) return '1px solid rgba(255, 215, 0, 0.8)';
      return '1px solid rgba(255, 255, 255, 0.15)';
    });

    const rimGlow = useTransform(scrollX, (latest) => {
      const relativePos = Math.abs(index - (latest / CARD_WIDTH));
      if (relativePos < 0.3) return '0 0 12px rgba(255, 215, 0, 0.4), inset 0 0 8px rgba(255, 215, 0, 0.1)';
      return 'none';
    });

    return (
      <motion.div
        style={{
          x,
          z,
          rotateY,
          opacity,
          scale,
          filter: filterBlur,
          pointerEvents,
          position: 'absolute',
          left: '50%',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
        className="w-[280px] cursor-pointer"
        onClick={() => {
          if (!isDragging && index === currentIndex) {
            triggerHaptic('heavy');
            onElectionClick?.(election);
          } else if (!isDragging) {
            snapToCenter(index);
          }
        }}
      >
        <motion.div
          style={{ border: rimBorder, boxShadow: rimGlow }}
          className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Rim Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          
          {/* Election Cover - reduced height */}
          <div className="relative h-[280px]">
            <Image
              src={election?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400'}
              alt={election?.coverImageAlt || 'Live election'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Live Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="text-xs font-bold">LIVE</span>
            </div>
            
            {/* Election Info */}
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
          </div>
          
          {/* Jackpot Display */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 text-center">
            <p className="text-xs font-semibold text-yellow-900 mb-0.5">JACKPOT POOL</p>
            <p className="text-xl font-bold text-white">
              ${election?.prizePool?.toLocaleString() || '0'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative py-8 my-[60px] overflow-hidden" data-section-type="kinetic-spindle">
      {/* Header */}
      <div className="max-w-[680px] mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Live Elections</h2>
              <p className="text-sm text-muted-foreground">Spin to explore active jackpots</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            View All →
          </button>
        </div>
      </div>
      {/* 3D Spindle Container - reduced to 320px */}
      <div 
        ref={containerRef}
        className="relative h-[320px] flex items-center justify-center"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        {/* Dark Chamber Background - deeper */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/70 to-gray-950/80 rounded-3xl" />
        
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {elections?.map((election, index) => (
            <ElectionCard key={election?.id || index} election={election} index={index} />
          ))}
        </motion.div>
        
        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => snapToCenter(currentIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-20"
          >
            <Icon name="ChevronLeft" size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
        
        {currentIndex < elections?.length - 1 && (
          <button
            onClick={() => snapToCenter(currentIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-20"
          >
            <Icon name="ChevronRight" size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>
      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {elections?.map((_, index) => (
          <button
            key={index}
            onClick={() => snapToCenter(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default KineticSpindle;
