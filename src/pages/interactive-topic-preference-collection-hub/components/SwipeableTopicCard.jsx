import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const SwipeableTopicCard = ({ topic, onSwipe, zIndex = 1, isActive = true }) => {
  const [swipeMetrics, setSwipeMetrics] = useState({
    velocity: 0,
    dwellTime: 0,
    hesitationCount: 0,
    hoverDuration: 0,
    interactionDepth: 0,
    metadata: {}
  });
  const [isHovering, setIsHovering] = useState(false);
  const cardStartTime = useRef(Date.now());
  const hoverStartTime = useRef(null);
  const hesitationThreshold = 50;
  const lastPosition = useRef({ x: 0, y: 0 });

  const [springProps, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    config: { tension: 300, friction: 30 }
  }));

  const { x, y, rotate } = springProps;

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity: [vx], direction: [xDir] }) => {
      if (!isActive || !onSwipe) return;

      // Track hesitation (direction changes)
      if (Math.abs(mx - lastPosition?.current?.x) < hesitationThreshold) {
        setSwipeMetrics(prev => ({
          ...prev,
          hesitationCount: prev?.hesitationCount + 1
        }));
      }
      lastPosition.current = { x: mx, y: my };

      // Calculate interaction depth
      const interactionDepth = Math.abs(mx) + Math.abs(my);
      setSwipeMetrics(prev => ({
        ...prev,
        interactionDepth: Math.max(prev?.interactionDepth, interactionDepth)
      }));

      const trigger = Math.abs(mx) > 200;

      if (!down && trigger) {
        const direction = xDir > 0 ? 'right' : 'left';
        const dwellTime = Date.now() - cardStartTime?.current;

        // Call onSwipe with comprehensive metrics
        onSwipe?.(direction, {
          ...swipeMetrics,
          velocity: Math.abs(vx),
          dwellTime,
          metadata: {
            finalPosition: { x: mx, y: my },
            swipeDistance: Math.abs(mx),
            timestamp: new Date()?.toISOString()
          }
        });

        // Animate card off screen
        api?.start({
          x: (200 + window.innerWidth) * xDir,
          y: my,
          rotate: xDir * 45,
          config: { duration: 300 }
        });
      } else {
        api?.start({
          x: down ? mx : 0,
          y: down ? my : 0,
          rotate: down ? mx / 10 : 0,
          immediate: down
        });
      }
    },
    { filterTaps: true }
  );

  const handleMouseEnter = () => {
    setIsHovering(true);
    hoverStartTime.current = Date.now();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hoverStartTime?.current) {
      const hoverDuration = Date.now() - hoverStartTime?.current;
      setSwipeMetrics(prev => ({
        ...prev,
        hoverDuration: prev?.hoverDuration + hoverDuration
      }));
      hoverStartTime.current = null;
    }
  };

  const opacity = x?.to([-200, 0, 200], [0.5, 1, 0.5]);
  const { scale } = useSpring({
    scale: isActive ? 1 : 0.95 - (zIndex * 0.05),
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div
      {...(isActive ? bind() : {})}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
        zIndex,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        touchAction: 'none',
        cursor: isActive ? 'grab' : 'default'
      }}
      className="w-full h-full"
    >
      <div className="card p-0 overflow-hidden h-full shadow-2xl">
        {/* Topic Image */}
        <div className="relative h-2/3">
          <Image
            src={topic?.imageUrl}
            alt={topic?.imageAlt || `${topic?.displayName} topic category`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Topic Icon */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
            <Icon name={topic?.iconName || 'Star'} size={24} className="text-primary" />
          </div>

          {/* Swipe Indicators */}
          <animated.div
            style={{
              opacity: x?.to([-200, -50, 0], [1, 0.5, 0])
            }}
            className="absolute top-1/2 left-8 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg"
          >
            NOPE
          </animated.div>

          <animated.div
            style={{
              opacity: x?.to([0, 50, 200], [0, 0.5, 1])
            }}
            className="absolute top-1/2 right-8 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl shadow-lg"
          >
            LIKE
          </animated.div>
        </div>

        {/* Topic Info */}
        <div className="p-6 h-1/3 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            {topic?.displayName}
          </h2>
          <p className="text-muted-foreground line-clamp-3">
            {topic?.description}
          </p>

          {/* Hover Indicator */}
          {isHovering && isActive && (
            <div className="mt-4 flex items-center gap-2 text-sm text-primary">
              <Icon name="Hand" size={16} />
              <span>Drag to swipe or use buttons below</span>
            </div>
          )}
        </div>
      </div>
    </animated.div>
  );
};

export default SwipeableTopicCard;