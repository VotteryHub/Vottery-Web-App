import { useTransform } from 'framer-motion';
import { useCallback } from 'react';

export const useParallaxEffect = (scrollValue, options = {}) => {
  const {
    strength = 1,
    direction = 'vertical',
    inputRange = [0, 1],
    outputRange = [0, 100]
  } = options;

  const parallaxY = useTransform(
    scrollValue,
    inputRange,
    outputRange?.map(val => val * strength * (direction === 'vertical' ? 1 : 0))
  );

  const parallaxX = useTransform(
    scrollValue,
    inputRange,
    outputRange?.map(val => val * strength * (direction === 'horizontal' ? 1 : 0))
  );

  const createParallax = useCallback((index, totalItems, scrollPos) => {
    const relativePos = index - scrollPos;
    const yOffset = relativePos * -15 * strength;
    const xOffset = relativePos * 10 * strength;
    
    return {
      y: direction === 'vertical' ? yOffset : 0,
      x: direction === 'horizontal' ? xOffset : 0,
      opacity: Math.max(0.3, 1 - Math.abs(relativePos) * 0.25)
    };
  }, [strength, direction]);

  return {
    parallaxY,
    parallaxX,
    createParallax
  };
};

export default useParallaxEffect;