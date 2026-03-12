import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LiquidHorizon = ({ winners = [] }) => {
  const scrollX = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

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
      newIndex = velocity > 0 ? Math.max(0, activeIndex - 1) : Math.min(winners?.length - 1, activeIndex + 1);
    } else if (Math.abs(offset) > 60) {
      newIndex = offset > 0 ? Math.max(0, activeIndex - 1) : Math.min(winners?.length - 1, activeIndex + 1);
    }
    
    if (newIndex !== activeIndex) {
      triggerHaptic();
      setActiveIndex(newIndex);
      animate(scrollX, -newIndex * 120, {
        type: 'spring',
        stiffness: 80,
        damping: 40, // High damping = viscous feel
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

  // Winner blob/bubble component
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
        className="flex-shrink-0 flex flex-col items-center justify-center px-3"
        style={{ scale: blobScale, opacity: blobOpacity, minWidth: '120px' }}
      >
        {/* Blob bubble */}
        <motion.div
          className="relative"
          animate={isFocused ? {
            scale: [1, 1.08, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Glow behind blob */}
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-yellow-400/40 blur-xl scale-150" />
          )}
          
          {/* Avatar blob */}
          <div className={`relative w-16 h-16 rounded-full overflow-hidden ring-2 ${
            isFocused ? 'ring-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]' : 'ring-white/20'
          }`}>
            <Image
              src={winner?.userProfiles?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={`${winner?.userProfiles?.name} profile picture`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Trophy badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
            <Icon name="Trophy" size={10} className="text-yellow-900" />
          </div>
        </motion.div>
        {/* Name */}
        <p className="text-xs font-semibold text-white mt-2 text-center truncate max-w-[100px]">
          {winner?.userProfiles?.name?.split(' ')?.[0]}
        </p>
        {/* Prize amount */}
        <p className="text-[10px] font-bold text-yellow-300">
          ${winner?.prizeAmount?.toLocaleString() || '0'}
        </p>
      </motion.div>
    );
  };

  return (
    <div className="relative my-[40px] overflow-hidden" data-section-type="liquid-horizon">
      {/* SVG Gooey Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
      {/* Full-width band container */}
      <div
        ref={containerRef}
        className="relative w-full h-[180px]"
        style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        }}
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-indigo-900/50 to-purple-900/40 border-y border-white/10" />
        
        {/* Animated metaball background blobs */}
        <div className="absolute inset-0 overflow-hidden" style={{ filter: 'url(#gooey-filter)' }}>
          {winners?.map((_, i) => (
            <motion.div
              key={`blob-bg-${i}`}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: 60 + Math.random() * 40,
                height: 60 + Math.random() * 40,
                left: `${(i / winners?.length) * 80 + 10}%`,
                top: '20%',
              }}
              animate={{
                x: [0, 15, -10, 0],
                y: [0, -10, 8, 0],
                scale: [1, 1.2, 0.9, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Header integrated into band */}
        <div className="absolute top-2 left-4 flex items-center gap-2 z-10">
          <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
            <Icon name="Trophy" size={14} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-white/90">Recent Winners</h3>
          <button className="ml-auto text-xs font-semibold text-yellow-300 hover:text-yellow-200 transition-colors">
            All →
          </button>
        </div>
        
        {/* Scrollable blobs area with gooey filter */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -(winners?.length * 120 - 300), right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          className="absolute bottom-4 left-0 right-0 flex items-center cursor-grab active:cursor-grabbing px-4"
          style={{
            x: scrollX,
            filter: 'url(#gooey-filter)',
          }}
        >
          {winners?.map((winner, index) => (
            <WinnerBlob key={winner?.id || index} winner={winner} index={index} />
          ))}
        </motion.div>

        {/* Navigation Dots */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {winners?.map((_, index) => (
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-5 bg-gradient-to-r from-yellow-400 to-orange-500' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiquidHorizon;
